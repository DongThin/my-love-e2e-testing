var solveQuadraticEquation = require('../src/solveQuadraticEquation.js')
var assert = require('assert');
var test = require('mocha').it;

describe('Calculate quadratic equations', function () {
  describe('The equation have 2 distinct roots', function () {

    function verify2Roots(actual, x1, x2) {
      assert.deepStrictEqual(actual.length, 2);
      assert.strictEqual(actual.includes(x1), true)
      assert.strictEqual(actual.includes(x2), true)

    }
    test('2 positive roots ', function () {
      const actual = solveQuadraticEquation(1, -5, 6);

      verify2Roots(actual, 2, 3);
    });

    test('2 negative roots', function () {
      var actual = solveQuadraticEquation(1, 3, 2);

      verify2Roots(actual, -1, -2);
    });

    test('two fraction roots', function () {
      var actual = solveQuadraticEquation(21, -4, -1);

      verify2Roots(actual, 1/3, -1/7);
    });

    test('two decimal roots', function () {
      var actual = solveQuadraticEquation(1, -0.9596, -2.49724421);

      verify2Roots(actual, 2.1313, -1.1717);
    });

    test('two roots', function () {
      var actual = solveQuadraticEquation(1, -0.3, 0.02);

      verify2Roots(actual, 0.1, 0.2);
    });

    
    test('two decimal roots (1 positive, 1 negative)', function () {
      var actual = solveQuadraticEquation(1, 0, -6.25);

      verify2Roots(actual, 2.5, -2.5);
    });
  });


  //_____________________________________________
  describe('The equation with a double root', function () {
    test('A double positive root', function () {
      var actual = solveQuadraticEquation(1, -4, 4);

      var expected = [2];
      assert.deepEqual(actual, expected);
    });

    test('A double negative root', function () {
      var actual = solveQuadraticEquation(1, 2, 1);
      var expected = [-1];
      assert.deepEqual(actual, expected);
    });

    test('Double root of 0 (a#0,b=0,c=0)', function () {
      var actual = solveQuadraticEquation(1, 0, 0);
      var expected = [0];
      assert.deepEqual(actual, expected);
    });

  });

  //______________________________________________
  describe('The equation without root', function () {

    test('The equation without root (a, b, c # 0)', function () {
      var actual = solveQuadraticEquation(1, 2, 3);

      assert.deepEqual(actual.length, 0);
    });

    test('The equation without root (a#0, b=0, c>0)', function () {
      var actual = solveQuadraticEquation(1, 0, 3);

      assert.deepEqual(actual.length, 0);
    });


  });
});
