const Big = require('big.js');
var net = require('../src/net.js')
var assert = require('assert');
var test = require('mocha').it;

describe("CALCULATE NET SALARY:", function () {
  console.log("*************************");

  describe("Gross is lte 12.290500m (No tax)", function () {
    describe("NO DEPENDENTS: ", function () {

      test('Gross is equal 12.290503m', () => {


        let netSalary = net(12290503, 0);
        let roundedSalary = Math.round(netSalary);

        assert.equal(roundedSalary, 11000000);
      });

      test('Gross is lt 12.290500m', function () {
        const netSalary = net(2000000, 0);

        assert.equal(netSalary.toNumber(), 1790000);
      });

      test('Gross is almost 0', function () {
        const netSalary = net(3, 0);

        assert.equal(netSalary.toNumber(), 2.685);
      });

      test('Gross is eq 0', function () {
        const netSalary = net(0, 0);

        assert.equal(netSalary.toNumber(), 0);
      });
    })

    describe("HAVING DEPENDENTS", function () {

      test('Gross is equal 12.290503m ', () => {

        let netSalary = net(12290503, 1);
        let roundedSalary = Math.floor(netSalary);

        assert.equal(roundedSalary, 11000000);
      });
    })

    describe("Gross is gt 12.290503m (tax)", function () {

      describe("NO DEPENDENTS: ", function () {

        test('Taxable income is lte 5m', () => {
          const netSalary = net(16000000, 0);

          assert.equal(netSalary.toNumber(), 14154000);
        });

        test('Taxable income is lte 5m (region 2)', () => {
          const netSalary = net(16000000, 0, 2);

          assert.equal(netSalary.toNumber(), 14154000);
        });
        //______________________________________________

        test('Taxable income is gt 5m and lt 10m', () => {
          const netSalary = net(20000000, 0);

          assert.equal(netSalary.toNumber(), 17460000);
        });

        test('Taxable income is eq 10m', () => {
          const netSalary = net(23463687, 0);

          assert.equal(netSalary.toNumber(), 20249999.8785);
        });
        //_______________________________________________

        test('Taxable income is gt 10m and lt 18m', () => {
          let netSalary = net(29050280, 0);

          assert.equal(netSalary.toNumber(), 24500000.51);
        });

        test('Taxable income is eq 18m', () => {
          let netSalary = net(32402235, 0);

          assert.equal(netSalary.toNumber(), 27050000.26);
        });
        //___________________________________________

        test('Taxable income is gt 18m and lt 32m', () => {
          let netSalary = net(32402236, 0);

          assert.equal(netSalary.toNumber(), 27050000.976);
        });

        test('Taxable income is eq 32m', () => {
          let netSalary = net(47884187, 0);

          assert.equal(netSalary.toNumber(), 38989008.8475);
        });
        //_____________________________________________

        test('Taxable income is gt 32m and lt 52m', () => {
          let netSalary = net(60900000, 0);

          assert.equal(netSalary.toNumber(), 48653250);
        });

        test('Taxable income is eq 52m', () => {
          let netSalary = net(67_090_909, 0);

          assert.equal(netSalary.toNumber(), 53_249_999.9325);
        });

        test('Taxable income is gt 52m and lt 80m', () => {
          let netSalary = net(70_000_000, 0, 1);

          assert.equal(netSalary.toNumber(), 55_266_000);
        });
        //__________________________________________

        test('Gross is eq 93.6m (test BHTN), dependent 0, region 1', () => {
          let netSalary = net(93_600_000, 0, 1);

          assert.equal(netSalary.toNumber(), 71_620_800);
        });

        test('Gross is gt 93.6m (test BHTN), dependent 0, region 1', () => {
          let netSalary = net(95_000_000, 0, 1);

          assert.equal(netSalary.toNumber(), 72_600_800);
        });

        test('Gross is gt 93.6m (test BHTN), dependent 0, region 2', () => {
          let netSalary = net(95_000_000, 0, 2);

          assert.equal(netSalary.toNumber(), 72_673_600);
        });

        test('Gross is gt 93.6m (test BHTN), dependent 0, region 3', () => {
          let netSalary = net(95_000_000, 0, 3);

          assert.equal(netSalary.toNumber(), 72_746_400);
        });

        test('Gross is gt 93.6m (test BHTN), dependent 0, region 4', () => {
          let netSalary = net(95_000_000, 0, 4);

          assert.equal(netSalary.toNumber(), 72_801_000);
        });
        //____________________________________

        test('Taxable income is eq 80m', () => {
          let netSalary = net(95_356_000, 0, 1);

          assert.equal(netSalary.toNumber(), 72_850_000);
        });

        test('Taxable income is eq 80m, region 2)', () => {
          let netSalary = net(95_356_000, 0, 2);

          assert.equal(netSalary.toNumber(), 72_917_600);
        });

        test('Taxable income is eq 80m, region 3)', () => {
          let netSalary = net(95_356_000, 0, 3);

          assert.equal(netSalary.toNumber(), 72_985_200);
        });
        
        test('Taxable income is eq 80m, region 4)', () => {
          let netSalary = net(95_356_000, 0, 4);

          assert.equal(netSalary.toNumber(), 73_035_900);
        });


        test('Taxable income is gt 80m ', () => {
          let netSalary = net(100_000_000, 0, 4);

          assert.equal(netSalary.toNumber(), 76_054_500);
        });

        test('Taxable income is gt 80m, region 2)', () => {
          let netSalary = net(100_000_000, 0, 2);

          assert.equal(netSalary.toNumber(), 75_936_200);
        });
      

      })
      //_______________________________________________

      describe("HAVING DEPENDENTS: ", ()=>{

        test('Taxable income is lt 5m (taxincome eq 0, dependent 1)', () => {
          const netSalary = net(16_000_000, 1, 1);

          assert.equal(netSalary.toNumber(), 14_320_000);
        });

        test('Taxable income is lt 5m (taxincome eq 0, dependent 2)', () => {
          const netSalary = net(16_000_000, 2, 1);

          assert.equal(netSalary.toNumber(), 14_320_000);
        });

        test('Taxable income is eq 5m (taxincome eq 0, dependent 1)', () => {
          const netSalary = net(17_206_704, 1, 1);

          assert.equal(netSalary.toNumber(), 15400000.076);
        });

        test('Taxable income is gt 5m and lt 10m, dependent 1)', () => {
          const netSalary = net(20_000_000, 1, 1);

          assert.equal(netSalary.toNumber(), 17_775_000);
        });

        test('Taxable income is gt 5m and lt 10m, dependent 2)', () => {
          const netSalary = net(20_000_000, 2, 1);

          assert.equal(netSalary.toNumber(), 17_900_000);
        });

        test('Taxable income is eq 10m, dependent 1', () => {
          const netSalary = net(23463687, 1);

          assert.equal(netSalary.toNumber(), 20_689_999.8785);
        });

        test('Taxable income is eq 10m, dependent 2', () => {
          const netSalary = net(23463687, 2);

          assert.equal(netSalary.toNumber(), 20_939_999.87175);
        });

        test('Taxable income is eq 10m, dependent 3', () => {
          const netSalary = net(23463687, 3);

          assert.equal(netSalary.toNumber(), 20_999_999.865);
        });

        test('Taxable income is gt 10m and lt 18m, dependent 1', () => {
          let netSalary = net(29050280, 1);

          assert.equal(netSalary.toNumber(), 25_160_000.51);
        });

        test('Taxable income is gt 10m and lt 18m, dependent 2', () => {
          let netSalary = net(29050280, 2);

          assert.equal(netSalary.toNumber(), 25_630_000.54);
        });

        test('Taxable income is gt 10m and lt 18m, dependent 3', () => {
          let netSalary = net(29050280, 3);

          assert.equal(netSalary.toNumber(), 25_910_000.57);
        });

        test('Taxable income is gt 10m and lt 18m, dependent 4', () => {
          let netSalary = net(29050280, 4);

          assert.equal(netSalary.toNumber(), 26_000_000.6);
        });
       // _____________________________

        test('Taxable income is eq 18m, dependent 1', () => {
          let netSalary = net(32402235, 1);

          assert.equal(netSalary.toNumber(), 27_710_000.27625);
        });

        test('Taxable income is eq 18m, dependent 2', () => {
          let netSalary = net(32_402_235, 2);

          assert.equal(netSalary.toNumber(), 28_330_000.2925);
        });

        test('Taxable income is eq 18m, dependent 3', () => {
          let netSalary = net(32_402_235, 3);

          assert.equal(netSalary.toNumber(), 28_760_000.30875);
        });

        test('Taxable income is eq 18m, dependent 4', () => {
          let netSalary = net(32_402_235, 4);

          assert.equal(netSalary.toNumber(), 28_980_000.30875);
        });
        
        test('Taxable income is eq 18m, dependent 5', () => {
          let netSalary = net(32_402_235, 5);

          assert.equal(netSalary.toNumber(), 29_000_000.325);
        });
        //_________________________________

        test('Taxable income is gt 18m and lt 32m, dependent 1', () => {
          let netSalary = net(32_402_236, 1);

          assert.equal(netSalary.toNumber(), 27_710_001.037);
        });

        test('Taxable income is gt 18m and lt 32m, dependent 2', () => {
          let netSalary = net(32_402_236, 2);

          assert.equal(netSalary.toNumber(), 28_330_001.098);
        });

        test('Taxable income is gt 18m and lt 32m, dependent 3', () => {
          let netSalary = net(32_402_236, 3);

          assert.equal(netSalary.toNumber(), 28_760_001.159);
        });

        test('Taxable income is gt 18m and lt 32m, dependent 4', () => {
          let netSalary = net(32_402_236, 4);

          assert.equal(netSalary.toNumber(), 28_980_001.159);
        });
        
        test('Taxable income is gt 18m and lt 32m, dependent 5', () => {
          let netSalary = net(32_402_236, 5);

          assert.equal(netSalary.toNumber(), 29_000_001.22);
        });
        //_____________________________________

        test('Taxable income is eq 32m, dependent 1', () => {
          let netSalary = net(47_884_187, 1);

          assert.equal(netSalary.toNumber(), 39_918_276.104);
        });

        test('Taxable income is eq 32m, dependent 2', () => {
          let netSalary = net(47_884_187, 2);

          assert.equal(netSalary.toNumber(), 40_798_276.104);
        });

        test('Taxable income is eq 32m, dependent 8', () => {
          let netSalary = net(47_884_187, 8);

          assert.equal(netSalary.toNumber(), 43_985_345.13);
        });
        //______________________________________



        test('Taxable income is gt 32m and lt 52m, dependent 1', () => {
          let netSalary = net(60_900_000, 1);

          assert.equal(netSalary.toNumber(), 49_753_250);
        });

        test('Taxable income is gt 32m and lt 52m, dependent 11', () => {
          let netSalary = net(60_900_000, 11);

          assert.equal(netSalary.toNumber(), 56_871_000);
        });

        //_________________________________________________

        test('Taxable income is gt 52m and lt 80m, dependent 1, region 1', () => {
          let netSalary = net(68000000, 1, 1);

          assert.equal(netSalary.toNumber(), 55_025_000);
        });

        
        test('Gross is eq 93.6m and taxable income lt 80m (test BHTN), dependent 1, region 1', () => {
          let netSalary = net(93_600_000, 1, 1);

          assert.equal(netSalary.toNumber(), 72_940_800);
        });

        
        test('Gross is gt 93.6m and taxable income lt 80m (test BHTN), dependent 1, region 1', () => {
          let netSalary = net(95_000_000, 1, 1);

          assert.equal(netSalary.toNumber(), 73_920_800);
        });

        test('Gross is gt 93.6m and taxable income lt 80m (test BHTN), dependent 1, region 2', () => {
          let netSalary = net(95_000_000, 1, 2);

          assert.equal(netSalary.toNumber(), 73_993_600);
        });

        test('Gross is gt 93.6m and taxable income lt 80m (test BHTN), dependent 1, region 3', () => {
          let netSalary = net(95_000_000, 1, 3);

          assert.equal(netSalary.toNumber(), 74_066_400);
        });

        test('Gross is gt 93.6m and taxable income lt 80m (test BHTN), dependent 1, region 4', () => {
          let netSalary = net(95_000_000, 1, 4);

          assert.equal(netSalary.toNumber(), 74_121_000);
        });

        test('Gross is gt 93.6m and taxable income lt 80m (test BHTN), dependent 19, region 4', () => {
          let netSalary = net(95_000_000, 19, 1);

          assert.equal(netSalary.toNumber(), 90_644_000);
        });
        //_____________________________

        test('Taxable income is eq 80m, dependent 1, region 1', () => {
          let netSalary = net(95_356_000, 1, 1);

          assert.equal(netSalary.toNumber(), 74_170_000);
        });

        test('Taxable income is eq 80m, dependent 5, region 4', () => {
          let netSalary = net(95_356_000, 5, 4);

          assert.equal(netSalary.toNumber(), 79_650_200);
        });
        //______________________________

        test('Taxable income is gt 80m, dependent 1, region 1', () => {
          let netSalary = net(100_000_000, 1, 1);

          assert.equal(netSalary.toNumber(), 77_408_600);
        });

        test('Taxable income is gt 80m, dependent 1, region 2', () => {
          let netSalary = net(100_000_000, 1, 2);

          assert.equal(netSalary.toNumber(), 77_476_200);
        });

        test('Taxable income is gt 80m, dependent 1, region 3', () => {
          let netSalary = net(100_000_000, 1, 3);

          assert.equal(netSalary.toNumber(), 77_543_800);
        });

        test('Taxable income is gt 80m, dependent 1, region 4', () => {
          let netSalary = net(100_000_000, 1, 4);

          assert.equal(netSalary.toNumber(), 77_594500);
          assert.equal(1, 1);
        });
 
      })

    })

  })
})
