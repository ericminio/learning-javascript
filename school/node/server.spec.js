const { expect } = require('chai');
const http = require('http');

describe('server', () => {

    let server;
    beforeEach((done) => {
        server = http.createServer();        
        server.on('request', (request, response) => {
            response.writeHead(501, { 'content-Type': 'text/plain' });
            response.end('NOT IMPLEMENTED');
          });
        server.listen(5001, done);
    });
    afterEach((done) => {
        server.close(done);
    });

    it('answers request as expected', async () => {
        let answer = await new Promise((resolve, reject)=>{
            let request = http.request({ port:5001 }, pong => {                
                let body = '';
                pong.on('data', chunk => {
                    body += chunk;
                });
                pong.on('end', ()=>{
                    pong.body = body;
                    resolve(pong);
                });
                pong.on('error', error => {
                    reject(error);
                })
            })
            request.on('error', error => {
                reject(error);
            })
            request.end();
        });
        expect(answer.statusCode).to.equal(501);
        expect(answer.body).to.equal('NOT IMPLEMENTED');
    });
});