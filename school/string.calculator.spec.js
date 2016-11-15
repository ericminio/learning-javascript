var expect = require('chai').expect;

var valueFromMap = function(variable, map) {
  return map[variable];
};

var eval = function(expression, map) {

  var indexOfClosingParenthesis = expression.indexOf(')');
  if (indexOfClosingParenthesis != -1) {
    var indexOfOpeningParenthesis = expression.substring(0, indexOfClosingParenthesis).lastIndexOf('(');
    var subExpression = expression.substring(indexOfOpeningParenthesis+1, indexOfClosingParenthesis);
    var value = eval(subExpression, map);
    return eval(expression.substring(0, indexOfOpeningParenthesis) + value + expression.substring(indexOfClosingParenthesis+1), map);
  }

  var operations = [
    { code: '+', call: function(a, b) { return a+b; } },
    { code: '*', call: function(a, b) { return a*b; } }
  ];

  for (var index = 0; index<operations.length; index++) {
    indexOfOperation = expression.indexOf(operations[index].code);
    if(indexOfOperation != -1) {
      var left = expression.substring(0, indexOfOperation);
      var right = expression.substring(indexOfOperation + 1);
      return operations[index].call(eval(left, map), eval(right, map));
    }
  }

  var value = valueFromMap(expression, map);
  if (value === undefined) {
      return parseInt(expression);
  }
  return parseInt(value);
};

describe('eval', function() {

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

});
