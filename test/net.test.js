const net = require('../src/net.js')
const assert = require('assert');
const test = require('mocha').it;
const sinon = require('sinon');
var proxyquire = require("proxyquire");

describe("Calculate net salary", function () {

    describe('Check Dependent deduction', function () {
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

    describe('Check Insurance & Taxes deduction', function () {

        beforeEach(function () {
            insurancesCalcStub = sinon.stub();
            mockedInsurance = { total: 0, insurances: [] };

            taxCalcStub = sinon.stub()
            mockedTaxes = { totalTax: 1, rates: [] };
        });

        afterEach(function () {
            sinon.restore();
        })

        describe('Before 1/7/2023', function () {

            test('It should correctly deduct total Insurance and total tax when there are no taxes', function () {
                // Social Insurance (SI): 8% Gross
                // Health Insurance (HI): 1.5% Gross
                // Unemployment Insurance (UI): 1% Gross

                insurancesCalcStub.withArgs(10, 1, new Date("2023-06-01")).returns(mockedInsurance)
                taxCalcStub.withArgs(0).returns(mockedTaxes)

                const mockedModules = {
                    "./insurancesCalculator.js": insurancesCalcStub,
                    "./taxCalculator.js": taxCalcStub,
                }
                const net = proxyquire("../src/net.js", mockedModules);
                const actualPayslip = net(10, 0, 1, new Date("2023-06-01"));

                const expectedPayslip = {
                    gross: 10,
                    dependents: 0,
                    dependentDeductionAmount: 0,
                    region: 1,
                    insurances: mockedInsurance.insurances,
                    totalInsurance: mockedInsurance.total,
                    afterInsurance: actualPayslip.gross - mockedInsurance.total,
                    taxes: mockedTaxes.rates,
                    totalTax: mockedTaxes.totalTax,
                    netSalary: actualPayslip.afterInsurance - mockedTaxes.totalTax
                };
                assert.deepStrictEqual(actualPayslip, expectedPayslip);
            })

            test('It should correctly deduct total Insurance and total tax when there are taxes', function () {
                // Social Insurance (SI): 8% Gross
                // Health Insurance (HI): 1.5% Gross
                // Unemployment Insurance (UI): 1% Gross

                insurancesCalcStub.withArgs(93_600_000, 1, new Date("2023-06-01")).returns(mockedInsurance)
                taxCalcStub.returns(mockedTaxes)

                const mockedModules = {
                    "./insurancesCalculator.js": insurancesCalcStub,
                    "./taxCalculator.js": taxCalcStub,
                }
                const net = proxyquire("../src/net.js", mockedModules);
                const actualPayslip = net(93_600_000, 0, 1, new Date("2023-06-01"));

                const expectedPayslip = {
                    gross: 93_600_000,
                    dependents: 0,
                    dependentDeductionAmount: 0,
                    region: 1,
                    insurances: mockedInsurance.insurances,
                    totalInsurance: mockedInsurance.total,
                    afterInsurance: actualPayslip.gross - mockedInsurance.total,
                    taxes: mockedTaxes.rates,
                    totalTax: mockedTaxes.totalTax,
                    netSalary: actualPayslip.afterInsurance - mockedTaxes.totalTax
                };
                assert.deepStrictEqual(actualPayslip, expectedPayslip);
            })
        })

        describe('After 1/7/2023', function () {

            test('It should correctly deduct total Insurance when there are no taxes', function () {
                // Social Insurance (SI): 8% Gross
                // Health Insurance (HI): 1.5% Gross
                // Unemployment Insurance (UI): 1% Gross

                insurancesCalcStub.withArgs(10, 1).returns(mockedInsurance)
                taxCalcStub.withArgs(0).returns(mockedTaxes)

                const mockedModules = {
                    "./insurancesCalculator.js": insurancesCalcStub,
                    "./taxCalculator.js": taxCalcStub,
                }
                const net = proxyquire("../src/net.js", mockedModules);
                const actualPayslip = net(10);

                const expectedPayslip = {
                    gross: 10,
                    dependents: 0,
                    dependentDeductionAmount: 0,
                    region: 1,
                    insurances: mockedInsurance.insurances,
                    totalInsurance: mockedInsurance.total,
                    afterInsurance: actualPayslip.gross - mockedInsurance.total,
                    taxes: mockedTaxes.rates,
                    totalTax: mockedTaxes.totalTax,
                    netSalary: actualPayslip.afterInsurance - mockedTaxes.totalTax
                };
                assert.deepStrictEqual(actualPayslip, expectedPayslip);
            })

            test('It should correctly deduct total Insurance and total Tax when there are taxes', function () {
                // Social Insurance (SI): 8% Gross
                // Health Insurance (HI): 1.5% Gross
                // Unemployment Insurance (UI): 1% Gross

                insurancesCalcStub.withArgs(93_600_000).returns(mockedInsurance)
                taxCalcStub.returns(mockedTaxes)

                const mockedModules = {
                    "./insurancesCalculator.js": insurancesCalcStub,
                    "./taxCalculator.js": taxCalcStub,
                }
                const net = proxyquire("../src/net.js", mockedModules);
                const actualPayslip = net(93_600_000);

                const expectedPayslip = {
                    gross: 93_600_000,
                    dependents: 0,
                    dependentDeductionAmount: 0,
                    region: 1,
                    insurances: mockedInsurance.insurances,
                    totalInsurance: mockedInsurance.total,
                    afterInsurance: actualPayslip.gross - mockedInsurance.total,
                    taxes: mockedTaxes.rates,
                    totalTax: mockedTaxes.totalTax,
                    netSalary: actualPayslip.afterInsurance - mockedTaxes.totalTax
                };
                assert.deepStrictEqual(actualPayslip, expectedPayslip);
            })
        });
    })
})

