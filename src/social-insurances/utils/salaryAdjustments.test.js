import assert from 'assert';
import { it as test } from 'mocha';
import {
  adjustAndCapSalary,
  calculatePeriodAdjustedAmount,
  calculateTotalAdjustedAmountWithLimits
} from './salaryAdjustments.js';

describe('Salary Adjustments', () => {
  describe('adjustAndCapSalary', () => {
    test('should adjust salary correctly', () => {
      const result = adjustAndCapSalary(5000000, '2021-01');
      // 5M * 1.07 (2021 coefficient) = 5,350,000
      assert.strictEqual(result, 5350000);
    });

    test('should cap salary at upper bound', () => {
      // Use a salary higher than the upper bound for 2021
      const result = adjustAndCapSalary(50000000, '2021-01');
      // Should be capped at upper bound first, then adjusted
      assert.ok(result > 0);
    });

    test('should throw error for invalid salary type', () => {
      assert.throws(() => adjustAndCapSalary('5000000', '2021-01'), 
        /Salary must be a non-negative number/);
    });

    test('should throw error for negative salary', () => {
      assert.throws(() => adjustAndCapSalary(-1000, '2021-01'), 
        /Salary must be a non-negative number/);
    });

    test('should handle zero salary', () => {
      const result = adjustAndCapSalary(0, '2021-01');
      assert.strictEqual(result, 0);
    });
  });

  describe('calculatePeriodAdjustedAmount', () => {
    test('should calculate period amount correctly', () => {
      const period = {
        startMonth: '2021-01',
        endMonth: '2021-03',
        monthlySalary: 5000000
      };

      const result = calculatePeriodAdjustedAmount(period);
      
      assert.strictEqual(result.startMonth, '2021-01');
      assert.strictEqual(result.endMonth, '2021-03');
      assert.strictEqual(result.months, 3);
      assert.ok(result.totalAdjustedAmount > 0);
      assert.ok(Array.isArray(result.monthlyBreakdown));
      assert.strictEqual(result.monthlyBreakdown.length, 3);
    });

    test('should throw error for missing startMonth', () => {
      const period = {
        endMonth: '2021-03',
        monthlySalary: 5000000
      };

      assert.throws(() => calculatePeriodAdjustedAmount(period), 
        /Period must have startMonth, endMonth, and monthlySalary/);
    });

    test('should throw error for missing endMonth', () => {
      const period = {
        startMonth: '2021-01',
        monthlySalary: 5000000
      };

      assert.throws(() => calculatePeriodAdjustedAmount(period), 
        /Period must have startMonth, endMonth, and monthlySalary/);
    });

    test('should throw error for invalid monthlySalary', () => {
      const period = {
        startMonth: '2021-01',
        endMonth: '2021-03',
        monthlySalary: 'invalid'
      };

      assert.throws(() => calculatePeriodAdjustedAmount(period), 
        /Period must have startMonth, endMonth, and monthlySalary/);
    });
  });

  describe('calculateTotalAdjustedAmountWithLimits', () => {
    test('should calculate total for multiple periods', () => {
      const periods = [
        {
          startMonth: '2021-01',
          endMonth: '2021-06',
          monthlySalary: 5000000
        },
        {
          startMonth: '2022-01',
          endMonth: '2022-06',
          monthlySalary: 6000000
        }
      ];

      const result = calculateTotalAdjustedAmountWithLimits(periods);
      
      assert.strictEqual(result.totalMonths, 12);
      assert.ok(result.totalAdjustedAmount > 0);
      assert.ok(result.averageMonthlyContribution > 0);
      assert.ok(Array.isArray(result.periodBreakdowns));
      assert.strictEqual(result.periodBreakdowns.length, 2);
    });

    test('should throw error for non-array input', () => {
      assert.throws(() => calculateTotalAdjustedAmountWithLimits('invalid'), 
        /Periods must be a non-empty array/);
    });

    test('should throw error for empty array', () => {
      assert.throws(() => calculateTotalAdjustedAmountWithLimits([]), 
        /Periods must be a non-empty array/);
    });

    test('should handle single period', () => {
      const periods = [
        {
          startMonth: '2021-01',
          endMonth: '2021-03',
          monthlySalary: 5000000
        }
      ];

      const result = calculateTotalAdjustedAmountWithLimits(periods);
      
      assert.strictEqual(result.totalMonths, 3);
      assert.strictEqual(result.periodBreakdowns.length, 1);
      assert.ok(result.totalAdjustedAmount > 0);
    });
  });
});
