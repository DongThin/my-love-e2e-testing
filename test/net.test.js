const assert = require('assert');
const test = require('mocha').it;
const sinon = require('sinon');
const proxyquire = require("proxyquire");

describe("Calculate net salary", () => {
    let insurancesCalcStub;
    let taxCalcStub;
    let net;

    beforeEach(() => {
        insurancesCalcStub = sinon.stub();
        taxCalcStub = sinon.stub()

        net = proxyquire("../src/net.js", {
            "./insurancesCalculator.js": insurancesCalcStub,
            "./taxCalculator.js": taxCalcStub,
        });
    });

    afterEach(() => {
        sinon.restore();
    })

    describe('Check Dependent deduction', () => {
        //Personal Income Tax (PIT)
        const mockedInsurance = { total: 0, insurances: [] };
        const mockedTaxes = { totalTax: 0, rates: [] };
        beforeEach(() => {
            insurancesCalcStub.returns(Promise.resolve(mockedInsurance));
            // insurancesCalcStub.resolves(mockedInsurance);

            taxCalcStub.returns(
                new Promise((resolve, reject) => {
                    resolve(mockedTaxes);
                })
            )
        })

        afterEach(() => {
            sinon.restore();
        })

        test('No dependent deducted', async () => {
            //Gross income below 11 million is tax-exempt.
            const gross = 12_290_500;

            const expectedPayslip = {
                gross: gross,
                dependents: 0,
                dependentDeductionAmount: 0,
                region: 1,
                insurances: mockedInsurance.insurances,
                totalInsurance: mockedInsurance.total,
                afterInsurance: gross - mockedInsurance.total,
                taxes: mockedTaxes.rates,
                totalTax: mockedTaxes.totalTax,
                netSalary: gross - mockedTaxes.totalTax - mockedInsurance.total
            };

            await net(gross).then((result) => {
                assert.deepStrictEqual(result, expectedPayslip);
            })
            assert(taxCalcStub.calledWith(1_290_500));
        })

        test('Dependent with no taxable income', async () => {
            //afterInsurance below 11 million is tax-exempt.
            const gross = 12_290_500;

            const expectedPayslip = {
                gross: gross,
                dependents: 1,
                dependentDeductionAmount: 4400000,
                region: 1,
                insurances: mockedInsurance.insurances,
                totalInsurance: mockedInsurance.total,
                afterInsurance: gross - mockedInsurance.total,
                taxes: mockedTaxes.rates,
                totalTax: mockedTaxes.totalTax,
                netSalary: gross - mockedTaxes.totalTax - mockedInsurance.total
            };

            await net(gross, 1).then((result) => {
                assert.deepStrictEqual(result, expectedPayslip);
            })
            assert(taxCalcStub.calledWith(0));
        })

        test('Taxes fully deducted with dependents', async () => {
            //11m < Gross - 10.5% Gross  <= 11m (Personal deductions) + 4.4m * dependents (Dependent deductions)
            //12.29m < Gross <=17.2067m
            const gross = 16_000_000;

            const expectedPayslip = {
                gross: gross,
                dependents: 1,
                dependentDeductionAmount: 4400000,
                region: 1,
                insurances: mockedInsurance.insurances,
                totalInsurance: mockedInsurance.total,
                afterInsurance: gross - mockedInsurance.total,
                taxes: mockedTaxes.rates,
                totalTax: mockedTaxes.totalTax,
                netSalary: gross - mockedTaxes.totalTax - mockedInsurance.total
            };

            await net(gross, 1).then((result) => {
                assert.deepStrictEqual(result, expectedPayslip);
            })
            assert(taxCalcStub.calledWith(600_000));

        })

        test('Taxes partially deducted with dependents', async () => {
            //Gross - 10.5% Gross  > 11m (Personal deductions) + 4.4m * dependents (Dependent deductions)
            //Gross > 17.2067m
            const gross = 23_463_687;

            const expectedPayslip = {
                gross: gross,
                dependents: 1,
                dependentDeductionAmount: 4400000,
                region: 1,
                insurances: mockedInsurance.insurances,
                totalInsurance: mockedInsurance.total,
                afterInsurance: gross - mockedInsurance.total,
                taxes: mockedTaxes.rates,
                totalTax: mockedTaxes.totalTax,
                netSalary: gross - mockedTaxes.totalTax - mockedInsurance.total
            };

            await net(gross, 1).then((result) => {
                assert.deepStrictEqual(result, expectedPayslip);
            })
            assert(taxCalcStub.calledWith(8_063_687));
        })
    });

    describe('Check Insurance & Taxes deduction', () => {

        test('It should correctly deduct total Insurance and total tax', async () => {
            // Arrange
            const mockedInsurance = { total: 1, insurances: [] };
            const mockedTaxes = { totalTax: 2, rates: [] };

            const region = 3;
            const argDate = new Date("2023-06-01");

            insurancesCalcStub.withArgs(93_600_000, region, argDate).resolves(mockedInsurance);
            taxCalcStub.withArgs(82_599_999).resolves(mockedTaxes)

            // Act
            const actualPayslip = await net(93_600_000, 0, region, argDate);

            // Verify
            const expectedPayslip = {
                gross: 93_600_000,
                dependents: 0,
                dependentDeductionAmount: 0,
                region: region,
                insurances: mockedInsurance.insurances,
                totalInsurance: mockedInsurance.total,
                afterInsurance: actualPayslip.gross - mockedInsurance.total,
                taxes: mockedTaxes.rates,
                totalTax: mockedTaxes.totalTax,
                netSalary: actualPayslip.afterInsurance - mockedTaxes.totalTax
            };
            assert.deepStrictEqual(actualPayslip, expectedPayslip);
        })

        test('Ensure correct default argument passing for accurate insurance calculations', async () => {
            const mockedInsurance = { total: 0, insurances: [] };
            const mockedTaxes = { totalTax: 1, rates: [] };

            insurancesCalcStub.withArgs(93_600_000, 1).resolves(mockedInsurance)
            taxCalcStub.withArgs(82_600_000).resolves(mockedTaxes)

            const actualPayslip = await net(93_600_000);

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
            const argDate = insurancesCalcStub.getCall(0).args[2].toISOString().substring(0, 10);
            const expectedDate = new Date().toISOString().substring(0, 10);

            assert.equal(argDate, expectedDate)
        })

        test('Throw error message when having error calculating taxes', async () => {
            const mockedInsurance = { total: 0, insurances: [] };

            insurancesCalcStub.withArgs(93_600_000, 1).resolves(mockedInsurance)
            taxCalcStub.withArgs(82_600_000).rejects('Error calculating taxes')

            await net(93_600_000).catch(function (error) {
                assert.equal(error, 'Error calculating taxes')
            })
        })

        test('Throw error message when having error calculating insurances', async () => {

            insurancesCalcStub.withArgs(93_600_000, 1).rejects('Error calculating insurances')

            await net(93_600_000).catch(function (error) {
                assert.equal(error, 'Error calculating insurances')
            })
        })
    })
})
