/**
 * Social Insurance Upper Bounds
 * 
 * Upper bounds for social insurance contributions based on base salary.
 * The upper bound is 20 times the base salary for each period.
 */


// Convert YYYY-MM to Date object for policy lookup
function monthToDate(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  return new Date(year, month - 1, 1); // Month is 0-based in Date
}

// Social Insurance Upper Bound Limits based on base salary
const SOCIAL_INSURANCE_UPPER_BOUNDS = [
  // January 2014 to April 2016 - Base salary: 1,150,000
  { startMonth: '2014-01', amount: 1_150_000 * 20 }, // = 23,000,000

  // May 2016 to June 2017 - Base salary: 1,210,000
  { startMonth: '2016-05', amount: 1_210_000 * 20 }, // = 24,200,000

  // July 2017 to June 2018 - Base salary: 1,300,000
  { startMonth: '2017-07', amount: 1_300_000 * 20 }, // = 26,000,000

  // July 2018 to June 2019 - Base salary: 1,390,000
  { startMonth: '2018-07', amount: 1_390_000 * 20 }, // = 27,800,000

  // July 2019 to June 2023 - Base salary: 1,490,000
  { startMonth: '2019-07', amount: 1_490_000 * 20 }, // = 29,800,000

  // July 2023 to June 2024 - Base salary: 1,800,000
  { startMonth: '2023-07', amount: 1_800_000 * 20 }, // = 36,000,000

  // July 2024 onwards - Base salary: 2,340,000
  { startMonth: '2024-07', amount: 2_340_000 * 20 }  // = 46,800,000
].sort((a, b) =>
  a.startMonth.localeCompare(b.startMonth)
);

/**
 * Get the applicable social insurance upper bound for a specific month
 * @param {string} targetMonth - Month in YYYY-MM format
 * @returns {number} The upper bound amount for that month
 */
function getSocialInsuranceUpperBound(targetMonth) {
  if (!targetMonth || typeof targetMonth !== 'string') {
    throw new Error('Target month must be a string in YYYY-MM format');
  }

  // Find the most recent applicable upper bound
  let applicableUpperBound = null;

  for (const bound of SOCIAL_INSURANCE_UPPER_BOUNDS) {
    if (bound.startMonth <= targetMonth) {
      applicableUpperBound = bound;
    }
  }

  if (!applicableUpperBound) {
    throw new Error(`No social insurance upper bound found for month: ${targetMonth}`);
  }

  return applicableUpperBound.amount;
}

/**
 * Apply social insurance upper bound to a contribution amount
 * @param {number} salary - Original salary amount
 * @param {string} month - Month in YYYY-MM format
 * @returns {number} Salary capped at the upper bound for that month
 */
function applySocialInsuranceUpperBound(salary, month) {
  if (typeof salary !== 'number' || salary < 0) {
    throw new Error('Salary must be a non-negative number');
  }

  const upperBound = getSocialInsuranceUpperBound(month);
  return Math.min(salary, upperBound);
}

/**
 * Get all social insurance upper bounds (for reference/testing)
 * @returns {Array} Array of all upper bound records
 */
function getAllSocialInsuranceUpperBounds() {
  return [...SOCIAL_INSURANCE_UPPER_BOUNDS]; // Return a copy to prevent mutation
}

export {
  applySocialInsuranceUpperBound,
  getAllSocialInsuranceUpperBounds, getSocialInsuranceUpperBound, SOCIAL_INSURANCE_UPPER_BOUNDS
};

