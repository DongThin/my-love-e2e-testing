import { expect } from 'chai';
import { sum } from './sum.js';

describe('sum function', () => {
    it('should correctly add two positive numbers', () => {
        expect(sum(2, 3)).to.equal(5);
    });

    it('should correctly handle negative numbers', () => {
        expect(sum(-1, -2)).to.equal(-3);
        expect(sum(-1, 5)).to.equal(4);
    });

    it('should handle zero correctly', () => {
        expect(sum(0, 5)).to.equal(5);
        expect(sum(0, 0)).to.equal(0);
    });

    it('should throw error when arguments are not numbers', () => {
        expect(() => sum('2', 3)).to.throw('Both arguments must be numbers');
        expect(() => sum(2, '3')).to.throw('Both arguments must be numbers');
    });
});