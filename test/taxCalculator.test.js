import assert from 'assert';
import {calculateTaxes} from "../src/taxCalculator";
const Big = require('big.js');
const test = require('mocha').it;

describe('Calculate taxes', () => {

    test('It should return no tax when taxableIncome is lte 0', async () => {
        // taxableIncome <= 5m (tax level 1)
        const taxableIncome = -1;

        const expectedTaxes = {
            rates: [],
            totalTax: 0
        };

        await calculateTaxes(taxableIncome)
            .then(function (actual) {
                assert.deepStrictEqual(actual, expectedTaxes)
            })
    })

    test('It applies tax rate 1 only', async () => {
        // taxableIncome <= 5m (tax level 1)

        const expectedTaxes = {
            rates: [
                { name: 'Tax level 1', rate: 0.05, amount: 61722.2 },
            ],
            totalTax: 61722.2
        };

        await calculateTaxes(1_234_444)
            .then(function (actual) {
                assert.deepStrictEqual(actual, expectedTaxes)

            })
    })

    test('It applies 2 first tax rates', async () => {
        // taxableIncome <= 5m (tax level 1) +  5m (tax level 2) 
        //5m < taxableIncome <= 10m

        const expectedTaxes = {
            rates: [
                { name: 'Tax level 1', rate: 0.05, amount: 250_000 },
                { name: 'Tax level 2', rate: 0.1, amount: 400_000 },
            ],
            totalTax: 650_000
        };

        await calculateTaxes(9_000_000).then((taxes) => {
            assert.deepStrictEqual(taxes, expectedTaxes)
        })
    })

    test('It applies 3 first tax rates', async () => {
        // 10m < taxableIncome <= 5m (tax level 1) +  5m (tax level 2) + 8m (tax level 3)
        //10m < taxableIncome <= 18m
        const expectedTaxes = {
            rates: [
                { name: 'Tax level 1', rate: 0.05, amount: 250_000 },
                { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                { name: 'Tax level 3', rate: 0.15, amount: 300000 }],
            totalTax: 1050000
        };

        await calculateTaxes(12_000_000).then((taxes) => {
            assert.deepStrictEqual(taxes, expectedTaxes)
        })
    })

    test('It applies 4 first tax rates', async () => {
        // taxableIncome <= 5m (tax level 1) +  5m (tax level 2) + 8m (tax level 3) + 14m(tax level 4)
        //18m < taxableIncome <= 32m

        const expectedTaxes = {
            rates: [
                { name: 'Tax level 1', rate: 0.05, amount: 250_000 },
                { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                { name: 'Tax level 3', rate: 0.15, amount: 1_200_000 },
                { name: 'Tax level 4', rate: 0.2, amount: 2_200_000 }],
            totalTax: 4_150_000
        };

        await calculateTaxes(29_000_000).then((taxes) => {
            assert.deepStrictEqual(taxes, expectedTaxes)
        })
    })

    test('It applies 5 first tax rates', async () => {
        // taxableIncome <= 5m (tax level 1) +  5m (tax level 2) + 8m (tax level 3) + 14m (tax level 4) + 20m (tax level 5) 
        //32m < taxableIncome <= 52m

        const expectedTaxes = {
            rates: [
                { name: 'Tax level 1', rate: 0.05, amount: 250_000 },
                { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                { name: 'Tax level 3', rate: 0.15, amount: 1_200_000 },
                { name: 'Tax level 4', rate: 0.2, amount: 2_800_000 },
                { name: 'Tax level 5', rate: 0.25, amount: 246_336.25 }],
            totalTax: 4_996_336.25
        };

        await calculateTaxes(32_985_345).then((taxes) => {
            assert.deepStrictEqual(taxes, expectedTaxes)
        })

    })

    test('It applies 6 first tax rates', async () => {
        // taxableIncome <= 5m (tax level 1) +  5m (tax level 2) + 8m (tax level 3) + 14m (tax level 4) + 20m (tax level 5) + 28m (tax level 6)
        //52m < taxableIncome <= 80m

        const expectedTaxes = {
            rates: [
                { name: 'Tax level 1', rate: 0.05, amount: 250_000 },
                { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                { name: 'Tax level 3', rate: 0.15, amount: 1_200_000 },
                { name: 'Tax level 4', rate: 0.2, amount: 2_800_000 },
                { name: 'Tax level 5', rate: 0.25, amount: 5_000_000 },
                { name: 'Tax level 6', rate: 0.3, amount: 864_000 }],
            totalTax: 10_614_000
        };

        await calculateTaxes(54_880_000).then((taxes) => {
            assert.deepStrictEqual(taxes, expectedTaxes)
        })
    })

    test('It applies with all 7 tax rates', async () => {
        // taxableIncome > 5m (tax level 1) +  5m (tax level 2) + 8m (tax level 3) + 14m (tax level 4) + 20m (tax level 5) + 28m (tax level 6) 
        // taxableIncome > 80m

        const expectedTaxes = {
            rates: [
                { name: 'Tax level 1', rate: 0.05, amount: 250_000 },
                { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                { name: 'Tax level 3', rate: 0.15, amount: 1_200_000 },
                { name: 'Tax level 4', rate: 0.2, amount: 2_800_000 },
                { name: 'Tax level 5', rate: 0.25, amount: 5_000_000 },
                { name: 'Tax level 6', rate: 0.3, amount: 8_400_000 },
                { name: 'Tax level 7', rate: 0.35, amount: 1_625_400 }],
            totalTax: 19775400
        };
        await calculateTaxes(84_644_000).then((taxes) => {
            assert.deepStrictEqual(taxes, expectedTaxes)
        })
    })
})
