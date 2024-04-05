
const Big = require('big.js');

module.exports = function net(gross, nguoiPhuThuoc, region = 1) {
    const grossBig = new Big(gross);
    console.log("Gross: ", grossBig.toNumber());
    console.log("Dependents: ", nguoiPhuThuoc);

   
    var giamThueNguoiPhuThuoc = new Big(0);

    if (nguoiPhuThuoc > 0) {

        giamThueNguoiPhuThuoc = new Big(nguoiPhuThuoc *4400000);
    }

    console.log("So tien khau tru nguoi phu thuoc: ", giamThueNguoiPhuThuoc.toNumber());


    //Gross > 93_600_000? regionMinWage*20: gross*0.01
    let regionMinWage;

    if (region === 1) {
        regionMinWage = 4680000;
    } else if (region === 2) {
        regionMinWage = 4160000;
    } else if (region === 3) {
        regionMinWage = 3640000;
    } else if (region === 4) {
        regionMinWage = 3250000;
    } else {
        console.log("Invalid region entered. Please enter again! (1, 2, 3, 4) ")
    };

    // Tính toán các khoản bảo hiểm xã hội
    const maxGrossForInsurance = new Big(36000000);
    const maxGrossAccidental = new Big(regionMinWage * 20);

    const BHXH = Math.min(maxGrossForInsurance.times(0.08), grossBig.times(0.08));
    console.log("BHXH: ", BHXH);

    const BHYT = Math.min(maxGrossForInsurance.times(0.015), grossBig.times(0.015));
    console.log("BHYT: ", BHYT);

    const BHTN = Math.min(maxGrossAccidental.times(0.01), grossBig.times(0.01));
    console.log("BHTN: ", BHTN);


    // Tính toán thu nhập chịu thuế
    const grossIncome = grossBig.minus(BHXH).minus(BHYT).minus(BHTN);
    console.log("Thu nhap truoc thue: ", grossIncome.toNumber());

    const taxableIncome = grossIncome.minus(11000000).minus(giamThueNguoiPhuThuoc);
    const taxableIncomeTemp = taxableIncome.gt(0) ? taxableIncome : new Big(0);

    console.log("Thu nhap chiu thue: ", taxableIncomeTemp.toNumber())


    // Tính toán thuế TNCN theo từng bậc thuế
    const bac1 = Math.min(taxableIncomeTemp.toNumber(), 5000000);
    const bac2 = Math.max(0, Math.min(taxableIncomeTemp.toNumber() - 5000000, 5000000));
    const bac3 = Math.max(0, Math.min(taxableIncomeTemp.toNumber() - 10000000, 8000000));
    const bac4 = Math.max(0, Math.min(taxableIncomeTemp.toNumber() - 18000000, 14000000));
    const bac5 = Math.max(0, Math.min(taxableIncomeTemp.toNumber() - 32000000, 20000000));
    const bac6 = Math.max(0, Math.min(taxableIncomeTemp.toNumber() - 52000000, 28000000));
    const bac7 = Math.max(0, taxableIncomeTemp.toNumber() - 80000000);

    // Tính toán thuế cho từng bậc
    const thueBac1 = bac1 * 0.05;
    const thueBac2 = bac2 * 0.1;
    const thueBac3 = bac3 * 0.15;
    const thueBac4 = bac4 * 0.2;
    const thueBac5 = bac5 * 0.25;
    const thueBac6 = bac6 * 0.3;
    const thueBac7 = bac7 * 0.35;


    // Tổng thuế thu nhập cá nhân
    const tongThueTNCN = thueBac1 + thueBac2 + thueBac3 + thueBac4 + thueBac5 + thueBac6 + thueBac7;
    console.log("Tong thue TNCN: ", tongThueTNCN);

    // Tính toán thu nhập ròng (net)


    if (taxableIncome.gt(0)) {
        netSalary = grossIncome.minus(tongThueTNCN);
    } else {
        netSalary = grossIncome;
    }

    console.log("netSalary: ", netSalary.toNumber());
    console.log("____________________________")

    return netSalary;

};



