const assert = require('assert');
const test = require('mocha').it;
const calculateTaxableIncome = require('../src/taxableIncomeCalcGross.js');

describe('Calculate taxes', function () {

    describe('Test Taxable Income when no dependent deducted', function () {

        test('No taxable income', async function () {
            const netIncome = 11_000_000
            const actual = await calculateTaxableIncome(netIncome)
            const expected = 0;

            assert.equal(actual, expected)
        })

        test('It applies tax rate 1 only', async function () {
            // ti                   <= net + 5% * Min(ti, 5) - 11; Only if ti <= 5.
            // ti - 5% * Min(ti, 5) <= net - 11
            // ti - 5% ti           <= net - 11 
            // 95%*ti               <= net - 11
            // ti <= 5             ==> net <= 15.75

            const netIncome = 15_750_000
            const actual = await calculateTaxableIncome(netIncome)

            assert.equal(actual, 5000000)
        })

        test('It applies 2 first tax rates', async function () {
            // ti        <= net + 5% * 5 + 10% * Min(ti - 5, 5) - 11; Only if ti <= 10.
            // ti        <= net + 5% * 5 + 10% * (ti - 5) - 11
            // 0.9*ti    <= net - 11.25
            // ti <= 10  ==> net <= 20_250_000

            const netIncome = 20_250_000
            const actual = await calculateTaxableIncome(netIncome)

            assert.deepEqual(actual, 10_000_000)
        })

        test('It applies 3 first tax rates', async function () {
            // ti        <= net + 5% * 5 + 10% * 5 + 15%*min(ti - 10, 8) - 11; Only if ti <= 18
            // 0.85*ti   <= net - 11.75
            // ti <= 18 ==> net <= 27_050_000

            const netIncome = 27_050_000
            const actual = await calculateTaxableIncome(netIncome)

            assert.equal(actual, 18000000)
        })

        test('It applies 4 first tax rates', async function () {
            // ti        <= net + 5% * 5 + 10% * 5 + 15%*8 + 20%*min(ti-18, 14)- 11; Only if ti <= 32
            // 0.8*ti    <= net - 12.65
            // ti <= 32 ==> net <= 38_250_000

            const netIncome = 38_250_000
            const actual = await calculateTaxableIncome(netIncome)

            assert.equal(actual, 32000000)
        })

        test('It applies 5 first tax rates', async function () {
            // ti        <= net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*min(ti-32, 20) - 11; Only if ti <=52
            // 0.75*ti   <= net -14.25
            // ti <= 52 ==> net <= 53_250_000

            const netIncome = 53_250_000
            const actual = await calculateTaxableIncome(netIncome)

            assert.equal(actual, 52000000)
        })

        test('It applies 6 first tax rates', async function () {
            // ti       <= net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*20 +30%(ti-52, 28) - 11; Only if ti <=80
            // 0.7*ti   <= net + 9.75 - 30%*52 -11
            // 0.7*ti   <= net - 16.85
            // ti <=80  ==> net <= 72_850_000

            const netIncome = 72_850_000
            const actual = await calculateTaxableIncome(netIncome)

            assert.equal(actual, 80000000)
        })

        test('It applies with all 7 tax rates', async function () {
            // ti        > net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*20 +30%*28 + 35%*(ti-80) - 11; Only if ti > 80
            // 0.65*ti   > net +18.15 -35%*80 -11
            // 0.65*ti   > net - 20.85
            // ti > 80 ==> net > 72_850_000

            const netIncome = 72_950_000
            const actual = await calculateTaxableIncome(netIncome)

            assert.equal(actual, 80_153_846.15384616)
        })
    })

    describe('Test Taxable Income when having dependent deducted', function () {

        test('Dependent with no taxable income', async function () {

            const netIncome = 11_000_000
            const actual = await calculateTaxableIncome(netIncome, 0)
            const expected = 0;

            assert.equal(actual, expected)
        })

        test('Taxes fully deducted with dependents', async function () {
            // 1 dependent = 4400000;
            const netIncome = 11_000_000 + 4400000
            const actual = await calculateTaxableIncome(netIncome, 1)
            const expected = 0;

            assert.equal(actual, expected)
        })

        test('Taxes partially deducted with dependents', async function () {

            const netIncome = 15_750_000
            const actual = await calculateTaxableIncome(netIncome, 1)
            const expected = 368_421.05263157893;

            assert.equal(actual, expected)
        })

    })
})