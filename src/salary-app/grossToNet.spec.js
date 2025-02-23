import assert from 'assert';
import sinon from 'sinon';
import * as calcTaxesModule from "./common/calcTaxes";
import grossToNet from "./grossToNet";
import * as calcInsuranceDetailsModule from './common/calcInsuranceDetails';

describe('Gross to Net Integration', () => {

    afterEach(() => {
        sinon.restore();
    })

    it('should correctly calculate net salary and verify that ' +
        'calcTaxesModule and calcInsuranceDetailsModule are called with the correct arguments ', async () => {
        const spyCalcTaxes = sinon.spy(calcTaxesModule, "default");
        const spyInsurance = sinon.spy(calcInsuranceDetailsModule, "default")

        const actual = await grossToNet(17_000_000);
        const expect = {
            "afterInsurance": 15215000,
            "dependentDeductionAmount": 0,
            "dependents": 0,
            "gross": 17000000,
            "insurances": [
                {
                    "amount": 1360000,
                    "name": "Social Insurance 8%"
                },
                {
                    "amount": 255000,
                    "name": "Health Insurance 1.5%"
                },
                {
                    "amount": 170000,
                    "name": "Unemployment Insurance 1%"
                }
            ],
            "netSalary": 15004250,
            "region": 1,
            "taxes": [
                {
                    "amount": 210750,
                    "name": "Tax level 1",
                    "rate": 0.05
                }
            ],
            "totalInsurance": 1785000,
            "totalTax": 210750
        }

        assert.deepStrictEqual(actual, expect);

        assert.equal(spyCalcTaxes.args[0], 4215000);
        assert.equal(spyCalcTaxes.callCount, 1)

        spyInsurance.calledWithMatch(17000000, 1, new Date());
    })
})