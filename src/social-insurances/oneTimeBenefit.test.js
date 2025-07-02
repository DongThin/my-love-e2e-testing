/**
 * Tests for Social Insurance One-Time Benefit Calculator
 */

import { expect } from 'chai';
import { calculateOneTimeBenefit } from './oneTimeBenefit.js';

describe('Social Insurance One-Time Benefit Calculator', () => {
  describe('calculateOneTimeBenefit', () => {
    it('should calculate benefit for the example case (Ms. Do Quynh Mai)', () => {
      const contributionPeriods = [
        {
          startMonth: '2021-01',
          endMonth: '2021-12',
          monthlySalary: 5000000
        },
        {
          startMonth: '2022-01',
          endMonth: '2023-04',
          monthlySalary: 6000000
        },
        {
          startMonth: '2023-05',
          endMonth: '2024-04',
          monthlySalary: 7000000
        }
      ];

      const result = calculateOneTimeBenefit(contributionPeriods);

      // Step 1: Verify total contribution period
      expect(result.breakdown.totalContributionMonths).to.equal(40); // 12 + 16 + 12 months
      expect(result.breakdown.totalContributionYears).to.equal(3.5); // 3 years and 4 months = 3.5 years

      // Step 2: Verify adjusted salary calculations for each period
      const periodDetails = result.breakdown.periodDetails;
      
      // First period (2021)
      const period2021 = periodDetails[0];
      expect(period2021.totalAdjustedAmount).to.be.closeTo(64200000, 100); // 5,000,000 × 1.07 × 12

      // Second period (2022-2023 April)
      const period2022 = periodDetails[1];
      const expectedAmount2022 = 74160000 + 24000000; // (6,000,000 × 1.03 × 12) + (6,000,000 × 1.00 × 4)
      expect(period2022.totalAdjustedAmount).to.be.closeTo(expectedAmount2022, 100);

      // Third period (2023 May-2024 April)
      const period2023_2024 = periodDetails[2];
      const expectedAmount2023_2024 = 56000000 + 28000000; // (7,000,000 × 1.00 × 8) + (7,000,000 × 1.00 × 4)
      expect(period2023_2024.totalAdjustedAmount).to.be.closeTo(expectedAmount2023_2024, 100);

      // Step 3: Verify total adjusted amount
      const expectedTotalAdjusted = 64200000 + 74160000 + 24000000 + 56000000 + 28000000;
      expect(result.breakdown.totalAdjustedAmount).to.be.closeTo(expectedTotalAdjusted, 100);

      // Step 4: Verify average monthly contribution
      const expectedAverage = expectedTotalAdjusted / 40; // Total adjusted / total months = 246,360,000 / 40
      expect(result.breakdown.averageMonthlyContribution).to.be.closeTo(6159000, 100);

      // Step 5: Verify final benefit amount (2 × average × years)
      const expectedBenefit = 2 * 6159000 * 3.5;
      expect(result.oneTimeBenefitAmount).to.equal(43113000); // Exact match from example

      // Verify the formula string is provided
      expect(result.formula).to.include('2');
      expect(result.formula).to.include('6159000');
      expect(result.formula).to.include('3.5');
      expect(result.formula).to.include('43113000');
    });

    it('should handle a simple single period case', () => {
      const contributionPeriods = [
        {
          startMonth: '2023-01',
          endMonth: '2023-12',
          monthlySalary: 6000000
        }
      ];

      const result = calculateOneTimeBenefit(contributionPeriods);

      expect(result.breakdown.totalContributionMonths).to.equal(12);
      expect(result.breakdown.totalContributionYears).to.equal(1);
      expect(result.oneTimeBenefitAmount).to.be.greaterThan(0);
    });

    it('should apply upper bounds correctly', () => {
      const contributionPeriods = [
        {
          startMonth: '2023-01',
          endMonth: '2023-06',
          monthlySalary: 35000000 // This exceeds the upper bound (29,800,000)
        }
      ];

      const result = calculateOneTimeBenefit(contributionPeriods);
      
      // The calculation should use the capped amount (29,800,000), not the original high salary (35,000,000)
      expect(result.breakdown.averageMonthlyContribution).to.be.lessThan(30000000);
      expect(result.breakdown.averageMonthlyContribution).to.be.closeTo(29800000, 100);
    });

    it('should throw error for invalid input', () => {
      expect(() => calculateOneTimeBenefit([])).to.throw('non-empty array');
      expect(() => calculateOneTimeBenefit(null)).to.throw('non-empty array');
      
      expect(() => calculateOneTimeBenefit([{
        startMonth: '2023-01',
        endMonth: '2023-12'
        // missing monthlySalary
      }])).to.throw('Must have startMonth, endMonth, and monthlySalary');
    });

    it('should throw error for periods before 2014', () => {
      const contributionPeriods = [
        {
          startMonth: '2013-01',
          endMonth: '2013-12',
          monthlySalary: 5000000
        }
      ];

      expect(() => calculateOneTimeBenefit(contributionPeriods)).to.throw('Only contributions from 2014-01 onwards');
    });

    it('should handle partial year rounding correctly', () => {
      // Test 6 months (should be 0.5 years)
      const periods6Months = [
        {
          startMonth: '2023-01',
          endMonth: '2023-06',
          monthlySalary: 6000000
        }
      ];

      const result6 = calculateOneTimeBenefit(periods6Months);
      expect(result6.breakdown.totalContributionYears).to.equal(0.5);

      // Test 7 months (should be 1 year)
      const periods7Months = [
        {
          startMonth: '2023-01',
          endMonth: '2023-07',
          monthlySalary: 6000000
        }
      ];

      const result7 = calculateOneTimeBenefit(periods7Months);
      expect(result7.breakdown.totalContributionYears).to.equal(1);
    });
  });
});
