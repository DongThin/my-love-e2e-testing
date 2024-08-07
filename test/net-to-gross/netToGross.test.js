const assert = require('assert');
const test = require('mocha').it;
const sinon = require('sinon');
const proxyquire = require("proxyquire");

describe('Net to Gross', function () {
    let calcTotalInsuranceStub;
    let calcInsDetailsStub;
    let calcTaxableIncome;
    let calculateTaxesStub;
    let netToGross;

    const mockedTotalInsurance = {total: 1, gross: 10};
    const mockedInsDetailsStub = {total: 1, insurances: []};
    const mockedTaxableIncome = 0;
    const mockedTaxes = {totalTax: 0, rates: []};

    beforeEach(function () {
        calcTotalInsuranceStub = sinon.stub();
        calcInsDetailsStub = sinon.stub();
        calcTaxableIncome = sinon.stub();
        calculateTaxesStub = sinon.stub();

        netToGross = proxyquire('../../src/net-to-gross/netToGross.js', {
            './calcTotalInsurance.js': calcTotalInsuranceStub,
            '../insurancesCalculator.js': calcInsDetailsStub,
            './calcTaxableIncome.js': calcTaxableIncome,
            '../taxCalculator.js': calculateTaxesStub
        })

        calcTotalInsuranceStub.resolves(mockedTotalInsurance);
        calcInsDetailsStub.resolves(mockedInsDetailsStub)
        calcTaxableIncome.resolves(mockedTaxableIncome)
        calculateTaxesStub.resolves(mockedTaxes)
    });

    afterEach(function () {
        sinon.restore();
    })

    test(' should be equal 0 when Net is less than or equal 0', async function () {

        const inputNet = -19;
        await netToGross(inputNet).then(function (actual) {
            assert.equal(actual.gross, 0)
        })
    });

    test('It should calculate gross income accurately', async function () {
        const inputNet = 1_000_000_000_000
        const expectedPayslip = {
            dependents: 0,
            dependentDeductionAmount: 0,
            region: 1,
            totalTax: mockedTaxes.totalTax,
            taxes: mockedTaxes.rates,
            totalInsurance: mockedInsDetailsStub.total,
            insurances: mockedInsDetailsStub.insurances,
            afterInsurance: 9,
            gross: mockedTotalInsurance.gross,
            netSalary: inputNet
        }

        await netToGross(inputNet).then(function (actual) {
            assert.deepStrictEqual(actual, expectedPayslip)
        })
    })

})