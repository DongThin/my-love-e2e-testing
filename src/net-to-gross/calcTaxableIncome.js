const Big = require('big.js');
const TAX_RATES = require('../taxRate');

const oneMinusInsRate = [0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65]

module.exports = function calculateTaxableIncome(netIncome, dependentCount = 0,) {
    return new Promise(function (resolve, reject) {
        const dependents = dependentCount * 4_400_000;

        let netBig = new Big(netIncome);
        let ti = new Big(0)
        let totalDeductionTimesRatePrev = new Big(0);
        let totalDeductionPrev = new Big(0);
        let percentAfterInsRateDeducted = 0;

        if (netBig.lte(11_000_000)) {
            resolve(new Big(0).toNumber());
            return;
        } else if (netBig.lte(15_750_000)) {
            percentAfterInsRateDeducted = oneMinusInsRate[0];
        } else if (netBig.lte(20_250_000)) {
            percentAfterInsRateDeducted = oneMinusInsRate[1]
        } else if (netBig.lte(27_050_000)) {
            percentAfterInsRateDeducted = oneMinusInsRate[2]
        } else if (netBig.lte(38_250_000)) {
            percentAfterInsRateDeducted = oneMinusInsRate[3]
        } else if (netBig.lte(53_250_000)) {
            percentAfterInsRateDeducted = oneMinusInsRate[4]
        } else if (netBig.lte(72_850_000)) {
            percentAfterInsRateDeducted = oneMinusInsRate[5]
        } else {
            percentAfterInsRateDeducted = oneMinusInsRate[6]
        }

        let taxRateMatch;

        for (let i = 0; i < TAX_RATES.length; i++) {
            const taxRate = TAX_RATES[i];
            if ((1 - taxRate.rate) >= percentAfterInsRateDeducted) {
                totalDeductionTimesRatePrev = totalDeductionTimesRatePrev.add(Big(taxRate.deduction).times(taxRate.rate));
                totalDeductionPrev = totalDeductionPrev.add(taxRate.deduction)
            }

            if (1 - taxRate.rate < percentAfterInsRateDeducted && i > 0) {
                taxRateMatch = TAX_RATES[i - 1];
                break;
            }
        }
        if (!taxRateMatch) {
            taxRateMatch = TAX_RATES[TAX_RATES.length - 1];
        }

        ti = (netBig
            .minus(11_000_000)
            .add(totalDeductionTimesRatePrev)
            .minus(totalDeductionPrev.times(taxRateMatch.rate)))
            .minus(dependents)
            .div(percentAfterInsRateDeducted)
        ti = Math.max(ti, 0)

        resolve(ti);
    })
}

// ti = net + 5% *min(ti, 5) - 11
// ti = net + 5% * 5 + 10% *min(ti - 5, 5) - 11
// ti = net + 5% * 5 + 10% * 5 + 15%*min(ti - 10, 8) - 11
// ti = net + 5% * 5 + 10% * 5 + 15%*8 + 20%*min(ti-18, 14)- 11
// ti = net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*min(ti-32, 20) - 11
// ti = net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*20 +30%*min(ti-52, 28) - 11
// ti = net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*20 +30%*28 + 35%*min(ti-80) - 11

// ti = (net - 11)/ 0.95 Only if ti <= 5.  15.75
// ti = (net - 11.25)/0.9 Only if ti <= 10.  20.25
// ti = (net - 11.75)/0.85 Only if ti <= 18. 27.05
// ti = (net -12.65)/0.8 Only if ti <= 32.  38.25
// ti = (net -14.25)/0.75 Only if ti <= 52  53.25
// ti = (net -16.85)/0.7 if ti <= 80  72.85
// ti = (net -20.85)/0.65 if ti > 80 > 72.85
