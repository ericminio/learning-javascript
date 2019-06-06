const { expect } = require('chai')
const { JSDOM } = require("jsdom")
const { addFetchFeature } = require('../support/add.fetch.feature')
let LocalServer = require('../support/local.server');

describe('Fetch', function() {

    var server;
    var thirdParty;
    var index = `
        <html>
            <head>
                <title>initial title</title>
                <script src="service.js"></script>
            </head>
            <body>
                <label id="data">waiting...</label>
                <button id="getData" onclick="getData();">fetch data</button>

                <input id="field" />
                <button id="postData" onclick="postData();">fetch data</button>
            </body>
        </html>
    `;
    var serviceScript = function() { return `
        function getData() {
            var message = 'http://localhost:` + thirdParty.port + `/any'
            var please = {
                method: 'GET',
                mode: 'cors'
            };
            fetch(message, please)
                .then((response)=> {
                    if (response.ok) {
                        return response.text()
                    }
                    else {
                        return 'error'
                    }
                })
                .then((text)=> {
                    document.getElementById('data').innerHTML = text;
                })
                .catch((error)=> {
                    document.getElementById('data').innerHTML = error.message;
                })
        }
        function postData() {
            var message = 'http://localhost:` + thirdParty.port + `/any'
            var please = {
                method: 'POST',
                mode: 'cors',
                body: document.getElementById('field').value
            };
            fetch(message, please)
                .then((response)=> {
                    if (response.ok) {
                        return response.text()
                    }
                    else {
                        return 'error'
                    }
                })
                .then((text)=> {
                    document.getElementById('data').innerHTML = text;
                })
                .catch((error)=> {
                    document.getElementById('data').innerHTML = error.message;
                })
        }
    `; }

    beforeEach(function(done) {
        thirdParty = new LocalServer(function(request, response) {
            response.setHeader('Access-Control-Allow-Origin', '*');
            if (request.method == 'POST') {
                var body = ''
                request.on('data', (chunk)=>{
                    body += chunk
                })
                request.on('end', ()=>{
                    response.write('pong: ' + body);
                    response.end();
                })
            }
            else {
                response.write('pong');
                response.end();
            }
        });
        thirdParty.start(function() {
            server = new LocalServer({
                '/': index,
                '/service.js': serviceScript()
            });
            server.start(done);
        });
    });

    afterEach(function(done) {
        thirdParty.stop(()=>{
            server.stop(done);
        });
    });

    it('can GET data', function(done) {
        JSDOM.fromURL('http://localhost:'+server.port, {
            runScripts: 'dangerously',
            resources: 'usable'
        })
        .then((dom)=>{
            setTimeout(() => {
                let document = dom.window.document;
                addFetchFeature(document)

                let button = document.getElementById('getData');
                button.click();

                setTimeout(()=>{
                    var label = document.getElementById('data')

                    expect(label.innerHTML).to.equal('pong')
                    done()
                },300)
            }, 500);
        });
    });

    it('can POST data', function(done) {
        JSDOM.fromURL('http://localhost:'+server.port, {
            runScripts: 'dangerously',
            resources: 'usable'
        })
        .then((dom)=>{
            setTimeout(() => {
                let document = dom.window.document;
                addFetchFeature(document)

                let input = document.getElementById('field')
                input.value = 'hello'
                let button = document.getElementById('postData');
                button.click();

                setTimeout(()=>{
                    var label = document.getElementById('data')

                    expect(label.innerHTML).to.equal('pong: hello')
                    done()
                },300)
            }, 500);
        });
    });
});
