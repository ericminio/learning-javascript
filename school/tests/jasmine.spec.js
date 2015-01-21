describe('Jasmine', function() {

    it('can assert number equality', function() {
        expect(1).toEqual(1);
    });
    
	it('considers different two objects with different fields', function() {
		expect({ one: 'any' }).not.toEqual({ two: 'any' });
	});
		
	it('considers different two objects with same fields and different values', function() {
		expect({ field: 'one' }).not.toEqual({ field: 'two' });
	});
		
	it('considers equal two objects with one field and same value', function() {
		expect({ field: 'one' }).toEqual({ field: 'one' });
	});
    
	it('considers equal two objects with two fields with same value', function() {
		expect({ one:'one', two:'two' }).toEqual({ one:'one', two:'two' });
	});
    
    describe('Spy', function() {
        
        it('offers a way to verify that a call was made', function() {
            var listener = { notify:function() {} };
            spyOn(listener, 'notify');
            listener.notify();
            
            expect(listener.notify).toHaveBeenCalled();
        });
        
        it('offers a way to verify that a call was made with expected parameter', function() {
            var listener = { notify:function() {} };
            spyOn(listener, 'notify');
            listener.notify('value');
            
            expect(listener.notify).toHaveBeenCalledWith('value');
        });

        it('offers a way to spy a call and still make the call', function() {
            var listener = { notify:function(value) { this.value = value; } };
            spyOn(listener, 'notify').andCallThrough();
            listener.notify(23);
            
            expect(listener.value).toEqual(23);
        });
    });
});