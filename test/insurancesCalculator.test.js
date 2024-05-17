const insurancesCalculator = require('../src/insurancesCalculator.js')

const assert = require('assert');
const test = require('mocha').it;

describe('Calculate Insurances', async function () {

    describe('It applies update of 1/7/2022', function () {
        const jun23 = new Date("2023-06-01");

        test('It applies 10.5% of Gross for all Insurance(Social Insurance 8%, Health Insurance 1.5% , Unemployment Insurance 1%) when Gross Income is less than or equal 20 times Base Salary (29.8m)', async function () {
            //Gross Income <= 29.8 million:
            // Social Insurance (Social Insurance): 8% Gross
            // Health Insurance (Health Insurance): 1.5% Gross
            // Unemployment Insurance (Unemployment Insurance): 1% Gross

            const actualInsurances = await insurancesCalculator(1, 1, jun23);
            const expectedInsurances = {
                insurances: [
                    {
                        amount: 0.08,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 0.015,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 0.01,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                total: 0.105
            }

            assert.deepStrictEqual(actualInsurances, expectedInsurances)
        })

        test('It applies max threshold (29.8m) for Social Insurance (8%) and Health Insurance (1.5%) when Gross between 29.8m and 88.4m', async function () {
            // Social Insurance: 8% of 29.8 million
            // Health Insurance: 1.5% of 29.8 million
            // Unemployment Insurance: 1% of Gross Income

            const actualInsurances = await insurancesCalculator(29_900_000, 1, jun23);
            const expectedInsurances = {
                insurances: [
                    {
                        amount: 2384000,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 447000,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 299_000,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                total: 3130000
            }

            assert.deepStrictEqual(actualInsurances, expectedInsurances)
        })

        test('It applies max threshold (88.4m) of region 1 for Unemployment Insurance (1%)', async function () {
            // Social Insurance: 8% of 29.8 million
            // Health Insurance: 1.5% of 29.8 million
            // Unemployment Insurance (Region 1): 1% of 20 * 4.42 (88.4 million)

            const actualInsurances = await insurancesCalculator(88_888_888, 1, jun23);
            const expectedInsurances = {
                insurances: [
                    {
                        amount: 2384000,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 447000,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 884000,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                total: 3715000
            }

            assert.deepStrictEqual(actualInsurances, expectedInsurances)
        })

        test('It applies max threshold (78.4m) of region 2 for Unemployment Insurance (1%)', async function () {
            // Social Insurance: 8% of 29.8 million
            // Health Insurance: 1.5% of 29.8 million
            // Unemployment Insurance (Region 2): 1% of 20 * 3.92 (78.4 million) 

            const actualInsurances = await insurancesCalculator(88_888_888, 2, jun23);
            const expectedInsurances = {
                insurances: [
                    {
                        amount: 2384000,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 447000,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 784000,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                total: 3615000
            }

            assert.deepStrictEqual(actualInsurances, expectedInsurances)
        })
        test('It applies max threshold (68.6m) of region 3 for Unemployment Insurance (1%)', async function () {
            // Social Insurance: 8% of 29.8 million
            // Health Insurance: 1.5% of 29.8 million
            // Unemployment Insurance (Region 3): 1% of 20 * 3.43 (68.6 million)

            const actualInsurances = await insurancesCalculator(88_888_888, 3, jun23);
            const expectedInsurances = {
                insurances: [
                    {
                        amount: 2384000,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 447000,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 686000,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                total: 3517000
            }

            assert.deepStrictEqual(actualInsurances, expectedInsurances)
        })

        test('It applies max threshold (61.4m) of region 4 for Unemployment Insurance (1%)', async function () {
            // Social Insurance: 8% of 29.8 million
            // Health Insurance: 1.5% of 29.8 million
            // Unemployment Insurance (Region 4): 1% of 20 * 3.07 (61.4 million)

            const actualInsurances = await insurancesCalculator(88_888_888, 4, jun23);
            const expectedInsurances = {
                insurances: [
                    {
                        amount: 2384000,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 447000,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 614000,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                total: 3445000
            }

            assert.deepStrictEqual(actualInsurances, expectedInsurances)
        })

        test('Throw Exception when entering invalid region', async function () {
            try {
                const actualInsurances = await insurancesCalculator(88_888_888, 5, jun23);
                assert.fail('Expected insurancesCalculator to throw an error');
            } catch (error) {
                assert.equal(error.message, 'Invalid region entered. Please enter again! (1, 2, 3, 4)');
            }
        })

        test('Throw Exception when there is no salary policy available for the date provided', async function () {

            try {
                const actualInsurances = await insurancesCalculator(88_888_888, 3, new Date("2021-01-01"));
                assert.fail('Expected insurancesCalculator to throw an error');
            } catch (error) {
                assert.equal(error.message, 'There is no salary policy available for the date provided');
            }
        })
    })


    describe('It applies update of 1/7/2023', async function () {

        test('It applies 10.5% of Gross for all Insurance(Social Insurance 8%, Health Insurance 1.5% , Unemployment Insurance 1%) when Gross Income is less than or equal 20 times Base Salary (36m)', async function () {
            // Social Insurance (Social Insurance): 8% gross 
            // Health Insurance (Health Insurance): 1.5% gross
            // Unemployment Insurance (Unemployment Insurance): 1% gross

            const actualInsurances = await insurancesCalculator(31_234_456);
            const expectedInsurances = {
                insurances: [
                    {
                        amount: 2_498_756.48,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 468516.84,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 312_344.56,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                total: 3279617.88
            }

            assert.deepStrictEqual(actualInsurances, expectedInsurances)
        })

        test('It applies max threshold (36m) for Social Insurance (8%) and Health Insurance (1.5%) when Gross between 36m and 93.6m', async function () {
            // Social Insurance: 8% of 36 million
            // Health Insurance: 1.5% of 36 million
            // Unemployment Insurance: 1% of Gross Income

            const actualInsurances = await insurancesCalculator(36_789_123);
            const expectedInsurances = {
                insurances: [
                    {
                        amount: 2_880_000,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 540_000,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 367_891.23,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                total: 3787891.23
            }

            assert.deepStrictEqual(actualInsurances, expectedInsurances)
        })

        test('It applies max threshold (93.6m) of region 1 for Unemployment Insurance (1%)', async function () {
            // Social Insurance: 8% of 36 million
            // Health Insurance: 1.5% of 36 million
            // Unemployment Insurance (Region 1): 1% of 20 * 4.68 (93.6 million)

            const actualInsurances = await insurancesCalculator(93_600_000);
            const expectedInsurances = {
                insurances: [
                    {
                        amount: 2_880_000,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 540_000,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 936000,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                total: 4356000
            }

            assert.deepStrictEqual(actualInsurances, expectedInsurances)
        })

        test('It applies max threshold (83.2m) of region 2 for Unemployment Insurance (1%)', async function () {
            // Social Insurance: 8% of 36 million
            // Health Insurance: 1.5% of 36 million
            // Unemployment Insurance (Region 2): 1% of 20 * 4.16 (83.2 million) 

            const actualInsurances = await insurancesCalculator(93_678_123, 2);
            const expectedInsurances = {
                insurances: [
                    {
                        amount: 2_880_000,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 540_000,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 832000,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                total: 4252000
            }

            assert.deepStrictEqual(actualInsurances, expectedInsurances)
        })

        test('It applies max threshold (72.8m) of region 3 for Unemployment Insurance (1%)', async function () {
            // Social Insurance: 8% of 36 million
            // Health Insurance: 1.5% of 36 million
            // Unemployment Insurance (Region 3): 1% of 20 * 3.64 (72.8 million)

            const actualInsurances = await insurancesCalculator(95_000_000, 3);
            const expectedInsurances = {
                insurances: [
                    {
                        amount: 2_880_000,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 540_000,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 728000,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                total: 4148000
            }

            assert.deepStrictEqual(actualInsurances, expectedInsurances)
        })

        test('It applies max threshold (65m) of region 4 for Unemployment Insurance (1%)', async function () {
            // Social Insurance: 8% of 36 million
            // Health Insurance: 1.5% of 36 million
            // Unemployment Insurance (Region 4): 1% of 20 * 3.25 (65 million)

            const actualInsurances = await insurancesCalculator(95_000_000, 4);
            const expectedInsurances = {
                insurances: [
                    {
                        amount: 2_880_000,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 540_000,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 650000,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                total: 4070000
            }

            assert.deepStrictEqual(actualInsurances, expectedInsurances)
        })

        test('Throw Exception when entering invalid region, after 1/7/2023', async function () {
            try {
                const actualInsurances = insurancesCalculator(93_678_123, 0, 10);
                assert.fail("Invalid region entered. Please enter again! (1, 2, 3, 4)");
            } catch (error) {
                assert.equal(error.message, "Invalid region entered. Please enter again! (1, 2, 3, 4)")
            }
        })
    })

    describe('Out of update range', async function () {

        test('Throw Exception when entering start date out of update range', async function () {
            try {
                const actualInsurances = insurancesCalculator(93_678_123, 1, new Date("2020-06-01"));
                assert.fail("There is no salary policy available for the date provided")

            } catch (error) {
                assert.equal(error.message, "There is no salary policy available for the date provided")

            }
        })
    })
})


