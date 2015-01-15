var $ = require('jquery')(require("jsdom").jsdom().parentWindow);

describe('json parsing', function() {
   
   it('can parse an object using native JSON', function() {
       var response = JSON.parse('{"alive":true}');
       expect(response.alive).toBe(true);
   });
    
   it('can parse an object using jQuery', function() {
       var response = $.parseJSON('{"alive":true}');
       expect(response.alive).toBe(true);
   });
   
   it('can parse an object from a string', function() {
       var value = '{"alive":true}';
       var response = JSON.parse(value);
       
       expect(response.alive).toBe(true);
   });
});