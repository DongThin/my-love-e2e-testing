const assert = require('assert');
const test = require('mocha').it;
const net = require('../../src/net');
const sinon = require('sinon');
const proxyquire = require("proxyquire");

describe('Calculate Gross salary', function () {
    let insurancesGrossStub;
    let insurancesCalculatorStub;
    let taxableIncomeGrossStub;
    let taxesStub;
    let netToGross;

    const mockedInsuranceForGross = {totalInsurance: 1, insurances: [], grossFromIns: 10};
    const mockedInsurance = {totalInsurance: 1, insurances: [], grossFromIns: 10};
    const mockedTaxableIncome = 0;
    const mockedTaxes = {totalTax: 0, rates: []};

    beforeEach(function () {
        insurancesGrossStub = sinon.stub();
        insurancesCalculatorStub = sinon.stub();
        taxableIncomeGrossStub = sinon.stub();
        taxesStub = sinon.stub();

        netToGross = proxyquire('../../src/net-to-gross/netToGross.js', {
            './calcInsurance.js': insurancesGrossStub,
            '../insurancesCalculator.js': insurancesCalculatorStub,
            './calcTaxableIncome.js': taxableIncomeGrossStub,
            '../taxCalculator.js': taxesStub
        })

        insurancesGrossStub.resolves(mockedInsuranceForGross);
        insurancesCalculatorStub.resolves(mockedInsurance)
        taxableIncomeGrossStub.resolves(mockedTaxableIncome)
        taxesStub.resolves(mockedTaxes)
    });

    afterEach(function () {
        sinon.restore();
    })

    test('Gross should be equal 0 when Net is less than or equal 0', async function () {

        const inputNet = -19;
        await netToGross(inputNet).then(function (actual) {
            assert.equal(actual, 0)
        })
    });

    test('Verify Gross without Taxes', async function () {

        const inputNet = 11000000;
        const expectedPayslip = {
            dependents: 0,
            dependentDeductionAmount: 0,
            region: 1,
            totalTax: mockedTaxes.totalTax,
            taxes: mockedTaxes.rates,
            totalInsurance: mockedInsurance.totalInsurance,
            insurances: mockedInsurance.insurances,
            afterInsurance: 9,
            gross: mockedInsuranceForGross.grossFromIns,
            netSalary: inputNet
        }
        await netToGross(inputNet).then(function (actual) {
            assert.deepStrictEqual(actual, expectedPayslip)
        })
    })

    test('Verify the accurate calculation of Gross with tax Level 1 and insurance', async function () {
        // ti                   <= net + 5% * Min(ti, 5) - 11; Only if ti <= 5.
        // ti - 5% * Min(ti, 5) <= net - 11
        // ti - 5% ti           <= net - 11 
        // 95%*ti               <= net - 11
        // ti <= 5             ==> net <= 15.75
        const inputNet = 15_750_000
        const expectedPayslip = {
            dependents: 0,
            dependentDeductionAmount: 0,
            region: 1,
            totalTax: mockedTaxes.totalTax,
            taxes: mockedTaxes.rates,
            totalInsurance: mockedInsurance.totalInsurance,
            insurances: mockedInsurance.insurances,
            afterInsurance: 9,
            gross: mockedInsuranceForGross.grossFromIns,
            netSalary: inputNet
        }

        await netToGross(inputNet).then(function (actual) {
            assert.deepStrictEqual(actual, expectedPayslip)
        })
    })

    test('Verify the accurate calculation of Gross with tax Level 2 and insurance', async function () {
        // ti        <= net + 5% * 5 + 10% * Min(ti - 5, 5) - 11; Only if ti <= 10.
        // ti        <= net + 5% * 5 + 10% * (ti - 5) - 11
        // 0.9*ti    <= net - 11.25
        // ti <= 10  ==> net <= 20_250_000
        const inputNet = 16_000_000
        const expectedPayslip = {
            dependents: 0,
            dependentDeductionAmount: 0,
            region: 1,
            totalTax: mockedTaxes.totalTax,
            taxes: mockedTaxes.rates,
            totalInsurance: mockedInsurance.totalInsurance,
            insurances: mockedInsurance.insurances,
            afterInsurance: 9,
            gross: mockedInsuranceForGross.grossFromIns,
            netSalary: inputNet
        }

        await netToGross(inputNet).then(function (actual) {
            assert.deepStrictEqual(actual, expectedPayslip)
        })
    })

    test('Verify the accurate calculation of Gross with tax Level 3 and insurance', async function () {
        // ti        <= net + 5% * 5 + 10% * 5 + 15%*min(ti - 10, 8) - 11; Only if ti <= 18
        // 0.85*ti   <= net - 11.75
        // ti <= 18 ==> net <= 27_050_000
        const inputNet = 27_050_000
        const expectedPayslip = {
            dependents: 0,
            dependentDeductionAmount: 0,
            region: 1,
            totalTax: mockedTaxes.totalTax,
            taxes: mockedTaxes.rates,
            totalInsurance: mockedInsurance.totalInsurance,
            insurances: mockedInsurance.insurances,
            afterInsurance: 9,
            gross: mockedInsuranceForGross.grossFromIns,
            netSalary: inputNet
        }

        await netToGross(inputNet).then(function (actual) {
            assert.deepStrictEqual(actual, expectedPayslip)
        })
    })

    test('Verify the accurate calculation of Gross with tax Level 4 and insurance', async function () {
        // ti        <= net + 5% * 5 + 10% * 5 + 15%*8 + 20%*min(ti-18, 14)- 11; Only if ti <= 32
        // 0.8*ti    <= net - 12.65
        // ti <= 32 ==> net <= 38_250_000
        const inputNet = 32_794_000
        const expectedPayslip = {
            dependents: 0,
            dependentDeductionAmount: 0,
            region: 1,
            totalTax: mockedTaxes.totalTax,
            taxes: mockedTaxes.rates,
            totalInsurance: mockedInsurance.totalInsurance,
            insurances: mockedInsurance.insurances,
            afterInsurance: 9,
            gross: mockedInsuranceForGross.grossFromIns,
            netSalary: inputNet
        }

        await netToGross(inputNet).then(function (actual) {
            assert.deepStrictEqual(actual, expectedPayslip)
        })
    })

    test('Verify the accurate calculation of Gross with tax Level 5 and insurance', async function () {
        //Net<= 11_000_000
        //3992424.242424242
        const inputNet = 53_250_000
        const expectedPayslip = {
            dependents: 0,
            dependentDeductionAmount: 0,
            region: 1,
            totalTax: mockedTaxes.totalTax,
            taxes: mockedTaxes.rates,
            totalInsurance: mockedInsurance.totalInsurance,
            insurances: mockedInsurance.insurances,
            afterInsurance: 9,
            gross: mockedInsuranceForGross.grossFromIns,
            netSalary: inputNet
        }

        await netToGross(inputNet).then(function (actual) {
            assert.deepStrictEqual(actual, expectedPayslip)
        })
    })

    test('Verify the accurate calculation of Gross with tax Level 6 and insurance', async function () {
        // ti       <= net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*20 +30%(ti-52, 28) - 11; Only if ti <=80
        // 0.7*ti   <= net + 9.75 - 30%*52 -11
        // 0.7*ti   <= net - 16.85
        // ti <=80  ==> net <= 72_850_000
        const inputNet = 72_850_000
        const expectedPayslip = {
            dependents: 0,
            dependentDeductionAmount: 0,
            region: 1,
            totalTax: mockedTaxes.totalTax,
            taxes: mockedTaxes.rates,
            totalInsurance: mockedInsurance.totalInsurance,
            insurances: mockedInsurance.insurances,
            afterInsurance: 9,
            gross: mockedInsuranceForGross.grossFromIns,
            netSalary: inputNet
        }

        await netToGross(inputNet).then(function (actual) {
            assert.deepStrictEqual(actual, expectedPayslip)
        })
    })

    test('Verify the accurate calculation of Gross with tax Level 7 and insurance', async function () {
        // ti        > net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*20 +30%*28 + 35%*(ti-80) - 11; Only if ti > 80
        // 0.65*ti   > net +18.15 -35%*80 -11
        // 0.65*ti   > net - 20.85
        // ti > 80 ==> net > 72_850_000
        const inputNet = 84_000_000
        const expectedPayslip = {
            dependents: 0,
            dependentDeductionAmount: 0,
            region: 1,
            totalTax: mockedTaxes.totalTax,
            taxes: mockedTaxes.rates,
            totalInsurance: mockedInsurance.totalInsurance,
            insurances: mockedInsurance.insurances,
            afterInsurance: 9,
            gross: mockedInsuranceForGross.grossFromIns,
            netSalary: inputNet
        }

        await netToGross(inputNet).then(function (actual) {
            assert.deepStrictEqual(actual, expectedPayslip)
        })
    })
})