const Big = require('big.js');
const BIG_20 = new Big(20);
const findRegionAndPolicy = require('../findPolicyAndRegion');

module.exports = function calcInsurance(net, totalTax, region = 1, date = new Date()) {
    return new Promise(function (resolve, reject) {
        const netBig = new Big(net);
        const totalNetAndTotalTax = netBig.add(totalTax);

        const infoRegionAndPolicy = findRegionAndPolicy(region, date)

        // Mức lương tối đa để tinh BHTN
        const maxUI = Big(infoRegionAndPolicy.minWage).times(BIG_20);
        const gte20TimeRegion = Big(0.99).times(maxUI).minus(3_420_000);
        const MAX_GROSS_FOR_SI_OR_HI = new Big((infoRegionAndPolicy.baseSalary).times(BIG_20));

        // employee has to pay
        const MAX_TOTAL_PAID_SI_AND_HI = Big(0.08)
            .times(MAX_GROSS_FOR_SI_OR_HI)
            .add(Big(0.015).times(MAX_GROSS_FOR_SI_OR_HI));

        const MAX_PAID_UI = Big(0.01).times(infoRegionAndPolicy.minWage).times(BIG_20);
        const insurances = {};

        if (totalNetAndTotalTax.gte(gte20TimeRegion)) {
            // net + totalTax >= 99% * 20 * regionMinwage - 3420

            insurances.totalInsurance = MAX_TOTAL_PAID_SI_AND_HI.add(MAX_PAID_UI).toNumber()
            insurances.grossFromIns = totalNetAndTotalTax.add(insurances.totalInsurance).toNumber()

        } else if (totalNetAndTotalTax.gte(MAX_GROSS_FOR_SI_OR_HI)) {
            // gross >= 36 ==> net +totalTax + 3.42 + 1% gross >=36
            // net + totalTax >= 99% * 36 - 3420
            // net + totalTax >= 32_220_000

            insurances.grossFromIns = totalNetAndTotalTax.add(MAX_TOTAL_PAID_SI_AND_HI).div(0.99).toNumber()
            insurances.totalInsurance = MAX_TOTAL_PAID_SI_AND_HI.add(Big(0.01).times(insurances.grossFromIns)).toNumber()

        } else {
            // net + totalTax < 32_220_000

            insurances.grossFromIns = totalNetAndTotalTax.div(0.895).toNumber()
            insurances.totalInsurance = Big(0.105).times(insurances.grossFromIns).toNumber()
        }

        resolve(insurances)
    })
}