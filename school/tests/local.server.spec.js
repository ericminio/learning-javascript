let LocalServer = require('./local.server');
let get = require('request');
let expect = require('chai').expect;

describe('Local Server', ()=> {

    let server;
    afterEach((done)=>{
        if (server) {server.stop(done);}
    });
    it('exposes the chosen port', (done)=> {
        server = new LocalServer((request, response)=>{
            response.write('Hello');
            response.end();
        });
        server.start(()=>{            
            get('http://localhost:'+server.port, (err, response, body)=>{
                expect(err).to.equal(null);
                expect(body).to.equal('Hello');
                done();
            })    
        });
    }); 
    it('always uses a fresh port', (done)=>{
        server = new LocalServer((request, response)=>{
            response.write('Hello');
            response.end();
        });
        server.start(()=>{
            let firstPort = server.port;
            server.stop(()=>{
                server = new LocalServer((request, response)=>{
                    response.write('Hello');
                    response.end();
                });
                server.start(()=>{
                    expect(server.port).not.to.equal(firstPort);
                    done();
                });
            });
        });
    }); 
});