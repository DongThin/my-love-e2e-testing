const Big = require('big.js');
const july23 = new Date("2023-07-01")
const calculateTaxes = require('./taxCalculator.js');
const inssuranceCalc = require('./insurancesCalculator.js');

module.exports = function net(gross, dependents = 0, region = 1, date = july23) {
    const grossBig = new Big(gross);

    const payslip = {};

    payslip.gross = grossBig.toNumber();

    payslip.region = region;

    const insurance = inssuranceCalc(gross, region, date);
    payslip.insurance = insurance;

    const afterInsurance = grossBig.minus(Big(insurance.totalInsurance));
    payslip.afterInsurance = afterInsurance.toNumber();

    payslip.dependents = dependents;
    payslip.dependentDeductionAmount = new Big(dependents * 4_400_000).toNumber();

    // Calculating taxable income
    let taxableIncome = afterInsurance.minus(new Big(11_000_000)).minus(payslip.dependentDeductionAmount);
    taxableIncome = Math.max(0, taxableIncome.toNumber());

    //Calculate totalTax && all level tax 
    const taxResult = calculateTaxes(taxableIncome);
    payslip.taxes = taxResult.rates;
    payslip.totalTax = taxResult.totalTax;

    payslip.netSalary = afterInsurance.minus(payslip.totalTax).toNumber();

    return payslip;
};
