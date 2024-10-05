const assert = require('assert');
const test = require('mocha').it;
const calcTaxableIncome = require('../../src/net-to-gross/calcTaxableIncome.js');

describe('Calculate Taxable Income',  () => {

    describe('Test Taxable Income when no dependent deducted', () => {

        test('No taxable income when Net Income is lte 11_000_000', async () => {
            const netIncome = 11_000_000
            const actual = await calcTaxableIncome(netIncome)
            const expected = 0;

            assert.equal(actual, expected)
        })

        test('The total tax is calculated correctly for tax rate 1 only', async () => {
            // ti <= 5_000_000     ==> net <= 15_750_000
            const netIncome = 15_750_000
            const actual = await calcTaxableIncome(netIncome)

            assert.equal(actual, 5000000)
        })

        test('The total tax is calculated correctly for 2 first tax rates', async () => {
            // ti <= 10_000_000 ==> net <= 20_250_000
            const netIncome = 20_250_000
            await calcTaxableIncome(netIncome).then(function (actual) {
                assert.deepEqual(actual, 10_000_000)
            })
        })

        test('The total tax is calculated correctly for 3 first tax rates', async () => {
            // ti <= 18_000_000 ==> net <= 27_050_000
            const netIncome = 27_050_000
            const actual = await calcTaxableIncome(netIncome)

            assert.equal(actual, 18_000_000)
        })

        test('The total tax is calculated correctly for 4 first tax rates', async () => {
            // ti <= 32_000_000 ==> net <= 38_250_000
            const netIncome = 38_250_000
            const actual = await calcTaxableIncome(netIncome)

            assert.equal(actual, 32_000_000)
        })

        test('The total tax is calculated correctly for 5 first tax rates', async () => {
            // ti <= 52_000_000 ==> net <= 53_250_000
            const netIncome = 53_250_000
            const actual = await calcTaxableIncome(netIncome)

            assert.equal(actual, 52_000_000)
        })

        test('The total tax is calculated correctly for 6 first tax rates', async () => {
            // ti <= 80_000_000  ==> net <= 72_850_000
            const netIncome = 72_850_000
            const actual = await calcTaxableIncome(netIncome)

            assert.deepEqual(actual, 80_000_000)
        })

        test('The total tax is calculated correctly for all 7 tax rates', async () => {
            // ti > 80_000_000 ==> net > 72_850_000
            const netIncome = 72_950_000
            const actual = await calcTaxableIncome(netIncome)

            assert.equal(actual, 80_153_846.15384616)
        })
    })

    describe('Test Taxable Income when having dependent deducted', () => {

        test('Dependent with no taxable income', async () => {
            const netIncome = 11_000_000
            const actual = await calcTaxableIncome(netIncome, 0)
            const expected = 0;

            assert.equal(actual, expected)
        })

        test('Taxes fully deducted with dependents', async () => {
            // 1 dependent = 4400000;
            const netIncome = 11_000_000 + 4400000
            const actual = await calcTaxableIncome(netIncome, 1)
            const expected = 0;

            assert.equal(actual, expected)
        })

        test('Taxes partially deducted with dependents', async () => {
            const netIncome = 15_750_000
            const actual = await calcTaxableIncome(netIncome, 1)
            const expected = 368_421.05263157893;

            assert.equal(actual, expected)
        })
    })
})

