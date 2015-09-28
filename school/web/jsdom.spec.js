var jsdom = require('jsdom');
var sinon = require('sinon');
var expect = require('chai').expect;
require('chai').use(require('sinon-chai'));

describe('Jsdom', function() {

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
});
