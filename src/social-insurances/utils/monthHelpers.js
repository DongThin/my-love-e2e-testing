/**
 * Month Helpers for Social Insurance Calculator
 * 
 * Utility functions for handling YYYY-MM date format operations.
 */

/**
 * Parse and validate a month string in YYYY-MM format
 * @param {string} monthString - Month in YYYY-MM format
 * @returns {Object} Parsed month object with year and month properties
 */
function parseMonth(monthString) {
  if (!monthString || typeof monthString !== 'string') {
    throw new Error('Month string is required and must be a string');
  }

  const monthRegex = /^(\d{4})-(\d{2})$/;
  const match = monthString.match(monthRegex);

  if (!match) {
    throw new Error('Month must be in YYYY-MM format');
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);

  if (month < 1 || month > 12) {
    throw new Error('Month must be between 01 and 12');
  }

  if (year < 1900 || year > 2100) {
    throw new Error('Year must be between 1900 and 2100');
  }

  return { year, month, original: monthString };
}

/**
 * Calculate the number of months between two YYYY-MM dates (inclusive)
 * @param {string} startMonth - Start month in YYYY-MM format
 * @param {string} endMonth - End month in YYYY-MM format
 * @returns {number} Number of months between the dates (inclusive)
 */
function calculateMonthsBetween(startMonth, endMonth) {
  const start = parseMonth(startMonth);
  const end = parseMonth(endMonth);

  if (startMonth > endMonth) {
    throw new Error('Start month cannot be after end month');
  }

  const months = (end.year - start.year) * 12 + (end.month - start.month) + 1;
  return months;
}

/**
 * Validate a date range
 * @param {string} startMonth - Start month in YYYY-MM format
 * @param {string} endMonth - End month in YYYY-MM format
 * @returns {boolean} True if valid range
 */
function validateDateRange(startMonth, endMonth) {
  try {
    parseMonth(startMonth);
    parseMonth(endMonth);
    
    if (startMonth > endMonth) {
      throw new Error('Start month cannot be after end month');
    }
    
    return true;
  } catch (error) {
    throw new Error(`Invalid date range: ${error.message}`);
  }
}

/**
 * Get the year from a YYYY-MM month string
 * @param {string} monthString - Month in YYYY-MM format
 * @returns {number} The year
 */
function getYearFromMonth(monthString) {
  const parsed = parseMonth(monthString);
  return parsed.year;
}

/**
 * Generate a list of months between start and end (inclusive)
 * @param {string} startMonth - Start month in YYYY-MM format
 * @param {string} endMonth - End month in YYYY-MM format
 * @returns {Array<string>} Array of month strings in YYYY-MM format
 */
function generateMonthRange(startMonth, endMonth) {
  validateDateRange(startMonth, endMonth);
  
  const months = [];
  const start = parseMonth(startMonth);
  const end = parseMonth(endMonth);
  
  let currentYear = start.year;
  let currentMonth = start.month;
  
  while (currentYear < end.year || (currentYear === end.year && currentMonth <= end.month)) {
    const monthStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
    months.push(monthStr);
    
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }
  
  return months;
}

export {
  parseMonth,
  calculateMonthsBetween,
  validateDateRange,
  getYearFromMonth,
  generateMonthRange
};
