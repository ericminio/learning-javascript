const Browser = require('zombie');
const browser = new Browser();
let LocalServer = require('../support/local.server');

describe('Angular v1', function() {

    var server;
    var page = `
        <html ng-app="testApp">
            <head>
                <script src="/lib/angular-1.3.0.min.js"></script>
                <script>
                    var testApp = angular.module("testApp", []);

                    testApp.controller("GreetingsController", function GreetingsController($scope, $http) {
                        $http.get("/data").success(function(data) { $scope.data = data.answer; });
                    });
                </script>
            </head>
            <body ng-controller="GreetingsController">
                <div id="data">{{data}}</div>
            </body>
        </html>`;

    beforeEach(function(done) {
        server = new LocalServer({
            '/': page,
            json: { 
                '/data': { answer:42 }
            }
        });
        server.start(done);
    });
    afterEach(function(done) {
        server.stop(done);
    });

    it('can make http GET requests', function(done) {
        browser.visit('http://localhost:' + server.port)
            .then(function() {
                browser.assert.text('#data', '42');
            })
            .then(done, done);
    });
});
