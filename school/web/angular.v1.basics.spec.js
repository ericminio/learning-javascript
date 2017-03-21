const Browser = require('zombie');
var browser = new Browser();
var server = require('./lib/server');

describe('Angular v1', function() {

    var app;
    var port = 5000;

    beforeEach(function(done) {
        app = server({ index:'' +
        '<html ng-app="testApp">' +
            '<head>' +
                '<script src="angular-1.3.0.min.js"></script>' +
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
        '</html>' }).listen(port, done);
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
