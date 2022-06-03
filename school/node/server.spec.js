const { expect } = require('chai');
const { Server } = require('./server');
const request = require('./request');

describe('server', () => {

    let server;
    beforeEach((done) => {
        server = new Server(5001);
        server.start(done);
    });
    afterEach((done) => {
        server.stop(done);
    });

    it('defaults to 501', async () => {
        let answer = await request({ port:5001 });
        
        expect(answer.statusCode).to.equal(501);
        expect(answer.payload).to.equal('NOT IMPLEMENTED');
    });

    it('uses the provided handler', (done) => {
        server.use((request, response) => {
            response.writeHead(200, { 'content-Type': 'text/plain' });
            response.end('hello world');
        });
        request({ port:5001 })
            .then(answer => {
                expect(answer.statusCode).to.equal(200);
                expect(answer.payload).to.equal('hello world');
                done();
            });
    });
});