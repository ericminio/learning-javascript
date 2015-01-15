CustomWidget = function() {
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

updateExistingRuleStrategy = function(ajax) {
    
    return function(id, value) {
        ajax.send('id=' + id + '&value=' + value);
    };
};

createNewRuleStrategy = function(ajax) {
    
    return function(id, value) {
        ajax.send('value=' + value);
    };
};

describe('Exploration:', function() {

    var ajax = {
        send: function() {  }
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
        first.setSaveStrategy( updateExistingRuleStrategy(ajax) );
        first.renderIn(document.getElementById('this-container')); 
        firstSaveButton = container.querySelector('#save-button-1');

        var second = new CustomWidget();
        second.setData({ id: 2, value:'127.0.0.1' });
        second.setSaveStrategy( createNewRuleStrategy(ajax) );
        second.renderIn(document.getElementById('this-container')); 
        secondSaveButton = container.querySelector('#save-button-2');

        spyOn(ajax, 'send');
    });
    
    it('sends the ruleId when updating an existing rule', function() {
        var click = document.createEvent('Event');
        click.initEvent('click', true, true);
        firstSaveButton.dispatchEvent(click);

        expect(ajax.send).toHaveBeenCalledWith('id=1&value=192.168.0.10');
    });

    it('sends only the ipAddress when creating a new rule', function() {
        var click = document.createEvent('Event');
        click.initEvent('click', true, true);
        secondSaveButton.dispatchEvent(click);

        expect(ajax.send).toHaveBeenCalledWith('value=127.0.0.1');
    });
});