import assert from 'assert';
import { it as test } from 'mocha';
import {
  roundPartialYear,
  calculateYearsFromMonths,
  parseContributionPeriod
} from './periodCalculations.js';

describe('Period Calculations', () => {
  describe('roundPartialYear', () => {
    test('throws error for invalid input type', () => {
      assert.throws(() => roundPartialYear('6'), 
        /Partial months must be between 1 and 11/);
    });

    test('throws error for months less than minimum', () => {
      assert.throws(() => roundPartialYear(0), 
        /Partial months must be between 1 and 11/);
    });

    test('throws error for months greater than maximum', () => {
      assert.throws(() => roundPartialYear(12), 
        /Partial months must be between 1 and 11/);
    });

    test('returns 0.5 for 1-6 months', () => {
      assert.strictEqual(roundPartialYear(1), 0.5);
      assert.strictEqual(roundPartialYear(3), 0.5);
      assert.strictEqual(roundPartialYear(6), 0.5);
    });

    test('returns 1.0 for 7-11 months', () => {
      assert.strictEqual(roundPartialYear(7), 1.0);
      assert.strictEqual(roundPartialYear(9), 1.0);
      assert.strictEqual(roundPartialYear(11), 1.0);
    });
  });

  describe('calculateYearsFromMonths', () => {
    test('throws error for invalid input type', () => {
      assert.throws(() => calculateYearsFromMonths('24'), 
        /Total months must be a non-negative number/);
    });

    test('throws error for negative months', () => {
      assert.throws(() => calculateYearsFromMonths(-1), 
        /Total months must be a non-negative number/);
    });

    test('handles zero months', () => {
      assert.strictEqual(calculateYearsFromMonths(0), 0);
    });

    test('correctly calculates full years', () => {
      assert.strictEqual(calculateYearsFromMonths(24), 2);
      assert.strictEqual(calculateYearsFromMonths(36), 3);
    });

    test('correctly handles partial years using rounding rules', () => {
      // 13 months = 1 year + 1 month = 1.5 years
      assert.strictEqual(calculateYearsFromMonths(13), 1.5);
      
      // 19 months = 1 year + 7 months = 2 years
      assert.strictEqual(calculateYearsFromMonths(19), 2);
      
      // 29 months = 2 years + 5 months = 2.5 years
      assert.strictEqual(calculateYearsFromMonths(29), 2.5);
    });
  });

  describe('parseContributionPeriod', () => {
    test('throws error for missing start month', () => {
      assert.throws(() => parseContributionPeriod(null, '2024-01'), 
        /Start month and end month are required/);
    });

    test('throws error for missing end month', () => {
      assert.throws(() => parseContributionPeriod('2024-01', null), 
        /Start month and end month are required/);
    });

    test('throws error for invalid date format', () => {
      assert.throws(() => parseContributionPeriod('2024/01', '2024-02'), 
        /Months must be in YYYY-MM format/);
      assert.throws(() => parseContributionPeriod('2024-01', '2024/02'), 
        /Months must be in YYYY-MM format/);
    });

    test('throws error when start month is after end month', () => {
      assert.throws(() => parseContributionPeriod('2024-02', '2024-01'), 
        /Start month cannot be after end month/);
    });

    test('correctly calculates period within same year', () => {
      const result = parseContributionPeriod('2024-01', '2024-06');
      assert.deepStrictEqual(result, {
        startMonth: '2024-01',
        endMonth: '2024-06',
        months: 6,
        years: 0.5
      });
    });

    test('correctly calculates period across years', () => {
      const result = parseContributionPeriod('2023-11', '2024-02');
      assert.deepStrictEqual(result, {
        startMonth: '2023-11',
        endMonth: '2024-02',
        months: 4,
        years: 0.5
      });
    });

    test('correctly calculates period with exact year', () => {
      const result = parseContributionPeriod('2023-01', '2023-12');
      assert.deepStrictEqual(result, {
        startMonth: '2023-01',
        endMonth: '2023-12',
        months: 12,
        years: 1
      });
    });
  });
});
