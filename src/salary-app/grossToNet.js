import Big from "../lib/big.js";
import calcTaxes from './common/calcTaxes.js';
import calcInsuranceDetails from './common/calcInsuranceDetails.js';
import {SELF_DEDUCTION, DEDUCTION_PER_PERSON} from './common/salaryConstants.js';

const todayDate = new Date();
export default function grossToNet(gross, dependents = 0, region = 1, date = todayDate) {
    return new Promise(function (resolve, reject) {

        const grossBig = new Big(gross);

        const payslip = {};
        payslip.gross = grossBig.toNumber();
        payslip.region = region;

        calcInsuranceDetails(gross, region, date).then(function (insurancesInfo) {
            payslip.totalInsurance = insurancesInfo.total;
            payslip.insurances = insurancesInfo.insurances;

            const afterInsurance = grossBig.minus(Big(insurancesInfo.total));
            payslip.afterInsurance = afterInsurance.toNumber();

            payslip.dependents = dependents;
            payslip.dependentDeductionAmount = new Big(dependents * DEDUCTION_PER_PERSON).toNumber();

            // Calculating taxable income
            let taxableIncome = afterInsurance.minus(new Big(SELF_DEDUCTION)).minus(payslip.dependentDeductionAmount);
            taxableIncome = Math.max(0, taxableIncome.toNumber());

            //Calculate totalTax && all level tax 
            calcTaxes(taxableIncome).then(function (taxResult) {
                payslip.taxes = taxResult.rates;
                payslip.totalTax = taxResult.totalTax;
                payslip.netSalary = afterInsurance.minus(payslip.totalTax).toNumber();

                resolve(payslip);

            }).catch(function (error) {
                reject('Error calculating taxes');
            })

        }).catch(function (error) {
            console.log(error)
            reject('Error calculating insurances');
        });
    })
}
