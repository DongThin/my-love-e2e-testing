import assert from 'assert';
import sinon from "sinon";
import * as calcTaxesModule from "./common/calcTaxes";
import grossToNet from "./grossToNet";
import *as calcInsuranceDetailsModule from './common/calcInsuranceDetails';

describe('Gross to Net Integration', () => {

    afterEach(() => {
        sinon.restore();
    })

    it('Should be able to get all net integrations', async () => {
        const spyCalcTaxes = sinon.spy(calcTaxesModule, "default");
        const spyInsurance = sinon.spy(calcInsuranceDetailsModule, "default")

        const actual = await grossToNet(17_000_000);

        assert.deepStrictEqual(actual, {
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
        });

        assert.equal(spyCalcTaxes.args[0], 4_215_000);
        assert.equal(spyCalcTaxes.callCount, 1)

        // assert.equal(spyInsurance.args[0], 17000000);
        const socialInsurance = actual.insurances.find(insurance => insurance.name === 'Social Insurance 8%');
        assert.equal(socialInsurance.amount, 1360000);
    })

})