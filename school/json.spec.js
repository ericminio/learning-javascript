var expect = require('chai').expect;

describe('json parsing', function() {

   it('can parse an object using native JSON', function() {
       var response = JSON.parse('{"alive":true}');
       expect(response.alive).to.equal(true);
   });

   it('can parse an object from a string', function() {
       var value = '{"alive":true}';
       var response = JSON.parse(value);

       expect(response.alive).to.equal(true);
   });
});
