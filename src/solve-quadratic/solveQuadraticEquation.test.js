import { expect } from 'chai';
import solveQuadraticEquation from './solveQuadraticEquation';

describe('Quadratic Equation Solver', () => {
    context('when validating inputs', () => {
        it('should reject non-numeric coefficients', () => {
            // Given: a string instead of number coefficient
            const invalidCoefficient = '1';

            // When/Then: it should throw TypeError
            expect(() => solveQuadraticEquation(invalidCoefficient, 2, 3))
                .to.throw(TypeError, 'All coefficients must be numbers');
        });

        it('should reject infinite coefficients', () => {
            // Given/When/Then: it should throw Error for Infinity
            expect(() => solveQuadraticEquation(Infinity, 2, 3))
                .to.throw(Error, 'Coefficients must be finite numbers');
        });

        it('should reject zero leading coefficient', () => {
            // Given/When/Then: it should throw Error for a = 0
            expect(() => solveQuadraticEquation(0, 5, 3))
                .to.throw(Error, 'Coefficient a must not be zero');
        });
    });

    context('when equation has real distinct roots', () => {
        it('should solve equation x² - 5x + 6 = 0', () => {
            // Given: coefficients of x² - 5x + 6
            const a = 1, b = -5, c = 6;

            // When: solving the equation
            const actual = solveQuadraticEquation(a, b, c);

            // Then: it should return roots 2 and 3
            expect(actual).to.have.lengthOf(2, 'Should have exactly two roots');
            expect(actual[0]).to.deep.include({ real: 3, imaginary: 0 });
            expect(actual[1]).to.deep.include({ real: 2, imaginary: 0 });
        });

        it('should solve equation x² + 3x + 2 = 0', () => {
            // Given: coefficients of x² + 3x + 2
            const a = 1, b = 3, c = 2;

            // When: solving the equation
            const actual = solveQuadraticEquation(a, b, c);

            // Then: it should return roots -1 and -2
            expect(actual).to.have.lengthOf(2, 'Should have exactly two roots');
            expect(actual[0]).to.deep.include({ real: -1, imaginary: 0 });
            expect(actual[1]).to.deep.include({ real: -2, imaginary: 0 });
        });

        it('should solve equation 21x² - 4x - 1 = 0', () => {
            // Given: coefficients of 21x² - 4x - 1
            const a = 21, b = -4, c = -1;

            // When: solving the equation
            const actual = solveQuadraticEquation(a, b, c);

            // Then: it should return fractional roots 1/3 and -1/7
            expect(actual).to.have.lengthOf(2, 'Should have exactly two roots');
            expect(actual[0].real).to.be.closeTo(1 / 3, 0.001);
            expect(actual[0].imaginary).to.equal(0);
            expect(actual[1].real).to.be.closeTo(-1 / 7, 0.001);
            expect(actual[1].imaginary).to.equal(0);
        });
    });

    context('when equation has a double root', () => {
        it('should solve equation x² - 4x + 4 = 0', () => {
            // Given: coefficients of x² - 4x + 4
            const a = 1, b = -4, c = 4;

            // When: solving the equation
            const actual = solveQuadraticEquation(a, b, c);

            // Then: it should return double root x = 2
            expect(actual).to.have.lengthOf(1, 'Should have exactly one root');
            expect(actual[0]).to.deep.include({ real: 2, imaginary: 0 });
        });

        it('should solve equation x² + 2x + 1 = 0', () => {
            // Given: coefficients of x² + 2x + 1
            const a = 1, b = 2, c = 1;

            // When: solving the equation
            const actual = solveQuadraticEquation(a, b, c);

            // Then: it should return double root x = -1
            expect(actual).to.have.lengthOf(1, 'Should have exactly one root');
            expect(actual[0]).to.deep.include({ real: -1, imaginary: 0 });
        });

        it('should solve equation x² = 0', () => {
            // Given: coefficients of x²
            const a = 1, b = 0, c = 0;

            // When: solving the equation
            const actual = solveQuadraticEquation(a, b, c);

            // Then: it should return double root x = 0
            expect(actual).to.have.lengthOf(1, 'Should have exactly one root');
            expect(actual[0]).to.deep.include({ real: 0, imaginary: 0 });
        });
    });

    context('when equation has complex roots', () => {
        it('should solve equation x² + 1 = 0', () => {
            // Given: coefficients of x² + 1
            const a = 1, b = 0, c = 1;

            // When: solving the equation
            const actual = solveQuadraticEquation(a, b, c);

            // Then: it should return complex roots ±i
            expect(actual).to.have.lengthOf(2, 'Should have exactly two roots');
            expect(actual[0]).to.deep.include({ real: 0, imaginary: 1 });
            expect(actual[1]).to.deep.include({ real: 0, imaginary: -1 });
        });

        it('should solve equation x² + 2x + 2 = 0', () => {
            // Given: coefficients of x² + 2x + 2
            const a = 1, b = 2, c = 2;

            // When: solving the equation
            const actual = solveQuadraticEquation(a, b, c);

            // Then: it should return complex roots -1 ± i
            expect(actual).to.have.lengthOf(2, 'Should have exactly two roots');
            expect(actual[0]).to.deep.include({ real: -1, imaginary: 1 });
            expect(actual[1]).to.deep.include({ real: -1, imaginary: -1 });
        });

        it('should solve equation 2x² + 4x + 5 = 0', () => {
            // Given: coefficients of 2x² + 4x + 5
            const a = 2, b = 4, c = 5;

            // When: solving the equation
            const actual = solveQuadraticEquation(a, b, c);

            // Then: it should return complex roots -1 ± √1.5i
            const expectedImaginary = Math.sqrt(1.5);
            expect(actual).to.have.lengthOf(2, 'Should have exactly two roots');
            expect(actual[0].real).to.equal(-1);
            expect(actual[0].imaginary).to.be.closeTo(expectedImaginary, 0.001);
            expect(actual[1].real).to.equal(-1);
            expect(actual[1].imaginary).to.be.closeTo(-expectedImaginary, 0.001);
        });
    });
});
