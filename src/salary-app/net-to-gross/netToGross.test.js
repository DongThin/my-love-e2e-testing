import assert from 'assert';
import {it as test} from 'mocha';
import * as sinon from 'sinon';
import proxyquire from 'proxyquire';

describe('Net to Gross', () =>{
    let calcTotalInsuranceStub;
    let calcInsDetailsStub;
    let calcTaxableIncome;
    let calculateTaxesStub;
    let netToGross;

    const mockedTotalInsurance = {total: 1, gross: 10};
    const mockedInsDetailsStub = {total: 1, insurances: []};
    const mockedTaxableIncome = 0;
    const mockedTaxes = {totalTax: 0, rates: []};

    beforeEach(() => {
        calcTotalInsuranceStub = sinon.stub();
        calcInsDetailsStub = sinon.stub();
        calcTaxableIncome = sinon.stub();
        calculateTaxesStub = sinon.stub();

        netToGross = proxyquire('./netToGross', {
            './calcTotalInsurance': {
                default: calcTotalInsuranceStub
            },
            '../common/insurancesCalculator': {
                default: calcInsDetailsStub
            },
            './calcTaxableIncome': {
                default: calcTaxableIncome
            },
            '../common/taxCalculator': {
                default: calculateTaxesStub
            }
        }).default;

        calcTotalInsuranceStub.resolves(mockedTotalInsurance);
        calcInsDetailsStub.resolves(mockedInsDetailsStub)
        calcTaxableIncome.resolves(mockedTaxableIncome)
        calculateTaxesStub.resolves(mockedTaxes)
    });

    afterEach(() => {
        sinon.restore();
    })

    test(' should be equal 0 when Net is less than or equal 0', async () => {

        const inputNet = -19;
        await netToGross(inputNet).then(function (actual) {
            assert.equal(actual.gross, 0)
        })
    });

    test('It should calculate gross income accurately', async () => {
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

        await netToGross(inputNet).then((actual) => {
            assert.deepStrictEqual(actual, expectedPayslip)
        })
    })

})