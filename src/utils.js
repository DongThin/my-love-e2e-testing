/**
 * Formats numbers as Vietnamese currency (VND)
 * with no decimal places
 */
export const numberFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});
