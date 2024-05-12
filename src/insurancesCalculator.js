const Big = require('big.js');

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

module.exports = function calculateInssurance(gross, region = 1, date = new Date()) {
    const grossBig = new Big(gross);

    const policyUpdate = POLICY_UPDATES.find(function (update) {
        return update.startDate.getTime() <= date.getTime()
    })

    if (!policyUpdate) {
        throw new Error("Not found data for the provided start date");
    }

    const regionMinWage = policyUpdate.regionMinWages.find(function (eachRegionMinWage) {
        return eachRegionMinWage.region === region;

    })

    if (!regionMinWage) {
        throw new Error("Invalid region entered. Please enter again! (1, 2, 3, 4)");
    }

    const maxGrossForSIorHI = new Big(policyUpdate.baseSalary.times(new Big(20)));

    const maxGrossForUI = new Big(regionMinWage.minWage).times(new Big(20));

    const socialInsurance = Big(Math.min(grossBig, maxGrossForSIorHI) * 0.08).toNumber();

    const healthInsurance = Big(Math.min(grossBig, maxGrossForSIorHI) * 0.015).toNumber();

    const unemploymentInsurance = Big(Math.min(grossBig, maxGrossForUI) * 0.01).toNumber();

    const insurances = [
        socialInsurance,
        healthInsurance,
        unemploymentInsurance
    ]

    // Reduce
    const addIns = function (prevValue, currenntValue, currentIndex, arr) {
        // currenntValue === inssurances[currentIndex]
        return prevValue.add(new Big(currenntValue))
    }

    const totalInsurance = insurances.reduce(addIns, new Big(0))

    return { socialInsurance, healthInsurance, unemploymentInsurance, totalInsurance: totalInsurance.toNumber() }
}
