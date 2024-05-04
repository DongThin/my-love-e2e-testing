
const Big = require('big.js');
const july23 = new Date("2023-07-01")


module.exports = function net(gross, dependents = 0, region = 1, date = july23) {
    const grossBig = new Big(gross);

    const allInfor = {};

    allInfor.gross = grossBig.toNumber();
    allInfor.dependents = dependents;

    let dependentTaxRelief = new Big(0);

    dependentTaxRelief = new Big(dependents * 4_400_000);

    allInfor.dependentTaxRelief = dependentTaxRelief.toNumber();


    let regionMinWage;
    let baseSalary;
    // console.log('Date:', date.toISOString());
    allInfor.region = region;

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
    const maxGrossForInsurance = new Big(baseSalary.times(new Big(20)));
    const maxGrossAccidental = new Big(regionMinWage.times(new Big(20)));

    const socialInsurance = maxGrossForInsurance.gt(grossBig) ? Big(grossBig.times(0.08)) : Big(maxGrossForInsurance.times(0.08));
    allInfor.socialInsurance = socialInsurance.toNumber()

    const healthInsurance = maxGrossForInsurance.gt(grossBig) ? Big(grossBig.times(0.015)) : Big(maxGrossForInsurance.times(0.015));
    allInfor.healthInsurance = healthInsurance.toNumber();

    const unemploymentInsurance = maxGrossAccidental.gt(grossBig) ? Big(grossBig.times(0.01)) : Big(maxGrossAccidental.times(0.01));
    allInfor.unemploymentInsurance = unemploymentInsurance.toNumber();

    // Calculating taxable income
    const afterInsurance = grossBig.minus(socialInsurance).minus(healthInsurance).minus(unemploymentInsurance);
    allInfor.afterInsurance = afterInsurance.toNumber();

    let taxableIncome = afterInsurance.minus(11000000).minus(dependentTaxRelief);

    taxableIncome = taxableIncome.gt(0) ? taxableIncome : new Big(0);

    const taxableIncomeRate1 = Big(taxableIncome).gt(Big(5000000)) ? Big(5000000) : taxableIncome;

    let taxableIncomeRate2 = Big(taxableIncome.minus(5000000)).lt(Big(5000000)) ? taxableIncome.minus(5000000) : Big(5000000);
    taxableIncomeRate2 = Big(0).gt(taxableIncomeRate2) ? Big(0) : taxableIncomeRate2;

    let taxableIncomeRate3 = Big(taxableIncome.minus(10000000)).lt(Big(8000000)) ? taxableIncome.minus(10000000) : Big(8000000);
    taxableIncomeRate3 = Big(0).gt(taxableIncomeRate3) ? Big(0) : taxableIncomeRate3;

    let taxableIncomeRate4 = Big(taxableIncome.minus(18000000)).lt(Big(14000000)) ? taxableIncome.minus(18000000) : Big(14000000);
    taxableIncomeRate4 = Big(0).gt(taxableIncomeRate4) ? Big(0) : taxableIncomeRate4;

    let taxableIncomeRate5 = Big(taxableIncome.minus(32000000)).lt(Big(20000000)) ? taxableIncome.minus(32000000) : Big(20000000);
    taxableIncomeRate5 = Big(0).gt(taxableIncomeRate5) ? Big(0) : taxableIncomeRate5;

    let taxableIncomeRate6 = Big(taxableIncome.minus(52000000)).lt(Big(28000000)) ? taxableIncome.minus(52000000) : Big(28000000);
    taxableIncomeRate6 = Big(0).gt(taxableIncomeRate6) ? Big(0) : taxableIncomeRate6;

    const taxableIncomeRate7 = Big(0).gt(Big(taxableIncome.minus(80000000))) ? Big(0) : Big(taxableIncome.minus(80000000));

    // Calculating tax by tax bracket
    const taxRate1 = new Big(taxableIncomeRate1).times(new Big(0.05));
    const taxRate2 = new Big(taxableIncomeRate2).times(new Big(0.1));
    const taxRate3 = new Big(taxableIncomeRate3).times(new Big(0.15));
    const taxRate4 = new Big(taxableIncomeRate4).times(new Big(0.2));
    const taxRate5 = new Big(taxableIncomeRate5).times(new Big(0.25));
    const taxRate6 = new Big(taxableIncomeRate6).times(new Big(0.3));
    const taxRate7 = new Big(taxableIncomeRate7).times(new Big(0.35));

    allInfor.taxes = [
        { name: 'Tax level 1', rate: 0.05, amount: taxRate1.toNumber() },
        { name: 'Tax level 2', rate: 0.1, amount: taxRate2.toNumber() },
        { name: 'Tax level 3', rate: 0.15, amount: taxRate3.toNumber() },
        { name: 'Tax level 4', rate: 0.2, amount: taxRate4.toNumber() },
        { name: 'Tax level 5', rate: 0.25, amount: taxRate5.toNumber() },
        { name: 'Tax level 6', rate: 0.3, amount: taxRate6.toNumber() },
        { name: 'Tax level 7', rate: 0.35, amount: taxRate7.toNumber() }]

    const totalTax = Big(taxRate1).add(Big(taxRate2)).add(Big(taxRate3)).add(Big(taxRate4)).add(Big(taxRate5)).add(Big(taxRate6)).add(Big(taxRate7));

    allInfor.totalTax = totalTax.toNumber();
    const netSalary = afterInsurance.minus(totalTax).toNumber();
    allInfor.netSalary = netSalary;

    return allInfor;

};
