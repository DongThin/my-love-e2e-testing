import Big from 'big.js';
import calcTaxes from '../common/calcTaxes';
import calcTotalInsurance from './calcTotalInsurance';
import calcTaxableIncome from './calcTaxableIncome';
import calcInsDetails from '../common/calcInsuranceDetails';
import {DEDUCTION_PER_PERSON} from '../common/salaryConstants';

// Single source of truth
export default async function netToGross(net, dependentCount = 0, region = 1, date = new Date()) {

    const netBig = new Big(net)
    const payslip = {};

    if (netBig.lte(0)) {
        payslip.gross = 0;
        return payslip
    }

    payslip.netSalary = net;
    payslip.region = region;
    payslip.dependents = dependentCount;
    payslip.dependentDeductionAmount = dependentCount * DEDUCTION_PER_PERSON;

    const taxableIncome = await calcTaxableIncome(net, dependentCount)
    const taxes = await calcTaxes(taxableIncome);

    payslip.totalTax = taxes.totalTax;
    payslip.taxes = taxes.rates;

    const totalIns = await calcTotalInsurance(net, payslip.totalTax, region, date)
    payslip.totalInsurance = totalIns.total
    payslip.gross = totalIns.gross;
    payslip.afterInsurance = new Big(payslip.gross).minus(payslip.totalInsurance).toNumber();

    const insuranceDetails = await calcInsDetails(payslip.gross)
    payslip.insurances = insuranceDetails.insurances

    return payslip
}

