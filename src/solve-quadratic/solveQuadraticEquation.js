import Big from 'big.js';

// Constants to avoid creating new Big instances repeatedly
const TWO = Big(2);
const FOUR = Big(4);

/**
 * Solves a quadratic equation of the form ax² + bx + c = 0
 * @param {number} a - Coefficient of x²
 * @param {number} b - Coefficient of x
 * @param {number} c - Constant term
 * @returns {Array<{real?: number, imaginary?: number}>} Array of solutions as objects with real and/or imaginary parts
 * @throws {Error} If a is zero or coefficients are not finite
 * @throws {TypeError} If inputs are not numbers
 */
export default function solveQuadraticEquation(a, b, c) {
    // Input validation
    if ([a, b, c].some(x => typeof x !== 'number')) {
        throw new TypeError('All coefficients must be numbers');
    }

    // Handle NaN and Infinity
    if ([a, b, c].some(x => !Number.isFinite(x))) {
        throw new Error('Coefficients must be finite numbers');
    }

    const bigA = Big(a);
    if (bigA.eq(0)) {
        throw new Error('Coefficient a must not be zero');
    }

    const bigB = Big(b);
    const bigC = Big(c);

    const delta = bigB.pow(2).minus(FOUR.times(bigA).times(bigC));
    const twoA = TWO.times(bigA);
    const negB = bigB.times(-1);

    // Calculate real part (common for all cases)
    const realPart = negB.div(twoA);
    const realValue = realPart.toNumber();
    
    // Helper to create root object without undefined values
    const createRoot = (real, imaginary) => {
        const root = {};
        if (real !== 0 && real !== undefined) root.real = real;
        if (imaginary !== undefined) root.imaginary = imaginary;
        return root;
    };

    if (delta.gt(0)) {
        const sqrtDelta = delta.sqrt().div(twoA);
        return [
            createRoot(realValue + sqrtDelta.toNumber()),
            createRoot(realValue - sqrtDelta.toNumber())
        ];
    } else if (delta.eq(0)) {
        return [createRoot(realValue)];
    } else {
        const imaginaryPart = delta.abs().sqrt().div(twoA).toNumber();
        return [
            createRoot(realValue, imaginaryPart),
            createRoot(realValue, -imaginaryPart)
        ];
    }
}
