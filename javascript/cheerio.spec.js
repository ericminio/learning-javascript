var cheerio = require('cheerio');

describe('cheerio', function() {
    
    var html =  '<html><body>' +
                    '<label id="number">42</label>' +
                '</body></html>';
    var page;
                
    beforeEach(function() {
        page = cheerio.load(html);
    });
                
    it('can access element by id', function() {
        expect(page('#number').text()).toEqual('42');
    });
                
    it('can modify the id of an element', function() {
        page('#number').attr('id', 'value');
        
        expect(page('#value').text()).toEqual('42');
    });
});