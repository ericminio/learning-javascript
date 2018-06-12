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
});