const { expect } = require('chai');
const { parse, create } = require('./form-data-protocol');

describe.only('Form data protocol', () => {
    
    describe('parser', () => {
        
        it('can parse single line data of one field', () => {
            let data = parse({ payload: `
                -----token
                Content-Disposition:form-data;name=field
                
                any content
                -----token--
            `});
            expect(data).to.deep.equal({
                form: [
                    { name: 'field', value: 'any content' }
                ]
            });
        });
        it('can parse single line data of two fields', () => {
            let data = parse({ payload: `
                -----token
                Content-Disposition:form-data;name=one
                
                111
                -----token
                Content-Disposition:form-data;name=two
                
                222
                -----token--
            `});
            expect(data).to.deep.equal({
                form: [
                    { name: 'one', value: '111' },
                    { name: 'two', value: '222' }
                ]
            });
        });
        it('can parse file info', () => {
            let data = parse({ payload: `
                -----token
                Content-Disposition: form-data; name=field; filename=hello.txt
                Content-Type: text/plain
                
                any content
                -----token--
            `});
            expect(data).to.deep.equal({
                form: [
                    { 
                        name: 'field', 
                        value: 'any content',
                        fileName: 'hello.txt',
                        contentType: 'text/plain'
                    }
                ]
            });
        });
        it('can parse multi lines content', () => {
            let data = parse({ payload: `
                -----token
                Content-Disposition:form-data;name=field
                
                any content
                with several
                lines
                -----token--
            `});
            expect(data).to.deep.equal({
                form: [
                    { name: 'field', value: 'any content\nwith several\nlines' }
                ]
            });
        });
        it('resists extended line end separator', () => {
            let data = parse({ payload: ''
                + '-----token\r\n'
                + 'Content-Disposition:form-data;name=field;filename=hello.txt\r\n'
                + 'Content-Type:text/plain\r\n'
                + '\r\n'
                + 'any content\r\n'
                + 'with several\r\n'
                + 'lines\r\n'
                + '-----token--\r\n'
            });
            expect(data).to.deep.equal({
                form: [
                    { 
                        name: 'field', 
                        value: 'any content\nwith several\nlines',
                        fileName: 'hello.txt',
                        contentType: 'text/plain'
                    }
                ]
            });
        });
        it('resists Firefox', () => {
            let data = parse({ payload: ''
                + '-----------------------------191462173837912382272006659563\n'
                + 'Content-Disposition: form-data; name=\"one\"; filename=\"hello.txt\"\n'
                + 'Content-Type: text/plain\n'
                + '\n'
                + 'hello\n'
                + '\n'
                +'-----------------------------191462173837912382272006659563--\n'
            });
            expect(data).to.deep.equal({
                form: [
                    { 
                        name: 'one', 
                        value: 'hello',
                        fileName: 'hello.txt',
                        contentType: 'text/plain'
                    }
                ]
            });
        });
        it('resists Chrome', () => {
            let data = parse({ payload: ''
                + '------WebKitFormBoundarySZQKHDCpRCnNKWS5\n'
                + 'Content-Disposition: form-data; name=\"one\"; filename=\"hello.txt\"\n'
                + 'Content-Type: text/plain\n'
                + '\n'
                + 'hello\n'
                + '\n'
                +'------WebKitFormBoundarySZQKHDCpRCnNKWS5--\n'
            });
            expect(data).to.deep.equal({
                form: [
                    { 
                        name: 'one', 
                        value: 'hello',
                        fileName: 'hello.txt',
                        contentType: 'text/plain'
                    }
                ]
            });
        });
    });

    describe('payload', () => {
        
        it('can build payload for a single field with a single line of data', () => {
            expect(create({
                form: [
                    { name: 'field', value: 'any content' }
                ],
                secret: 'token'
            })).to.equal('' +
                '-----token\n' +
                'Content-Disposition:form-data;name=field\n' +
                '\n'+
                'any content\n' +
                '-----token--\n'
            )
        });
    });
    
});