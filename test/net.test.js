const Big = require('big.js');
var net = require('../src/net.js')
var assert = require('assert');
var test = require('mocha').it;

describe("Calculate net salary", function () {

    describe('Check Net salary with dependent', function () {
        //Personal Income Tax (PIT)

        test('No dependent deducted', function () {
            //Gross income below 11 million is tax-exempt.
            const netSalary = net(10_000_000);

            assert.equal(netSalary, 8_950_000);
        })

        test('Dependent with no taxable income', function () {
            //afterInsurance below 11 million is tax-exempt.
            const netSalary = net(10_000_000, 1);

            assert.equal(netSalary, 8_950_000);
        })

        test('Taxes fully deducted with dependents', function () {
            //11m < Gross - 10.5% Gross  <= 11m (Personal deductions) + 4.4m * dependents (Dependent deductions)
            //12.29m < Gross <=17.2067m
            const netSalary = net(13_000_000, 1);

            assert.equal(netSalary, 11_635_000);
        })

        test('Taxes partially deducted with dependents', function () {
            //Gross - 10.5% Gross  > 11m (Personal deductions) + 4.4m * dependents (Dependent deductions)
            //Gross > 17.2067m
            const netSalary = net(20_000_000, 1);

            assert.equal(netSalary, 17_775_000);
        })
    })

    describe('Check Net salary with Insurance', function () {

        describe('Before 1/7/2023', function () {

            test('Throw Exception when entering invalid region', function () {
                assert.throws(function () {
                    net(93_678_123, 0, 10, new Date("2023-06-01"));
                }, Error, 'Invalid region entered. Please enter again! (1, 2, 3, 4)');

            })

            test('It applies 10.5% of Gross for all Insurance(SI 8%, HI 1.5% , UI 1%) when Gross Income is less than or equal 20 times Base Salary (29.8m)', function () {
                //Gross Income <= 29.8 million:
                // Social Insurance (SI): 8% Gross
                // Health Insurance (HI): 1.5% Gross
                // Unemployment Insurance (UI): 1% Gross

                const netSalary = net(10, 0, 1, new Date("2023-06-01"));
                assert.equal(netSalary, 8.95);
            })

            test('It applies max threshold (29.8m) for SI (8%) and HI (1.5%) when Gross between 29.8m and 88.4m', function () {
                // SI: 8% of 29.8 million
                // HI: 1.5% of 29.8 million
                // UI: 1% of Gross Income

                const netSalary = net(29_900_000, 0, 1, new Date("2023-06-01"));
                assert.equal(netSalary, 25154500);
            })

            test('It applies max threshold (88.4m) of region 1 for UI (1%)', function () {
                // SI: 8% of 29.8 million
                // HI: 1.5% of 29.8 million
                // UI (Region 1): 1% of 20 * 4.42 (88.4 million)

                const netSalary = net(88_888_888, 0, 1, new Date("2023-06-01"));
                assert.equal(netSalary, 68_771_721.6);
            })


            test('It applies max threshold (78.4m) of region 2 for UI (1%)', function () {
                // SI: 8% of 29.8 million
                // HI: 1.5% of 29.8 million
                // UI (Region 2): 1% of 20 * 3.92 (78.4 million) 
                const netSalary = net(88_888_888, 0, 2, new Date("2023-06-01"));
                assert.equal(netSalary, 68841721.6);
            })

            test('It applies max threshold (68.6m) of region 3 for UI (1%)', function () {
                // SI: 8% of 29.8 million
                // HI: 1.5% of 29.8 million
                // UI (Region 3): 1% of 20 * 3.43 (68.6 million)
                const netSalary = net(88_888_888, 0, 3, new Date("2023-06-01"));
                assert.equal(netSalary, 68_910_321.6);
            })


            test('It applies max threshold (61.4m) of region 4 for UI (1%)', function () {
                // SI: 8% of 29.8 million
                // HI: 1.5% of 29.8 million
                // UI (Region 4): 1% of 20 * 3.07 (61.4 million)
                const netSalary = net(88_888_888, 0, 4, new Date("2023-06-01"));
                assert.equal(netSalary, 68_960_721.6);
            })

        })
        describe('After 1/7/2023', function () {

            test('Throw Exception when entering invalid region, after 1/7/2023', function () {
                assert.throws(function () {
                    net(93_678_123, 0, 10);
                }, Error, 'Invalid region entered. Please enter again! (1, 2, 3, 4)');

            })

            test('It applies 10.5% of Gross for all Insurance(SI 8%, HI 1.5% , UI 1%) when Gross Income is less than or equal 20 times Base Salary (36m)', function () {
                // Social Insurance (SI): 8% gross 
                // Health Insurance (HI): 1.5% gross
                // Unemployment Insurance (UI): 1% gross

                const netSalary = net(31_234_456);
                assert.equal(netSalary, 26_161_612.402);
            })

            test('It applies max threshold (36m) for SI (8%) and HI (1.5%) when Gross between 36m and 93.6m', function () {
                // SI: 8% of 36 million
                // HI: 1.5% of 36 million
                // UI: 1% of Gross Income

                const netSalary = net(36_789_123);
                assert.equal(netSalary, 30_250_985.416);
            })

            test('It applies max threshold (93.6m) of region 1 for UI (1%)', function () {
                // SI: 8% of 36 million
                // HI: 1.5% of 36 million
                // UI (Region 1): 1% of 20 * 4.68 (93.6 million)

                const netSalary = net(93_678_123);
                assert.equal(netSalary, 71_675_486.1);
            })


            test('It applies max threshold (83.2m) of region 2 for UI (1%)', function () {
                // SI: 8% of 36 million
                // HI: 1.5% of 36 million
                // UI (Region 2): 1% of 20 * 4.16 (83.2 million) 

                const netSalary = net(93_678_123, 0, 2);
                assert.equal(netSalary, 71_748_286.1);
            })

            test('It applies max threshold (72.8m) of region 3 for UI (1%)', function () {
                // SI: 8% of 36 million
                // HI: 1.5% of 36 million
                // UI (Region 3): 1% of 20 * 3.64 (72.8 million)

                const netSalary = net(93_678_123, 0, 3);
                assert.equal(netSalary, 71_821_086.1);
            })

            test('It applies max threshold (65m) of region 4 for UI (1%)', function () {
                // SI: 8% of 36 million
                // HI: 1.5% of 36 million
                // UI (Region 4): 1% of 20 * 3.25 (65 million) 

                const netSalary = net(93_678_123, 0, 4);
                assert.equal(netSalary, 71_875_686.1);
            })


        })
    });

    describe('Check Net salary with 7 rates of taxes: ', function () {

        /**
         * gross = NET + tax + inssurance
         * Case 1: inssurance + dont have taxableIncome
         * => NET = Gross - gross*10.5%
         * Case 2: inssurance + have taxableIncome ()
         * => NET = Gross - tax - gross*10.5% - dependents
         * 
         */
        test('It applies no tax', function () {
            //afterInsurance below 11 million is tax-exempt.
            //Gross - 10.5% Gross < 11m (Personal deductions)
            // Gross < 12.29m
            const netSalary = net(12_000_000);

            assert.equal(netSalary, 10_740_000);
        })

        test('It applies tax rate 1 only', function () {
            //11m < Gross - 10.5% Gross < 11m + 5m (taxRate1)
            //12.29m < Gross <17.87
            const netSalary = net(16_789_000);

            assert.equal(netSalary, 14_824_847.25);
        })

        test('It applies 2 first tax rates', function () {
            //16m < Gross - 10.5% Gross < 11m + 5m (taxRate1) +  5m (taxRate2)
            //17.87m <Gross < 23.46m
            const netSalary = net(19_789_000);

            assert.equal(netSalary, 17_290_039.5);
        })

        test('It applies 3 first tax rates', function () {
            //21m < Gross - 10.5% Gross < 11m + 5m (taxRate1) +  5m (taxRate2) + 8m (taxRate3)
            //23.46m < Gross < 32.4m
            const netSalary = net(24_023_355);

            assert.equal(netSalary, 20_675_767.31625);
        })

        test('It applies 4 first tax rates', function () {
            //29m < Gross - 10.5% Gross &&  Gross - 8%*36_000_000 - 1.5%*36_000_000 - 1%* Gross (Gross < 20 * regionMinWage) < 11m + 5m (taxRate1) +  5m (taxRate2) + 8m (taxRate3) + 14m (taxRate4)
            //32.402235m < Gross < 46_888_888,89

            const netSalary = net(34_398_344);

            assert.equal(netSalary, 28_479_214.304);
        })

        test('It applies 5 first tax rates', function () {
            //43m < Gross - 8%*36_000_000 - 1.5%*36_000_000 - 1%* Gross (Gross < 20 * regionMinWage) < 11m + 5m (taxRate1) +  5m (taxRate2) + 8m (taxRate3) + 14m (taxRate4) + 20m(taxRate5)
            //46_888_888,89m < Gross < 67_090_909,09m

            const netSalary = net(48_003_947);

            assert.equal(netSalary, 39_077_930.6475);
        })

        test('It applies 6 first tax rates', function () {
            //63m < Gross - 8%*36_000_000 - 1.5%*36_000_000 - 1%* Gross (Gross < 20 * regionMinWage) < 11m + 5m (taxRate1) +  5m (taxRate2) + 8m (taxRate3) + 14m (taxRate4) + 20m(taxRate5) + 28m (taxRate6)
            //67_090_909,09m < Gross < 95_373_737,37m

            const netSalary = net(68_033_567);

            assert.equal(netSalary, 53_903_261.931);
        })

        test('It applies with all 7 tax rates', function () {
            // Gross - 8%*36_000_000 - 1.5%*36_000_000 - 1% * 93_600_000 > 80m +11m
            // gross > 95_356_000

            const netSalary = net(95_356_001);

            assert.equal(netSalary, 72_850_000.65);
        })

    })

})


