var cheerio = require('cheerio');
var expect = require('chai').expect;

describe('cheerio', function() {

    var html =  '<html><body>' +
                    '<label id="number">42</label>' +
                '</body></html>';
    var page;

    beforeEach(function() {
        page = cheerio.load(html);
    });

    it('can access element by id', function() {
        expect(page('#number').text()).to.equal('42');
    });

    it('can modify the id of an element', function() {
        page('#number').attr('id', 'value');

        expect(page('#value').text()).to.equal('42');
    });
});
