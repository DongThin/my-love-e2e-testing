import Big from "../lib/big.js";
import calcTaxes from './common/calcTaxes.js';
import calcInsuranceDetails from './common/calcInsuranceDetails.js';
import {SELF_DEDUCTION, DEDUCTION_PER_PERSON} from './common/salaryConstants.js';

const todayDate = new Date();

/**
 * Calculates the net salary from gross salary considering insurance, dependents, and taxes
 * 
 * @param {number} gross - The gross salary amount
 * @param {number} [dependents=0] - Number of dependents for tax deduction
 * @param {(1|2|3|4)} [region=1] - Region code for insurance calculation (must be 1, 2, 3, or 4)
 * @param {Date} [date=todayDate] - Date for calculating insurance rates, defaults to current date
 * @returns {Promise<{
*   gross: number,
*   region: number,
*   totalInsurance: number,
*   insurances: Object,
*   afterInsurance: number,
*   dependents: number,
*   dependentDeductionAmount: number,
*   taxes: Array,
*   totalTax: number,
*   netSalary: number
* }>} Promise that resolves with the payslip object containing all salary calculations
* @throws {Error} When there's an error calculating insurances or taxes
*/

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
                reject(new Error('Error calculating taxes'));
            })

        }).catch(function (error) {
            reject(new Error('Error calculating insurances'));
        });
    })
}
