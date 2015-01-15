describe('Bind', function() {
   
    it('offers a way to impostarize this', function() {
        var listener = { notify: function() {} };
        spyOn(listener, 'notify');
        (function() { this.notify() }).bind(listener)();
        
        expect(listener.notify).toHaveBeenCalled();
    });
});