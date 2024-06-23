const Big = require('big.js');
const {TAX_RATES, DEDUCTION_PER_PERSON, SELF_DEDUCTION} = require('../salaryConstants');
/**
 * Gross = Net + totalTax + totalInsurance
 * Unit: a million (Ex: 11 means 11 million)
 *
 * Taxable Income (ti) = net + totalTax - 11; Total tax is the sum of the tax amounts at each level (tax rate * deduction).
 * ti = net + sum tax amounts (tax rate * deduction) - 11
 *
 * Each tax level has different rate and its max deduction. Therefore, we have below un-equations
 *
 * lv1 ti ∈ (0, 5]:
 * ==> 0 < net + 5% * min(ti, 5) - 11 <= 5
 * ==> 11 - 5% * min(0, 5) < net <= 5 + 11 - 5% * min(5, 5)
 * ==> 11 < net <= 15.75
 *
 * lv2: ti <= net + 5% * 5 + 10% *min(ti - 5, 5) - 11
 * lv3: ti = net + 5% * 5 + 10% * 5 + 15% *min(ti - 10, 8) - 11
 * lv4: ti <= net + 5% * 5 + 10% * 5 + 15%*8 + 20% *min(ti-18, 14)- 11
 * lv5: ti <= net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*min(ti-32, 20) - 11
 * lv6: ti <= net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*20 +30%*min(ti-52, 28) - 11
 * lv7: ti >= net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*20 +30%*28 + 35%*min(ti-80) - 11
 *
 *
 * @type {[{taxableIncomeFactor: number, inclusiveNetMax: number, totalDeductionTimeRatePrev: number}]}
 */

const TAX_FACTOR_RANGES = [
    // lv1 ti ∈ (0, 5], rate 5%:
    // ==> 0 < net + 5% * min(ti, 5) - 11 <= 5
    // ==> 11 - 5% * min(0, 5) < net <= 5 + 11 - 5% * min(5, 5)
    // ==> 11 < net <= 15.75

    //==>  ti = (net - 11)/0.95 when net ∈ (11, 15.75]
    {totalDeductionTimeRatePrev: 11_000_000, inclusiveNetMax: 15_750_000, taxableIncomeFactor: 0.95},

    // lv2 ti ∈ (5, 10], rate 10%:
    // ==> 5 < net + 5% * 5 + 10% *min(ti - 5, 5) - 11 <= 10
    // ==> 5 + 11 - 5% * 5 - 10% *min(5 - 5, 5) < net <= 10 + 11 - 5 *5% - 10% *min(10 - 5, 5)
    // ==> 15.75 < net <= 20.25

    // ti = net + 5% * 5 + 10% *min(ti - 5, 5) - 11
    // 0.9ti = net + 5% * 5 - 10% * 5 - 11
    // ti = (net - 11.25)/0.9 when net ∈ (15.75, 20.25]
    {totalDeductionTimeRatePrev: 11_250_000, inclusiveNetMax: 20_250_000, taxableIncomeFactor: 0.9},

    /**
     * Following above inequation, we can conclude for the rest of tax rates.
     */

    // lv3 ti ∈ (10, 18], rate 15%:
    // ti = (net - 11.25)/0.9 when net ∈ (20.25, 27.05]
    // ti <= net + 5% * 5 + 10% * 5 + 15%*min(ti - 10, 8) - 11
    // ti <= (net - 11.75)/0.85
    // ti <= 18 ==> net <= 27.05
    {totalDeductionTimeRatePrev: 11_750_000, inclusiveNetMax: 27_050_000, taxableIncomeFactor: 0.85},

    // ti <= net + 5% * 5 + 10% * 5 + 15%*8 + 20%*min(ti-18, 14)- 11
    // ti <= (net -12.65)/0.8
    // ti <= 32 ==> net <= 38.25
    {totalDeductionTimeRatePrev: 12_650_000, inclusiveNetMax: 38_250_000, taxableIncomeFactor: 0.8},

    // ti <= net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*min(ti-32, 20) - 11
    // ti <= (net -14.25)/0.75 Only if ti <= 52
    // ti <= 52 ==> net <= 53.25
    {totalDeductionTimeRatePrev: 14_250_000, inclusiveNetMax: 53_250_000, taxableIncomeFactor: 0.75},

    // ti <= net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*20 +30%*min(ti-52, 28) - 11
    // ti <= (net -16.85)/0.7
    // ti <= 80 ==> net <= 72.85
    {totalDeductionTimeRatePrev: 16_850_000, inclusiveNetMax: 72_850_000, taxableIncomeFactor: 0.7},

    // ti >= net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*20 +30%*28 + 35%*min(ti-80) - 11
    // ti >= (net -20.85)/0.65
    // ti >= 80 ==> net >= 72.85
    {totalDeductionTimeRatePrev: 20_850_000, inclusiveNetMax: Number.MAX_SAFE_INTEGER, taxableIncomeFactor: 0.65}
]

/**
 * @param {number} netIncome
 * @param {number} dependentCount
 * @returns {Promise: number}
 */

module.exports = function calcTaxableIncome(netIncome, dependentCount = 0) {
    return new Promise(function (resolve, reject) {
        // lv1 ti ∈ (0, 5], rate 5%:
        // ==> 0 < net + 5% * min(ti, 5) - 11 <= 5
        // ==> 11 - 5% * min(0, 5) < net <= 5 + 11 - 5% * min(5, 5)
        // ==> 11 < net <= 15.75

        // ti = (net - 11)/0.95 when net ∈ (11, 15.75]

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
        ti = (netBig.minus(taxFactorRange.totalDeductionTimeRatePrev)
            .minus(dependents))
            .div(taxableIncomeFactor)

        resolve(Math.max(ti.toNumber(), 0));
    })
}