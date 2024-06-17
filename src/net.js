const Big = require('big.js');
const todayDate = new Date();
const calculateTaxes = require('./taxCalculator.js');
const calcInsuranceDetails = require('./insurancesCalculator.js');
const {SELF_DEDUCTION, DEDUCTION_PER_PERSON} = require("./salaryConstants");

module.exports = function net(gross, dependents = 0, region = 1, date = todayDate) {
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
            calculateTaxes(taxableIncome).then(function (taxResult) {
                payslip.taxes = taxResult.rates;
                payslip.totalTax = taxResult.totalTax;
                payslip.netSalary = afterInsurance.minus(payslip.totalTax).toNumber();

                resolve(payslip);

            }).catch(function (error) {
                reject('Error calculating taxes');
            })

        }).catch(function (error) {
            reject('Error calculating insurances');
        });
    })
}
