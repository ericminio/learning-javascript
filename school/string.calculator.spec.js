var expect = require('chai').expect;

describe('string calculator', function() {

  it('can add', function() {
    expect(eval('x+y', { x:5, y:6 })).to.equal(11);
  });

  it('can multiply', function() {
    expect(eval('x*y', { x:5, y:6 })).to.equal(30);
  });

  it('can multiply and add', function() {
    expect(eval('x*y+z', { x:5, y:6, z:2 })).to.equal(32);
  });

  it('can override operators priorities with parenthesis', function() {
    expect(eval('x*(y+z)', { x:5, y:6, z:2 })).to.equal(40);
  });

  it('supports spaces in expression', function() {
    expect(eval(' x + y + 1', { x:5, y:4 })).to.equal(10);
  });

  it('supports expression with static values', function() {
    expect(eval('x+2.3+1.7', { x:5 })).to.equal(9);
  });

});

var operations = [
  { code: '+', call: function(a, b) { return a+b; } },
  { code: '*', call: function(a, b) { return a*b; } }
];

var eval = function(expression, map) {

  var indexOfClosingParenthesis = expression.indexOf(')');
  if (indexOfClosingParenthesis != -1) {
    var indexOfOpeningParenthesis = expression.substring(0, indexOfClosingParenthesis).lastIndexOf('(');
    var subExpression = expression.substring(indexOfOpeningParenthesis+1, indexOfClosingParenthesis);
    var value = eval(subExpression, map);
    var reducedExpression = expression.substring(0, indexOfOpeningParenthesis)
                            + value
                            + expression.substring(indexOfClosingParenthesis+1)
    return eval(reducedExpression, map);
  }
  for (var index = 0; index<operations.length; index++) {
    indexOfOperator = expression.indexOf(operations[index].code);
    if(indexOfOperator != -1) {
      var left = expression.substring(0, indexOfOperator);
      var right = expression.substring(indexOfOperator + 1);
      return operations[index].call(eval(left, map), eval(right, map));
    }
  }
  var value = map[expression.trim()];
  return value !== undefined ? value : parseFloat(expression);
};
