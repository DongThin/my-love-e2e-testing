const Big = require('big.js');
const july23 = new Date("2023-07-01")
const calculateTaxes = require('./taxCalculator.js')

module.exports = function net(gross, dependents = 0, region = 1, date = july23) {
    const grossBig = new Big(gross);

    const payslip = {};

    payslip.gross = grossBig.toNumber();
    payslip.dependents = dependents;

    payslip.dependentDeductionAmount = new Big(dependents * 4_400_000).toNumber();


    let regionMinWage;
    let baseSalary;

    payslip.region = region;

    if (date.getTime() < july23.getTime()) {

        baseSalary = new Big(1_490_000);
        switch (region) {
            case 1:
                regionMinWage = new Big(4_420_000);
                break;
            case 2:
                regionMinWage = new Big(3_920_000);
                break;
            case 3:
                regionMinWage = new Big(3_430_000);
                break;
            case 4:
                regionMinWage = new Big(3_070_000);
                break;
            default:
                throw new Error("Invalid region entered. Please enter again! (1, 2, 3, 4)");
        }

    } else {

        baseSalary = new Big(1_800_000);
        switch (region) {
            case 1:
                regionMinWage = new Big(4_680_000);
                break;
            case 2:
                regionMinWage = new Big(4_160_000);
                break;
            case 3:
                regionMinWage = new Big(3_640_000);
                break;
            case 4:
                regionMinWage = new Big(3_250_000);
                break;
            default:
                throw new Error("Invalid region entered. Please enter again! (1, 2, 3, 4)");
        }
    }

    // Calculating social insurance contributions
    const maxGrossForSIorHI = new Big(baseSalary.times(new Big(20)));
    const maxGrossForUI = new Big(regionMinWage.times(new Big(20)));

    const socialInsurance = maxGrossForSIorHI.gt(grossBig) ? Big(grossBig.times(0.08)) : Big(maxGrossForSIorHI.times(0.08));
    payslip.socialInsurance = socialInsurance.toNumber()

    const healthInsurance = maxGrossForSIorHI.gt(grossBig) ? Big(grossBig.times(0.015)) : Big(maxGrossForSIorHI.times(0.015));
    payslip.healthInsurance = healthInsurance.toNumber();

    const unemploymentInsurance = maxGrossForUI.gt(grossBig) ? Big(grossBig.times(0.01)) : Big(maxGrossForUI.times(0.01));
    payslip.unemploymentInsurance = unemploymentInsurance.toNumber();

    // Calculating afterInsurance
    const afterInsurance = grossBig.minus(socialInsurance).minus(healthInsurance).minus(unemploymentInsurance);
    payslip.afterInsurance= afterInsurance.toNumber();

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
