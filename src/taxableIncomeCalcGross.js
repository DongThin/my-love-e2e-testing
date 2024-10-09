const Big = require('big.js');

const TAX_RATES = [
    { name: 'Tax level 1', rate: 0.05, deduction: 5000000 },
    { name: 'Tax level 2', rate: 0.1, deduction: 5000000 },
    { name: 'Tax level 3', rate: 0.15, deduction: 8000000 },
    { name: 'Tax level 4', rate: 0.2, deduction: 14000000 },
    { name: 'Tax level 5', rate: 0.25, deduction: 20000000 },
    { name: 'Tax level 6', rate: 0.3, deduction: 28000000 },
    { name: 'Tax level 7', rate: 0.35, deduction: 80000000 },
]

module.exports = function calculateTaxableIncome(netIncome, dependentCount = 0, ) {
    return new Promise(function (resolve, reject) {
        const dependents = dependentCount * 4_400_000;
        let netBig = new Big(netIncome);

        let ti = new Big(0)
        let per;
        let totalDeductionTimesRatePrev = new Big(0);
        let totalDeductionPrev = new Big(0);

        if (netBig.lte(11_000_000)) {
            resolve(new Big(0).toNumber());
            return;
        } else if (netBig.lte(15_750_000)) {
            per = 0.95;
        } else if (netBig.lte(20_250_000)) {
            per = 0.9;
        } else if (netBig.lte(27_050_000)) {
            per = 0.85;
        } else if (netBig.lte(38_250_000)) {
            per = 0.8;
        } else if (netBig.lte(53_250_000)) {
            per = 0.75;
        } else if (netBig.lte(72_850_000)) {
            per = 0.7;
        } else {
            per = 0.65;
        }
        let taxRateMatch;


        for (let i = 0; i < TAX_RATES.length; i++) {
            const taxRate = TAX_RATES[i];

            if ((1 - taxRate.rate) >= per) {
                totalDeductionTimesRatePrev = totalDeductionTimesRatePrev.add(Big(taxRate.deduction).times(taxRate.rate));
                totalDeductionPrev = totalDeductionPrev.add(taxRate.deduction)
            }

            if (1 - taxRate.rate < per && i > 0) {
                taxRateMatch = TAX_RATES[i - 1];
                break;
            }
            if (!taxRateMatch) {
                taxRateMatch = TAX_RATES[TAX_RATES.length - 1];
            }
        }

        ti = (netBig
            .minus(11_000_000)
            .add(totalDeductionTimesRatePrev)
            .minus(totalDeductionPrev.times(taxRateMatch.rate)))
            .minus(dependents)
            .div(per)

        if (ti < 0) {
            return ti = 0;
        }

        resolve(ti.toNumber());
    })
}

