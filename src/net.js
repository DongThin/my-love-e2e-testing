const Big = require('big.js');
const todayDate = new Date();
const calculateTaxes = require('./taxCalculator.js');
const calculateInsurances = require('./insurancesCalculator.js');

// I made this change

module.exports = function net(gross, dependents = 0, region = 1, date = todayDate) {
    return new Promise(function (resolve, reject) {

        const grossBig = new Big(gross);

        const payslip = {};
        payslip.gross = grossBig.toNumber();
        payslip.region = region;

        calculateInsurances(gross, region, date).then(function (insurancesInfo) {
            payslip.totalInsurance = insurancesInfo.total;
            payslip.insurances = insurancesInfo.insurances;

            const afterInsurance = grossBig.minus(Big(insurancesInfo.total));
            payslip.afterInsurance = afterInsurance.toNumber();

            payslip.dependents = dependents;
            payslip.dependentDeductionAmount = new Big(dependents * 4_400_000).toNumber();

            // Calculating taxable income
            let taxableIncome = afterInsurance.minus(new Big(11_000_000)).minus(payslip.dependentDeductionAmount);
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
