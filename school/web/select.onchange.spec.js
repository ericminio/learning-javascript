var expect = require('chai').expect;
require('chai').use(require('sinon-chai'));
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
let LocalServer = require('../support/local.server');

describe('Triggering script via select onchange', function () {
    var server;
    var index = `
        <html>
            <head>
                <title>initial title</title>
                <script src="/lib/jquery-2.1.3.min.js"></script>
                <script src="/script.js"></script>
            </head>
            <body>
                <select id="countries" onchange="displayId(this.options[this.selectedIndex].id);">
                    <option id="china">China</option>
                    <option id="canada">Canada</option>
                </select>
                <label id="continent"></label>
            </body>
        </html>`;
    var script = `function displayId(id) {
        document.querySelector("#continent").innerHTML = id;
    }`;

    beforeEach(function (done) {
        server = new LocalServer({
            '/': index,
            '/script.js': script,
        });
        server.start(done);
    });

    afterEach(function (done) {
        server.stop(done);
    });

    it('works', function (done) {
        JSDOM.fromURL('http://localhost:' + server.port, {
            runScripts: 'dangerously',
            resources: 'usable',
        }).then((dom) => {
            expect(dom.window.document.title).to.equal('initial title');
            setTimeout(() => {
                let window = dom.window;
                var option = window.document.querySelector('option#canada');
                option.setAttribute('selected', 'selected');

                var select = window.document.querySelector('#countries');
                var change = window.document.createEvent('Event');
                change.initEvent('change', true, true);
                select.dispatchEvent(change);

                expect(
                    window.document.querySelector('#continent').innerHTML
                ).to.equal('canada');

                done();
            }, 100);
        });
    });
});
