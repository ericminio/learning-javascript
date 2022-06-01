const { expect } = require('chai');
const http = require('http');
const { Server } = require('./server');
const extractPayload = require('./extract-payload');

describe('server', () => {

    let server;
    beforeEach((done) => {
        server = new Server(5001);
        server.start(done);
    });
    afterEach((done) => {
        server.stop(done);
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

    it('answers request as expected using callback', (done) => {
        let request = http.request({ port:5001 }, pong => {    
            expect(pong.statusCode).to.equal(501);            
            let body = '';
            pong.on('data', chunk => {
                body += chunk;
            });
            pong.on('end', ()=>{
                expect(body).to.equal('NOT IMPLEMENTED');
                done();
            });
            pong.on('error', done);
        })
        request.on('error', done);
        request.end();
    });

    it('uses the provided handler', async () => {
        server.use((request, response) => {
            response.writeHead(200, { 'content-Type': 'text/plain' });
            response.end('hello world');
        });
        let answer = await new Promise((resolve, reject)=>{
            let request = http.request({ port:5001 }, pong => {                
                extractPayload(pong)
                    .then((payload) => {
                        pong.body = payload;
                        resolve(pong);
                    })
                    .catch((error) => {
                        reject(error);
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
        expect(answer.statusCode).to.equal(200);
        expect(answer.body).to.equal('hello world');
    });
});