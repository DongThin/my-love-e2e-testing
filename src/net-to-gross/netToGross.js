const Big = require('big.js');
const todayDate = new Date();
const calculateTaxes = require('../taxCalculator.js');
const insurancesCalcGross = require('./calcInsurance.js');
const calcTaxableIncome = require('./calcTaxableIncome.js');
const calcInsurance = require('../insurancesCalculator.js');

module.exports = async function netToGross(net, dependentCount = 0, region = 1, date = todayDate) {

    const netBig = new Big(net)
    const payslip = {};

    if (netBig.lte(0)) {
        payslip.gross = 0;
        return payslip
    }

    payslip.dependents = dependentCount;
    payslip.dependentDeductionAmount = dependentCount * 4400000;

    const taxableIncome = await calcTaxableIncome(net, dependentCount)
    const taxes = await calculateTaxes(taxableIncome);

    payslip.totalTax = taxes.totalTax;
    payslip.taxes = taxes.rates;

    const insurance = await insurancesCalcGross(net, payslip.totalTax, region, date)
    payslip.totalInsurance = insurance.totalInsurance
    payslip.gross = insurance.grossFromIns;
    payslip.afterInsurance = new Big(payslip.gross).minus(payslip.totalInsurance).toNumber();
    payslip.netSalary = net;

    const ins =await calcInsurance(payslip.gross)
    payslip.insurances = ins.insurances
    payslip.region = region;

    return payslip
}

