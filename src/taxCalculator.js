const Big = require('big.js');

const TAX_RATES = [
    { name: 'Tax level 1', rate: 0.05, deduction: 5000000 },
    { name: 'Tax level 2', rate: 0.1, deduction: 5000000 },
    { name: 'Tax level 3', rate: 0.15, deduction: 8000000 },
    { name: 'Tax level 4', rate: 0.2, deduction: 14000000 },
    { name: 'Tax level 5', rate: 0.25, deduction: 20000000 },
    { name: 'Tax level 6', rate: 0.3, deduction: 28000000 },
    { name: 'Tax level 7', rate: 0.35, deduction: 9007_199_254_740_991 },
]
/**
 * 
 * @param {number} taxableIncome 
 * @returns 
 */
module.exports = function calculateTaxes(taxableIncome) {
    //Do not change type param default. If want to change, convert that variable to the other variable
    let taxableIncomeBig = new Big(taxableIncome);

    const tax = { totalTax: new Big(0), rates: [] };

    if (taxableIncomeBig.lte(0)) {
        tax.totalTax = tax.totalTax.toNumber();
        return tax;
    }

    for (let taxRate of TAX_RATES) {

        let taxableIncomeRate = taxableIncomeBig.minus(taxRate.deduction).gt(Big(0)) ? Big(taxRate.deduction) : taxableIncomeBig;

        if (taxRate.name === 'Tax level 7') {
            taxableIncomeRate = taxableIncomeBig;
        }

        const taxAmount = taxableIncomeRate.times(taxRate.rate);
        tax.totalTax = tax.totalTax.plus(taxAmount);

        if (taxAmount.gt(0)) {
            tax.rates.push({
                name: taxRate.name,
                rate: taxRate.rate,
                amount: taxAmount.toNumber()
            });
        }

        taxableIncomeBig = taxableIncomeBig.minus(taxableIncomeRate);

        if (taxableIncomeBig.lte(0)) {
            break;
        }
    }
    tax.totalTax = tax.totalTax.toNumber();
    return tax;
}