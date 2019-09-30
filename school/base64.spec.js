var expect = require('chai').expect;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe('base64', function() {

    var window

    beforeEach(function() {
        window = new JSDOM(``).window
    })

    describe('encoding', function() {

        it('is available', function() {
            expect(window.btoa('hello world')).to.equal('aGVsbG8gd29ybGQ=');
        })
    })

    describe('decoding', function() {

        it('is available', function() {
            expect(window.atob('aGVsbG8gd29ybGQ=')).to.equal('hello world');
        })
    })

    describe('round trip of json data', function() {

        it('works as expected', function() {
            var data = {
                field:'value',
                collection: [
                    {
                        rank:1,
                        label:'first'
                    },
                    {
                        rank:2,
                        label:'second'
                    }
                ]
            }
            var encoded = window.btoa(JSON.stringify(data))

            expect(encoded).to.equal('eyJmaWVsZCI6InZhbHVlIiwiY29sbGVjdGlvbiI6W3sicmFuayI6MSwibGFiZWwiOiJmaXJzdCJ9LHsicmFuayI6MiwibGFiZWwiOiJzZWNvbmQifV19');
            expect(JSON.parse(window.atob(encoded))).to.deep.equal(data)
        })
    })
})
