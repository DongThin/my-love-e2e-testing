const assert = require('assert');
const calcInsurance = require('../../src/net-to-gross/calcInsurance');
const findPolicyAndRegion = require('../../src/findPolicyAndRegion');
const test = require('mocha').it;


describe('Calculate Insurances from Net and Taxes', async function () {

    test('Verify maximum SI, HI, and UI are applied ' +
        'when total of net and taxes gte 20 times region min wage', async function () {
        // net + totalTax >= 99% * 20 * regionMinwage - 3420
        // net + totalTax >= 89_244_000

        const actualInsurances = await calcInsurance(89_000_000, 26_846_154);
        const expectedInsurances = {
            totalInsurance: 4_356_000,
            grossFromIns: 120_202_154
        }
        assert.deepStrictEqual(actualInsurances, expectedInsurances)
    })

    test('Verify maximum SI, HI are applied when total of net income and total tax gte 20x base Salary and lt 20x region min wage', async function () {
        // 20*regionMinwage > gross >= 36 ==> net +totalTax + 3.42 + 1% gross >=36
        // 20*regionMinwage > net + totalTax >= 99% * 36 - 3420
        // 93_600_000 > net + totalTax >= 32_220_000

        const actualInsurances = await calcInsurance(36_000_000, 4_187_500);
        const expectedInsurances = {
            totalInsurance: 3_860_479.797979798,
            grossFromIns: 44_047_979.797979794
        }
        assert.deepStrictEqual(actualInsurances, expectedInsurances)
    })

    test('Verify standard insurance calculation (10.5% of gross) when total of net income and total tax below 20x base salary', async function () {
        // gross < 36 ==> net +totalTax + 3.42 + 1% gross < 36
        // net + totalTax <36 * 0.895
        // net + totalTax < 32_220_000

        const actualInsurances = await calcInsurance(22_000_000, 1_058_824);
        const expectedInsurances = {
            totalInsurance: 2_705_225.162011173,
            grossFromIns: 25_764_049.162011173
        }
        assert.deepStrictEqual(actualInsurances, expectedInsurances)
    })

    test('Verify that the gross amount is calculated correctly in various regions ' +
        'when the total net and total tax are greater than or equal to 89,244,000', async function () {
        // net + totalTax >= 89_244_000

        const actualInsurances = await calcInsurance(89_000_000, 26_846_154, 2);
        const expectedInsurances = {
            totalInsurance: 4252000,
            grossFromIns: 120098154
        }
        assert.deepStrictEqual(actualInsurances, expectedInsurances)
    })
})
describe('Throw error', function () {
    test('Throw Exception when entering invalid region', async function () {
        await calcInsurance(89_000_000, 26_846_154, 5).catch(function (error) {
            assert.equal(error.message, "Invalid region entered. Please enter again! (1, 2, 3, 4)")
        })
    })

    test('Throw Exception when entering start date out of update range', async function () {
        await calcInsurance(89_000_000, 26_846_154, 4, new Date("2020-06-01")).catch(function (error) {
            assert.equal(error.message, "There is no salary policy available for the date provided")
        })
    })

})

