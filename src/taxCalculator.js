const Big = require('big.js');

const TAX_RATES = [
    { name: 'Tax level 1', rate: 0.05, deduction: 5000000 },
    { name: 'Tax level 2', rate: 0.1, deduction: 5000000 },
    { name: 'Tax level 3', rate: 0.15, deduction: 8000000 },
    { name: 'Tax level 4', rate: 0.2, deduction: 14000000 },
    { name: 'Tax level 5', rate: 0.25, deduction: 20000000 },
    { name: 'Tax level 6', rate: 0.3, deduction: 28000000 },
    { name: 'Tax level 7', rate: 0.35, deduction: Number.MAX_SAFE_INTEGER },
]

/**
 * 
 * @param {number} taxableIncome 
 * @returns 
 */
module.exports = function calculateTaxes(taxableIncome) {
    //Do not change type param default. If want to change, convert that variable to the other variable
    let taxableIncomeRemain = new Big(taxableIncome);

    const tax = { totalTax: new Big(0), rates: [] };

    if (taxableIncomeRemain.lte(0)) {
        tax.totalTax = tax.totalTax.toNumber();
        return tax;
    }

    for (const taxRate of TAX_RATES) {
        const taxPaidForEachRate = Big(Math.min(taxableIncomeRemain, taxRate.deduction)).times(taxRate.rate);

        tax.totalTax = tax.totalTax.plus(taxPaidForEachRate);

        tax.rates.push({
            name: taxRate.name,
            rate: taxRate.rate,
            amount: taxPaidForEachRate.toNumber()
        });

        taxableIncomeRemain = taxableIncomeRemain.minus(Big(taxRate.deduction));

        if (taxableIncomeRemain.lte(0)) {
            break;
        }
    }

    tax.totalTax = tax.totalTax.toNumber();
    return tax;
}