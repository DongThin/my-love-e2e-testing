const Big = require('big.js');
const todayDate = new Date();
const calculateTaxes = require('./taxCalculator.js');
const insurancesCalcGross = require('./insurancesCalcGross.js');
const calculateTaxableIncome = require('./taxableIncomeCalcGross.js');
const insurancesCalculator = require('./insurancesCalculator.js');

module.exports = async function gross(net, dependentCount = 0, region = 1, date = todayDate) {

    const netBig = new Big(net)
    if (netBig.lte(0)) {
        return 0
    }

    const payslip = {};

    //gross = net + totalTax + Insurances 
    payslip.dependents = dependentCount;
    payslip.dependentDeductionAmount = dependentCount * 4400000;

    const taxableIncome = await calculateTaxableIncome(net, dependentCount)
    const taxes = await calculateTaxes(taxableIncome);

    payslip.totalTax = taxes.totalTax;
    payslip.taxes = taxes.rates;

    //Gross = net + totalTax + Insurance
    const insurance = await insurancesCalcGross(net, taxes.totalTax, region, date)
    payslip.totalInsurance = insurance.totalInsurance
    payslip.gross = insurance.grossFromIns;
    payslip.netSalary = net;

    const findInsuranceItem = insurancesCalculator(payslip.gross)
    payslip.insurances = (await findInsuranceItem).insurances;
    payslip.afterInsurance = Big(payslip.gross).minus(payslip.totalInsurance).toNumber();
    payslip.region = region;
    return payslip
}

// ti = net + 5% *min(ti, 5) - 11
// ti = net + 5% * 5 + 10% *min(ti - 5, 5) - 11
// ti = net + 5% * 5 + 10% * 5 + 15%*min(ti - 10, 8) - 11
// ti = net + 5% * 5 + 10% * 5 + 15%*8 + 20%*min(ti-18, 14)- 11
// ti = net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*min(ti-32, 20) - 11
// ti = net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*20 +30%*min(ti-52, 28) - 11
// ti = net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*20 +30%*28 + 35%*min(ti-80) - 11

// ti = (net - 11)/ 0.95 Only if ti <= 5.  15.75
// ti = (net - 11.25)/0.9 Only if ti <= 10.  20.25
// ti = (net - 11.75)/0.85 Only if ti <= 18. 27.05
// ti = (net -12.65)/0.8 Only if ti <= 32.  38.25
// ti = (net -14.25)/0.75 Only if ti <= 52  53.25
// ti = (net -16.85)/0.7 if ti <= 80  72.85
// ti = (net -20.85)/0.65 if ti > 80 > 72.85
