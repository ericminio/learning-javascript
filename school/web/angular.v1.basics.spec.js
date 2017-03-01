const Browser = require('zombie');
var browser = new Browser();

describe('Angular v1', function() {

    var app;
    var server;
    var port = 5000;

    beforeEach(function(done) {

        var sendPage = function(response) {
            response.setHeader('Content-Type', 'text/html');
            var page = '<html ng-app="testApp">' +
            '<head>' +
                '<script src="/angular.js"></script>' +
                '<script>'+
                    'var testApp = angular.module("testApp", []);'+

                    'testApp.controller("GreetingsController", function GreetingsController($scope, $http) {'+
                      '$scope.greetings = "Welcome Home";'+
                    '});' +
                '</script>'+
            '</head>' +
            '<body ng-controller="GreetingsController">'+
                '<label id="greetings">{{greetings}}</label>' +
            '</body>'+
            '</html>';
            response.write(page);
        };

        var sendAngular = function(response) {
            var angular = require('path').join(__dirname, '/lib/angular-1.3.0.min.js');
            var content = require('fs').readFileSync(angular).toString();
            response.setHeader('Content-Type', 'text/plain');
            response.write(content);
        };

        var handler = function(request, response) {
            var url = require('url');
            var parsed = url.parse(request.url, true);
            if (parsed.pathname == '/angular.js') {
                sendAngular(response);
            }
            else {
                sendPage(response);
            }
            response.end();
        };

        app = require('http').createServer(handler);
        app.listen(port, done);
    });

    afterEach(function() {
        app.close();
    });

    it('will eventually replace expressions in curly braces', function(done) {
        browser.visit('http://localhost:' + port)
            .then(function() {
                browser.assert.text('#greetings', 'Welcome Home');
            })
            .then(done, done);
    });
});
