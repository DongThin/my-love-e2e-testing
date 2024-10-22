import Big from 'big.js';
// const {TAX_RATES, DEDUCTION_PER_PERSON, SELF_DEDUCTION} = require('../salaryConstants');
import {TAX_RATES, DEDUCTION_PER_PERSON, SELF_DEDUCTION} from '../common/salaryConstants';
/**
 * Gross = Net + totalTax + totalInsurance
 * Unit: a million (Ex: 11 means 11 million)
 *
 * Taxable Income (ti) = net + totalTax - 11; Total tax is the sum of the tax amounts at each level (tax rate * deduction).
 * ti = net + sum tax amounts (tax rate * deduction) - 11
 *
 * Each tax level has different rate and its max deduction. Therefore, we have below un-equations
 *

 * @type {[{netDeduction: number, inclusiveNetMax: number, taxableIncomeFactor: number, totalDeductionTimeRatePrev: number}]}
 */

const TAX_FACTOR_RANGES = [
    // lv1 ti ∈ (0, 5], rate 5%:
    // ==> 0 < net + 5% * min(ti, 5) - 11 <= 5
    // ==> 11 - 5% * min(0, 5) < net <= 5 + 11 - 5% * min(5, 5)
    // ==> 11 < net <= 15.75

    //==>  ti = (net - 11)/0.95 when net ∈ (11, 15.75]
    {netDeduction: 11_000_000, inclusiveNetMax: 15_750_000, taxableIncomeFactor: 1 - TAX_RATES[0].rate},

    // lv2 ti ∈ (5, 10], rate 10%:
    // ==> 5 < net + 5% * 5 + 10% *min(ti - 5, 5) - 11 <= 10
    // ==> 5 + 11 - 5% * 5 - 10% *min(5 - 5, 5) < net <= 10 + 11 - 5 *5% - 10% *min(10 - 5, 5)
    // ==> 15.75 < net <= 20.25

    // ti = (net - 11.25)/0.9 when net ∈ (15.75, 20.25]
    {netDeduction: 11_250_000, inclusiveNetMax: 20_250_000, taxableIncomeFactor: 1 - TAX_RATES[1].rate},

    /**
     * Following above inequation, we can conclude for the rest of tax rates.
     */

    // lv3 ti ∈ (10, 18], rate 15%
    // ti = net + 5% * 5 + 10% * 5 + 15%*min(ti - 10, 8) - 11
    // ti = (net - 11.75)/0.85 when net ∈ (20.25, 27.05]
    {netDeduction: 11_750_000, inclusiveNetMax: 27_050_000, taxableIncomeFactor: 1 - TAX_RATES[2].rate},

    // lv4 ti ∈ (18, 32], rate 20%
    // ti = net + 5% * 5 + 10% * 5 + 15%*8 + 20%*min(ti-18, 14)- 11
    // ti = (net -12.65)/0.8 when net ∈ (27.05, 38.25]
    {netDeduction: 12_650_000, inclusiveNetMax: 38_250_000, taxableIncomeFactor: 1 - TAX_RATES[3].rate},

    // lv5 ti ∈ (32, 52], rate 25%
    // ti = net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*min(ti-32, 20) - 11
    // ti = (net -14.25)/0.75 when net ∈ (38.25, 53.25]
    {netDeduction: 14_250_000, inclusiveNetMax: 53_250_000, taxableIncomeFactor: 1 - TAX_RATES[4].rate},

    // lv6 ti ∈ (52, 80], rate 30%
    // ti = net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*20 +30%*min(ti-52, 28) - 11
    // ti = (net -16.85)/0.7 when net ∈ (53.25, 72.85]
    {netDeduction: 16_850_000, inclusiveNetMax: 72_850_000, taxableIncomeFactor: 1 - TAX_RATES[5].rate},

    // lv7 ti ∈ (80, ∞], rate 35%
    // ti = net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*20 +30%*28 + 35%*min(ti-80) - 11
    // ti = (net -20.85)/0.65 when net ∈ (72.85,∞ ]
    {netDeduction: 20_850_000, inclusiveNetMax: Number.MAX_SAFE_INTEGER, taxableIncomeFactor: 1 - TAX_RATES[6].rate}
]

/**
 * @param {number} netIncome
 * @param {number} dependentCount
 * @returns {Promise: number}
 */

export default function calcTaxableIncome(netIncome, dependentCount = 0) {
    return new Promise(function (resolve, reject) {
        let netBig = new Big(netIncome);
        let ti = new Big(0)

        if (netBig.lte(SELF_DEDUCTION)) {
            resolve(ti.toNumber());
            return
        }

        const taxFactorRange = TAX_FACTOR_RANGES.find(function (result) {
            return netBig.lte(result.inclusiveNetMax);
        });

        const taxableIncomeFactor = taxFactorRange.taxableIncomeFactor
        const dependents = dependentCount * DEDUCTION_PER_PERSON;

        ti = (netBig.minus(taxFactorRange.netDeduction)
            .minus(dependents))
            .div(taxableIncomeFactor)

        resolve(Math.max(ti.toNumber(), 0));
    })
}
