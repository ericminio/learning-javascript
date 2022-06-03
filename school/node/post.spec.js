const { expect } = require('chai');
const { Server } = require('./server');
const extractPayload = require('./extract-payload');
const request = require('./request');

describe('POST', () => {

    let server;
    beforeEach((done) => {
        server = new Server(5001);
        server.start(done);
    });
    afterEach((done) => {
        server.stop(done);
    });

    it('needs to be explicit', (done) => {
        server.use((request, response) => {
            response.writeHead(200, { 'content-Type': 'application/json' });
            response.end(JSON.stringify({ method: request.method }));
        });
        request({ port:5001, method:'post' })
            .then((answer) => {
                let message = JSON.parse(answer.payload);
                expect(message.method).to.equal('POST');
                done();
            })
            .catch(done);
    });

    it('usually submits a payload', (done) => {
        server.use(async (request, response) => {
            let payload = await extractPayload(request)
            response.writeHead(200, { 'content-Type': 'text/plain' });
            response.end(payload);
        });
        request({ port:5001, method:'post', payload:'this payload' })
            .then((answer) => {
                expect(answer.payload).to.equal('this payload');
                done();
            })
            .catch(done);
    });

    it('usually submits a content-type header', (done) => {
        server.use(async (request, response) => {
            let contentType = request.headers['content-type'];
            response.writeHead(200, { 'content-Type': 'text/plain' });
            response.end(contentType);
        });
        request({ 
            port:5001, 
            method:'post', 
            contentType: 'application/json',
            payload:JSON.stringify({ answer:42 }) 
        })
            .then((answer) => {
                expect(answer.payload).to.equal('application/json');
                done();
            })
            .catch(done);
    });

    it('allows error to be caught via try/catch', async () => {
        try {
            await request({ port:5002 });
        }
        catch(error) {
            expect(error.code).to.equal('ECONNREFUSED');
        }
    });

    it('allows error to be caught via promise catch', (done) => {
        request({ port:5002 })
            .catch(error => {
                expect(error.code).to.equal('ECONNREFUSED');
                done();
            });
    });
});