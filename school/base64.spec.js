var expect = require('chai').expect;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe('base64', function() {

    var window

    beforeEach(function() {
        window = new JSDOM(``).window
    })

    describe('encoding', function() {

        it('is available', function() {
            expect(window.btoa('hello world')).to.equal('aGVsbG8gd29ybGQ=');
        })
    })

    describe('decoding', function() {

        it('is available', function() {
            expect(window.atob('aGVsbG8gd29ybGQ=')).to.equal('hello world');
        })
    })

    describe('round trip of json data', function() {

        it('works as expected', function() {
            var data = {
                field:'value',
                collection: [
                    {
                        rank:1,
                        label:'first'
                    },
                    {
                        rank:2,
                        label:'second'
                    }
                ]
            }
            var encoded = window.btoa(JSON.stringify(data))

            expect(encoded).to.equal('eyJmaWVsZCI6InZhbHVlIiwiY29sbGVjdGlvbiI6W3sicmFuayI6MSwibGFiZWwiOiJmaXJzdCJ9LHsicmFuayI6MiwibGFiZWwiOiJzZWNvbmQifV19');
            expect(JSON.parse(window.atob(encoded))).to.deep.equal(data)
        })

        it('can digest more data', function() {
            var data = {
                team: [
                    { id:1, name:'bruce' },
                    { id:2, name:'clark' }
                ],
                pbis: [
                    {
                        id:1,
                        title:'I want people to register'
                    },
                    {
                        id:2,
                        title:'I want to register'
                    },
                    {
                        id:3,
                        title:'I want to know how many people are registered'
                    }
                ],
                sbis: [
                    {
                        id:1,
                        pbi:1,
                        title:'change the home page to list the advantages of registering',
                        done:'yes'
                    },
                    {
                        id:2,
                        pbi:2,
                        title:'add a register button on the home page',
                        done:'yes'
                    },
                    {
                        id:3,
                        pbi:2,
                        title:'create the form to collect user email',
                        done:'yes'
                    },
                    {
                        id:4,
                        pbi:2,
                        title:'create the batch to send the weekly reminder to registered users',
                        done:'no'
                    }
                ],
                selection: [
                    {
                        pbi:1,
                        workers: [
                            { id:1, done:'yes' },
                            { id:2, done:'yes' }
                        ]
                    },
                    {
                        pbi:2,
                        workers: [
                            { id:1, done:'yes' },
                            { id:2, done:'no' }
                        ]
                    }
                ]
            }
            var encoded = window.btoa(JSON.stringify(data))

            expect(encoded).to.equal(`eyJ0ZWFtIjpbeyJpZCI6MSwibmFtZSI6ImJydWNlIn0seyJpZCI6MiwibmFtZSI6ImNsYXJrIn1dLCJwYmlzIjpbeyJpZCI6MSwidGl0bGUiOiJJIHdhbnQgcGVvcGxlIHRvIHJlZ2lzdGVyIn0seyJpZCI6MiwidGl0bGUiOiJJIHdhbnQgdG8gcmVnaXN0ZXIifSx7ImlkIjozLCJ0aXRsZSI6Ikkgd2FudCB0byBrbm93IGhvdyBtYW55IHBlb3BsZSBhcmUgcmVnaXN0ZXJlZCJ9XSwic2JpcyI6W3siaWQiOjEsInBiaSI6MSwidGl0bGUiOiJjaGFuZ2UgdGhlIGhvbWUgcGFnZSB0byBsaXN0IHRoZSBhZHZhbnRhZ2VzIG9mIHJlZ2lzdGVyaW5nIiwiZG9uZSI6InllcyJ9LHsiaWQiOjIsInBiaSI6MiwidGl0bGUiOiJhZGQgYSByZWdpc3RlciBidXR0b24gb24gdGhlIGhvbWUgcGFnZSIsImRvbmUiOiJ5ZXMifSx7ImlkIjozLCJwYmkiOjIsInRpdGxlIjoiY3JlYXRlIHRoZSBmb3JtIHRvIGNvbGxlY3QgdXNlciBlbWFpbCIsImRvbmUiOiJ5ZXMifSx7ImlkIjo0LCJwYmkiOjIsInRpdGxlIjoiY3JlYXRlIHRoZSBiYXRjaCB0byBzZW5kIHRoZSB3ZWVrbHkgcmVtaW5kZXIgdG8gcmVnaXN0ZXJlZCB1c2VycyIsImRvbmUiOiJubyJ9XSwic2VsZWN0aW9uIjpbeyJwYmkiOjEsIndvcmtlcnMiOlt7ImlkIjoxLCJkb25lIjoieWVzIn0seyJpZCI6MiwiZG9uZSI6InllcyJ9XX0seyJwYmkiOjIsIndvcmtlcnMiOlt7ImlkIjoxLCJkb25lIjoieWVzIn0seyJpZCI6MiwiZG9uZSI6Im5vIn1dfV19`);
            expect(JSON.parse(window.atob(encoded))).to.deep.equal(data)
        })
    })
})
