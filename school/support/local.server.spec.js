let LocalServer = require('./local.server');
let get = require('request');
let expect = require('chai').expect;
const Browser = require('zombie');
const browser = new Browser();

describe('Local Server', ()=> {

    let server;
    afterEach((done)=>{
        if (server) {server.stop(done);}
        else { done(); }
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
    it('serves known libs', (done)=> {
        var page = `
            <html>
                <head>
                    <title>initial title</title>
                    <script src="/lib/jquery-2.1.3.min.js"></script>
                </head>
                <body>
                    <script>
                        $( document ).ready(function() {
                            document.title = 'modified title';
                        });
                    </script>
                </body>
            </html>                    
        `;
        server = new LocalServer(page);
        server.start(()=>{
            browser.visit('http://localhost:' + server.port)
                .then(function() {
                    browser.assert.text('title', 'modified title');
                })
                .then(done, done);
        });
    });
    it('leverages regexp', ()=>{
        var pattern = /^\/lib\/(.*)\.js$/;

        var candidate = '/lib/jquery-2.1.3.min.js';
        expect(pattern.test(candidate)).to.equal(true);
        expect(pattern.exec(candidate)[1]).to.equal('jquery-2.1.3.min');

        candidate = '/';
        expect(pattern.test(candidate)).to.equal(false);
    });
});