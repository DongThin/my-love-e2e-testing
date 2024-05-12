const Big = require('big.js');

const REGIONS = [1, 2, 3, 4];
const BIG_20 = new Big(20);
/**
 * If there are new policy changes, please add that on top!
 */
const POLICY_UPDATES = [
    {
        startDate: new Date("2023-07-01"),
        regionMinWages:
            [
                { region: 1, minWage: 4_680_000 },
                { region: 2, minWage: 4_160_000 },
                { region: 3, minWage: 3_640_000 },
                { region: 4, minWage: 3_250_000 }
            ],
        baseSalary: new Big(1_800_000)
    },
    {
        startDate: new Date("2022-07-01"),
        regionMinWages:
            [
                { region: 1, minWage: 4_420_000 },
                { region: 2, minWage: 3_920_000 },
                { region: 3, minWage: 3_430_000 },
                { region: 4, minWage: 3_070_000 }
            ],
        baseSalary: new Big(1_490_000)
    },
];

/**
 * 
 * @param {Number} gross 
 * @param {1|2|3|4} region 
 * @param {Date} date 
 * @returns { {
 * total: number,
 * details: [{name: string, amount: number}]
* }}
 */
module.exports = function insurancesCalculator(gross, region = 1, date = new Date()) {
    const grossBig = new Big(gross);

    if (!REGIONS.includes(region)) {
        throw new Error("Invalid region entered. Please enter again! (1, 2, 3, 4)");
    }

    const policyUpdate = POLICY_UPDATES.find(function (update) {
        return update.startDate.getTime() <= date.getTime()
    })

    if (!policyUpdate) {
        throw new Error("There is no salary policy available for the date provided");
    }

    const regionMinWage = policyUpdate.regionMinWages.find(function (eachRegionMinWage) {
        return eachRegionMinWage.region === region;
    })

    const maxGrossForSIorHI = new Big(policyUpdate.baseSalary.times(BIG_20));

    const insuranceScheme = [
        { name: 'Social Insurance 8%', percentage: 0.08, maxGross: maxGrossForSIorHI },
        { name: 'Health Insurance 1.5%', percentage: 0.015, maxGross: maxGrossForSIorHI },
        { name: 'Unemployment Insurance 1%', percentage: 0.01, maxGross: new Big(regionMinWage.minWage).times(BIG_20) }
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
    }

    const total = insurances.reduce(addIns, new Big(0))
    return { total: total.toNumber(), insurances }
}
