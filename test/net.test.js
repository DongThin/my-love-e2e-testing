const Big = require('big.js');
var net = require('../src/net.js')
var assert = require('assert');
var test = require('mocha').it;

describe("CALCULATE NET SALARY:", function () {
  console.log("*************************");

  describe("Gross is lte 12.290500m (No tax)", function () {
    describe("NO DEPENDENTS: ", function () {

      test('Gross is equal 12.290503m', function () {
        const allInfor = net(12_290_503);
        assert.strictEqual(allInfor.gross, 12_290_503, 'Gross should be 12_290_503');
        assert.strictEqual(allInfor.dependents, 0, 'Dependents should be 0');

        assert.strictEqual(allInfor.netSalary, 11000000.17575, 'Net Salary should be 11000000.17575');
        assert.strictEqual(allInfor.BHXH, 983_240.24, 'BHXH should be 983_240');
        assert.strictEqual(allInfor.BHYT, 184_357.545, 'BHYT should be 184_358');
        assert.strictEqual(allInfor.BHTN, 122_905.03, 'BHTN should be 122_905');
        assert.strictEqual(allInfor.grossIncome, 11_000_000.185);
        assert.strictEqual(allInfor.totalIncomeTax, 0.00925, 'Total Income Tax should be 0.00925');

      });

      test('Gross is lt 12.290503m', function () {
        const allInfor = net(2_000_000);
        assert.strictEqual(allInfor.gross, 2_000_000);
        assert.strictEqual(allInfor.dependents, 0);

        assert.strictEqual(allInfor.netSalary, 1_790_000);
        assert.strictEqual(allInfor.BHXH, 160_000);
        assert.strictEqual(allInfor.BHYT, 30_000);
        assert.strictEqual(allInfor.BHTN, 20_000);
        assert.strictEqual(allInfor.grossIncome, 1_790_000);
        assert.strictEqual(allInfor.totalIncomeTax, 0);

      });

      test('Gross is almost 0', function () {
        const allInfor = net(3);

        assert.strictEqual(allInfor.gross, 3);
        assert.strictEqual(allInfor.dependents, 0);
        assert.strictEqual(allInfor.netSalary, 2.685);
        assert.strictEqual(allInfor.BHXH, 0.24);
        assert.strictEqual(allInfor.BHYT, 0.045);
        assert.strictEqual(allInfor.BHTN, 0.03);
        assert.strictEqual(allInfor.grossIncome, 2.685);
        assert.strictEqual(allInfor.totalIncomeTax, 0);

      });

      test('Gross is eq 0', function () {
        const allInfor = net(0);

        assert.strictEqual(allInfor.gross, 0);
        assert.strictEqual(allInfor.dependents, 0);
        assert.strictEqual(allInfor.netSalary, 0);
        assert.strictEqual(allInfor.BHXH, 0);
        assert.strictEqual(allInfor.BHYT, 0);
        assert.strictEqual(allInfor.BHTN, 0);
        assert.strictEqual(allInfor.grossIncome, 0);
        assert.strictEqual(allInfor.totalIncomeTax, 0);
        assert.strictEqual(allInfor.thueBac1, 0);

      });
    })

    describe("HAVING DEPENDENTS", function () {

      test('Gross is equal 12.290503m ', function () {

        const allInfor = net(12_290_503, 1);

        assert.strictEqual(allInfor.gross, 12_290_503);
        assert.strictEqual(allInfor.dependents, 1);
        assert.strictEqual(allInfor.netSalary, 11_000_000.185);
        assert.strictEqual(allInfor.BHXH, 983_240.24);
        assert.strictEqual(allInfor.BHYT, 184_357.545);
        assert.strictEqual(allInfor.BHTN, 122_905.03);
        assert.strictEqual(allInfor.grossIncome, 11_000_000.185);
        assert.strictEqual(allInfor.totalIncomeTax, 0);
        assert.strictEqual(allInfor.thueBac1, 0);

      });
    })

    describe("Gross is gt 12.290503m (tax)", function () {

      describe("NO DEPENDENTS: ", function () {

        test('Taxable income is lte 5m', function () {
          const allInfor = net(16_000_000, 1);

          assert.strictEqual(allInfor.gross, 16_000_000);
          assert.strictEqual(allInfor.dependents, 1);
          assert.strictEqual(allInfor.netSalary, 14_320_000);
          assert.strictEqual(allInfor.BHXH, 1_280_000);
          assert.strictEqual(allInfor.BHYT, 240_000);
          assert.strictEqual(allInfor.BHTN, 160_000);
          assert.strictEqual(allInfor.grossIncome, 14_320_000);
          assert.strictEqual(allInfor.totalIncomeTax, 0);
          assert.strictEqual(allInfor.thueBac1, 0);

        });

        test('Taxable income is lte 5m (region 2)', function () {
          const allInfor = net(16_000_000, 2);

          assert.strictEqual(allInfor.gross, 16_000_000);
          assert.strictEqual(allInfor.dependents, 2);
          assert.strictEqual(allInfor.netSalary, 14_320_000);
          assert.strictEqual(allInfor.BHXH, 1_280_000);
          assert.strictEqual(allInfor.BHYT, 240_000);
          assert.strictEqual(allInfor.BHTN, 160_000);
          assert.strictEqual(allInfor.grossIncome, 14_320_000);
          assert.strictEqual(allInfor.totalIncomeTax, 0);
          assert.strictEqual(allInfor.thueBac1, 0);
          assert.strictEqual(allInfor.giamThueNguoiPhuThuoc, 8_800_000);

        });
        //______________________________________________

        test('Taxable income is gt 5m and lt 10m', function () {

          const allInfor = net(20_000_000);

          assert.strictEqual(allInfor.gross, 20_000_000);
          assert.strictEqual(allInfor.dependents, 0);
          assert.strictEqual(allInfor.netSalary, 17_460_000);
          assert.strictEqual(allInfor.BHXH, 1_600_000);
          assert.strictEqual(allInfor.BHYT, 300_000);
          assert.strictEqual(allInfor.BHTN, 200_000);
          assert.strictEqual(allInfor.grossIncome, 17_900_000);
          assert.strictEqual(allInfor.totalIncomeTax, 440_000);
          assert.strictEqual(allInfor.thueBac1, 250_000);
          assert.strictEqual(allInfor.thueBac2, 190_000);
          assert.strictEqual(allInfor.thueBac3, 0);
          assert.strictEqual(allInfor.giamThueNguoiPhuThuoc, 0);


        });

        test('Taxable income is eq 10m', function () {
          const allInfor = net(23_463_687);

          assert.strictEqual(allInfor.gross, 23_463_687);
          assert.strictEqual(allInfor.dependents, 0);
          assert.strictEqual(allInfor.netSalary, 20_249_999.8785);
          assert.strictEqual(allInfor.BHXH, 1_877_094.96);
          assert.strictEqual(allInfor.BHYT, 351_955.305);
          assert.strictEqual(allInfor.BHTN, 234_636.87);
          assert.strictEqual(allInfor.grossIncome, 20_999_999.865);
          assert.strictEqual(allInfor.totalIncomeTax, 749_999.9865000001);
          assert.strictEqual(allInfor.thueBac1, 250_000);
          assert.strictEqual(allInfor.thueBac2, 499_999.98650000006);
          assert.strictEqual(allInfor.thueBac3, 0);
          assert.strictEqual(allInfor.giamThueNguoiPhuThuoc, 0);

        });
        //_______________________________________________

        test('Taxable income is gt 10m and lt 18m', function () {
          const allInfor = net(29_050_280);

          assert.strictEqual(allInfor.gross, 29_050_280);
          assert.strictEqual(allInfor.dependents, 0);
          assert.strictEqual(allInfor.netSalary, 24_500_000.51);
          assert.strictEqual(allInfor.BHXH, 2324022.4);
          assert.strictEqual(allInfor.BHYT, 435754.2);
          assert.strictEqual(allInfor.BHTN, 290502.8);
          assert.strictEqual(allInfor.grossIncome, 26000000.6);
          assert.strictEqual(allInfor.totalIncomeTax, 1500000.0899999999);
          assert.strictEqual(allInfor.thueBac1, 250_000);
          assert.strictEqual(allInfor.thueBac2, 500000);
          assert.strictEqual(allInfor.thueBac3, 750000.09);
          assert.strictEqual(allInfor.giamThueNguoiPhuThuoc, 0);
        });

        test('Taxable income is eq 18m', function () {

          const allInfor = net(32_402_235);

          const expectedValues = {
            gross: 32402235,
            dependents: 0,
            giamThueNguoiPhuThuoc: 0,
            region: 1,
            BHXH: 2592178.8,
            BHYT: 486033.525,
            BHTN: 324022.35,
            grossIncome: 29000000.325,
            taxableIncomeTemp: 18000000.325,
            thueBac1: 250000,
            thueBac2: 500000,
            thueBac3: 1200000,
            thueBac4: 0.0649999998509884,
            thueBac5: 0,
            thueBac6: 0,
            thueBac7: 0,
            totalIncomeTax: 1950000.065,
            netSalary: 27050000.26

          };

          assert.deepStrictEqual(allInfor, expectedValues);
        });

      });
      //___________________________________________

      test('Taxable income is gt 18m and lt 32m', function () {
        const allInfor = net(32_402_236);

        const expectedValues = {
          gross: 32402236,
          dependents: 0,
          giamThueNguoiPhuThuoc: 0,
          region: 1,
          BHXH: 2592178.88,
          BHYT: 486033.54,
          BHTN: 324022.36,
          grossIncome: 29000001.22,
          taxableIncomeTemp: 18000001.22,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 0.24399999976158143,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 1950000.2439999997,
          netSalary: 27050000.976

        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is eq 32m', function () {
        const allInfor = net(47_884_187);

        const expectedValues = {
          gross: 47884187,
          dependents: 0,
          giamThueNguoiPhuThuoc: 0,
          region: 1,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 478841.87,
          grossIncome: 43985345.13,
          taxableIncomeTemp: 32985345.13,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 246336.28249999974,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 4996336.2825,
          netSalary: 38989008.8475

        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });
      //_____________________________________________

      test('Taxable income is gt 32m and lt 52m', function () {
        const allInfor = net(60_900_000);

        const expectedValues = {
          gross: 60_900_000,
          dependents: 0,
          giamThueNguoiPhuThuoc: 0,
          region: 1,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 609000,
          grossIncome: 56871000,
          taxableIncomeTemp: 45871000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 3467750,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 8217750,
          netSalary: 48653250

        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is eq 52m', function () {
        const allInfor = net(67_090_909);

        const expectedValues = {
          gross: 67_090_909,
          dependents: 0,
          giamThueNguoiPhuThuoc: 0,
          region: 1,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 670909.09,
          grossIncome: 62999999.91,
          taxableIncomeTemp: 51999999.91,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 4999999.977499999,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 9749999.9775,
          netSalary: 53249999.9325

        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is gt 52m and lt 80m', function () {
        const allInfor = net(70_000_000);

        const expectedValues = {
          gross: 70_000_000,
          dependents: 0,
          giamThueNguoiPhuThuoc: 0,
          region: 1,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 700000,
          grossIncome: 65880000,
          taxableIncomeTemp: 54880000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 864000,
          thueBac7: 0,
          totalIncomeTax: 10614000,
          netSalary: 55266000

        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });
      //__________________________________________

      test('Gross is eq 93.6m (test BHTN), dependent 0, region 1', function () {
        const allInfor = net(93_600_000);

        const expectedValues = {
          gross: 93_600_000,
          dependents: 0,
          giamThueNguoiPhuThuoc: 0,
          region: 1,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 936000,
          grossIncome: 89244000,
          taxableIncomeTemp: 78244000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 7873200,
          thueBac7: 0,
          totalIncomeTax: 17623200,
          netSalary: 71620800

        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Gross is gt 93.6m (test BHTN), dependent 0, region 1', function () {
        const allInfor = net(95_000_000);

        const expectedValues = {
          gross: 95000000,
          dependents: 0,
          giamThueNguoiPhuThuoc: 0,
          region: 1,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 936000,
          grossIncome: 90644000,
          taxableIncomeTemp: 79644000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 8293200,
          thueBac7: 0,
          totalIncomeTax: 18043200,
          netSalary: 72600800

        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Gross is gt 93.6m (test BHTN), dependent 0, region 2', function () {
        const allInfor = net(95_000_000, 0, 2);

        const expectedValues = {
          gross: 95000000,
          dependents: 0,
          giamThueNguoiPhuThuoc: 0,
          region: 2,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 832000,
          grossIncome: 90748000,
          taxableIncomeTemp: 79748000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 8324400,
          thueBac7: 0,
          totalIncomeTax: 18074400,
          netSalary: 72673600

        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Gross is gt 93.6m (test BHTN), dependent 0, region 3', function () {
        const allInfor = net(95_000_000, 0, 3);

        const expectedValues = {
          gross: 95000000,
          dependents: 0,
          giamThueNguoiPhuThuoc: 0,
          region: 3,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 728000,
          grossIncome: 90852000,
          taxableIncomeTemp: 79852000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 8355600,
          thueBac7: 0,
          totalIncomeTax: 18105600,
          netSalary: 72746400

        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Gross is gt 93.6m (test BHTN), dependent 0, region 4', function () {
        const allInfor = net(95_000_000, 0, 4);

        const expectedValues = {
          gross: 95000000,
          dependents: 0,
          giamThueNguoiPhuThuoc: 0,
          region: 4,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 650000,
          grossIncome: 90930000,
          taxableIncomeTemp: 79930000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 8379000,
          thueBac7: 0,
          totalIncomeTax: 18129000,
          netSalary: 72801000

        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });
      //____________________________________

      test('Taxable income is eq 80m', function () {
        const allInfor = net(95_356_000);

        const expectedValues = {
          gross: 95356000,
          dependents: 0,
          giamThueNguoiPhuThuoc: 0,
          region: 1,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 936000,
          grossIncome: 91000000,
          taxableIncomeTemp: 80000000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 8400000,
          thueBac7: 0,
          totalIncomeTax: 18150000,
          netSalary: 72850000

        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is eq 80m, region 2)', function () {
        const allInfor = net(95_356_000, 0, 2);

        const expectedValues = {
          gross: 95356000,
          dependents: 0,
          giamThueNguoiPhuThuoc: 0,
          region: 2,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 832000,
          grossIncome: 91104000,
          taxableIncomeTemp: 80104000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 8400000,
          thueBac7: 36400,
          totalIncomeTax: 18186400,
          netSalary: 72917600
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is eq 80m, region 3)', function () {
        const allInfor = net(95_356_000, 0, 3);

        const expectedValues = {
          gross: 95356000,
          dependents: 0,
          giamThueNguoiPhuThuoc: 0,
          region: 3,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 728000,
          grossIncome: 91208000,
          taxableIncomeTemp: 80208000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 8400000,
          thueBac7: 72800,
          totalIncomeTax: 18222800,
          netSalary: 72985200

        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is eq 80m, region 4)', function () {
        const allInfor = net(95_356_000, 0, 4);

        const expectedValues = {
          gross: 95356000,
          dependents: 0,
          giamThueNguoiPhuThuoc: 0,
          region: 4,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 650000,
          grossIncome: 91286000,
          taxableIncomeTemp: 80286000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 8400000,
          thueBac7: 100100,
          totalIncomeTax: 18250100,
          netSalary: 73035900
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });


      test('Taxable income is gt 80m ', function () {
        const allInfor = net(100_000_000, 0, 4);

        const expectedValues = {
          gross: 100_000_000,
          dependents: 0,
          giamThueNguoiPhuThuoc: 0,
          region: 4,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 650000,
          grossIncome: 95930000,
          taxableIncomeTemp: 84930000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 8400000,
          thueBac7: 1725500,
          totalIncomeTax: 19875500,
          netSalary: 76_054_500

        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is gt 80m, region 2)', function () {
        const allInfor = net(100_000_000, 0, 2);

        const expectedValues = {
          gross: 100000000,
          dependents: 0,
          giamThueNguoiPhuThuoc: 0,
          region: 2,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 832000,
          grossIncome: 95748000,
          taxableIncomeTemp: 84748000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 8400000,
          thueBac7: 1661800,
          totalIncomeTax: 19811800,
          netSalary: 75936200

        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });


    })
    //_______________________________________________

    describe("HAVING DEPENDENTS: ", function () {

      test('Taxable income is lt 5m (taxincome eq 0, dependent 1)', function () {
        const allInfor = net(16_000_000, 1);

        const expectedValues = {
          gross: 16000000,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 1,
          BHXH: 1280000,
          BHYT: 240000,
          BHTN: 160000,
          grossIncome: 14320000,
          taxableIncomeTemp: 0,
          thueBac1: 0,
          thueBac2: 0,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 0,
          netSalary: 14320000
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is lt 5m (taxincome eq 0, dependent 2)', function () {
        const allInfor = net(16_000_000, 2, 1);
        
        const expectedValues = {
          gross: 16000000,
          dependents: 2,
          giamThueNguoiPhuThuoc: 8800000,
          region: 1,
          BHXH: 1280000,
          BHYT: 240000,
          BHTN: 160000,
          grossIncome: 14320000,
          taxableIncomeTemp: 0,
          thueBac1: 0,
          thueBac2: 0,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 0,
          netSalary: 14320000
        };
        assert.deepStrictEqual(allInfor, expectedValues);
        
      });

      test('Taxable income is eq 5m (taxincome eq 0, dependent 1)', function () {
        const allInfor = net(17_206_704, 1);

        const expectedValues = {
          gross: 17206704,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 1,
          BHXH: 1376536.32,
          BHYT: 258100.56,
          BHTN: 172067.04,
          grossIncome: 15400000.08,
          taxableIncomeTemp: 0.08,
          thueBac1: 0.004,
          thueBac2: 0,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 0.004,
          netSalary: 15400000.076
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is gt 5m and lt 10m, dependent 1)', function () {
        const allInfor = net(20_000_000, 1, 1);

        const expectedValues = {
          gross: 20000000,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 1,
          BHXH: 1600000,
          BHYT: 300000,
          BHTN: 200000,
          grossIncome: 17900000,
          taxableIncomeTemp: 2500000,
          thueBac1: 125000,
          thueBac2: 0,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 125000,
          netSalary: 17775000
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is gt 5m and lt 10m, dependent 2)', function () {
        const allInfor = net(20_000_000, 2, 1);

        const expectedValues = {
          gross: 20000000,
          dependents: 2,
          giamThueNguoiPhuThuoc: 8800000,
          region: 1,
          BHXH: 1600000,
          BHYT: 300000,
          BHTN: 200000,
          grossIncome: 17900000,
          taxableIncomeTemp: 0,
          thueBac1: 0,
          thueBac2: 0,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 0,
          netSalary: 17900000
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is eq 10m, dependent 1', function () {
        const allInfor = net(23463687, 1);

        const expectedValues = {
          gross: 23463687,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 1,
          BHXH: 1877094.96,
          BHYT: 351955.305,
          BHTN: 234636.87,
          grossIncome: 20999999.865,
          taxableIncomeTemp: 5599999.865,
          thueBac1: 250000,
          thueBac2: 59999.98650000003,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 309999.9865,
          netSalary: 20689999.8785
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is eq 10m, dependent 2', function () {
        const allInfor = net(23463687, 2);

        const expectedValues = {
          gross: 23463687,
          dependents: 2,
          giamThueNguoiPhuThuoc: 8800000,
          region: 1,
          BHXH: 1877094.96,
          BHYT: 351955.305,
          BHTN: 234636.87,
          grossIncome: 20999999.865,
          taxableIncomeTemp: 1199999.865,
          thueBac1: 59999.99325,
          thueBac2: 0,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 59999.99325,
          netSalary: 20939999.87175
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is eq 10m, dependent 3', function () {
        const allInfor = net(23463687, 3);

        const expectedValues = {
          gross: 23463687,
          dependents: 3,
          giamThueNguoiPhuThuoc: 13200000,
          region: 1,
          BHXH: 1877094.96,
          BHYT: 351955.305,
          BHTN: 234636.87,
          grossIncome: 20999999.865,
          taxableIncomeTemp: 0,
          thueBac1: 0,
          thueBac2: 0,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 0,
          netSalary: 20999999.865
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is gt 10m and lt 18m, dependent 1', function () {
        let allInfor = net(29050280, 1);

        const expectedValues = {
          gross: 29050280,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 1,
          BHXH: 2324022.4,
          BHYT: 435754.2,
          BHTN: 290502.8,
          grossIncome: 26000000.6,
          taxableIncomeTemp: 10600000.6,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 90000.08999999994,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 840000.09,
          netSalary: 25160000.51
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is gt 10m and lt 18m, dependent 2', function () {
        let allInfor = net(29050280, 2);

        const expectedValues = {
          gross: 29050280,
          dependents: 2,
          giamThueNguoiPhuThuoc: 8800000,
          region: 1,
          BHXH: 2324022.4,
          BHYT: 435754.2,
          BHTN: 290502.8,
          grossIncome: 26000000.6,
          taxableIncomeTemp: 6200000.6,
          thueBac1: 250000,
          thueBac2: 120000.05999999997,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 370000.05999999994,
          netSalary: 25630000.54
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is gt 10m and lt 18m, dependent 3', function () {
        let allInfor = net(29050280, 3);

        const expectedValues = {
          gross: 29050280,
          dependents: 3,
          giamThueNguoiPhuThuoc: 13200000,
          region: 1,
          BHXH: 2324022.4,
          BHYT: 435754.2,
          BHTN: 290502.8,
          grossIncome: 26000000.6,
          taxableIncomeTemp: 1800000.6,
          thueBac1: 90000.03000000001,
          thueBac2: 0,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 90000.03000000001,
          netSalary: 25910000.57
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is gt 10m and lt 18m, dependent 4', function () {
        let allInfor = net(29050280, 4);

        const expectedValues = {
          gross: 29050280,
          dependents: 4,
          giamThueNguoiPhuThuoc: 17600000,
          region: 1,
          BHXH: 2324022.4,
          BHYT: 435754.2,
          BHTN: 290502.8,
          grossIncome: 26000000.6,
          taxableIncomeTemp: 0,
          thueBac1: 0,
          thueBac2: 0,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 0,
          netSalary: 26000000.6
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });
      // _____________________________

      test('Taxable income is eq 18m, dependent 1', function () {
        let allInfor = net(32402235, 1);

        const expectedValues = {
          gross: 32402235,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 1,
          BHXH: 2592178.8,
          BHYT: 486033.525,
          BHTN: 324022.35,
          grossIncome: 29000000.325,
          taxableIncomeTemp: 13600000.325,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 540000.0487499998,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 1290000.0487499998,
          netSalary: 27710000.27625
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is eq 18m, dependent 2', function () {
        let allInfor = net(32_402_235, 2);

        const expectedValues = {
          gross: 32402235,
          dependents: 2,
          giamThueNguoiPhuThuoc: 8800000,
          region: 1,
          BHXH: 2592178.8,
          BHYT: 486033.525,
          BHTN: 324022.35,
          grossIncome: 29000000.325,
          taxableIncomeTemp: 9200000.325,
          thueBac1: 250000,
          thueBac2: 420000.0325,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 670000.0325,
          netSalary: 28330000.2925
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is eq 18m, dependent 3', function () {
        let allInfor = net(32_402_235, 3);

        const expectedValues = {
          gross: 32402235,
          dependents: 3,
          giamThueNguoiPhuThuoc: 13200000,
          region: 1,
          BHXH: 2592178.8,
          BHYT: 486033.525,
          BHTN: 324022.35,
          grossIncome: 29000000.325,
          taxableIncomeTemp: 4800000.325,
          thueBac1: 240000.01625000002,
          thueBac2: 0,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 240000.01625000002,
          netSalary: 28760000.30875
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is eq 18m, dependent 4', function () {
        let allInfor = net(32_402_235, 4);

        const expectedValues = {
          gross: 32402235,
          dependents: 4,
          giamThueNguoiPhuThuoc: 17600000,
          region: 1,
          BHXH: 2592178.8,
          BHYT: 486033.525,
          BHTN: 324022.35,
          grossIncome: 29000000.325,
          taxableIncomeTemp: 400000.325,
          thueBac1: 20000.01625,
          thueBac2: 0,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 20000.01625,
          netSalary: 28980000.30875
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is eq 18m, dependent 5', function () {
        let allInfor = net(32_402_235, 5);

        const expectedValues = {
          gross: 32402235,
          dependents: 5,
          giamThueNguoiPhuThuoc: 22000000,
          region: 1,
          BHXH: 2592178.8,
          BHYT: 486033.525,
          BHTN: 324022.35,
          grossIncome: 29000000.325,
          taxableIncomeTemp: 0,
          thueBac1: 0,
          thueBac2: 0,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 0,
          netSalary: 29000000.325
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });
      //_________________________________

      test('Taxable income is gt 18m and lt 32m, dependent 1', function () {
        let allInfor = net(32_402_236, 1);

        const expectedValues = {
          gross: 32402236,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 1,
          BHXH: 2592178.88,
          BHYT: 486033.54,
          BHTN: 324022.36,
          grossIncome: 29000001.22,
          taxableIncomeTemp: 13600001.22,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 540000.1830000001,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 1290000.1830000002,
          netSalary: 27710001.037
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is gt 18m and lt 32m, dependent 2', function () {
        let allInfor = net(32_402_236, 2);

        const expectedValues = {
          gross: 32402236,
          dependents: 2,
          giamThueNguoiPhuThuoc: 8800000,
          region: 1,
          BHXH: 2592178.88,
          BHYT: 486033.54,
          BHTN: 324022.36,
          grossIncome: 29000001.22,
          taxableIncomeTemp: 9200001.22,
          thueBac1: 250000,
          thueBac2: 420000.1220000001,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 670000.1220000001,
          netSalary: 28330001.098
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is gt 18m and lt 32m, dependent 3', function () {
        let allInfor = net(32_402_236, 3);

        const expectedValues = {
          gross: 32402236,
          dependents: 3,
          giamThueNguoiPhuThuoc: 13200000,
          region: 1,
          BHXH: 2592178.88,
          BHYT: 486033.54,
          BHTN: 324022.36,
          grossIncome: 29000001.22,
          taxableIncomeTemp: 4800001.22,
          thueBac1: 240000.061,
          thueBac2: 0,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 240000.061,
          netSalary: 28760001.159
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is gt 18m and lt 32m, dependent 4', function () {
        let allInfor = net(32_402_236, 4);

        const expectedValues = {
          gross: 32402236,
          dependents: 4,
          giamThueNguoiPhuThuoc: 17600000,
          region: 1,
          BHXH: 2592178.88,
          BHYT: 486033.54,
          BHTN: 324022.36,
          grossIncome: 29000001.22,
          taxableIncomeTemp: 400001.22,
          thueBac1: 20000.061,
          thueBac2: 0,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 20000.061,
          netSalary: 28980001.159
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is gt 18m and lt 32m, dependent 5', function () {
        let allInfor = net(32_402_236, 5);

        const expectedValues = {
          gross: 32402236,
          dependents: 5,
          giamThueNguoiPhuThuoc: 22000000,
          region: 1,
          BHXH: 2592178.88,
          BHYT: 486033.54,
          BHTN: 324022.36,
          grossIncome: 29000001.22,
          taxableIncomeTemp: 0,
          thueBac1: 0,
          thueBac2: 0,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 0,
          netSalary: 29000001.22
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });
      //_____________________________________

      test('Taxable income is eq 32m, dependent 1', function () {
        let allInfor = net(47_884_187, 1);

        const expectedValues = {
          gross: 47884187,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 1,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 478841.87,
          grossIncome: 43985345.13,
          taxableIncomeTemp: 28585345.13,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2117069.026,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 4067069.026,
          netSalary: 39918276.104
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is eq 32m, dependent 2', function () {
        let allInfor = net(47_884_187, 2);

        const expectedValues = {
          gross: 47884187,
          dependents: 2,
          giamThueNguoiPhuThuoc: 8800000,
          region: 1,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 478841.87,
          grossIncome: 43985345.13,
          taxableIncomeTemp: 24185345.13,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 1237069.0259999998,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 3187069.0259999996,
          netSalary: 40798276.104
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is eq 32m, dependent 8', function () {
        let allInfor = net(47_884_187, 8);

        const expectedValues = {
          gross: 47884187,
          dependents: 8,
          giamThueNguoiPhuThuoc: 35200000,
          region: 1,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 478841.87,
          grossIncome: 43985345.13,
          taxableIncomeTemp: 0,
          thueBac1: 0,
          thueBac2: 0,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 0,
          netSalary: 43985345.13
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });
      //______________________________________



      test('Taxable income is gt 32m and lt 52m, dependent 1', function () {
        let allInfor = net(60_900_000, 1);

        const expectedValues = {
          gross: 60900000,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 1,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 609000,
          grossIncome: 56871000,
          taxableIncomeTemp: 41471000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 2367750,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 7117750,
          netSalary: 49753250
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is gt 32m and lt 52m, dependent 11', function () {
        let allInfor = net(60_900_000, 11);

        const expectedValues = {
          gross: 60900000,
          dependents: 11,
          giamThueNguoiPhuThuoc: 48400000,
          region: 1,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 609000,
          grossIncome: 56871000,
          taxableIncomeTemp: 0,
          thueBac1: 0,
          thueBac2: 0,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 0,
          netSalary: 56871000
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      //_________________________________________________

      test('Taxable income is gt 52m and lt 80m, dependent 1, region 1', function () {
        let allInfor = net(68000000, 1, 1);

        const expectedValues = {
          gross: 68000000,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 1,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 680000,
          grossIncome: 63900000,
          taxableIncomeTemp: 48500000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 4125000,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 8875000,
          netSalary: 55025000
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });


      test('Gross is eq 93.6m and taxable income lt 80m (test BHTN), dependent 1, region 1', function () {
        let allInfor = net(93_600_000, 1);

        const expectedValues = {
          gross: 93600000,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 1,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 936000,
          grossIncome: 89244000,
          taxableIncomeTemp: 73844000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 6553200,
          thueBac7: 0,
          totalIncomeTax: 16303200,
          netSalary: 72940800
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });


      test('Gross is gt 93.6m and taxable income lt 80m (test BHTN), dependent 1, region 1', function () {
        let allInfor = net(95_000_000, 1);

        const expectedValues = {
          gross: 95000000,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 1,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 936000,
          grossIncome: 90644000,
          taxableIncomeTemp: 75244000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 6973200,
          thueBac7: 0,
          totalIncomeTax: 16723200,
          netSalary: 73920800
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Gross is gt 93.6m and taxable income lt 80m (test BHTN), dependent 1, region 2', function () {
        let allInfor = net(95_000_000, 1, 2);

        const expectedValues = {
          gross: 95000000,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 2,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 832000,
          grossIncome: 90748000,
          taxableIncomeTemp: 75348000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 7004400,
          thueBac7: 0,
          totalIncomeTax: 16754400,
          netSalary: 73993600
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Gross is gt 93.6m and taxable income lt 80m (test BHTN), dependent 1, region 3', function () {
        let allInfor = net(95_000_000, 1, 3);

        const expectedValues = {
          gross: 95000000,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 3,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 728000,
          grossIncome: 90852000,
          taxableIncomeTemp: 75452000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 7035600,
          thueBac7: 0,
          totalIncomeTax: 16785600,
          netSalary: 74066400
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Gross is gt 93.6m and taxable income lt 80m (test BHTN), dependent 1, region 4', function () {
        let allInfor = net(95_000_000, 1, 4);

        const expectedValues = {
          gross: 95000000,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 4,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 650000,
          grossIncome: 90930000,
          taxableIncomeTemp: 75530000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 7059000,
          thueBac7: 0,
          totalIncomeTax: 16809000,
          netSalary: 74121000
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Gross is gt 93.6m and taxable income lt 80m (test BHTN), dependent 19, region 4', function () {
        let allInfor = net(95_000_000, 19, 1);

        const expectedValues = {
          gross: 95000000,
          dependents: 19,
          giamThueNguoiPhuThuoc: 83600000,
          region: 1,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 936000,
          grossIncome: 90644000,
          taxableIncomeTemp: 0,
          thueBac1: 0,
          thueBac2: 0,
          thueBac3: 0,
          thueBac4: 0,
          thueBac5: 0,
          thueBac6: 0,
          thueBac7: 0,
          totalIncomeTax: 0,
          netSalary: 90644000
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });
      //_____________________________

      test('Taxable income is eq 80m, dependent 1, region 1', function () {
        let allInfor = net(95_356_000, 1, 1);

        const expectedValues = {
          gross: 95356000,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 1,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 936000,
          grossIncome: 91000000,
          taxableIncomeTemp: 75600000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 7080000,
          thueBac7: 0,
          totalIncomeTax: 16830000,
          netSalary: 74170000
        };
        assert.deepStrictEqual(allInfor, expectedValues);


      });

      test('Taxable income is eq 80m, dependent 5, region 4', function () {
        let allInfor = net(95_356_000, 5, 4);

        const expectedValues = {
          gross: 95356000,
          dependents: 5,
          giamThueNguoiPhuThuoc: 22000000,
          region: 4,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 650000,
          grossIncome: 91286000,
          taxableIncomeTemp: 58286000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 1885800,
          thueBac7: 0,
          totalIncomeTax: 11635800,
          netSalary: 79650200
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });
      //______________________________

      test('Taxable income is gt 80m, dependent 1, region 1', function () {
        let allInfor = net(100_000_000, 1, 1);

        const expectedValues = {
          gross: 100000000,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 1,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 936000,
          grossIncome: 95644000,
          taxableIncomeTemp: 80244000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 8400000,
          thueBac7: 85400,
          totalIncomeTax: 18235400,
          netSalary: 77408600
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is gt 80m, dependent 1, region 2', function () {
        let allInfor = net(100_000_000, 1, 2);

        const expectedValues = {
          gross: 100000000,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 2,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 832000,
          grossIncome: 95748000,
          taxableIncomeTemp: 80348000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 8400000,
          thueBac7: 121799.99999999999,
          totalIncomeTax: 18271800,
          netSalary: 77476200
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is gt 80m, dependent 1, region 3', function () {
        let allInfor = net(100_000_000, 1, 3);

        const expectedValues = {
          gross: 100000000,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 3,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 728000,
          grossIncome: 95852000,
          taxableIncomeTemp: 80452000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 8400000,
          thueBac7: 158200,
          totalIncomeTax: 18308200,
          netSalary: 77543800
        };
        assert.deepStrictEqual(allInfor, expectedValues);

      });

      test('Taxable income is gt 80m, dependent 1, region 4', function () {
        let allInfor = net(100_000_000, 1, 4);

        const expectedValues = {
          gross: 100000000,
          dependents: 1,
          giamThueNguoiPhuThuoc: 4400000,
          region: 4,
          BHXH: 2880000,
          BHYT: 540000,
          BHTN: 650000,
          grossIncome: 95930000,
          taxableIncomeTemp: 80530000,
          thueBac1: 250000,
          thueBac2: 500000,
          thueBac3: 1200000,
          thueBac4: 2800000,
          thueBac5: 5000000,
          thueBac6: 8400000,
          thueBac7: 185500,
          totalIncomeTax: 18335500,
          netSalary: 77594500
        };
        assert.deepStrictEqual(allInfor, expectedValues);
      });


    })

  })

})

