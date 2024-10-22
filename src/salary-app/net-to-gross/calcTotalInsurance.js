import Big from 'big.js';
import findInsurancePolicy from '../common/findInsurancePolicy';
import {BIG_20} from '../common/salaryConstants';

/**
 * @param net
 * @param totalTax
 * @param region
 * @param date
 * @returns {Promise<{
 *     total: number,
 *     gross: number
 * }>}
 */
export default function calcTotalInsurance(net, totalTax, region = 1, date = new Date()) {
    return new Promise(function (resolve, reject) {
        const netBig = new Big(net);
        const totalNetAndTax = netBig.add(totalTax);

        const insurancePolicy = findInsurancePolicy(region, date)

        // Max salary to calculate UI
        const maxUI = Big(insurancePolicy.minWage).times(BIG_20);
        const gte20TimeRegion = Big(0.99).times(maxUI).minus(3_420_000);
        const maxGrossForSIorHI = new Big((insurancePolicy.baseSalary).times(BIG_20));

        // employee has to pay
        const maxTotalPaidForSIAndHI = Big(0.08)
            .times(maxGrossForSIorHI)
            .add(Big(0.015).times(maxGrossForSIorHI));

        const max_Paid_UI = Big(0.01).times(insurancePolicy.minWage).times(BIG_20);
        const insurances = {};

        // Assume: net + totalTax < 32_220_000
        insurances.gross = totalNetAndTax.div(0.895).toNumber()
        insurances.total = Big(0.105).times(insurances.gross).toNumber()

        if (totalNetAndTax.gte(gte20TimeRegion)) {
            // net + totalTax + 3_420_000 (SI + HI) + 1% 20*regionMinwage >= 93_600_000 (100% 20*regionMinwage)
            // net + totalTax >= 99% * 20 * regionMinwage - 3_420_000

            insurances.total = maxTotalPaidForSIAndHI.add(max_Paid_UI).toNumber()
            insurances.gross = totalNetAndTax.add(insurances.total).toNumber()

        } else if (totalNetAndTax.gte(maxGrossForSIorHI)) {
            // gross >= 36_000_000 ==> net + totalTax + 3_420_000 + 1% gross >= 36_000_000
            // net + totalTax >= 99% * 36_000_000 - 3_420_000
            // net + totalTax >= 32_220_000

            insurances.gross = totalNetAndTax.add(maxTotalPaidForSIAndHI).div(0.99).toNumber()
            insurances.total = maxTotalPaidForSIAndHI.add(Big(0.01).times(insurances.gross)).toNumber()
        }

        resolve(insurances)
    })
}