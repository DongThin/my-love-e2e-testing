import Big from '../lib/big.js';
import { BENEFIT_MULTIPLIER, NEW_RULES_START_DATE } from './common/socialInsuranceConstants.js';
import { calculateYearsFromMonths } from './common/periodCalculations.js';
import { calculateTotalAdjustedAmountWithLimits } from './utils/salaryAdjustments.js';
import { validateDateRange, calculateMonthsBetween } from './utils/monthHelpers.js';

/**
 * Validate contribution periods array
 * @param {Array} periods - Array of contribution periods
 * @throws {Error} If validation fails
 */
function validateContributionPeriods(periods) {
  if (!Array.isArray(periods) || periods.length === 0) {
    throw new Error('Contribution periods must be a non-empty array');
  }

  for (let i = 0; i < periods.length; i++) {
    const period = periods[i];
    
    if (!period.startMonth || !period.endMonth || typeof period.monthlySalary !== 'number') {
      throw new Error(`Period ${i + 1}: Must have startMonth, endMonth, and monthlySalary`);
    }

    if (period.monthlySalary < 0) {
      throw new Error(`Period ${i + 1}: Monthly salary must be non-negative`);
    }

    // Validate date range
    validateDateRange(period.startMonth, period.endMonth);

    // Check if period is after 2014 (when new rules apply)
    if (period.startMonth < NEW_RULES_START_DATE) {
      throw new Error(`Period ${i + 1}: Only contributions from ${NEW_RULES_START_DATE} onwards are supported`);
    }
  }

  // Check for overlapping periods
  const sortedPeriods = [...periods].sort((a, b) => a.startMonth.localeCompare(b.startMonth));
  for (let i = 1; i < sortedPeriods.length; i++) {
    if (sortedPeriods[i].startMonth <= sortedPeriods[i - 1].endMonth) {
      throw new Error('Contribution periods cannot overlap');
    }
  }
}

/**
 * Calculate total contribution period from all periods
 * @param {Array} periods - Array of contribution periods
 * @returns {Object} Object containing total months and years
 */
function calculateTotalContributionPeriod(periods) {
  let totalMonths = 0;

  for (const period of periods) {
    const months = calculateMonthsBetween(period.startMonth, period.endMonth);
    totalMonths += months;
  }

  const totalYears = calculateYearsFromMonths(totalMonths);

  return {
    totalMonths,
    totalYears
  };
}

/**
 * Calculate average monthly contribution from all periods
 * @param {Array} periods - Array of contribution periods
 * @returns {Object} Object containing calculation details
 */
function calculateAverageMonthlyContribution(periods) {
  const adjustmentResult = calculateTotalAdjustedAmountWithLimits(periods);
  const periodResult = calculateTotalContributionPeriod(periods);

  return {
    totalMonths: adjustmentResult.totalMonths,
    totalAdjustedAmount: adjustmentResult.totalAdjustedAmount,
    averageMonthlyContribution: adjustmentResult.averageMonthlyContribution,
    totalYears: periodResult.totalYears,
    periodBreakdowns: adjustmentResult.periodBreakdowns
  };
}

/**
 * Calculate one-time social insurance benefit
 * @param {Array} contributionPeriods - Array of contribution periods
 * @returns {Object} Complete calculation result
 */
function calculateOneTimeBenefit(contributionPeriods) {
  // Validate input
  validateContributionPeriods(contributionPeriods);

  // Calculate average monthly contribution and other details
  const contributionDetails = calculateAverageMonthlyContribution(contributionPeriods);

  // Calculate one-time benefit amount using the formula:
  // Benefit = 2 × Average Monthly Contribution × Total Years
  const benefitAmount = new Big(BENEFIT_MULTIPLIER)
    .times(contributionDetails.averageMonthlyContribution)
    .times(contributionDetails.totalYears);

  return {
    oneTimeBenefitAmount: parseFloat(benefitAmount.toString()),
    breakdown: {
      benefitMultiplier: BENEFIT_MULTIPLIER,
      totalContributionMonths: contributionDetails.totalMonths,
      totalContributionYears: contributionDetails.totalYears,
      averageMonthlyContribution: contributionDetails.averageMonthlyContribution,
      totalAdjustedAmount: contributionDetails.totalAdjustedAmount,
      periodDetails: contributionDetails.periodBreakdowns
    },
    formula: `${BENEFIT_MULTIPLIER} × ${contributionDetails.averageMonthlyContribution} × ${contributionDetails.totalYears} = ${parseFloat(benefitAmount.toString())}`
  };
}

export {
  calculateOneTimeBenefit,
  validateContributionPeriods,
  calculateTotalContributionPeriod,
  calculateAverageMonthlyContribution
};
