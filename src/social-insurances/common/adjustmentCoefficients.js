// Historical adjustment coefficients by year
const ADJUSTMENT_COEFFICIENTS = {
  2014: 1.40,
  2015: 1.35,
  2016: 1.30,
  2017: 1.25,
  2018: 1.20,
  2019: 1.15,
  2020: 1.10,
  2021: 1.07,
  2022: 1.03,
  2023: 1.00,
  2024: 1.00,
  2025: 1.00
};

/**
 * Get adjustment coefficient for a specific year
 * @param {number} year - The year to get coefficient for
 * @returns {number} The adjustment coefficient
 */
function getAdjustmentCoefficient(year) {
  if (typeof year !== 'number' || year < 2014) {
    throw new Error('Year must be a number >= 2014');
  }

  const coefficient = ADJUSTMENT_COEFFICIENTS[year];
  if (coefficient === undefined) {
    // For future years not in the table, use the most recent coefficient
    const latestYear = Math.max(...Object.keys(ADJUSTMENT_COEFFICIENTS).map(Number));
    return ADJUSTMENT_COEFFICIENTS[latestYear];
  }

  return coefficient;
}

/**
 * Get all adjustment coefficients
 * @returns {Object} Object containing all year-coefficient pairs
 */
function getAllCoefficients() {
  return { ...ADJUSTMENT_COEFFICIENTS }; // Return a copy to prevent mutation
}

export {
  ADJUSTMENT_COEFFICIENTS,
  getAdjustmentCoefficient,
  getAllCoefficients
};
