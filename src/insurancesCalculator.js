const Big = require('big.js');
const findPolicyAndRegion = require('./findPolicyAndRegion');
const BIG_20 = new Big(20);

/**
 *
 * @param {Number} gross
 * @param {1|2|3|4} region
 * @param {Date} date
 * @returns {Promise<{total: number, insurances: { name: string, amount: number }[]}>}
 */

module.exports = function insurancesCalculator(gross, region = 1, date = new Date()) {
    return new Promise(function (resolve, reject) {

        const grossBig = new Big(gross);
        const infoRegion = findPolicyAndRegion(region, date);
        const minWage = infoRegion.minWage;
        const baseSalary = infoRegion.baseSalary;

        const maxGrossForSIorHI = new Big(baseSalary.times(BIG_20));

        const insuranceScheme = [
            {name: 'Social Insurance 8%', percentage: 0.08, maxGross: maxGrossForSIorHI},
            {name: 'Health Insurance 1.5%', percentage: 0.015, maxGross: maxGrossForSIorHI},
            {name: 'Unemployment Insurance 1%', percentage: 0.01, maxGross: new Big(minWage).times(BIG_20)}
        ]

        const insurances = insuranceScheme.map(function to(eachScheme) {
            return {
                name: eachScheme.name,
                amount: Big(Math.min(eachScheme.maxGross, grossBig)).times(eachScheme.percentage).toNumber()
            }
        })

        // Reduce
        const addIns = function (prevValue, currenntValue) {
            // currenntValue === inssurances[currentIndex]
            return prevValue.add(new Big(currenntValue.amount))
        };

        const total = insurances.reduce(addIns, new Big(0));
        // console.log(total.toNumber());
        resolve({total: total.toNumber(), insurances});
    })
}


