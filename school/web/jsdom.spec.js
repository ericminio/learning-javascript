var jsdom = require('jsdom');

describe('Jsdom', function() {

    it('handles events on dom elements', function() {
        var listener = { notify: function() {} };
        spyOn(listener, 'notify');
        var document = jsdom.jsdom('<button id="this-button"></button>');
        var button = document.querySelector('#this-button');
        button.onclick = function() { listener.notify(); }
        var click = document.createEvent('Event');
        click.initEvent('click', true, true);
        button.dispatchEvent(click);
        
        expect(listener.notify).toHaveBeenCalled();
    });
});