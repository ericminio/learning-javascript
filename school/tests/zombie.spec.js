const Browser = require('zombie');
var browser = new Browser();
var server = require('../web/lib/server');

describe('Zombie', function() {

    var app;
    var port = 5000;

    beforeEach(function(done) {
        app = server({ index:'' +
        '<html>' +
            '<head>' +
                '<script src="jquery-2.1.3.min.js"></script>' +
            '</head>' +
            '<body>'+
                '<div id="greetings"></div>' +
                '<script>'+
                    '$( document ).ready(function() {'+
                    '   document.getElementById("greetings").innerHTML = "hello world";'+
                    '   document.dispatchEvent(new Event("this-event"));'+
                    '});' +
                '</script>'+
            '</body>'+
        '</html>' }).listen(port, done);
    });
    afterEach(function() {
        app.close();
    });

    it('can digest jquery', function(done) {
        browser.visit('http://localhost:' + port)
            .then(function() {
                browser.assert.text('#greetings', 'hello world');
            })
            .then(done, done);
    });
    it('can spy custom events', function(done) {
        browser.on('event', function(e) {
            if (e.type == 'this-event') {
                done();
            }
        });
        browser.visit('http://localhost:' + port)
            .then(function(){}, done);
    });
});
