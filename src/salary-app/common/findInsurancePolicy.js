import Big from 'big.js';
const REGIONS = [1, 2, 3, 4];
/**
 * If there are new policy changes, please add that on top!
 */
const POLICY_UPDATES = [

    {
        startDate: new Date("2024-07-01"),
        regionMinWages: [
            {region: 1, minWage: 4_960_000},
            {region: 2, minWage: 4_410_000},
            {region: 3, minWage: 3_860_000},
            {region: 4, minWage: 3_450_000}
        ],
        baseSalary: new Big(2_340_000)
    },

    {
        startDate: new Date("2023-07-01"),
        regionMinWages: [
            {region: 1, minWage: 4_680_000},
            {region: 2, minWage: 4_160_000},
            {region: 3, minWage: 3_640_000},
            {region: 4, minWage: 3_250_000}
        ],
        baseSalary: new Big(1_800_000)
    },
    {
        startDate: new Date("2022-07-01"),
        regionMinWages: [
            {region: 1, minWage: 4_420_000},
            {region: 2, minWage: 3_920_000},
            {region: 3, minWage: 3_430_000},
            {region: 4, minWage: 3_070_000}
        ],
        baseSalary: new Big(1_490_000)
    }
]

/**
 * @param region {1|2|3|4}
 * @param effectiveDate {Date}
 * @returns {{
 *     baseSalary: Big,
 *     minWage: number
 * }}
 */
export default function findInsurancePolicy(region, effectiveDate) {
    if (!REGIONS.includes(region)) {
        throw new Error("Invalid region entered. Please enter again! (1, 2, 3, 4)")
    }

    const policyUpdate = POLICY_UPDATES.find(update => update.startDate.getTime() <=effectiveDate.getTime())

    if (!policyUpdate) {
        throw new Error(`There is no insurance policy available for the date provided ${effectiveDate.toISOString()}`);
    }

    const regionInfo = policyUpdate.regionMinWages.find((minWage) =>
        minWage.region === region
    )

    return {
        baseSalary: policyUpdate.baseSalary,
        minWage: regionInfo.minWage,
    }
}
