var expect = require('chai').expect;
var sinon = require('sinon');
require('chai').use(require('sinon-chai'));
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe('Triggering script via select onchange', function() {

    var server;
    beforeEach(function() {
        server = require('http').createServer(function(request, response) {
            var index = '' +
            '<html>' +
            '   <head>' +
            '       <title>initial title</title>' +
            '       <script src="/jquery.js"></script>' +
            '       <script src="/script.js"></script>' +
            '   </head>' +
            '   <body>' +
            '       <select id="countries" onchange="displayId(this.options[this.selectedIndex].id);">' +
            '           <option id="china">China</option>' +
            '           <option id="canada">Canada</option>' +
            '       </select>' +
            '       <label id="continent"></label>' +
            '   </body>' +
            '</html>';
            var script =    'function displayId(id) { ' +
                            '   document.querySelector("#continent").innerHTML = id;' +
                            '}';

            if (request.url == '/') {
                response.writeHead(200, { 'content-type':'text/html' });
                response.end(index);
            }
            if (request.url == '/script.js') {
                response.writeHead(200, { 'content-type':'application/javascript' });
                response.end(script);
                return;
            }
            if (request.url == '/jquery.js') {
                response.writeHead(200, { 'content-type':'application/javascript' });
                var fs = require('fs');
                var jqueryLib = require('path').join(__dirname, '/lib/jquery-2.1.3.min.js');
                var content = fs.readFileSync(jqueryLib).toString();
                response.end(content);
                return;
            }
        }).listen(5000);
    });

    afterEach(function() {
        server.close();
    });

    it('works', function(done) {
        JSDOM.fromURL('http://localhost:5000/', {
            runScripts: 'dangerously',
            resources: 'usable'
        })
        .then((dom)=>{
            expect(dom.window.document.title).to.equal('initial title');
            setTimeout(() => {
                let window = dom.window;
                var option = window.document.querySelector('option#canada');
                option.setAttribute('selected', 'selected');

                var select = window.document.querySelector('#countries');
                var change = window.document.createEvent('Event');
                change.initEvent('change', true, true);
                select.dispatchEvent(change);

                expect(window.document.querySelector('#continent').innerHTML).to.equal('canada');
              
                done();    
            }, 100);
        });
    });
});
