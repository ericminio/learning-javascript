const { expect } = require('chai');
const http = require('http');
const { Server } = require('./server');
const extractPayload = require('./extract-payload');

describe('GET', () => {

    let server;
    beforeEach((done) => {
        server = new Server(5001);
        server.start(done);
    });
    afterEach((done) => {
        server.stop(done);
    });

    it('is the default', (done) => {
        server.use((request, response) => {
            response.writeHead(200, { 'content-Type': 'application/json' });
            response.end(JSON.stringify({
                method: request.method
            }));
        });
        let request = http.request({ port:5001 }, pong => {                
            extractPayload(pong)
                .then((payload) => {
                    let message = JSON.parse(payload);
                    expect(message.method).to.equal('GET');
                    done();
                })
                .catch(done);
            pong.on('error', done);
        })
        request.on('error', done);
        request.end();
    });
});