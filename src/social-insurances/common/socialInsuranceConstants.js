// Benefit calculation multiplier (2 months per year of contribution)
const BENEFIT_MULTIPLIER = 2;

// Partial year calculation thresholds
const PARTIAL_YEAR_THRESHOLDS = {
  MIN_MONTHS: 1,
  ROUND_DOWN_MAX: 6,  // 1-6 months = 0.5 years
  ROUND_UP_MIN: 7,    // 7-11 months = 1 year
  MAX_MONTHS: 11
};

// Partial year values
const PARTIAL_YEAR_VALUES = {
  HALF_YEAR: 0.5,
  FULL_YEAR: 1.0
};

// Social insurance contribution start date for new rules
const NEW_RULES_START_DATE = '2014-01';

export {
  BENEFIT_MULTIPLIER,
  PARTIAL_YEAR_THRESHOLDS,
  PARTIAL_YEAR_VALUES,
  NEW_RULES_START_DATE
};
