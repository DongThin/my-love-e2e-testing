const calculateInssurance = require('../src/insurancesCalculator.js')

const assert = require('assert');
const test = require('mocha').it;

describe('Calculate Insurances', function () {

    describe('It applies update of 1/7/2022', function () {
        const jun23 = new Date("2023-06-01");

        test('It applies 10.5% of Gross for all Insurance(socialInsurance 8%, healthInsurance 1.5% , unemploymentInsurance 1%) when Gross Income is less than or equal 20 times Base Salary (29.8m)', function () {
            //Gross Income <= 29.8 million:
            // Social Insurance (socialInsurance): 8% Gross
            // Health Insurance (healthInsurance): 1.5% Gross
            // Unemployment Insurance (unemploymentInsurance): 1% Gross

            const actual = calculateInssurance(1, 1, jun23);
            const expectObject = {
                socialInsurance: 0.08,
                healthInsurance: 0.015,
                unemploymentInsurance: 0.01,
                totalInsurance: 0.105
            }

            assert.deepStrictEqual(actual, expectObject)
        })

        test('It applies max threshold (29.8m) for socialInsurance (8%) and healthInsurance (1.5%) when Gross between 29.8m and 88.4m', function () {
            // socialInsurance: 8% of 29.8 million
            // healthInsurance: 1.5% of 29.8 million
            // unemploymentInsurance: 1% of Gross Income

            const actual = calculateInssurance(29_900_000, 1, jun23);
            const expectObject = {
                socialInsurance: 2384000,
                healthInsurance: 447000,
                unemploymentInsurance: 299_000,
                totalInsurance: 3130000
            }

            assert.deepStrictEqual(actual, expectObject)
        })

        test('It applies max threshold (88.4m) of region 1 for unemploymentInsurance (1%)', function () {
            // socialInsurance: 8% of 29.8 million
            // healthInsurance: 1.5% of 29.8 million
            // unemploymentInsurance (Region 1): 1% of 20 * 4.42 (88.4 million)

            const actual = calculateInssurance(88_888_888, 1, jun23);
            const expectObject = {
                socialInsurance: 2384000,
                healthInsurance: 447000,
                unemploymentInsurance: 884000,
                totalInsurance: 3715000
            }

            assert.deepStrictEqual(actual, expectObject)
        })

        test('It applies max threshold (78.4m) of region 2 for unemploymentInsurance (1%)', function () {
            // socialInsurance: 8% of 29.8 million
            // healthInsurance: 1.5% of 29.8 million
            // unemploymentInsurance (Region 2): 1% of 20 * 3.92 (78.4 million) 

            const actual = calculateInssurance(88_888_888, 2, jun23);
            const expectObject = {
                socialInsurance: 2384000,
                healthInsurance: 447000,
                unemploymentInsurance: 784000,
                totalInsurance: 3615000
            }

            assert.deepStrictEqual(actual, expectObject)
        })
        test('It applies max threshold (68.6m) of region 3 for unemploymentInsurance (1%)', function () {
            // socialInsurance: 8% of 29.8 million
            // healthInsurance: 1.5% of 29.8 million
            // unemploymentInsurance (Region 3): 1% of 20 * 3.43 (68.6 million)

            const actual = calculateInssurance(88_888_888, 3, jun23);
            const expectObject = {
                socialInsurance: 2384000,
                healthInsurance: 447000,
                unemploymentInsurance: 686000,
                totalInsurance: 3517000
            }

            assert.deepStrictEqual(actual, expectObject)
        })

        test('It applies max threshold (61.4m) of region 4 for unemploymentInsurance (1%)', function () {
            // socialInsurance: 8% of 29.8 million
            // healthInsurance: 1.5% of 29.8 million
            // unemploymentInsurance (Region 4): 1% of 20 * 3.07 (61.4 million)

            const actual = calculateInssurance(88_888_888, 4, jun23);
            const expectObject = {
                socialInsurance: 2384000,
                healthInsurance: 447000,
                unemploymentInsurance: 614000,
                totalInsurance: 3445000
            }

            assert.deepStrictEqual(actual, expectObject)
        })

        test('Throw Exception when entering invalid region', function () {
            assert.throws(function () {
                calculateInssurance(93_678_123, 10, jun23);
            }, Error, 'Invalid region entered. Please enter again! (1, 2, 3, 4)');
        })
    })
    describe('It applies update of 1/7/2023', function () {

        test('It applies 10.5% of Gross for all Insurance(socialInsurance 8%, healthInsurance 1.5% , unemploymentInsurance 1%) when Gross Income is less than or equal 20 times Base Salary (36m)', function () {
            // Social Insurance (socialInsurance): 8% gross 
            // Health Insurance (healthInsurance): 1.5% gross
            // Unemployment Insurance (unemploymentInsurance): 1% gross

            const actual = calculateInssurance(31_234_456);
            const expectObject = {
                socialInsurance: 2_498_756.48,
                healthInsurance: 468_516.83999999997,
                unemploymentInsurance: 312_344.56,
                totalInsurance: 3279617.88
            }

            assert.deepStrictEqual(actual, expectObject)
        })

        test('It applies max threshold (36m) for socialInsurance (8%) and healthInsurance (1.5%) when Gross between 36m and 93.6m', function () {
            // socialInsurance: 8% of 36 million
            // healthInsurance: 1.5% of 36 million
            // unemploymentInsurance: 1% of Gross Income

            const actual = calculateInssurance(36_789_123);
            const expectObject = {
                socialInsurance: 2_880_000,
                healthInsurance: 540_000,
                unemploymentInsurance: 367_891.23,
                totalInsurance: 3787891.23
            }

            assert.deepStrictEqual(actual, expectObject)
        })

        test('It applies max threshold (93.6m) of region 1 for unemploymentInsurance (1%)', function () {
            // socialInsurance: 8% of 36 million
            // healthInsurance: 1.5% of 36 million
            // unemploymentInsurance (Region 1): 1% of 20 * 4.68 (93.6 million)

            const actual = calculateInssurance(93_600_000);
            const expectObject = {
                socialInsurance: 2_880_000,
                healthInsurance: 540_000,
                unemploymentInsurance: 936000,
                totalInsurance: 4356000
            }

            assert.deepStrictEqual(actual, expectObject)
        })

        test('It applies max threshold (83.2m) of region 2 for unemploymentInsurance (1%)', function () {
            // socialInsurance: 8% of 36 million
            // healthInsurance: 1.5% of 36 million
            // unemploymentInsurance (Region 2): 1% of 20 * 4.16 (83.2 million) 

            const actual = calculateInssurance(93_678_123, 2);
            const expectObject = {
                socialInsurance: 2_880_000,
                healthInsurance: 540_000,
                unemploymentInsurance: 832000,
                totalInsurance: 4252000
            }

            assert.deepStrictEqual(actual, expectObject)
        })

        test('It applies max threshold (72.8m) of region 3 for unemploymentInsurance (1%)', function () {
            // socialInsurance: 8% of 36 million
            // healthInsurance: 1.5% of 36 million
            // unemploymentInsurance (Region 3): 1% of 20 * 3.64 (72.8 million)

            const actual = calculateInssurance(95_000_000, 3);
            const expectObject = {
                socialInsurance: 2_880_000,
                healthInsurance: 540_000,
                unemploymentInsurance: 728000,
                totalInsurance: 4148000
            }

            assert.deepStrictEqual(actual, expectObject)
        })

        test('It applies max threshold (65m) of region 4 for unemploymentInsurance (1%)', function () {
            // socialInsurance: 8% of 36 million
            // healthInsurance: 1.5% of 36 million
            // unemploymentInsurance (Region 4): 1% of 20 * 3.25 (65 million)

            const actual = calculateInssurance(95_000_000, 4);
            const expectObject = {
                socialInsurance: 2_880_000,
                healthInsurance: 540_000,
                unemploymentInsurance: 650000,
                totalInsurance: 4070000
            }

            assert.deepStrictEqual(actual, expectObject)
        })

        test('Throw Exception when entering invalid region, after 1/7/2023', function () {
            assert.throws(function () {
                calculateInssurance(93_678_123, 0, 10);
            }, Error, 'Invalid region entered. Please enter again! (1, 2, 3, 4)');
        })
    })
   
    describe('Out of update range', function(){

        test('Throw Exception when entering start date out of update range', function () {
            assert.throws(function () {
                calculateInssurance(93_678_123, 1, new Date("2020-06-01"));
            }, Error, 'Not found data for the provided start date');
        })
    })
});
