const assert = require('assert');
const test = require('mocha').it;
const calcTaxableIncome = require('../../src/net-to-gross/calcTaxableIncome.js');

describe('Calculate Taxable Income', function () {

    describe('Test Taxable Income when no dependent deducted', function () {

        test('No taxable income when Net Income is lte 11_000_000', async function () {
            const netIncome = 11_000_000
            const actual = await calcTaxableIncome(netIncome)
            const expected = 0;

            assert.equal(actual, expected)
        })

        test('The total tax is calculated correctly for tax rate 1 only', async function () {
            // ti                   <= net + 5% * Min(ti, 5_000_000) - 11_000_000; Only if ti <= 5_000_000
            // ti - 5% * Min(ti, 5_000_000) <= net - 11_000_000
            // ti - 5% ti           <= net - 11_000_000 
            // 95%*ti               <= net - 11_000_000
            // ti <= 5_000_000     ==> net <= 15_750_000
            const netIncome = 15_750_000
            const actual = await calcTaxableIncome(netIncome)

            assert.equal(actual, 5000000)
        })

        test('The total tax is calculated correctly for 2 first tax rates', async function () {
            // ti        <= net + 5% * 5_000_000 + 10% * Min(ti - 5, 5_000_000) - 11_000_000; Only if ti <= 10_000_000.
            // ti        <= net + 5% *  5_000_000+ 10% * (ti - 5_000_000) - 11_000_000
            // 0.9*ti    <= net - 11_250_000
            // ti <= 10_000_000 ==> net <= 20_250_000
            const netIncome = 20_250_000
            await calcTaxableIncome(netIncome).then(function (actual) {
                assert.deepEqual(actual, 10_000_000)
            })
        })

        test('The total tax is calculated correctly for 3 first tax rates', async function () {
            // ti        <= net + 5%*5_000_000 + 10%*5_000_000 + 15%*min(ti - 10_000_000, 8_000_000) - 11_000_000; Only if ti <= 18000000
            // 0.85*ti   <= net - 11_750_000
            // ti <= 18 ==> net <= 27_050_000
            const netIncome = 27_050_000
            const actual = await calcTaxableIncome(netIncome)

            assert.equal(actual, 18000000)
        })

        test('The total tax is calculated correctly for 4 first tax rates', async function () {
            // ti        <= net + 5%*5_000_000 + 10%*5_000_000 + 15%*8_000_000 + 20%*min(ti-18, 14)- 11_000_000; Only if ti <= 32000000
            // 0.8*ti    <= net - 12_650_000
            // ti <= 32000000 ==> net <= 38_250_000
            const netIncome = 38_250_000
            const actual = await calcTaxableIncome(netIncome)

            assert.equal(actual, 32000000)
        })

        test('The total tax is calculated correctly for 5 first tax rates', async function () {
            // ti        <= net + 5%*5_000_000 + 10%*5_000_000 + 15%*8_000_000 + 20%*14_000_000 + 25%*min(ti-32, 20) - 11_000_000; Only if ti <= 52000000
            // 0.75*ti   <= net - 14_250_000
            // ti <= 52000000 ==> net <= 53_250_000
            const netIncome = 53_250_000
            const actual = await calcTaxableIncome(netIncome)

            assert.equal(actual, 52000000)
        })

        test('The total tax is calculated correctly for 6 first tax rates', async function () {
            // ti       <= net + 5%*5_000_000 + 10%*5_000_000 + 15%*8_000_000  + 20%*14_000_000 + 25%*20_000_000 +30%(ti-52_000_000, 28_000_000) - 11_000_000; Only if ti <=80
            // 0.7*ti   <= net + 9_750_000 - 30%*52 - 11_000_000
            // 0.7*ti   <= net - 16_850_000
            // ti <= 80_000_000  ==> net <= 72_850_000
            const netIncome = 72_850_000
            const actual = await calcTaxableIncome(netIncome)

            assert.deepEqual(actual, 80_000_000)
        })

        test('The total tax is calculated correctly for all 7 tax rates', async function () {
            // ti        > net + 5%*5_000_000 + 10%*5_000_000 + 15%*8_000_000 + 20%*14_000_000 + 25%*20_000_000 + 30%*28_000_000 + 35%*(ti-80_000_000) - 11_000_000; Only if ti > 80_000_000
            // 0.65*ti   > net + 18_150_000 -35%*80_000_000 - 11_000_000
            // 0.65*ti   > net - 20_850_000
            // ti > 80_000_000 ==> net > 72_850_000
            const netIncome = 72_950_000
            const actual = await calcTaxableIncome(netIncome)

            assert.equal(actual, 80_153_846.15384616)
        })
    })

    describe('Test Taxable Income when having dependent deducted', function () {

        test('Dependent with no taxable income', async function () {
            const netIncome = 11_000_000
            const actual = await calcTaxableIncome(netIncome, 0)
            const expected = 0;

            assert.equal(actual, expected)
        })

        test('Taxes fully deducted with dependents', async function () {
            // 1 dependent = 4400000;
            const netIncome = 11_000_000 + 4400000
            const actual = await calcTaxableIncome(netIncome, 1)
            const expected = 0;

            assert.equal(actual, expected)
        })

        test('Taxes partially deducted with dependents', async function () {
            const netIncome = 15_750_000
            const actual = await calcTaxableIncome(netIncome, 1)
            const expected = 368_421.05263157893;

            assert.equal(actual, expected)
        })
    })
})

