import Big from '../../lib/big.js';
import { getAdjustmentCoefficient } from '../common/adjustmentCoefficients.js';
import { applySocialInsuranceUpperBound } from '../common/socialInsuranceUpperBounds.js';
import { getYearFromMonth, generateMonthRange } from './monthHelpers.js';

/**
 * Apply both upper bound limit and inflation adjustment to a salary
 * @param {number} salary - Original monthly salary
 * @param {string} month - Month in YYYY-MM format
 * @returns {number} Adjusted salary amount
 */
function adjustAndCapSalary(salary, month) {
  if (typeof salary !== 'number' || salary < 0) {
    throw new Error('Salary must be a non-negative number');
  }

  // First apply the upper bound limit
  const cappedSalary = applySocialInsuranceUpperBound(salary, month);
  
  // Then apply inflation adjustment
  const year = getYearFromMonth(month);
  const coefficient = getAdjustmentCoefficient(year);
  
  // Use BigJS for precise calculation
  const adjustedAmount = new Big(cappedSalary).times(coefficient);
  
  return parseFloat(adjustedAmount.toString());
}

/**
 * Calculate total adjusted amount for a contribution period
 * @param {Object} period - Contribution period with startMonth, endMonth, monthlySalary
 * @returns {Object} Object containing total amount and monthly breakdown
 */
function calculatePeriodAdjustedAmount(period) {
  const { startMonth, endMonth, monthlySalary } = period;
  
  if (!startMonth || !endMonth || typeof monthlySalary !== 'number') {
    throw new Error('Period must have startMonth, endMonth, and monthlySalary');
  }

  const months = generateMonthRange(startMonth, endMonth);
  const monthlyBreakdown = [];
  let totalAmount = new Big(0);

  for (const month of months) {
    const adjustedSalary = adjustAndCapSalary(monthlySalary, month);
    monthlyBreakdown.push({
      month,
      originalSalary: monthlySalary,
      cappedSalary: applySocialInsuranceUpperBound(monthlySalary, month),
      adjustmentCoefficient: getAdjustmentCoefficient(getYearFromMonth(month)),
      adjustedAmount: adjustedSalary
    });
    
    totalAmount = totalAmount.plus(adjustedSalary);
  }

  return {
    startMonth,
    endMonth,
    months: months.length,
    totalAdjustedAmount: parseFloat(totalAmount.toString()),
    monthlyBreakdown
  };
}

/**
 * Calculate total adjusted amount for multiple contribution periods
 * @param {Array} periods - Array of contribution periods
 * @returns {Object} Object containing total amounts and detailed breakdown
 */
function calculateTotalAdjustedAmountWithLimits(periods) {
  if (!Array.isArray(periods) || periods.length === 0) {
    throw new Error('Periods must be a non-empty array');
  }

  const periodBreakdowns = [];
  let totalAdjustedAmount = new Big(0);
  let totalMonths = 0;

  for (const period of periods) {
    const periodResult = calculatePeriodAdjustedAmount(period);
    periodBreakdowns.push(periodResult);
    
    totalAdjustedAmount = totalAdjustedAmount.plus(periodResult.totalAdjustedAmount);
    totalMonths += periodResult.months;
  }

  const averageMonthlyContribution = totalAdjustedAmount.div(totalMonths);

  return {
    totalMonths,
    totalAdjustedAmount: parseFloat(totalAdjustedAmount.toString()),
    averageMonthlyContribution: parseFloat(averageMonthlyContribution.toString()),
    periodBreakdowns
  };
}

export {
  adjustAndCapSalary,
  calculatePeriodAdjustedAmount,
  calculateTotalAdjustedAmountWithLimits
};
