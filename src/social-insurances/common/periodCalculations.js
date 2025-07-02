/**
 * Period Calculations for Social Insurance
 * 
 * Functions for calculating and rounding contribution periods
 * according to social insurance regulations.
 */

import { PARTIAL_YEAR_THRESHOLDS, PARTIAL_YEAR_VALUES } from './socialInsuranceConstants.js';

/**
 * Round partial year according to social insurance rules
 * @param {number} months - Number of partial months (1-11)
 * @returns {number} Rounded year value (0.5 or 1.0)
 */
function roundPartialYear(months) {
  if (typeof months !== 'number' || months < PARTIAL_YEAR_THRESHOLDS.MIN_MONTHS || months > PARTIAL_YEAR_THRESHOLDS.MAX_MONTHS) {
    throw new Error(`Partial months must be between ${PARTIAL_YEAR_THRESHOLDS.MIN_MONTHS} and ${PARTIAL_YEAR_THRESHOLDS.MAX_MONTHS}`);
  }

  if (months <= PARTIAL_YEAR_THRESHOLDS.ROUND_DOWN_MAX) {
    return PARTIAL_YEAR_VALUES.HALF_YEAR; // 1-6 months = 0.5 years
  } else {
    return PARTIAL_YEAR_VALUES.FULL_YEAR; // 7-11 months = 1 year
  }
}

/**
 * Calculate total years from total months, applying rounding rules
 * @param {number} totalMonths - Total number of contribution months
 * @returns {number} Total years with proper rounding applied
 */
function calculateYearsFromMonths(totalMonths) {
  if (typeof totalMonths !== 'number' || totalMonths < 0) {
    throw new Error('Total months must be a non-negative number');
  }

  const fullYears = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  if (remainingMonths === 0) {
    return fullYears;
  }

  return fullYears + roundPartialYear(remainingMonths);
}

/**
 * Parse contribution period from start and end months
 * @param {string} startMonth - Start month in YYYY-MM format
 * @param {string} endMonth - End month in YYYY-MM format
 * @returns {Object} Object containing period details
 */
function parseContributionPeriod(startMonth, endMonth) {
  if (!startMonth || !endMonth) {
    throw new Error('Start month and end month are required');
  }

  // Validate format
  const monthRegex = /^\d{4}-\d{2}$/;
  if (!monthRegex.test(startMonth) || !monthRegex.test(endMonth)) {
    throw new Error('Months must be in YYYY-MM format');
  }

  if (startMonth > endMonth) {
    throw new Error('Start month cannot be after end month');
  }

  // Calculate number of months
  const [startYear, startMth] = startMonth.split('-').map(Number);
  const [endYear, endMth] = endMonth.split('-').map(Number);

  const months = (endYear - startYear) * 12 + (endMth - startMth) + 1;

  return {
    startMonth,
    endMonth,
    months,
    years: calculateYearsFromMonths(months)
  };
}

export {
  roundPartialYear,
  calculateYearsFromMonths,
  parseContributionPeriod
};
