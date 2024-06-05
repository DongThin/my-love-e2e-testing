const assert = require('assert');
const test = require('mocha').it;
const gross = require('../src/gross');
const net = require('../src/net');

describe('Calculate Gross salary', function () {

    test('Gross should be equal 0 when Net is less than or equal 0', async function () {

        const inputNet = -19;
        const actual = await gross(inputNet)
        assert.equal(actual, 0)
    })

    test('Verify Gross without Taxes', async function () {

        const inputNet = 11_000_000;
        const actual = await gross(inputNet)

        const expectedPayslip = {
            dependents: 0,
            dependentDeductionAmount: 0,
            region: 1,
            totalTax: 0,
            taxes: [],
            totalInsurance: 1_290_502.7932960894,
            insurances: [
                {
                    amount: 983240.2234636872,
                    name: 'Social Insurance 8%'
                },
                {
                    amount: 184357.54189944136,
                    name: 'Health Insurance 1.5%'
                },
                {
                    amount: 122905.0279329609,
                    name: 'Unemployment Insurance 1%'
                }
            ],
            afterInsurance: 11_000_000,
            gross: 12_290_502.79329609,
            netSalary: 11_000_000,
            region: 1
        }

        assert.deepStrictEqual(actual, expectedPayslip)
    })

    test('Verify the accurate calculation of Gross with tax Level 1 and insurance.', async function () {
        // ti                   <= net + 5% * Min(ti, 5) - 11; Only if ti <= 5.
        // ti - 5% * Min(ti, 5) <= net - 11
        // ti - 5% ti           <= net - 11 
        // 95%*ti               <= net - 11
        // ti <= 5             ==> net <= 15.75

        const inputNet = 15_750_000
        const actual = await gross(inputNet)

        const expectedPayslip = {
            dependents: 0,
            dependentDeductionAmount: 0,
            region: 1,
            totalTax: 250_000,
            taxes: [
                {
                    name: 'Tax level 1',
                    rate: 0.05,
                    amount: 250000
                }
            ],
            totalInsurance: 1877094.9720670392,
            insurances: [
                {
                    amount: 1_430_167.5977653633,
                    name: 'Social Insurance 8%'
                },
                {
                    amount: 268_156.4245810056,
                    name: 'Health Insurance 1.5%'
                },
                {
                    amount: 178_770.9497206704,
                    name: 'Unemployment Insurance 1%'
                }],
            afterInsurance: 16000000,
            gross: 17_877_094.97206704,
            netSalary: 15_750_000,
            region: 1
        }

        assert.deepStrictEqual(actual, expectedPayslip)
    })

    test('Verify the accurate calculation of Gross with tax Level 2 and insurance.', async function () {
        // ti        <= net + 5% * 5 + 10% * Min(ti - 5, 5) - 11; Only if ti <= 10.
        // ti        <= net + 5% * 5 + 10% * (ti - 5) - 11
        // 0.9*ti    <= net - 11.25
        // ti <= 10  ==> net <= 20_250_000

        const inputNet = 16_000_000
        const actual = await gross(inputNet)

        const expectedPayslip = {
            dependents: 0,
            dependentDeductionAmount: 0,
            region: 1,
            totalTax: 277_777.7777777778,
            taxes: [
                {
                    name: 'Tax level 1',
                    rate: 0.05,
                    amount: 250_000
                },
                {
                    name: 'Tax level 2',
                    rate: 0.1,
                    amount: 27_777.7777777778
                }
            ],
            totalInsurance: 1_909_683.426443203,
            insurances: [
                {
                    amount: 1_454_996.8963376784,
                    name: 'Social Insurance 8%'
                },
                {
                    amount: 272_811.9180633147,
                    name: 'Health Insurance 1.5%'
                },
                {
                    amount: 181_874.6120422098,
                    name: 'Unemployment Insurance 1%'
                }],
            afterInsurance: 16277777.777777776,
            gross: 18_187_461.20422098,
            netSalary: 16_000_000,
            region: 1
        }

        assert.deepStrictEqual(actual, expectedPayslip)
    })
    
    test('Verify the accurate calculation of Gross with tax Level 3 and insurance.', async function () {
        // ti        <= net + 5% * 5 + 10% * 5 + 15%*min(ti - 10, 8) - 11; Only if ti <= 18
        // 0.85*ti   <= net - 11.75
        // ti <= 18 ==> net <= 27_050_000

        const inputNet = 27_050_000
        const actual = await gross(inputNet)

        const expectedPayslip = {
            dependents: 0,
            dependentDeductionAmount: 0,
            region: 1,
            totalTax: 1950000,
            taxes: [
                {
                    name: 'Tax level 1',
                    rate: 0.05,
                    amount: 250_000
                },
                {
                    name: 'Tax level 2',
                    rate: 0.1,
                    amount: 500000
                },
                {
                    name: 'Tax level 3',
                    rate: 0.15,
                    amount: 1200000
                }
            ],
            totalInsurance: 3402234.6368715083,
            insurances: [
                {
                    amount: 2_592_178.770949721,
                    name: 'Social Insurance 8%'
                },
                {
                    amount: 486_033.51955307263,
                    name: 'Health Insurance 1.5%'
                },
                {
                    amount: 324022.3463687151,
                    name: 'Unemployment Insurance 1%'
                }],
            afterInsurance: 29000000,
            gross: 32402234.63687151,
            netSalary: 27_050_000,
            region: 1
        }

        assert.deepStrictEqual(actual, expectedPayslip)
    })

    test('Verify the accurate calculation of Gross with tax Level 4 and insurance.', async function () {
        // ti        <= net + 5% * 5 + 10% * 5 + 15%*8 + 20%*min(ti-18, 14)- 11; Only if ti <= 32
        // 0.8*ti    <= net - 12.65
        // ti <= 32 ==> net <= 38_250_000
        const inputNet = 32_794_000
        const actual = await gross(inputNet)

        const expectedPayslip = {
            dependents: 0,
            dependentDeductionAmount: 0,
            region: 1,
            totalTax: 3386000,
            taxes: [
                {
                    name: 'Tax level 1',
                    rate: 0.05,
                    amount: 250_000
                },
                {
                    name: 'Tax level 2',
                    rate: 0.1,
                    amount: 500000
                },
                {
                    name: 'Tax level 3',
                    rate: 0.15,
                    amount: 1200000
                },
                {
                    name: 'Tax level 4',
                    rate: 0.2,
                    amount: 1436000
                }
            ],
            totalInsurance: 3820000,
            insurances: [
                {
                    amount: 2880000,
                    name: 'Social Insurance 8%'
                },
                {
                    amount: 540000,
                    name: 'Health Insurance 1.5%'
                },
                {
                    amount: 400000,
                    name: 'Unemployment Insurance 1%'
                }],
            afterInsurance: 36180000,
            gross: 40000000,
            netSalary: 32794000,
            region: 1
        }

        assert.deepStrictEqual(actual, expectedPayslip)
    })

    test('Verify the accurate calculation of Gross with tax Level 5 and insurance.', async function () {
        //Net<= 11_000_000
        //3992424.242424242
        const inputNet = 53_250_000
        const actual = await gross(inputNet)

        const expectedPayslip = {
            dependents: 0,
            dependentDeductionAmount: 0,
            region: 1,
            totalTax: 9750000,
            taxes: [
                {
                    name: 'Tax level 1',
                    rate: 0.05,
                    amount: 250000
                },
                {
                    name: 'Tax level 2',
                    rate: 0.1,
                    amount: 500000
                },
                {
                    name: 'Tax level 3',
                    rate: 0.15,
                    amount: 1200000
                },
                {
                    name: 'Tax level 4',
                    rate: 0.2,
                    amount: 2800000
                },
                {
                    name: 'Tax level 5',
                    rate: 0.25,
                    amount: 5000000
                },
            ],
            totalInsurance: 4_090_909.090909091,
            insurances: [
                {
                    amount: 2880000,
                    name: 'Social Insurance 8%'
                },
                {
                    amount: 540000,
                    name: 'Health Insurance 1.5%'
                },
                {
                    amount: 670909.0909090909,
                    name: 'Unemployment Insurance 1%'
                }],
            afterInsurance: 63000000,
            gross: 67090909.09090909,
            netSalary: 53_250_000,
            region: 1,
        }

        assert.deepStrictEqual(actual, expectedPayslip)
    })

    test('Verify the accurate calculation of Gross with tax Level 6 and insurance.', async function () {
        // ti       <= net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*20 +30%(ti-52, 28) - 11; Only if ti <=80
        // 0.7*ti   <= net + 9.75 - 30%*52 -11
        // 0.7*ti   <= net - 16.85
        // ti <=80  ==> net <= 72_850_000

        const inputNet = 72_850_000
        const actual = await gross(inputNet)

        const expectedPayslip = {
            dependents: 0,
            dependentDeductionAmount: 0,
            region: 1,
            totalTax: 18150000,
            taxes: [
                {
                    name: 'Tax level 1',
                    rate: 0.05,
                    amount: 250000
                },
                {
                    name: 'Tax level 2',
                    rate: 0.1,
                    amount: 500000
                },
                {
                    name: 'Tax level 3',
                    rate: 0.15,
                    amount: 1200000
                },
                {
                    name: 'Tax level 4',
                    rate: 0.2,
                    amount: 2800000
                },
                {
                    name: 'Tax level 5',
                    rate: 0.25,
                    amount: 5000000
                },
                {
                    name: 'Tax level 6',
                    rate: 0.3,
                    amount: 8400000
                }
            ],
            totalInsurance: 4356000,
            insurances: [
                {
                    amount: 2880000,
                    name: 'Social Insurance 8%'
                },
                {
                    amount: 540000,
                    name: 'Health Insurance 1.5%'
                },
                {
                    amount: 936000,
                    name: 'Unemployment Insurance 1%'
                }],
            afterInsurance: 91000000,
            gross: 95_356_000,
            netSalary: 72850000
        }

        assert.deepStrictEqual(actual, expectedPayslip)
    })

    test('Verify the accurate calculation of Gross with tax Level 7 and insurance.', async function () {
        // ti        > net + 5% * 5 + 10% * 5 + 15%*8 + 20%*14 + 25%*20 +30%*28 + 35%*(ti-80) - 11; Only if ti > 80
        // 0.65*ti   > net +18.15 -35%*80 -11
        // 0.65*ti   > net - 20.85
        // ti > 80 ==> net > 72_850_000

        const inputNet = 84_000_000
        const actual = await gross(inputNet)
        const payslipFromNet = await net(actual.gross)

        assert.deepStrictEqual(actual, payslipFromNet)
    })

})