const solveQuadraticEquation = require('../src/solveQuadraticEquation.js')
const assert = require('assert');
const test = require('mocha').it;

describe('Calculate quadratic equations', () => {
  describe('The equation have 2 distinct roots', () => {

    function verify2Roots(actual, x1, x2) {
      assert.deepStrictEqual(actual.length, 2);
      assert.strictEqual(actual.includes(x1), true)
      assert.strictEqual(actual.includes(x2), true)
    }

    test('2 positive roots ', () => {
      const actual = solveQuadraticEquation(1, -5, 6);

      verify2Roots(actual, 2, 3);
    });

    test('2 negative roots', () => {
      const actual = solveQuadraticEquation(1, 3, 2);

      verify2Roots(actual, -1, -2);
    });

    test('two fraction roots', () => {
      const actual = solveQuadraticEquation(21, -4, -1);

      verify2Roots(actual, 1/3, -1/7);
    });

    test('two decimal roots', () => {
      const actual = solveQuadraticEquation(1, -0.9596, -2.49724421);

      verify2Roots(actual, 2.1313, -1.1717);
    });

    test('two roots', () => {
      const actual = solveQuadraticEquation(1, -0.3, 0.02);

      verify2Roots(actual, 0.1, 0.2);
    });

    test('two decimal roots (1 positive, 1 negative)', () => {
      const actual = solveQuadraticEquation(1, 0, -6.25);

      verify2Roots(actual, 2.5, -2.5);
    });
  });

  describe('The equation with a double root', () => {
    test('A double positive root', () => {
      const actual = solveQuadraticEquation(1, -4, 4);

      const expected = [2];
      assert.deepEqual(actual, expected);
    });

    test('A double negative root', () => {
      const actual = solveQuadraticEquation(1, 2, 1);
      const expected = [-1];
      assert.deepEqual(actual, expected);
    });

    test('Double root of 0 (a#0,b=0,c=0)', () => {
      const actual = solveQuadraticEquation(1, 0, 0);
      const expected = [0];
      assert.deepEqual(actual, expected);
    });

  });

  describe('The equation without root', () => {

    test('The equation without root (a, b, c # 0)', () => {
      const actual = solveQuadraticEquation(1, 2, 3);

      assert.deepEqual(actual.length, 0);
    });

    test('The equation without root (a#0, b=0, c>0)', () => {
      const actual = solveQuadraticEquation(1, 0, 3);

      assert.deepEqual(actual.length, 0);
    });

  });

  test('Throw exception when a is equal to zero', () => {
    assert.throws(() => {
      solveQuadraticEquation(0, 5, 3);
    }, Error, 'Error: a must not be zero.');
  });
});
