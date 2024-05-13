const net = require('../src/net.js')

const assert = require('assert');
const test = require('mocha').it;

describe("Calculate net salary", function () {

    describe('Check Net salary with dependent', function () {
        //Personal Income Tax (PIT)

        test('No dependent deducted', function () {
            //Gross income below 11 million is tax-exempt.
            const actualPayslip = net(12_290_500, 0);

            const expectedPayslip = {
                gross: 12_290_500,
                dependents: 0,
                dependentDeductionAmount: 0,
                region: 1,
                insurances: [
                    {
                        amount: 983_240,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 184357.5,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 122905,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                totalInsurance: 1290502.5,
                afterInsurance: 10999997.5,
                taxes: [],
                totalTax: 0,
                netSalary: 10999997.5
            };
            assert.deepStrictEqual(actualPayslip, expectedPayslip);
        })

        test('Dependent with no taxable income', function () {
            //afterInsurance below 11 million is tax-exempt.

            const actualPayslip = net(12_290_500, 1);

            const expectedPayslip = {
                gross: 12_290_500,
                dependents: 1,
                dependentDeductionAmount: 4400000,
                region: 1,
                insurances: [
                    {
                        amount: 983_240,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 184357.5,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 122905,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                totalInsurance: 1290502.5,
                afterInsurance: 10999997.5,
                taxes: [],
                totalTax: 0,
                netSalary: 10999997.5
            };
            assert.deepStrictEqual(actualPayslip, expectedPayslip);
        })

        test('Taxes fully deducted with dependents', function () {
            //11m < Gross - 10.5% Gross  <= 11m (Personal deductions) + 4.4m * dependents (Dependent deductions)
            //12.29m < Gross <=17.2067m
            const actualPayslip = net(16_000_000, 1);

            const expectedPayslip = {
                gross: 16_000_000,
                dependents: 1,
                dependentDeductionAmount: 4_400_000,
                region: 1,
                insurances: [
                    {
                        amount: 1_280_000,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 240_000,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 160_000,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                totalInsurance: 1680000,
                afterInsurance: 14320000,
                taxes: [],
                totalTax: 0,
                netSalary: 14_320_000
            };
            assert.deepStrictEqual(actualPayslip, expectedPayslip);
        })

        test('Taxes partially deducted with dependents', function () {
            //Gross - 10.5% Gross  > 11m (Personal deductions) + 4.4m * dependents (Dependent deductions)
            //Gross > 17.2067m
            const actualPayslip = net(23_463_687, 1);

            const expectedPayslip = {
                gross: 23_463_687,
                dependents: 1,
                dependentDeductionAmount: 4400000,
                region: 1,
                insurances: [
                    {
                        amount: 1877094.96,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 351955.305,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 234636.87,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                totalInsurance: 2463687.135,
                afterInsurance: 20999999.865,
                taxes: [
                    { name: 'Tax level 1', rate: 0.05, amount: 250000 },
                    { name: 'Tax level 2', rate: 0.1, amount: 59999.9865 }
                ],
                totalTax: 309999.9865,
                netSalary: 20689999.8785
            };
            assert.deepStrictEqual(actualPayslip, expectedPayslip);
        })
    });

    describe('Check Net salary with Insurance', function () {

        describe('Before 1/7/2023', function () {

            test('Throw Exception when entering invalid region', function () {
                assert.throws(function () {
                    net(93_678_123, 0, 10, new Date("2023-06-01"));
                }, Error, 'Invalid region entered. Please enter again! (1, 2, 3, 4)');

            })

            test('It applies 10.5% of Gross for all Insurance(SI 8%, HI 1.5% , UI 1%) when Gross Income is less than or equal 20 times Base Salary (29.8m)', function () {
                //Gross Income <= 29.8 million:
                // Social Insurance (SI): 8% Gross
                // Health Insurance (HI): 1.5% Gross
                // Unemployment Insurance (UI): 1% Gross

                const actualPayslip = net(10, 0, 1, new Date("2023-06-01"));

                const expectedPayslip = {
                    gross: 10,
                    dependents: 0,
                    dependentDeductionAmount: 0,
                    region: 1,
                    insurances: [
                        {
                            amount: 0.8,
                            name: 'Social Insurance 8%'
                        },
                        {
                            amount: 0.15,
                            name: 'Health Insurance 1.5%'
                        },
                        {
                            amount: 0.1,
                            name: 'Unemployment Insurance 1%'
                        },
                    ],
                    totalInsurance: 1.05,
                    afterInsurance: 8.95,
                    taxes: [],
                    totalTax: 0,
                    netSalary: 8.95
                };
                assert.deepStrictEqual(actualPayslip, expectedPayslip);
            })

            test('It applies max threshold (29.8m) for SI (8%) and HI (1.5%) when Gross between 29.8m and 88.4m', function () {
                // SI: 8% of 29.8 million
                // HI: 1.5% of 29.8 million
                // UI: 1% of Gross Income

                const actualPayslip = net(29_900_000, 0, 1, new Date("2023-06-01"));

                const expectedPayslip = {
                    gross: 29_900_000,
                    dependents: 0,
                    dependentDeductionAmount: 0,
                    region: 1,
                    insurances: [
                        {
                            amount: 2_384_000,
                            name: 'Social Insurance 8%'
                        },
                        {
                            amount: 447_000,
                            name: 'Health Insurance 1.5%'
                        },
                        {
                            amount: 299_000,
                            name: 'Unemployment Insurance 1%'
                        },
                    ],
                    totalInsurance: 3130000,
                    afterInsurance: 26770000,
                    taxes: [
                        { name: 'Tax level 1', rate: 0.05, amount: 250000 },
                        { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                        { name: 'Tax level 3', rate: 0.15, amount: 865500 }
                    ],
                    totalTax: 1_615_500,
                    netSalary: 25154500
                };
                assert.deepStrictEqual(actualPayslip, expectedPayslip);
            })

            test('It applies max threshold (88.4m) of region 1 for UI (1%)', function () {
                // SI: 8% of 29.8 million
                // HI: 1.5% of 29.8 million
                // UI (Region 1): 1% of 20 * 4.42 (88.4 million)

                const actualPayslip = net(88_888_888, 0, 1, new Date("2023-06-01"));

                const expectedPayslip = {
                    gross: 88_888_888,
                    dependents: 0,
                    dependentDeductionAmount: 0,
                    region: 1,
                    insurances: [
                        {
                            amount: 2_384_000,
                            name: 'Social Insurance 8%'
                        },
                        {
                            amount: 447_000,
                            name: 'Health Insurance 1.5%'
                        },
                        {
                            amount: 884000,
                            name: 'Unemployment Insurance 1%'
                        },
                    ],
                    totalInsurance: 3715000,
                    afterInsurance: 85173888,
                    taxes: [
                        { name: 'Tax level 1', rate: 0.05, amount: 250000 },
                        { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                        { name: 'Tax level 3', rate: 0.15, amount: 1200000 },
                        { name: 'Tax level 4', rate: 0.2, amount: 2800000 },
                        { name: 'Tax level 5', rate: 0.25, amount: 5000000 },
                        { name: 'Tax level 6', rate: 0.3, amount: 6652166.4 }
                    ],
                    totalTax: 16402166.4,
                    netSalary: 68_771_721.6
                };
                assert.deepStrictEqual(actualPayslip, expectedPayslip);
            })

            test('It applies max threshold (78.4m) of region 2 for UI (1%)', function () {
                // SI: 8% of 29.8 million
                // HI: 1.5% of 29.8 million
                // UI (Region 2): 1% of 20 * 3.92 (78.4 million) 

                const actualPayslip = net(88_888_888, 0, 2, new Date("2023-06-01"));

                const expectedPayslip = {
                    gross: 88_888_888,
                    dependents: 0,
                    dependentDeductionAmount: 0,
                    region: 2,
                    insurances: [
                        {
                            amount: 2_384_000,
                            name: 'Social Insurance 8%'
                        },
                        {
                            amount: 447_000,
                            name: 'Health Insurance 1.5%'
                        },
                        {
                            amount: 784000,
                            name: 'Unemployment Insurance 1%'
                        },
                    ],
                    totalInsurance: 3615000,
                    afterInsurance: 85273888,
                    taxes: [
                        { name: 'Tax level 1', rate: 0.05, amount: 250000 },
                        { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                        { name: 'Tax level 3', rate: 0.15, amount: 1200000 },
                        { name: 'Tax level 4', rate: 0.2, amount: 2800000 },
                        { name: 'Tax level 5', rate: 0.25, amount: 5000000 },
                        { name: 'Tax level 6', rate: 0.3, amount: 6682166.4 }
                    ],
                    totalTax: 16432166.4,
                    netSalary: 68_841_721.6
                };
                assert.deepStrictEqual(actualPayslip, expectedPayslip);
            })

            test('It applies max threshold (68.6m) of region 3 for UI (1%)', function () {
                // SI: 8% of 29.8 million
                // HI: 1.5% of 29.8 million
                // UI (Region 3): 1% of 20 * 3.43 (68.6 million)

                const actualPayslip = net(88_888_888, 0, 3, new Date("2023-06-01"));

                const expectedPayslip = {
                    gross: 88_888_888,
                    dependents: 0,
                    dependentDeductionAmount: 0,
                    region: 3,
                    insurances: [
                        {
                            amount: 2_384_000,
                            name: 'Social Insurance 8%'
                        },
                        {
                            amount: 447_000,
                            name: 'Health Insurance 1.5%'
                        },
                        {
                            amount: 686000,
                            name: 'Unemployment Insurance 1%'
                        },
                    ],
                    totalInsurance: 3517000,
                    afterInsurance: 85371888,
                    taxes: [
                        { name: 'Tax level 1', rate: 0.05, amount: 250000 },
                        { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                        { name: 'Tax level 3', rate: 0.15, amount: 1200000 },
                        { name: 'Tax level 4', rate: 0.2, amount: 2800000 },
                        { name: 'Tax level 5', rate: 0.25, amount: 5000000 },
                        { name: 'Tax level 6', rate: 0.3, amount: 6711566.4 }
                    ],
                    totalTax: 16461566.4,
                    netSalary: 68910321.6
                };
                assert.deepStrictEqual(actualPayslip, expectedPayslip);
            })


            test('It applies max threshold (61.4m) of region 4 for UI (1%)', function () {
                // SI: 8% of 29.8 million
                // HI: 1.5% of 29.8 million
                // UI (Region 4): 1% of 20 * 3.07 (61.4 million)

                const actualPayslip = net(88_888_888, 0, 4, new Date("2023-06-01"));

                const expectedPayslip = {
                    gross: 88_888_888,
                    dependents: 0,
                    dependentDeductionAmount: 0,
                    region: 4,
                    insurances: [
                        {
                            amount: 2_384_000,
                            name: 'Social Insurance 8%'
                        },
                        {
                            amount: 447_000,
                            name: 'Health Insurance 1.5%'
                        },
                        {
                            amount: 614000,
                            name: 'Unemployment Insurance 1%'
                        },
                    ],
                    totalInsurance: 3445000,
                    afterInsurance: 85443888,
                    taxes: [
                        { name: 'Tax level 1', rate: 0.05, amount: 250000 },
                        { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                        { name: 'Tax level 3', rate: 0.15, amount: 1200000 },
                        { name: 'Tax level 4', rate: 0.2, amount: 2800000 },
                        { name: 'Tax level 5', rate: 0.25, amount: 5000000 },
                        { name: 'Tax level 6', rate: 0.3, amount: 6733166.4 }
                    ],
                    totalTax: 16483166.4,
                    netSalary: 68_960_721.6
                };
                assert.deepStrictEqual(actualPayslip, expectedPayslip);
            })
        })
        describe('After 1/7/2023', function () {

            test('Throw Exception when entering invalid region, after 1/7/2023', function () {
                assert.throws(function () {
                    net(93_678_123, 0, 10);
                }, Error, 'Invalid region entered. Please enter again! (1, 2, 3, 4)');
            })

            test('It applies 10.5% of Gross for all Insurance(SI 8%, HI 1.5% , UI 1%) when Gross Income is less than or equal 20 times Base Salary (36m)', function () {
                // Social Insurance (SI): 8% gross 
                // Health Insurance (HI): 1.5% gross
                // Unemployment Insurance (UI): 1% gross

                const actualPayslip = net(31_234_456);

                const expectedPayslip = {
                    gross: 31_234_456,
                    dependents: 0,
                    dependentDeductionAmount: 0,
                    region: 1,
                    insurances: [
                        {
                            amount: 2498756.48,
                            name: 'Social Insurance 8%'
                        },
                        {
                            amount: 468516.84,
                            name: 'Health Insurance 1.5%'
                        },
                        {
                            amount: 312344.56,
                            name: 'Unemployment Insurance 1%'
                        },
                    ],
                    totalInsurance: 3279617.88,
                    afterInsurance: 27954838.12,
                    taxes: [
                        { name: 'Tax level 1', rate: 0.05, amount: 250000 },
                        { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                        { name: 'Tax level 3', rate: 0.15, amount: 1043225.718 }
                    ],
                    totalTax: 1793225.718,
                    netSalary: 26_161_612.402
                };
                assert.deepStrictEqual(actualPayslip, expectedPayslip);
            })

            test('It applies max threshold (36m) for SI (8%) and HI (1.5%) when Gross between 36m and 93.6m', function () {
                // SI: 8% of 36 million
                // HI: 1.5% of 36 million
                // UI: 1% of Gross Income

                const actualPayslip = net(36_789_123);

                const expectedPayslip = {
                    gross: 36789123,
                    dependents: 0,
                    dependentDeductionAmount: 0,
                    region: 1,
                    insurances: [
                        {
                            amount: 2880000,
                            name: 'Social Insurance 8%'
                        },
                        {
                            amount: 540000,
                            name: 'Health Insurance 1.5%'
                        },
                        {
                            amount: 367891.23,
                            name: 'Unemployment Insurance 1%'
                        },
                    ],
                    totalInsurance: 3787891.23,
                    afterInsurance: 33001231.77,
                    taxes: [
                        { name: 'Tax level 1', rate: 0.05, amount: 250000 },
                        { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                        { name: 'Tax level 3', rate: 0.15, amount: 1200000 },
                        { name: 'Tax level 4', rate: 0.2, amount: 800246.354 }
                    ],
                    totalTax: 2750246.354,
                    netSalary: 30_250_985.416
                };
                assert.deepStrictEqual(actualPayslip, expectedPayslip);
            })

            test('It applies max threshold (93.6m) of region 1 for UI (1%)', function () {
                // SI: 8% of 36 million
                // HI: 1.5% of 36 million
                // UI (Region 1): 1% of 20 * 4.68 (93.6 million)
                const actualPayslip = net(93_600_000);

                const expectedPayslip = {
                    gross: 93_600_000,
                    dependents: 0,
                    dependentDeductionAmount: 0,
                    region: 1,
                    insurances: [
                        {
                            amount: 2880000,
                            name: 'Social Insurance 8%'
                        },
                        {
                            amount: 540000,
                            name: 'Health Insurance 1.5%'
                        },
                        {
                            amount: 936000,
                            name: 'Unemployment Insurance 1%'
                        },
                    ],
                    totalInsurance: 4356000,
                    afterInsurance: 89244000,
                    taxes: [
                        { name: 'Tax level 1', rate: 0.05, amount: 250000 },
                        { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                        { name: 'Tax level 3', rate: 0.15, amount: 1200000 },
                        { name: 'Tax level 4', rate: 0.2, amount: 2800000 },
                        { name: 'Tax level 5', rate: 0.25, amount: 5000000 },
                        { name: 'Tax level 6', rate: 0.3, amount: 7873200 }
                    ],
                    totalTax: 17623200,
                    netSalary: 71620800
                };
                assert.deepStrictEqual(actualPayslip, expectedPayslip);
            })

            test('It applies max threshold (83.2m) of region 2 for UI (1%)', function () {
                // SI: 8% of 36 million
                // HI: 1.5% of 36 million
                // UI (Region 2): 1% of 20 * 4.16 (83.2 million) 

                const actualPayslip = net(93_678_123, 0, 2);

                const expectedPayslip = {
                    gross: 93_678_123,
                    dependents: 0,
                    dependentDeductionAmount: 0,
                    region: 2,
                    insurances: [
                        {
                            amount: 2880000,
                            name: 'Social Insurance 8%'
                        },
                        {
                            amount: 540000,
                            name: 'Health Insurance 1.5%'
                        },
                        {
                            amount: 832_000,
                            name: 'Unemployment Insurance 1%'
                        },
                    ],
                    totalInsurance: 4252000,
                    afterInsurance: 89426123,
                    taxes: [
                        { name: 'Tax level 1', rate: 0.05, amount: 250000 },
                        { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                        { name: 'Tax level 3', rate: 0.15, amount: 1200000 },
                        { name: 'Tax level 4', rate: 0.2, amount: 2800000 },
                        { name: 'Tax level 5', rate: 0.25, amount: 5000000 },
                        { name: 'Tax level 6', rate: 0.3, amount: 7927836.9 }
                    ],
                    totalTax: 17677836.9,
                    netSalary: 71_748_286.1
                };
                assert.deepStrictEqual(actualPayslip, expectedPayslip);
            })

            test('It applies max threshold (72.8m) of region 3 for UI (1%)', function () {
                // SI: 8% of 36 million
                // HI: 1.5% of 36 million
                // UI (Region 3): 1% of 20 * 3.64 (72.8 million)

                const actualPayslip = net(95_000_000, 0, 3);

                const expectedPayslip = {
                    gross: 95_000_000,
                    dependents: 0,
                    dependentDeductionAmount: 0,
                    region: 3,
                    insurances: [
                        {
                            amount: 2880000,
                            name: 'Social Insurance 8%'
                        },
                        {
                            amount: 540000,
                            name: 'Health Insurance 1.5%'
                        },
                        {
                            amount: 728_000,
                            name: 'Unemployment Insurance 1%'
                        },
                    ],
                    totalInsurance: 4148000,
                    afterInsurance: 90_852_000,
                    taxes: [
                        { name: 'Tax level 1', rate: 0.05, amount: 250000 },
                        { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                        { name: 'Tax level 3', rate: 0.15, amount: 1200000 },
                        { name: 'Tax level 4', rate: 0.2, amount: 2800000 },
                        { name: 'Tax level 5', rate: 0.25, amount: 5000000 },
                        { name: 'Tax level 6', rate: 0.3, amount: 8_355_600 }
                    ],
                    totalTax: 18_105_600,
                    netSalary: 72_746_400
                };
                assert.deepStrictEqual(actualPayslip, expectedPayslip);
            })


            test('It applies max threshold (65m) of region 4 for UI (1%)', function () {
                // SI: 8% of 36 million
                // HI: 1.5% of 36 million
                // UI (Region 4): 1% of 20 * 3.25 (65 million)

                const actualPayslip = net(95_000_000, 0, 4);

                const expectedPayslip = {
                    gross: 95000000,
                    dependents: 0,
                    dependentDeductionAmount: 0,
                    region: 4,
                    insurances: [
                        {
                            amount: 2880000,
                            name: 'Social Insurance 8%'
                        },
                        {
                            amount: 540000,
                            name: 'Health Insurance 1.5%'
                        },
                        {
                            amount: 650000,
                            name: 'Unemployment Insurance 1%'
                        },
                    ],
                    totalInsurance: 4070000,
                    afterInsurance: 90930000,
                    taxes: [
                        { name: 'Tax level 1', rate: 0.05, amount: 250000 },
                        { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                        { name: 'Tax level 3', rate: 0.15, amount: 1200000 },
                        { name: 'Tax level 4', rate: 0.2, amount: 2800000 },
                        { name: 'Tax level 5', rate: 0.25, amount: 5000000 },
                        { name: 'Tax level 6', rate: 0.3, amount: 8379000 }
                    ],
                    totalTax: 18129000,
                    netSalary: 72801000
                };
                assert.deepStrictEqual(actualPayslip, expectedPayslip);
            })
        })
    });

    describe('Check Net salary with 7 rates of taxes: ', function () {

        /**
         * gross = NET + tax + inssurance
         * Case 1: inssurance + dont have taxableIncome
         * => NET = Gross - gross*10.5%
         * Case 2: inssurance + have taxableIncome ()
         * => NET = Gross - tax - gross*10.5% - dependents
         *
         */
        test('It applies no tax', function () {
            //afterInsurance below 11 million is tax-exempt.
            //Gross - 10.5% Gross < 11m (Personal deductions)
            // Gross < 12.29m

            const actualPayslip = net(12_000_000);
            const expectedPayslip = {
                gross: 12_000_000,
                dependents: 0,
                dependentDeductionAmount: 0,
                region: 1,
                insurances: [
                    {
                        amount: 960_000,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 180_000,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 120_000,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                totalInsurance: 1260000,
                afterInsurance: 10_740_000,
                taxes: [],
                totalTax: 0,
                netSalary: 10_740_000
            };
            assert.deepStrictEqual(actualPayslip, expectedPayslip);
        })

        test('It applies tax rate 1 only', function () {
            //11m < Gross - 10.5% Gross < 11m + 5m (tax level 1)
            //12.29m < Gross <17.87

            const actualPayslip = net(16_789_000);
            const expectedPayslip = {
                gross: 16_789_000,
                dependents: 0,
                dependentDeductionAmount: 0,
                region: 1,
                insurances: [
                    {
                        amount: 1_343_120,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 251_835,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 167_890,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                totalInsurance: 1762845,
                afterInsurance: 15026155,
                taxes: [
                    { name: 'Tax level 1', rate: 0.05, amount: 201307.75 }
                ],
                totalTax: 201307.75,
                netSalary: 14_824_847.25
            };
            assert.deepStrictEqual(actualPayslip, expectedPayslip);
        })

        test('It applies 2 first tax rates', function () {
            //16m < Gross - 10.5% Gross < 11m + 5m (tax level 1) +  5m (tax level 2)
            //17.87m <Gross < 23.46m
            const actualPayslip = net(20_050_280);
            const expectedPayslip = {
                gross: 20_050_280,
                dependents: 0,
                dependentDeductionAmount: 0,
                region: 1,
                insurances: [
                    {
                        amount: 1604022.4,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 300754.2,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 200502.8,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                totalInsurance: 2105279.4,
                afterInsurance: 17945000.6,

                taxes: [
                    { name: 'Tax level 1', rate: 0.05, amount: 250_000 },
                    { name: 'Tax level 2', rate: 0.1, amount: 194500.06 }
                ],
                totalTax: 444500.06,
                netSalary: 17500500.54
            };

            assert.deepStrictEqual(actualPayslip, expectedPayslip);
        })

        test('It applies 3 first tax rates', function () {
            //21m < Gross - 10.5% Gross < 11m + 5m (tax level 1) +  5m (tax level 2) + 8m (tax level 3)
            //23.46m < Gross < 32.4m
            const actualPayslip = net(29_050_280);
            const expectedPayslip = {
                gross: 29_050_280,
                dependents: 0,
                dependentDeductionAmount: 0,
                region: 1,
                insurances: [
                    {
                        amount: 2324022.4,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 435754.2,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 290502.8,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                totalInsurance: 3050279.4,
                afterInsurance: 26000000.6,
                taxes: [
                    { name: 'Tax level 1', rate: 0.05, amount: 250_000 },
                    { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                    { name: 'Tax level 3', rate: 0.15, amount: 750000.09 }
                ],
                totalTax: 1500000.09,
                netSalary: 24_500_000.51
            };
            assert.deepStrictEqual(actualPayslip, expectedPayslip);
        })

        test('It applies 4 first tax rates', function () {
            //29m < Gross - 10.5% Gross &&  Gross - 8%*36_000_000 - 1.5%*36_000_000 - 1%* Gross (Gross < 20 * regionMinWage) < 11m + 5m (tax level 1) +  5m (tax level 2) + 8m (tax level 3) + 14m (tax level 4)
            //32.402235m < Gross < 46_888_888,89
            const actualPayslip = net(32_402_236);

            const expectedPayslip = {
                gross: 32402236,
                dependents: 0,
                dependentDeductionAmount: 0,
                region: 1,
                insurances: [
                    {
                        amount: 2592178.88,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 486033.54,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 324022.36,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                totalInsurance: 3402234.78,
                afterInsurance: 29000001.22,
                taxes: [
                    { name: 'Tax level 1', rate: 0.05, amount: 250_000 },
                    { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                    { name: 'Tax level 3', rate: 0.15, amount: 1200000 },
                    { name: 'Tax level 4', rate: 0.2, amount: 0.244 }
                ],
                totalTax: 1950000.244,
                netSalary: 27050000.976
            };
            assert.deepStrictEqual(actualPayslip, expectedPayslip);
        })

        test('It applies 5 first tax rates', function () {
            //43m < Gross - 8%*36_000_000 - 1.5%*36_000_000 - 1%* Gross (Gross < 20 * regionMinWage) < 11m + 5m (tax level 1) +  5m (tax level 2) + 8m (tax level 3) + 14m (tax level 4) + 20m (tax level 5)
            //46_888_888,89m < Gross < 67_090_909,09m
            const actualPayslip = net(47_884_187);

            const expectedPayslip = {
                gross: 47884187,
                dependents: 0,
                dependentDeductionAmount: 0,
                region: 1,
                insurances: [
                    {
                        amount: 2880000,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 540000,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 478841.87,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                totalInsurance: 3898841.87,
                afterInsurance: 43985345.13,
                taxes: [
                    { name: 'Tax level 1', rate: 0.05, amount: 250_000 },
                    { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                    { name: 'Tax level 3', rate: 0.15, amount: 1200000 },
                    { name: 'Tax level 4', rate: 0.2, amount: 2800000 },
                    { name: 'Tax level 5', rate: 0.25, amount: 246336.2825 }
                ],
                totalTax: 4_996_336.2825,
                netSalary: 38_989_008.8475
            };
            assert.deepStrictEqual(actualPayslip, expectedPayslip);
        })

        test('It applies 6 first tax rates', function () {
            //63m < Gross - 8%*36_000_000 - 1.5%*36_000_000 - 1%* Gross (Gross < 20 * regionMinWage) < 11m + 5m (tax level 1) +  5m (tax level 2) + 8m (tax level 3) + 14m (tax level 4) + 20m (tax level 5) + 28m (tax level 6)
            //67_090_909,09m < Gross < 95_373_737,37m

            const actualPayslip = net(70_000_000);

            const expectedPayslip = {
                gross: 70_000_000,
                dependents: 0,
                dependentDeductionAmount: 0,
                region: 1,
                insurances: [
                    {
                        amount: 2880000,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 540000,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 700000,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                totalInsurance: 4120000,
                afterInsurance: 65880000,
                taxes: [
                    { name: 'Tax level 1', rate: 0.05, amount: 250_000 },
                    { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                    { name: 'Tax level 3', rate: 0.15, amount: 1200000 },
                    { name: 'Tax level 4', rate: 0.2, amount: 2800000 },
                    { name: 'Tax level 5', rate: 0.25, amount: 5000000 },
                    { name: 'Tax level 6', rate: 0.3, amount: 864000 }
                ],
                totalTax: 10614000,
                netSalary: 55266000
            };
            assert.deepStrictEqual(actualPayslip, expectedPayslip);
        });

        test('It applies with all 7 tax rates', function () {
            // Gross - 8%*36_000_000 - 1.5%*36_000_000 - 1% * 93_600_000 > 80m +11m
            // gross > 95_356_000
            const actualPayslip = net(100_000_000);

            const expectedPayslip = {
                gross: 100_000_000,
                dependents: 0,
                dependentDeductionAmount: 0,
                region: 1,
                insurances: [
                    {
                        amount: 2880000,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 540000,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 936_000,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                totalInsurance: 4356000,
                afterInsurance: 95644000,
                taxes: [
                    { name: 'Tax level 1', rate: 0.05, amount: 250_000 },
                    { name: 'Tax level 2', rate: 0.1, amount: 500000 },
                    { name: 'Tax level 3', rate: 0.15, amount: 1200000 },
                    { name: 'Tax level 4', rate: 0.2, amount: 2800000 },
                    { name: 'Tax level 5', rate: 0.25, amount: 5000000 },
                    { name: 'Tax level 6', rate: 0.3, amount: 8_400_000 },
                    { name: 'Tax level 7', rate: 0.35, amount: 1_625_400 }
                ],
                totalTax: 19775400,
                netSalary: 75_868_600
            };
            assert.deepStrictEqual(actualPayslip, expectedPayslip);
        })
    });
});

