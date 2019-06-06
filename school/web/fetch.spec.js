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
                <script src="fetch-data.js"></script>
            </head>
            <body>
                <label id="data">waiting...</label>
                <button id="fetchData" onclick="fetchData();">fetch data</button>
            </body>
        </html>
    `;
    var fetchDataScript = function() { return `
        function fetchData() {
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
    `; }

    beforeEach(function(done) {
        thirdParty = new LocalServer(function(request, response) {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.write('data coming from third party');
            response.end();
        });
        thirdParty.start(function() {
            server = new LocalServer({
                '/': index,
                '/fetch-data.js': fetchDataScript()
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

                let button = document.getElementById('fetchData');
                button.click();

                setTimeout(()=>{
                    var label = document.getElementById('data')

                    expect(label.innerHTML).to.equal('data coming from third party')
                    done()
                },300)
            }, 500);
        });
    });
});
