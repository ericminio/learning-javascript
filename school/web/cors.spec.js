var expect = require('chai').expect;
const Browser = require('zombie');
var browser = new Browser();

describe('CORS', function() {
    
    var origin;
    var port = 5000;

    var thirdParty;
    var anotherPort = 5005;
    var thirdPartyAnswer;
    
    beforeEach(function(done) {        
        
        var sendPage = function(response) {
            response.setHeader('Content-Type', 'text/html');
            var page = '<html>' +
            '<body>'+
                '<script>' +
                    'function requestSomething() {' +
                        'var xhr = new XMLHttpRequest();' +
                        'xhr.open("GET", "http://localhost:' + anotherPort + '/message");' +
                        'xhr.onload = function() {' +
                            'var label = document.getElementById("message");' +
                            'label.innerHTML = xhr.responseText;' +
                        '};' +
                        'xhr.send();'+                
                    '}' +
                '</script>' +
                '<div id="message">unexpected</div>'+
                '<button id="go" onclick="javascript:requestSomething();">clik me!</button>'+
            '</body>'+
            '</html>';
            response.write(page);
        };
        
        origin = require('http').createServer(function(request, response) {
            sendPage(response);
            response.end();
        });
        thirdParty = require('http').createServer(function(request, response) {
            thirdPartyAnswer(response);
            response.end();
        });
        
        origin.listen(port, function() {            
            thirdParty.listen(anotherPort, done);
        });
    });

    afterEach(function() {
        origin.close();
        thirdParty.close();
    });
    
    it('is active by default', function(done) {
        thirdPartyAnswer = function(response) {
            response.setHeader('Content-Type', 'text/plain');
            response.write('Peace, Love, Joy');
        };
        browser.visit('http://localhost:' + port, function() {
            browser.click('#go', function() {
                expect(browser.errors[0].toString()).to.equal('SecurityError');
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
        browser.visit('http://localhost:' + port)
            .then(function() {
                return browser.click('#go');
            })
            .then(function() {
                browser.assert.text('#message', 'Peace, Love, Joy');
            })
            .then(done, done);
    });
});