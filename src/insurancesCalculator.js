const Big = require('big.js');
const findInsurancePolicy = require('./findInsurancePolicy');
const {BIG_20} = require("./salaryConstants");

/**
 *
 * @param {Number} gross
 * @param {1|2|3|4} region
 * @param {Date} date
 * @returns {Promise<{total: number, insurances: { name: string, amount: number }[]}>}
 */

module.exports = function calcInsuranceDetails(gross, region = 1, date = new Date()) {
    return new Promise(function (resolve, reject) {

        const grossBig = new Big(gross);
        const policy = findInsurancePolicy(region, date);

        const maxGrossForSIorHI = policy.baseSalary.times(BIG_20);

        const insuranceScheme = [
            {name: 'Social Insurance 8%', percentage: 0.08, maxGross: maxGrossForSIorHI},
            {name: 'Health Insurance 1.5%', percentage: 0.015, maxGross: maxGrossForSIorHI},
            {name: 'Unemployment Insurance 1%', percentage: 0.01, maxGross: new Big(policy.minWage).times(BIG_20)}
        ]

        const insurances = insuranceScheme.map(function to(eachScheme) {
            return {
                name: eachScheme.name,
                amount: Big(Math.min(eachScheme.maxGross, grossBig.toNumber())).times(eachScheme.percentage).toNumber()
            }
        })

        // Reduce
        const addIns = function (prevValue, currentValue) {
            // currentValue === insurances[currentIndex]
            return prevValue.add(new Big(currentValue.amount))
        };

        const total = insurances.reduce(addIns, new Big(0));
        resolve({total: total.toNumber(), insurances});
    })
}


