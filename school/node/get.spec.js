const { expect } = require('chai');
const { Server } = require('./server');
const request = require('./request');

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
            response.end(JSON.stringify({ method: request.method }));
        });
        request({ port: 5001 })
            .then((answer) => {
                let message = JSON.parse(answer.payload);
                expect(message.method).to.equal('GET');
                done();
            })
            .catch(done);
    });
});
