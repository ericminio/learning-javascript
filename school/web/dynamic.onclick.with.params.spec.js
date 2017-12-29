var expect = require('chai').expect;
var sinon = require('sinon');
require('chai').use(require('sinon-chai'));

var CustomWidget = function() {
    this.useTemplate('<button id="save-button">Save</button>"');
};

CustomWidget.prototype = {
    useTemplate: function(template) {
        this.template = template;
    },
    setData: function(data) {
        this.data = data;
    },
    setSaveStrategy: function(strategy) {
        this.strategy = strategy;
    },
    renderIn: function(container) {
        var html = this.template.replace('save-button', 'save-button-' + this.data.id);
        container.innerHTML = html;

        var self = this;
        var saveButton = container.querySelector('#save-button-' + this.data.id);
        saveButton.onclick = function() { self.strategy(self.data.id, self.data.value) };
    }
};

var sendAllFieldsStrategy = function(ajax) {

    return function(id, value) {
        ajax.send('id=' + id + '&value=' + value);
    };
};

var sendOnlyTheValueStrategy = function(ajax) {

    return function(id, value) {
        ajax.send('value=' + value);
    };
};

describe('Dynamic onclick event', function() {

    var ajax = {
        send: sinon.spy()
    };

    var document = require('jsdom').jsdom(''+
        '<div id="this-container">'+
        '</div>'
    );

    var container = document.getElementById('this-container');
    var firstSaveButton;
    var secondSaveButton;

    beforeEach(function() {
        var first = new CustomWidget();
        first.setData({ id: 1, value:'192.168.0.10' });
        first.setSaveStrategy( sendAllFieldsStrategy(ajax) );
        first.renderIn(document.getElementById('this-container'));
        firstSaveButton = container.querySelector('#save-button-1');

        var second = new CustomWidget();
        second.setData({ id: 2, value:'127.0.0.1' });
        second.setSaveStrategy( sendOnlyTheValueStrategy(ajax) );
        second.renderIn(document.getElementById('this-container'));
        secondSaveButton = container.querySelector('#save-button-2');
    });

    it('can be configured with a specific strategy', function() {
        var click = document.createEvent('Event');
        click.initEvent('click', true, true);
        firstSaveButton.dispatchEvent(click);

        expect(ajax.send).to.have.been.calledWith('id=1&value=192.168.0.10');
    });

    it('can be configured with another strategy', function() {
        var click = document.createEvent('Event');
        click.initEvent('click', true, true);
        secondSaveButton.dispatchEvent(click);

        expect(ajax.send).to.have.been.calledWith('value=127.0.0.1');
    });
});
