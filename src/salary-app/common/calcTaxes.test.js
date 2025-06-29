import assert from 'assert';
import calcTaxes from "./calcTaxes";
import { it as test } from 'mocha';
import { expect } from 'chai';

describe('Calculate taxes', () => {

    test('It should return no tax when taxableIncome is lte 0', async () => {
        // taxableIncome <= 5m (tax level 1)
        const taxableIncome = -1;
        const expectedTaxes = {
            rates: [],
            totalTax: 0
        };

        const actual = await calcTaxes(taxableIncome)

        expect(actual).to.deep.equal(expectedTaxes);
    })

    test('It applies tax rate 1 only', async () => {
        // taxableIncome <= 5m (tax level 1)

        const expectedTaxes = {
            rates: [
                { name: 'Tax level 1', rate: 0.05, amount: 61722.2 },
            ],
            totalTax: 61722.2
        };

        const actual = await calcTaxes(1_234_444)
        expect(actual.rates[0]).to.have.property('name', 'Tax level 1');
        expect(actual.rates[0]).to.have.property('rate', 0.05);
        expect(actual).to.have.property('totalTax', 61722.2);
        expect(actual.rates).to.have.lengthOf(1);
        expect(actual).to.deep.equal(expectedTaxes);

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
        const actual = await calcTaxes(9_000_000)
        expect(actual).to.deep.equal(expectedTaxes);
        expect(actual.rates[0]).to.have.property('name', 'Tax level 1');
        expect(actual.rates[0]).to.have.property('rate', 0.05);
        expect(actual.rates[1]).to.have.property('name', 'Tax level 2');
        expect(actual.rates[1]).to.have.property('rate', 0.1);
        expect(actual).to.have.property('totalTax', 650_000);
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
        const actual = await calcTaxes(12_000_000)
        expect(actual).to.deep.equal(expectedTaxes);
        expect(actual.rates[0]).to.have.property('name', 'Tax level 1');
        expect(actual.rates[0]).to.have.property('rate', 0.05);
        expect(actual.rates[1]).to.have.property('name', 'Tax level 2');
        expect(actual.rates[1]).to.have.property('rate', 0.1);
        expect(actual.rates[2]).to.have.property('name', 'Tax level 3');
        expect(actual.rates[2]).to.have.property('rate', 0.15);
        expect(actual).to.have.property('totalTax', 1050000);
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
        const actual = await calcTaxes(29_000_000)
        expect(actual).to.deep.equal(expectedTaxes);
        expect(actual.rates[0]).to.have.property('name', 'Tax level 1');
        expect(actual.rates[0]).to.have.property('rate', 0.05);
        expect(actual.rates[1]).to.have.property('name', 'Tax level 2');
        expect(actual.rates[1]).to.have.property('rate', 0.1);
        expect(actual.rates[2]).to.have.property('name', 'Tax level 3');
        expect(actual.rates[2]).to.have.property('rate', 0.15);
        expect(actual.rates[3]).to.have.property('name', 'Tax level 4');
        expect(actual.rates[3]).to.have.property('rate', 0.2);
        expect(actual).to.have.property('totalTax', 4_150_000);
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
        const actual = await calcTaxes(32_985_345)
        expect(actual).to.deep.equal(expectedTaxes);

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
        const actual = await calcTaxes(54_880_000)
        expect(actual).to.deep.equal(expectedTaxes);

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
        const actual = await calcTaxes(84_644_000)
        expect(actual).to.deep.equal(expectedTaxes);
    })

    test('It applies tax rate 7 correctly for very large incomes', async () => {
        // Testing with income significantly above 80M to verify 35% rate
        const taxableIncome = 983_562_000;

        const expectedTaxes = {
            rates: [
                { name: 'Tax level 1', rate: 0.05, amount: 250_000 },
                { name: 'Tax level 2', rate: 0.1, amount: 500_000 },
                { name: 'Tax level 3', rate: 0.15, amount: 1_200_000 },
                { name: 'Tax level 4', rate: 0.2, amount: 2_800_000 },
                { name: 'Tax level 5', rate: 0.25, amount: 5_000_000 },
                { name: 'Tax level 6', rate: 0.3, amount: 8_400_000 },
                { name: 'Tax level 7', rate: 0.35, amount: 316_246_700 }], // (983_562_000 - 80M) * 0.35
            totalTax: 334_396_700
        };
        const actual = await calcTaxes(taxableIncome);
        expect(actual).to.deep.equal(expectedTaxes);

    });
})
