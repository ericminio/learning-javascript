const Browser = require('zombie');
const browser = new Browser();
let LocalServer = require('../tests/local.server');

describe.skip('Angular v1', function() {

    var server;
    var page = `
    <html ng-app="testApp">
        <head>
            <script src="angular-1.3.0.min.js"></script>
            <script>
                var testApp = angular.module("testApp", []);

                testApp.controller("GreetingsController", function GreetingsController($scope, $http) {
                $scope.greetings = "Welcome Home";
                });
            </script>
        </head>
        <body ng-controller="GreetingsController">
            <label id="greetings">{{greetings}}</label>
        </body>
    </html>
    `;

    beforeEach(function(done) {
        server = new LocalServer((request, response)=>{
            var url = require('url');
            var parsed = url.parse(request.url, true);
            if (/\.js$/.test(parsed.pathname)) {
                var path = require('path').join(__dirname, '../web/lib', parsed.pathname);
                var content = require('fs').readFileSync(path).toString();
                response.setHeader('Content-Type', 'application/javascript');
                response.write(content);
            }
            else {
                response.setHeader('Content-Type', 'text/html');
                response.write(page);
            }
            response.end();
        });
        server.start(done);
    });
    afterEach(function(done) {
        server.stop(done);
    });

    it('will eventually replace expressions in curly braces', function(done) {
        browser.visit('http://localhost:' + server.port)
            .then(function() {
                browser.assert.text('#greetings', 'Welcome Home');
            })
            .then(done, done);
    });
});
