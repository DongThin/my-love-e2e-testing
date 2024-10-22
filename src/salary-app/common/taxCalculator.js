import Big from 'big.js';
import {TAX_RATES} from './salaryConstants';

/**
 * @param {number} taxableIncome
 * @returns {Promise<{
 *  totalTax: number,
 *  rates: [{
 *      name: string,
 *      rate: number,
 *      amount: number
 * }]
 * }>}
 */
export default function calculateTaxes(taxableIncome) {
    //Do not change type param default. If want to change, convert that variable to the other variable
    return new Promise(function (resolve, reject) {
        let taxableIncomeRemain = new Big(taxableIncome);
        const tax = {totalTax: new Big(0), rates: []};

        if (taxableIncomeRemain.lte(0)) {
            tax.totalTax = tax.totalTax.toNumber()

            resolve(tax)
            return;
        }

        for (const taxRate of TAX_RATES) {
            const taxPaidForEachRate = Big(Math.min(taxableIncomeRemain.toNumber(), taxRate.deduction)).times(taxRate.rate);
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
        resolve(tax);
    })
}
