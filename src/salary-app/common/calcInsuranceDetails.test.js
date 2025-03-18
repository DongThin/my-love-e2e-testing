import assert from 'assert';
import {it as test} from 'mocha'
import * as sinon from "sinon";
import proxyquire from "proxyquire";
import Big from "../../lib/big.js";

describe('Calculate Insurances', async () => {

    describe('It applies update of 1/7/2022', function () {

        let insurancesCalculator;
        let findInsurancePolicyStub;

        beforeEach(() => {
            findInsurancePolicyStub = sinon.stub();
            insurancesCalculator = proxyquire('./calcInsuranceDetails', {
                './findInsurancePolicy': {
                    default: findInsurancePolicyStub
                }
            }).default;

        });

        afterEach(() => {
            sinon.restore();
        })

        const jun23 = new Date("2023-06-01");
        const july23 = new Date("2023-07-01");

        test('It applies 10.5% of Gross for all Insurance(Social Insurance 8%, Health Insurance 1.5% , Unemployment Insurance 1%) ' +
            'when Gross Income is lte 20 times Base Salary (29.8m)', async () => {

            //Gross Income <= 29.8 million:
            // Social Insurance (Social Insurance): 8% Gross
            // Health Insurance (Health Insurance): 1.5% Gross
            // Unemployment Insurance (Unemployment Insurance): 1% Gross
            const mockedPolicy = {
                baseSalary: new Big(1_800_000),
                minWage: 4_680_000
            };

            findInsurancePolicyStub.returns(mockedPolicy);

            const actualInsurances = await insurancesCalculator(1, 1, july23);
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


        test('It applies max threshold (29.8m) for Social Insurance (8%) and Health Insurance (1.5%) ' +
            'when Gross between 29.8m and 88.4m', async () => {
            // Social Insurance: 8% of 29.8 million
            // Health Insurance: 1.5% of 29.8 million
            // Unemployment Insurance: 1% of Gross Income

            const mockedPolicy = {
                baseSalary: new Big(1_800_000),
                minWage: 4_680_000
            };

            findInsurancePolicyStub.returns(mockedPolicy);

            const actualInsurances = await insurancesCalculator(29_900_000, 1, july23);
            const expectedInsurances = {
                insurances: [
                    {
                        amount: 2392000,
                        name: 'Social Insurance 8%'
                    },
                    {
                        amount: 448500,
                        name: 'Health Insurance 1.5%'
                    },
                    {
                        amount: 299_000,
                        name: 'Unemployment Insurance 1%'
                    },
                ],
                total: 3139500
            }

            assert.deepStrictEqual(actualInsurances, expectedInsurances)
        })

        test('It applies max threshold (88.4m) of region 1 for Unemployment Insurance (1%)', async () => {
            // Social Insurance: 8% of 29.8 million
            // Health Insurance: 1.5% of 29.8 million
            // Unemployment Insurance (Region 1): 1% of 20 * 4.42 (88.4 million)

            const mockedPolicy = {
                baseSalary: new Big(1_490_000),
                minWage: 4_420_000
            };

            findInsurancePolicyStub.returns(mockedPolicy);

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

        test('It applies max threshold (78.4m) of region 2 for Unemployment Insurance (1%)', async () => {
            // Social Insurance: 8% of 29.8 million
            // Health Insurance: 1.5% of 29.8 million
            // Unemployment Insurance (Region 2): 1% of 20 * 3.92 (78.4 million)

            const mockedPolicy = {
                baseSalary: new Big(1_490_000),
                minWage: 3_920_000
            };

            findInsurancePolicyStub.returns(mockedPolicy);
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
        test('It applies max threshold (68.6m) of region 3 for Unemployment Insurance (1%)', async () => {
            // Social Insurance: 8% of 29.8 million
            // Health Insurance: 1.5% of 29.8 million
            // Unemployment Insurance (Region 3): 1% of 20 * 3.43 (68.6 million)

            const mockedPolicy = {
                baseSalary: new Big(1_490_000),
                minWage: 3_430_000
            };

            findInsurancePolicyStub.returns(mockedPolicy);
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

        test('It applies max threshold (61.4m) of region 4 for Unemployment Insurance (1%)', async () => {
            // Social Insurance: 8% of 29.8 million
            // Health Insurance: 1.5% of 29.8 million
            // Unemployment Insurance (Region 4): 1% of 20 * 3.07 (61.4 million)

            const mockedPolicy = {
                baseSalary: new Big(1_490_000),
                minWage: 3_070_000
            };

            findInsurancePolicyStub.returns(mockedPolicy);
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

        const invalidRegionError = new Error('Invalid region entered. Please enter again! (1, 2, 3, 4)');
        test('Throw Exception when entering invalid region', async () => {

            findInsurancePolicyStub.throws(invalidRegionError);

            await assert.rejects(
                insurancesCalculator(88_888_888, 5, july23),
                invalidRegionError
            );
        })

        const salaryPolicyNotFoundError = new Error('There is no salary policy available for the date provided');
        test('Throw Exception when there is no salary policy available for the date provided', async () => {

            findInsurancePolicyStub.throws(salaryPolicyNotFoundError);
            await assert.rejects(
                insurancesCalculator(88_888_888, 3, new Date("2021-01-01")),
                salaryPolicyNotFoundError
            );
        })


        describe('It applies update of 1/7/2023', async () => {

            let insurancesCalculator;
            let findInsurancePolicyStub;

            beforeEach(() => {
                findInsurancePolicyStub = sinon.stub();
                insurancesCalculator = proxyquire('./calcInsuranceDetails', {
                    './findInsurancePolicy': {
                        default: findInsurancePolicyStub
                    }
                }).default;

                // findInsurancePolicyStub.resolves(mockedPolicy);

            });

            afterEach(() => {
                sinon.restore();
            })

            test('It applies 10.5% of Gross for all Insurance(Social Insurance 8%, Health Insurance 1.5% , Unemployment Insurance 1%)' +
                ' when Gross Income is less than or equal 20 times Base Salary (36m)', async () => {
                // Social Insurance (Social Insurance): 8% gross
                // Health Insurance (Health Insurance): 1.5% gross
                // Unemployment Insurance (Unemployment Insurance): 1% gross

                const mockedPolicy = {
                    baseSalary: new Big(1_800_000),
                    minWage: 4_680_000
                };

                findInsurancePolicyStub.returns(mockedPolicy);

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

            test('It applies max threshold (36m) for Social Insurance (8%) and Health Insurance (1.5%) ' +
                'when Gross between 36m and 93.6m', async () => {
                // Social Insurance: 8% of 36 million
                // Health Insurance: 1.5% of 36 million
                // Unemployment Insurance: 1% of Gross Income

                const mockedPolicy = {
                    baseSalary: new Big(1_800_000),
                    minWage: 4_680_000
                };

                findInsurancePolicyStub.returns(mockedPolicy);

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

            test('It applies max threshold (93.6m) of region 1 for Unemployment Insurance (1%)', async () => {
                // Social Insurance: 8% of 36 million
                // Health Insurance: 1.5% of 36 million
                // Unemployment Insurance (Region 1): 1% of 20 * 4.68 (93.6 million)

                const mockedPolicy = {
                    baseSalary: new Big(1_800_000),
                    minWage: 4_680_000
                };

                findInsurancePolicyStub.returns(mockedPolicy);

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

            test('It applies max threshold (83.2m) of region 2 for Unemployment Insurance (1%)', async () => {
                // Social Insurance: 8% of 36 million
                // Health Insurance: 1.5% of 36 million
                // Unemployment Insurance (Region 2): 1% of 20 * 4.16 (83.2 million)

                const mockedPolicy = {
                    baseSalary: new Big(1_800_000),
                    minWage: 4_160_000
                };

                findInsurancePolicyStub.returns(mockedPolicy);

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

            test('It applies max threshold (72.8m) of region 3 for Unemployment Insurance (1%)', async () => {
                // Social Insurance: 8% of 36 million
                // Health Insurance: 1.5% of 36 million
                // Unemployment Insurance (Region 3): 1% of 20 * 3.64 (72.8 million)
                const mockedPolicy = {
                    baseSalary: new Big(1_800_000),
                    minWage: 3_640_000
                };

                findInsurancePolicyStub.returns(mockedPolicy);

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

            test('It applies max threshold (65m) of region 4 for Unemployment Insurance (1%)', async () => {
                // Social Insurance: 8% of 36 million
                // Health Insurance: 1.5% of 36 million
                // Unemployment Insurance (Region 4): 1% of 20 * 3.25 (65 million)

                const mockedPolicy = {
                    baseSalary: new Big(1_800_000),
                    minWage: 3_250_000
                };

                findInsurancePolicyStub.returns(mockedPolicy);

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
        })
    })
})


