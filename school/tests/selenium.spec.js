var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;
var service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

var expect = require('chai').expect;



describe('Selenium', function() {

    var server;
    var driver;

    beforeEach(function(done) {
        server = require('http').createServer(function(request, response) {
            var index = '' +
            '<html>' +
            '   <head><title>hello</title></head>' +
            '   <body>' +
            '       <div id="greetings" style="display:inline-block">welcome</div>' +
            '   </body>' +
            '</html>';
            response.writeHead(200, { 'content-type':'text/html' });
            response.end(index);
        }).listen(5000, done);
    });

    afterEach(function() {
        server.close();
        driver.quit();
        // .then(function(){ exit(); }, function(error) {
        //     expect(JSON.stringify(error)).to.equal(undefined);
        //     exit();
        // });
    });

    it.skip('can be used to inspect the computed width of an element', function(done) {
        this.timeout(5000);
        driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
        driver.get('http://localhost:5000/').then(
            function() {
                var element = driver.findElement(By.id('greetings'));
                element.getCssValue('width').then(
                    function(value) {
                        expect(value).to.equal('57.75px');
                        done();
                    },
                    function(error) {
                        expect(JSON.stringify(error)).to.equal(undefined);
                        done();
                    }
                );
            },
            function(error) {
                expect(JSON.stringify(error)).to.equal(undefined);
                done();
            }
        );
    });
});
