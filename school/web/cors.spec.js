var expect = require('chai').expect;
const Browser = require('zombie');
var browser = new Browser();
let LocalServer = require('../support/local.server');

describe('CORS', function() {
    
    var origin;
    var thirdParty;
    var thirdPartyAnswer;
    
    beforeEach(function(done) {   
        thirdParty = new LocalServer(function(request, response) {
            thirdPartyAnswer(response);
            response.end();
        });
        thirdParty.start(()=>{
            var page = `
                <html>
                    <body>
                        <script>
                            function requestSomething() {
                                var xhr = new XMLHttpRequest();
                                xhr.onload = function() {
                                    var label = document.getElementById("message");
                                    label.innerHTML = xhr.responseText;
                                };
                                xhr.open("GET", "http://localhost:` + thirdParty.port + `/message", true);
                                xhr.send();
                            }
                        </script>
                        <div id="message">unexpected</div>
                        <button id="go" onclick="javascript:requestSomething();">clik me!</button>
                    </body>
                </html>`;
            origin = new LocalServer(page);
            origin.start(done);
        });   
    });

    afterEach(function(done) {
        origin.stop(()=>{ thirdParty.stop(done); });
    });
    
    it('is active by default', function(done) {
        thirdPartyAnswer = function(response) {
            response.setHeader('Content-Type', 'text/plain');
            response.write('Peace, Love, Joy');
        };
        browser.visit('http://localhost:' + origin.port, function() {
            browser.click('#go', function() {
                expect(browser.errors[0].toString()).to.equal('Cannot make request to different domain: 18');
                done();
            });
        });
    });
    
    it('can be overriden', function(done) {
        thirdPartyAnswer = function(response) {
            response.setHeader('Content-Type', 'text/plain');
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.write('Peace, Love, Joy');
        };
        browser.visit('http://localhost:' + origin.port)
            .then(function() {
                return browser.click('#go');
            })
            .then(function() {
                browser.assert.text('#message', 'Peace, Love, Joy');
            })
            .then(done, done);
    });

    it('is active for PUT method even with allow-origin header', (done)=>{
        thirdPartyAnswer = function(response) {
            response.setHeader('Content-Type', 'text/plain');
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.write('Peace, Love, Joy');
        };
        origin.stop(()=>{
            var page = `
                <html>
                    <head>
                        <script src="/lib/jquery-2.1.3.min.js"></script>
                    </head>
                    <body>
                        <label id="greetings"></label>
                        <script>
                            $( document ).ready(function() {
                                var xhr = new XMLHttpRequest();
                                xhr.onload = function() {
                                    var label = document.getElementById('greetings');
                                    label.innerHTML = xhr.responseText;
                                };
                                xhr.open('PUT', 'http://localhost:` + thirdParty.port + `/message');
                                xhr.send();
                            });
                        </script>
                    </body>
                </html>`;
            origin = new LocalServer(page);
            origin.start(()=>{
                browser.visit('http://localhost:' + origin.port)
                    .then(()=>{}, ()=>{                            
                        expect(browser.errors[0].toString()).to.equal('Cannot make request with not-allowed method(PUT): 18');
                        done();
                    }); 
            });
        });
    });

    it('can be overriden for PUT with additional header', (done)=>{
        thirdPartyAnswer = function(response) {
            response.setHeader('Content-Type', 'text/plain');
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Allow-Methods', 'PUT');
            response.write('Peace, Love, Joy');
        };
        origin.stop(()=>{
            var page = `
                <html>
                    <head>
                        <script src="/lib/jquery-2.1.3.min.js"></script>
                    </head>
                    <body>
                        <label id="greetings"></label>
                        <script>
                            $( document ).ready(function() {
                                var xhr = new XMLHttpRequest();
                                xhr.onload = function() {
                                    var label = document.getElementById('greetings');
                                    label.innerHTML = xhr.responseText;
                                };
                                xhr.open('PUT', 'http://localhost:` + thirdParty.port + `/message');
                                xhr.send();
                            });
                        </script>
                    </body>
                </html>`;
            origin = new LocalServer(page);
            origin.start(()=>{
                browser.visit('http://localhost:' + origin.port)
                    .then(()=>{
                        browser.assert.text('#greetings', 'Peace, Love, Joy');
                    })
                    .then(done, done);
            });
        });
    });
});