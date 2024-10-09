const Big = require('big.js');
const insurancesCalculator = require('./insurancesCalculator');

const REGIONS = [1, 2, 3, 4];
const BIG_20 = new Big(20);
/**
 * If there are new policy changes, please add that on top!
 */
const POLICY_UPDATES = [{
    startDate: new Date("2023-07-01"),
    regionMinWages: [
        { region: 1, minWage: 4_680_000 },
        { region: 2, minWage: 4_160_000 },
        { region: 3, minWage: 3_640_000 },
        { region: 4, minWage: 3_250_000 }
    ],
    baseSalary: new Big(1_800_000)
}, {
    startDate: new Date("2022-07-01"),
    regionMinWages: [
        { region: 1, minWage: 4_420_000 },
        { region: 2, minWage: 3_920_000 },
        {
            region: 3, minWage: 3_430_000
        }, { region: 4, minWage: 3_070_000 }],
    baseSalary: new Big(1_490_000)
},];

module.exports = function insurancesCalcGross(net, totalTax, region = 1, date = new Date()) {
    return new Promise(function (resolve, reject) {
        const netBig = new Big(net);
        const totalNetAndTotalTax = netBig.add(totalTax);

        if (!REGIONS.includes(region)) {
            reject(new Error("Invalid region entered. Please enter again! (1, 2, 3, 4)"))
            return;
        }

        const policyUpdate = POLICY_UPDATES.find(function (update) {
            return update.startDate.getTime() <= date.getTime()
        })

        if (!policyUpdate) {
            reject(new Error("There is no salary policy available for the date provided"));
            return;
        }

        const regionMinWage = policyUpdate.regionMinWages.find(function (eachRegionMinWage) {
            return eachRegionMinWage.region === region;
        })

        // Mức lương tối đa để tinh BHTN
        const maxUI = Big(regionMinWage.minWage).times(BIG_20)
        const gte20TimeRegion = Big(0.99).times(maxUI).minus(3_420_000);
        const maxGrossForSIorHI = new Big(policyUpdate.baseSalary.times(BIG_20));

        // employee has to pay
        const MAX_TOTAL_PAID_SI_AND_HI = Big(0.08).times(maxGrossForSIorHI).add(Big(0.015).times(maxGrossForSIorHI));
        const MAX_PAID_UI = Big(0.01).times(regionMinWage.minWage).times(BIG_20);

        const insurancesArray = {};

        // net + totalTax >= 99% * 20 * regionMinwage - 3420
        if (totalNetAndTotalTax.gte(gte20TimeRegion)) {
            insurancesArray.totalInsurance = MAX_TOTAL_PAID_SI_AND_HI.add(MAX_PAID_UI).toNumber()
            insurancesArray.grossFromIns = totalNetAndTotalTax.add(insurancesArray.totalInsurance).toNumber()

            // gross >= 36 ==> net +totalTax + 3.42 + 1% gross >=36
            // net + totalTax >= 99% * 36 - 3420
            // net + totalTax >= 32_220_000
        } else if (totalNetAndTotalTax.gte(maxGrossForSIorHI)) {
            insurancesArray.grossFromIns = totalNetAndTotalTax.add(MAX_TOTAL_PAID_SI_AND_HI).div(0.99).toNumber()
            insurancesArray.totalInsurance = MAX_TOTAL_PAID_SI_AND_HI.add(Big(0.01).times(insurancesArray.grossFromIns)).toNumber()

            // net + totalTax < 32_220_000
        } else {
            insurancesArray.grossFromIns = totalNetAndTotalTax.div(0.895).toNumber()
            insurancesArray.totalInsurance = Big(0.105).times(insurancesArray.grossFromIns).toNumber()
        }

        resolve(insurancesArray)
    })
}