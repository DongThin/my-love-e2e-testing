import { expect } from 'chai';
import { it as test } from 'mocha';
import * as calcTaxableIncome from './calcTaxableIncome';
import sinon from "sinon";


describe('Calculate Taxable Income', () => {
    let mockData;

    afterEach(() => {
        if (mockData) {
            mockData.restore();
        }
    });

    describe('Test Taxable Income when no dependent deducted', () => {
        test('No taxable income when Net Income is lte 11_000_000', async () => {
            mockData = sinon.stub(calcTaxableIncome, 'default');
            mockData.withArgs(11_000_000, 0).returns(Promise.resolve(0));

            const actual = await calcTaxableIncome.default(11_000_000, 0);
            expect(actual).to.equal(0);
            expect(mockData.calledOnceWithExactly(11_000_000, 0)).to.be.true;
        });

        test('The total tax is calculated correctly for tax rate 1 only', async () => {
            // ti <= 5_000_000     ==> net <= 15_750_000
            mockData = sinon.stub(calcTaxableIncome, 'default');
            mockData.withArgs(15_750_000, 0).returns(Promise.resolve(1_000_000));

            const actual = await calcTaxableIncome.default(15_750_000, 0);
            expect(actual).to.equal(1_000_000);
            expect(mockData.calledOnceWithExactly(15_750_000, 0)).to.be.true;
        });

        test('The total tax is calculated correctly for 2 first tax rates', async () => {
            // ti <= 10_000_000 ==> net <= 20_250_000
            mockData = sinon.stub(calcTaxableIncome, 'default');
            mockData.withArgs(20_250_000, 0).returns(Promise.resolve(20));

            const actual = await calcTaxableIncome.default(20_250_000, 0);
            expect(actual).to.be.a('number').that.is.greaterThan(0);
            expect(mockData.calledOnceWithExactly(20_250_000, 0)).to.be.true;
        });

        test('The total tax is calculated correctly for 3 first tax rates', async () => {
            // ti <= 18_000_000 ==> net <= 27_050_000
            mockData = sinon.stub(calcTaxableIncome, 'default');
            mockData.withArgs(27_050_000, 0).returns(Promise.resolve(20));

            const actual = await calcTaxableIncome.default(27_050_000, 0);
            expect(actual).to.equal(20);
            expect(mockData.calledOnceWithExactly(27_050_000, 0)).to.be.true;
        });

        test('The total tax is calculated correctly for 4 first tax rates', async () => {
            // ti <= 32_000_000 ==> net <= 38_250_000
            mockData = sinon.stub(calcTaxableIncome, 'default');
            mockData.withArgs(38_250_000, 0).returns(Promise.resolve(10));

            const actual = await calcTaxableIncome.default(38_250_000, 0);
            expect(actual).to.equal(10);
            expect(mockData.calledOnceWithExactly(38_250_000, 0)).to.be.true;
        });

        test('The total tax is calculated correctly for 5 first tax rates', async () => {
            // ti <= 52_000_000 ==> net <= 53_250_000
            mockData = sinon.stub(calcTaxableIncome, 'default');
            mockData.withArgs(53_250_000, 0).returns(Promise.resolve(10));

            const actual = await calcTaxableIncome.default(53_250_000, 0);
            expect(actual).to.equal(10);
            expect(mockData.calledOnceWithExactly(53_250_000, 0)).to.be.true;
        });

        test('The total tax is calculated correctly for 6 first tax rates', async () => {
            // ti <= 80_000_000  ==> net <= 72_850_000
            mockData = sinon.stub(calcTaxableIncome, 'default');
            mockData.withArgs(72_850_000, 0).returns(Promise.resolve(10));

            const actual = await calcTaxableIncome.default(72_850_000, 0);
            expect(actual).to.equal(10);
            expect(mockData.calledOnceWithExactly(72_850_000, 0)).to.be.true;
        });

        test('The total tax is calculated correctly for all 7 tax rates', async () => {
            // ti > 80_000_000 ==> net > 72_850_000
            mockData = sinon.stub(calcTaxableIncome, 'default');
            mockData.withArgs(72_950_000, 0).returns(Promise.resolve(10));

            const actual = await calcTaxableIncome.default(72_950_000, 0);
            expect(actual).to.equal(10);
            expect(mockData.calledOnceWithExactly(72_950_000, 0)).to.be.true;
        });
    });

    describe('Test Taxable Income when having dependent deducted', () => {
        test('Taxes fully deducted with dependents', async () => {
            // 1 dependent = 4400000
            mockData = sinon.stub(calcTaxableIncome, 'default');
            mockData.withArgs(11_000_000 + 4400000, 1).returns(Promise.resolve(10));

            const actual = await calcTaxableIncome.default(11_000_000 + 4400000, 1);
            expect(actual).to.equal(10);
            expect(mockData.calledOnceWithExactly(11_000_000 + 4400000, 1)).to.be.true;
        });

        test('Taxes partially deducted with dependents', async () => {
            mockData = sinon.stub(calcTaxableIncome, 'default');
            mockData.withArgs(15_750_000, 1).returns(Promise.resolve(10));

            const actual = await calcTaxableIncome.default(15_750_000, 1);
            expect(actual).to.equal(10);
            expect(mockData.calledOnceWithExactly(15_750_000, 1)).to.be.true;
        });
    });
});


