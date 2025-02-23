import assert from 'assert';
import calcTotalInsurance from './calcTotalInsurance';
import {it as test} from 'mocha';

/**
 * Gross max for UI = 20x region min wage
 * Gross max for SI,HI = 20x base Salary
 */
describe('Calculate total Insurances from Net and Taxes', async () => {

    test('Maximum SI, HI, and UI application' +
        'when net + taxes >= Gross max for UI', async () => {
        // net + totalTax + 3_420_000 (SI + HI) + 1% 20*regionMinwage >= 93_600_000 (100% 20*regionMinwage)
        // net + totalTax >= 99% * 20 * regionMinwage - 3_420_000
        // net + totalTax >= 89_244_000

        const actualInsurances = await calcTotalInsurance(89_000_000, 26_846_154);
        const expectedInsurances = {
            total: 5_438_000,
            gross: 121_284_154
        }
        assert.deepStrictEqual(actualInsurances, expectedInsurances)
    })

    test('Maximum SI, HI application' +
        'when net + taxes >= Gross max for SI, HI && < Gross max for UI', async () => {

        // 20*regionMinwage > gross >= 36_000_000==> net +totalTax + 3_420_000 + 1% gross >= 36_000_000
        // 20*regionMinwage > net + totalTax >= 99% * 36_000_000 - 3_420_000
        // 93_600_000 > net + totalTax >= 32_220_000

        const actualInsurances = await calcTotalInsurance(36_000_000, 4_187_500);
        const expectedInsurances = {
            total: 4_714_734.636871508,
            gross: 44_902_234.63687151
        }
        assert.deepStrictEqual(actualInsurances, expectedInsurances)
    })

    test('10.5% gross-based standard insurance calculation' +
        'when net + taxes < Gross max for SI, HI', async () => {
        // gross < 36_000_000 ==> net +totalTax + 3_420_000 + 1% gross < 36_000_000
        // net + totalTax <36_000_000 * 0.895
        // net + totalTax < 32_220_000

        const actualInsurances = await calcTotalInsurance(22_000_000, 1_058_824);
        const expectedInsurances = {
            total: 2_705_225.162011173,
            gross: 25_764_049.162011173
        }
        assert.deepStrictEqual(actualInsurances, expectedInsurances)
    })

    test('Gross is calculated correctly in various regions ' +
        'when net + taxes >= 89,244,000', async () => {
        // net + totalTax + 3_420_000 (SI + HI) + 1% 20*regionMinwage >= 93_600_000 (100% 20*regionMinwage)
        // net + totalTax >= 99% * 20 * regionMinwage - 3_420_000
        // net + totalTax >= 89_244_000

        const actualInsurances = await calcTotalInsurance(89_000_000, 26_846_154, 2);
        const expectedInsurances = {
            total: 5_328_000,
            gross: 121_174_154
        }
        assert.deepStrictEqual(actualInsurances, expectedInsurances)
    })

    test('Gross is calculated correctly in various regions when ' +
        'total Net and tax is greater than max Gross for SI or HI', async ()=> {
        console.log("ansnsnsj")
        const actualInsurances =await calcTotalInsurance(50_000_000, 8_666_667, 1);
        const expectedInsurances = {
            total: 5083501.686868687,
            gross:63750168.68686869
        }
        assert.deepStrictEqual(actualInsurances, expectedInsurances)
        console.log(actualInsurances.total)
    })
})
describe('Throw error', () => {
    test('Exception is thrown when entering invalid region', async () => {
        await calcTotalInsurance(89_000_000, 26_846_154, 5).catch((error) =>{
            assert.equal(error.message, "Invalid region entered. Please enter again! (1, 2, 3, 4)")
        })
    })

    test('Exception is thrown when entering start date out of update range', async () => {
        const jun20 = new Date("2020-06-01");
        await calcTotalInsurance(89_000_000, 26_846_154, 4, jun20).catch((error) => {
            assert.equal(error.message, `There is no insurance policy available for the date provided ${jun20.toISOString()}`)
        })
    })

})

