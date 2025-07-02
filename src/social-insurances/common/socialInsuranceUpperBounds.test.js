/**
 * Tests for Social Insurance Upper Bounds
 */

import { expect } from 'chai';
import {
  getSocialInsuranceUpperBound,
  applySocialInsuranceUpperBound,
  getAllSocialInsuranceUpperBounds
} from './socialInsuranceUpperBounds.js';

describe('Social Insurance Upper Bounds', () => {
  describe('getSocialInsuranceUpperBound', () => {
    it('should return correct upper bound for known months (20 x base salary)', () => {
      // July 2024 onwards - Base salary: 2,340,000 × 20 = 46,800,000
      expect(getSocialInsuranceUpperBound('2024-07')).to.equal(46_800_000);
      expect(getSocialInsuranceUpperBound('2025-01')).to.equal(46_800_000);
      
      // July 2023 to June 2024 - Base salary: 1,800,000 × 20 = 36,000,000
      expect(getSocialInsuranceUpperBound('2023-07')).to.equal(36_000_000);
      expect(getSocialInsuranceUpperBound('2024-01')).to.equal(36_000_000);
      
      // July 2022 to June 2023 - Base salary: 1,490,000 × 20 = 29,800,000
      expect(getSocialInsuranceUpperBound('2022-07')).to.equal(29_800_000);
      expect(getSocialInsuranceUpperBound('2023-01')).to.equal(29_800_000);

      // January 2021 to June 2022 - Base salary: 1,490,000 × 20 = 29,800,000
      expect(getSocialInsuranceUpperBound('2021-01')).to.equal(29_800_000);
      expect(getSocialInsuranceUpperBound('2021-07')).to.equal(29_800_000);
      expect(getSocialInsuranceUpperBound('2022-06')).to.equal(29_800_000);
    });

    it('should return the most recent applicable upper bound', () => {
      // Test boundary months
      expect(getSocialInsuranceUpperBound('2022-01')).to.equal(29_800_000); // Uses 2021-01 bound
      expect(getSocialInsuranceUpperBound('2022-06')).to.equal(29_800_000); // Uses 2021-01 bound
      expect(getSocialInsuranceUpperBound('2024-06')).to.equal(36_000_000); // Uses 2023-07 bound
    });

    it('should throw error for invalid input', () => {
      expect(() => getSocialInsuranceUpperBound('')).to.throw('string in YYYY-MM format');
      expect(() => getSocialInsuranceUpperBound(null)).to.throw('string in YYYY-MM format');
      expect(() => getSocialInsuranceUpperBound('2013-01')).to.throw('No social insurance upper bound found');
    });
  });

  describe('applySocialInsuranceUpperBound', () => {
    it('should cap salary at upper bound when exceeded', () => {
      const result = applySocialInsuranceUpperBound(50_000_000, '2023-01');
      expect(result).to.equal(29_800_000); // Should be capped at 2023-01 upper bound (1,490,000 × 20)
    });

    it('should not change salary when under upper bound', () => {
      const result = applySocialInsuranceUpperBound(5000000, '2023-01');
      expect(result).to.equal(5000000); // Should remain unchanged
    });

    it('should handle exact upper bound amount', () => {
      const upperBound = getSocialInsuranceUpperBound('2023-01');
      const result = applySocialInsuranceUpperBound(upperBound, '2023-01');
      expect(result).to.equal(upperBound);
    });

    it('should throw error for invalid salary', () => {
      expect(() => applySocialInsuranceUpperBound(-1000, '2023-01')).to.throw('non-negative number');
      expect(() => applySocialInsuranceUpperBound('invalid', '2023-01')).to.throw('non-negative number');
    });
  });

  describe('getAllSocialInsuranceUpperBounds', () => {
    it('should return array of all upper bounds', () => {
      const bounds = getAllSocialInsuranceUpperBounds();
      expect(bounds).to.be.an('array');
      expect(bounds.length).to.be.greaterThan(0);
      
      // Check structure of first item
      expect(bounds[0]).to.have.property('startMonth');
      expect(bounds[0]).to.have.property('amount');
    });

    it('should return a copy (not original array)', () => {
      const bounds1 = getAllSocialInsuranceUpperBounds();
      const bounds2 = getAllSocialInsuranceUpperBounds();
      expect(bounds1).to.not.equal(bounds2); // Different object references
      expect(bounds1).to.deep.equal(bounds2); // But same content
    });
  });
});
