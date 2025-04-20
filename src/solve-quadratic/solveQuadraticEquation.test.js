import assert from 'assert';
import solveQuadraticEquation from './solveQuadraticEquation';

const test = require('mocha').it;

// Helper function moved to outer scope
function verifyRoots(actual, expected) {
    assert.strictEqual(actual.length, expected.length);
    actual.forEach((root, index) => {
        // Allow small floating point differences
        const realDiff = Math.abs(root.real - expected[index].real);
        const imagDiff = Math.abs(root.imaginary - expected[index].imaginary);
        assert.ok(realDiff < 1e-10, `Real part difference too large: ${realDiff}`);
        assert.ok(imagDiff < 1e-10, `Imaginary part difference too large: ${imagDiff}`);
    });
}

describe('Calculate quadratic equations', () => {
    describe('Input validation', () => {
        test('should throw TypeError for non-number inputs', () => {
            assert.throws(() => {
                solveQuadraticEquation('1', 2, 3);
            }, TypeError);
        });

        test('should throw QuadraticEquationError for infinite or NaN inputs', () => {
            assert.throws(() => {
                solveQuadraticEquation(Infinity, 2, 3);
            }, Error);
        });

        test('should throw QuadraticEquationError when a is zero', () => {
            assert.throws(() => {
                solveQuadraticEquation(0, 5, 3);
            }, Error);
        });
    });

    describe('The equation with distinct real roots', () => {
        test('should find two positive roots', () => {
            const actual = solveQuadraticEquation(1, -5, 6);
            const expected = [
                { real: 3, imaginary: 0 },
                { real: 2, imaginary: 0 }
            ];
            verifyRoots(actual, expected);
        });

        test('should find two negative roots', () => {
            const actual = solveQuadraticEquation(1, 3, 2);
            const expected = [
                { real: -1, imaginary: 0 },
                { real: -2, imaginary: 0 }
            ];
            verifyRoots(actual, expected);
        });

        test('should handle fractional roots', () => {
            const actual = solveQuadraticEquation(21, -4, -1);
            const expected = [
                { real: 1/3, imaginary: 0 },
                { real: -1/7, imaginary: 0 }
            ];
            verifyRoots(actual, expected);
        });
    });

    describe('The equation with a double root', () => {
        test('should find a double positive root', () => {
            const actual = solveQuadraticEquation(1, -4, 4);
            verifyRoots(actual, [
                { real: 2, imaginary: 0 }
            ]);
        });

        test('should find a double negative root', () => {
            const actual = solveQuadraticEquation(1, 2, 1);
            verifyRoots(actual, [
                { real: -1, imaginary: 0 }
            ]);
        });

        test('should handle zero as double root', () => {
            const actual = solveQuadraticEquation(1, 0, 0);
            verifyRoots(actual, [
                { real: 0, imaginary: 0 }
            ]);
        });
    });

    describe('The equation with complex roots', () => {
        test('x² + 1 = 0 should return ±i', () => {
            const actual = solveQuadraticEquation(1, 0, 1);
            verifyRoots(actual, [
                { real: 0, imaginary: 1 },
                { real: 0, imaginary: -1 }
            ]);
        });

        test('x² + 2x + 2 = 0 should return -1 ± i', () => {
            const actual = solveQuadraticEquation(1, 2, 2);
            verifyRoots(actual, [
                { real: -1, imaginary: 1 },
                { real: -1, imaginary: -1 }
            ]);
        });

        test('2x² + 4x + 5 = 0 should return -1 ± √1.5i', () => {
            const actual = solveQuadraticEquation(2, 4, 5);
            const expectedImaginary = Math.sqrt(1.5);
            verifyRoots(actual, [
                { real: -1, imaginary: expectedImaginary },
                { real: -1, imaginary: -expectedImaginary }
            ]);
        });
    });
});
