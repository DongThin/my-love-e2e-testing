import assert from 'assert';
import { it as test } from 'mocha';
import {
  parseMonth,
  calculateMonthsBetween,
  validateDateRange,
  getYearFromMonth,
  generateMonthRange
} from './monthHelpers.js';

describe('Month Helpers', () => {
  describe('parseMonth', () => {
    test('should parse valid month string', () => {
      const result = parseMonth('2024-06');
      assert.deepStrictEqual(result, {
        year: 2024,
        month: 6,
        original: '2024-06'
      });
    });

    test('should throw error for null input', () => {
      assert.throws(() => parseMonth(null), 
        /Month string is required and must be a string/);
    });

    test('should throw error for non-string input', () => {
      assert.throws(() => parseMonth(123), 
        /Month string is required and must be a string/);
    });

    test('should throw error for invalid format', () => {
      assert.throws(() => parseMonth('2024/06'), 
        /Month must be in YYYY-MM format/);
    });

    test('should throw error for invalid month', () => {
      assert.throws(() => parseMonth('2024-13'), 
        /Month must be between 01 and 12/);
      assert.throws(() => parseMonth('2024-00'), 
        /Month must be between 01 and 12/);
    });

    test('should throw error for invalid year', () => {
      assert.throws(() => parseMonth('1899-06'), 
        /Year must be between 1900 and 2100/);
      assert.throws(() => parseMonth('2101-06'), 
        /Year must be between 1900 and 2100/);
    });
  });

  describe('calculateMonthsBetween', () => {
    test('should calculate months within same year', () => {
      const result = calculateMonthsBetween('2024-01', '2024-06');
      assert.strictEqual(result, 6);
    });

    test('should calculate months across years', () => {
      const result = calculateMonthsBetween('2023-11', '2024-02');
      assert.strictEqual(result, 4);
    });

    test('should throw error when start month is after end month', () => {
      assert.throws(() => calculateMonthsBetween('2024-06', '2024-01'), 
        /Start month cannot be after end month/);
    });

    test('should handle same month', () => {
      const result = calculateMonthsBetween('2024-06', '2024-06');
      assert.strictEqual(result, 1);
    });
  });

  describe('validateDateRange', () => {
    test('should return true for valid range', () => {
      const result = validateDateRange('2024-01', '2024-06');
      assert.strictEqual(result, true);
    });

    test('should throw error for invalid start month', () => {
      assert.throws(() => validateDateRange('invalid', '2024-06'), 
        /Invalid date range: Month must be in YYYY-MM format/);
    });

    test('should throw error for invalid end month', () => {
      assert.throws(() => validateDateRange('2024-01', 'invalid'), 
        /Invalid date range: Month must be in YYYY-MM format/);
    });

    test('should throw error when start month is after end month', () => {
      assert.throws(() => validateDateRange('2024-06', '2024-01'), 
        /Invalid date range: Start month cannot be after end month/);
    });
  });

  describe('getYearFromMonth', () => {
    test('should extract year from month string', () => {
      const result = getYearFromMonth('2024-06');
      assert.strictEqual(result, 2024);
    });

    test('should throw error for invalid month string', () => {
      assert.throws(() => getYearFromMonth('invalid'), 
        /Month must be in YYYY-MM format/);
    });
  });

  describe('generateMonthRange', () => {
    test('should generate range within same year', () => {
      const result = generateMonthRange('2024-01', '2024-03');
      assert.deepStrictEqual(result, ['2024-01', '2024-02', '2024-03']);
    });

    test('should generate range across years', () => {
      const result = generateMonthRange('2023-11', '2024-01');
      assert.deepStrictEqual(result, ['2023-11', '2023-12', '2024-01']);
    });

    test('should handle single month range', () => {
      const result = generateMonthRange('2024-06', '2024-06');
      assert.deepStrictEqual(result, ['2024-06']);
    });

    test('should throw error for invalid range', () => {
      assert.throws(() => generateMonthRange('2024-06', '2024-01'), 
        /Invalid date range: Start month cannot be after end month/);
    });
  });
});
