
const Big = require('big.js');

module.exports = function net(gross, nguoiPhuThuoc = 0, region = 1) {
    const grossBig = new Big(gross);

    const allInfor = {};

    allInfor.gross = grossBig.toNumber();
    allInfor.dependents = nguoiPhuThuoc;

    var giamThueNguoiPhuThuoc = new Big(0);

    if (nguoiPhuThuoc > 0) {

        giamThueNguoiPhuThuoc = new Big(nguoiPhuThuoc * 4400000);
    }


    allInfor.giamThueNguoiPhuThuoc = giamThueNguoiPhuThuoc.toNumber();

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
    allInfor.region= region;

    // Tính toán các khoản bảo hiểm xã hội
    const maxGrossForInsurance = new Big(36000000);
    const maxGrossAccidental = new Big(regionMinWage * 20);

    const BHXH = Math.min(maxGrossForInsurance.times(0.08), grossBig.times(0.08));
    allInfor.BHXH = BHXH;

    const BHYT = Math.min(maxGrossForInsurance.times(0.015), grossBig.times(0.015));
    allInfor.BHYT = BHYT;

    const BHTN = Math.min(maxGrossAccidental.times(0.01), grossBig.times(0.01));
    allInfor.BHTN = BHTN;

    // Tính toán thu nhập chịu thuế
    const grossIncome = grossBig.minus(BHXH).minus(BHYT).minus(BHTN);
    allInfor.grossIncome = grossIncome.toNumber();

    const taxableIncome = grossIncome.minus(11000000).minus(giamThueNguoiPhuThuoc);
    const taxableIncomeTemp = taxableIncome.gt(0) ? taxableIncome : new Big(0);

    allInfor.taxableIncomeTemp = taxableIncomeTemp.toNumber();

    // console.log("Thu nhap chiu thue: ", taxableIncomeTemp.toNumber())


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

    allInfor.thueBac1 = thueBac1;
    allInfor.thueBac2 = thueBac2;
    allInfor.thueBac3 = thueBac3;
    allInfor.thueBac4 = thueBac4;
    allInfor.thueBac5 = thueBac5;
    allInfor.thueBac6 = thueBac6;
    allInfor.thueBac7 = thueBac7;

    // Tổng thuế thu nhập cá nhân
    const tongThueTNCN = thueBac1 + thueBac2 + thueBac3 + thueBac4 + thueBac5 + thueBac6 + thueBac7;
    // console.log("Tong thue TNCN: ", tongThueTNCN);
    allInfor.totalIncomeTax = tongThueTNCN;

    // Tính toán thu nhập ròng (net)

    let netSalary;
    if (taxableIncome.gt(0)) {
        netSalary = grossIncome.minus(tongThueTNCN);
    } else {
        netSalary = grossIncome;
    }
    allInfor.netSalary = netSalary.toNumber();

    console.log("All Information:", allInfor);

    return allInfor;

};



