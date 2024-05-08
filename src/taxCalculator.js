const Big = require('big.js');

const taxRates = [
    { rate: 0.05, deduction: 5000000 },
    { rate: 0.1, deduction: 5000000 },
    { rate: 0.15, deduction: 8000000 },
    { rate: 0.2, deduction: 14000000 },
    { rate: 0.25, deduction: 20000000 },
    { rate: 0.3, deduction: 28000000 },
    { rate: 0.35, deduction: 0 },
]
/**
 * 
 * @param {number} taxableIncome 
 * @returns 
 */
module.exports = function calculateTaxes(taxableIncome) {
    //Do not change type param default. If want to change, convert that variable to the other variable
    let taxableIncomeBig = new Big(taxableIncome);

    let totalTax = new Big(0);
    const tax = { totalTax: 0, rates: [] };

    if (taxableIncomeBig.lte(0))
        return tax;

    const calcPaidPerRate = function (taxRate, i) {

        let taxableIncomeRate = taxableIncomeBig.minus(taxRate.deduction).gt(Big(0)) ? Big(taxRate.deduction) : taxableIncomeBig;

        if (i === 6) {
            taxableIncomeRate = taxableIncomeBig;
        }

        const taxAmount = taxableIncomeRate.times(taxRate.rate);
        totalTax = totalTax.plus(taxAmount);

        if (taxAmount.gt(0)) {
            tax.rates.push({
                name: `Tax level ${i + 1}`,
                rate: taxRate.rate,
                amount: taxAmount.toNumber()
            });
        }

        taxableIncomeBig = taxableIncomeBig.minus(taxableIncomeRate);

        if (taxableIncomeBig.lte(0)) {
            return undefined;
        }
    }

    taxRates.forEach(calcPaidPerRate);
    tax.totalTax = totalTax.toNumber();
    return tax;
}