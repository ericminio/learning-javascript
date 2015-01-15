describe('Bind', function() {
   
    it('offers a way to imposterize this', function() {
        var bound;
        var subject = {};
        (function() { bound = this; }).bind(subject)();
        
        expect(bound).toEqual(subject);
    });
});