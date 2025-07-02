import assert from 'assert';
import { it as test } from 'mocha';
import {
  ADJUSTMENT_COEFFICIENTS,
  getAdjustmentCoefficient,
  getAllCoefficients
} from './adjustmentCoefficients.js';

describe('Adjustment Coefficients', () => {
  describe('getAdjustmentCoefficient', () => {
    test('should return correct coefficient for known years', () => {
      assert.strictEqual(getAdjustmentCoefficient(2021), 1.07);
      assert.strictEqual(getAdjustmentCoefficient(2023), 1.00);
      assert.strictEqual(getAdjustmentCoefficient(2024), 1.00);
    });

    test('should throw error for invalid input type', () => {
      assert.throws(() => getAdjustmentCoefficient('2021'), 
        /Year must be a number >= 2014/);
    });

    test('should throw error for year before 2014', () => {
      assert.throws(() => getAdjustmentCoefficient(2013), 
        /Year must be a number >= 2014/);
    });

    test('should return latest coefficient for future years not in table', () => {
      // Test with a future year not in the coefficients table
      const futureYear = 2030;
      const result = getAdjustmentCoefficient(futureYear);
      
      // Should return the coefficient for the latest year in the table
      const latestYear = Math.max(...Object.keys(ADJUSTMENT_COEFFICIENTS).map(Number));
      const expectedCoefficient = ADJUSTMENT_COEFFICIENTS[latestYear];
      
      assert.strictEqual(result, expectedCoefficient);
    });
  });

  describe('getAllCoefficients', () => {
    test('should return all coefficients', () => {
      const result = getAllCoefficients();
      
      // Should contain all expected years
      assert.strictEqual(result[2021], 1.07);
      assert.strictEqual(result[2023], 1.00);
      assert.strictEqual(result[2024], 1.00);
    });

    test('should return a copy to prevent mutation', () => {
      const result = getAllCoefficients();
      
      // Modify the returned object
      result[2021] = 999;
      
      // Original should be unchanged
      assert.strictEqual(getAdjustmentCoefficient(2021), 1.07);
      assert.notStrictEqual(result, ADJUSTMENT_COEFFICIENTS);
    });
  });
});
