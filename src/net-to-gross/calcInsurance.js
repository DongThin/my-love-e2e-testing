const Big = require('big.js');
const BIG_20 = new Big(20);
const findRegionAndPolicy = require('../findPolicyAndRegion');

module.exports = function calcInsurance(net, totalTax, region = 1, date = new Date()) {
    return new Promise(function (resolve, reject) {
        const netBig = new Big(net);
        const totalNetAndTotalTax = netBig.add(totalTax);

        const info = findRegionAndPolicy(region, date)
        const minWage = info.minWage;
        const baseSalary = info.baseSalary;

        // Mức lương tối đa để tinh BHTN
        const maxUI = Big(minWage).times(BIG_20);
        const gte20TimeRegion = Big(0.99).times(maxUI).minus(3_420_000);
        const maxGrossForSIorHI = new Big(baseSalary.times(BIG_20));

        // employee has to pay
        const MAX_TOTAL_PAID_SI_AND_HI = Big(0.08)
            .times(maxGrossForSIorHI)
            .add(Big(0.015).times(maxGrossForSIorHI));
        const MAX_PAID_UI = Big(0.01).times(minWage).times(BIG_20);

        const infoInsurance = {};

        // net + totalTax >= 99% * 20 * regionMinwage - 3420
        if (totalNetAndTotalTax.gte(gte20TimeRegion)) {
            infoInsurance.totalInsurance = MAX_TOTAL_PAID_SI_AND_HI.add(MAX_PAID_UI).toNumber()
            infoInsurance.grossFromIns = totalNetAndTotalTax.add(infoInsurance.totalInsurance).toNumber()

            // gross >= 36 ==> net +totalTax + 3.42 + 1% gross >=36
            // net + totalTax >= 99% * 36 - 3420
            // net + totalTax >= 32_220_000
        } else if (totalNetAndTotalTax.gte(maxGrossForSIorHI)) {
            infoInsurance.grossFromIns = totalNetAndTotalTax.add(MAX_TOTAL_PAID_SI_AND_HI).div(0.99).toNumber()
            infoInsurance.totalInsurance = MAX_TOTAL_PAID_SI_AND_HI.add(Big(0.01).times(infoInsurance.grossFromIns)).toNumber()

            // net + totalTax < 32_220_000
        } else {
            infoInsurance.grossFromIns = totalNetAndTotalTax.div(0.895).toNumber()
            infoInsurance.totalInsurance = Big(0.105).times(infoInsurance.grossFromIns).toNumber()
        }

        resolve(infoInsurance)
    })
}