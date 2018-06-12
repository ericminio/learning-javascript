var expect = require('chai').expect;
var sinon = require('sinon');
require('chai').use(require('sinon-chai'));
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
//var canvas = require('canvas');
let LocalServer = require('../support/local.server');

describe('Jsdom', function() {

    var server;
    var thirdParty;
    var index = `
        <html>
            <head>
                <title>initial title</title>
                <script src="modify-title.js"></script>
                <script src="fetch-data.js"></script>
            </head>
            <body>
                <label id="data">waiting...</label>
                <button id="modifyTitle" onclick="modifyTitle();">modify Title</button>
                <button id="fetchData" onclick="fetchData();">fetch data</button>
            </body>
        </html>        
    `;
    var modifyTitleScript = `function modifyTitle() { document.title = "modified title"; }`;
    var fetchDataScript = function() { return `
        function fetchData() {
            var xhr = new window.XMLHttpRequest();
            xhr.onreadystatechange = function (oEvent) {  
                if (xhr.readyState === 4) {  
                    if (xhr.status === 200) {  
                        document.getElementById('data').innerHTML = xhr.responseText;
                    } else {  
                        document.getElementById('data').innerHTML = 'error';
                    }  
                }  
            };
            xhr.open('GET', 'http://localhost:` + thirdParty.port + `/any', true);
            xhr.send();
        }
    `; }
    
    beforeEach(function(done) {
        thirdParty = new LocalServer(function(request, response) {
            //response.setHeader('Access-Control-Allow-Origin', '*');
            response.write('data coming from third party');
            response.end();
        });
        thirdParty.start(function() {
            server = new LocalServer({
                '/': index,
                '/modify-title.js': modifyTitleScript,
                '/fetch-data.js': fetchDataScript(),
                '/ping': 'pong',
                '/any': 'pong'    
            });
            server.start(done);
        });
    });

    afterEach(function(done) {
        thirdParty.stop(()=>{
            server.stop(done);
        });        
    });

    it('needs time to load external script', function(done) {
        JSDOM.fromURL('http://localhost:'+server.port, {
            runScripts: 'dangerously',
            resources: 'usable'
        })
        .then((dom)=>{
            expect(dom.window.document.title).to.equal('initial title');
            setTimeout(() => {
                let document = dom.window.document;
                let button = document.getElementById('modifyTitle');
                button.click();

                expect(dom.window.document.title).to.equal('modified title');
                done();    
            }, 500);
        });            
    });

    it('can be used to create a document element', function() {
        var document = new JSDOM(`<html><body><div id="message">Hello world!</div></body></html>`).window.document;

        expect(document.getElementById('message').innerHTML).to.equal('Hello world!');
    });

    it('can be used to inspect computed color', function() {
        var document = new JSDOM(`
            <html>
                <head>
                    <style>span { color:red }</style>
                </head>
                <body>
                    <span id="message">Hello world!</span>
                </body>
            </html>`).window.document;
        var element = document.getElementById('message');
        var style = document.defaultView.getComputedStyle(element, null);

        expect(style.color).to.equal('red');
    });

    it('can be used to inspect window size', function(done) {
        JSDOM.fromURL('http://localhost:'+server.port, {
            runScripts: 'dangerously',
            resources: 'usable'
        })
        .then((dom)=>{
            setTimeout(() => {
                expect(dom.window.innerWidth).to.equal(1024);
                done();    
            }, 100);
        }); 
    });

    it('offers a XMLHttpRequest implementation', function(exit) {
        var window = new JSDOM(`<html></html>`).window;
        var xhr = new window.XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == xhr.DONE && xhr.status == 200) {
                try {
                    expect(xhr.responseText).to.equal('pong');
                    exit();
                }
                catch (error) {
                    exit(error);
                }
            }
        };
        xhr.open('GET', 'http://localhost:'+server.port + '/ping', true);
        xhr.send();
    });

    it.skip('can be used to inspect canvas content', function() {
        var document = new JSDOM(`<canvas id="board" width="15", height="15"></canvas>`).window.document;
        var canvas = document.getElementById('board');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(1, 1, 1, 1);
        var img = ctx.getImageData(0, 0, 2, 2);

        expect(img.data).to.deep.equal({
            '0':0, '1':0, '2':0, '3':0,
            '4':0, '5':0, '6':0, '7':0,
            '8':0, '9':0, '10':0, '11':0,
            '12':255, '13':0, '14':0, '15':255,
        });
    });

    it('can be used to detect the need for cors headers', function(done) {
        const virtualConsole = new jsdom.VirtualConsole();
        virtualConsole.on("jsdomError", (error) => { 
            expect(error.message).to.equal('Cross origin http://localhost:' + server.port + ' forbidden');
            done();
        });
        JSDOM.fromURL('http://localhost:'+server.port, {
            runScripts: 'dangerously',
            resources: 'usable',
            virtualConsole: virtualConsole
        })
        .then((dom)=>{
            setTimeout(() => {
                let document = dom.window.document;
                let button = document.getElementById('fetchData');
                button.click();
            }, 500);
        }); 
    });  
});
