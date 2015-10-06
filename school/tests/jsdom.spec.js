var expect = require('chai').expect;
var sinon = require('sinon');
require('chai').use(require('sinon-chai'));
var jsdom = require("jsdom");

describe('Jsdom', function() {

    var server;

    beforeEach(function() {
        server = require('http').createServer(function(request, response) {
            var index = '' +
            '<html>' +
            '   <head>' +
            '       <title>initial title</title>' +
            '       <script src="/title.js"></script>' +
            '   </head>' +
            '   <body>' +
            '       <script>' +
            '           window.onload = function() { modifyTitle(); }' +
            '       </script>' +
            '       <a id="navigate" href="/next.html">go</a>' +
            '   </body>' +
            '</html>';
            var script = 'function modifyTitle() { document.title = "modified title"; }';
            var next = '' +
            '<html>' +
            '   <head>' +
            '       <title>next page</title>' +
            '   </head>' +
            '   <body>' +
            '   </body>' +
            '</html>';

            if (request.url == '/') {
                response.writeHead(200, { 'content-type':'text/html' });
                response.end(index);
            }
            if (request.url == '/title.js') {
                response.writeHead(200, { 'content-type':'application/javascript' });
                response.end(script);
                return;
            }
            if (request.url == '/next.html') {
                response.writeHead(200, { 'content-type':'text/html' });
                response.end(next);
            }
        }).listen(5000);
    });

    afterEach(function() {
        server.close();
    });

    it('can download and execute a script', function(exit) {
        jsdom.env({
          url: "http://localhost:5000/",
          features: {
              FetchExternalResources: ["script"],
              ProcessExternalResources: ["script"]
          },
          done: function (errors, window) {
              expect(window.document.title).to.equal('modified title');
              exit();
          }
        });
    });

    it('can be used to follow a link by hand', function(exit) {
        jsdom.env({
          url: "http://localhost:5000/",
          features: {
              FetchExternalResources: ["script"],
              ProcessExternalResources: ["script"]
          },
          done: function (errors, window) {
              var link = window.document.querySelector('a#navigate');
              jsdom.env({
                url: link.href,
                features: {
                    FetchExternalResources: ["script"],
                    ProcessExternalResources: ["script"]
                },
                done: function (errors, window) {
                    expect(window.document.title).to.equal('next page');
                    exit();
                }
              });
          }
        });
    });

    it('handles events on dom elements', function() {
        var listener = { notify: sinon.spy() };
        var document = jsdom.jsdom('<button id="this-button"></button>');
        var button = document.querySelector('#this-button');
        button.onclick = function() { listener.notify(); }
        var click = document.createEvent('Event');
        click.initEvent('click', true, true);
        button.dispatchEvent(click);

        expect(listener.notify).to.have.been.called;
    });

    it('can be used to create a document element', function() {
        var document = jsdom.jsdom('<html><body><div id="message">Hello world!</div></body></html>');

        expect(document.getElementById('message').innerHTML).to.equal('Hello world!');
    });
});
