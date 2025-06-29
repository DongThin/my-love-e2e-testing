import { expect } from 'chai';
import findInsurancePolicy from './findInsurancePolicy';
import { it as test } from 'mocha';
import Big from "../../lib/big.js";

describe('Insurance Policy Finder', () => {
    const july22 = new Date("2022-07-01");
    const july23 = new Date("2023-07-01");
    const july24 = new Date("2024-07-01");

    describe('Input Validation', () => {
        test('should throw error when invalid region is provided', () => {
            expect(() => findInsurancePolicy(5, july23))
                .to.throw("Invalid region entered. Please enter again! (1, 2, 3, 4)");
        });

        test('should throw error when date is before July 2022', () => {
            const july20 = new Date("2020-07-01");
            expect(() => findInsurancePolicy(4, july20))
                .to.throw(`There is no insurance policy available for the date provided ${july20.toISOString()}`);
        });
    });

    describe('Policy Lookup by Region and Date', () => {
        test('should find correct policy for region 1 in July 2022', () => {
            const expectedResult = {
                baseSalary: new Big(1_490_000),
                minWage: 4_420_000
            };

            const actual = findInsurancePolicy(1, july22);
            expect(actual.baseSalary.eq(expectedResult.baseSalary)).to.be.true;
            expect(actual.minWage).to.equal(expectedResult.minWage);
        });

        test('should find correct policy for region 2 in July 2023', () => {
            const expectedResult = {
                baseSalary: new Big(1_800_000),
                minWage: 4_160_000
            };

            const actual = findInsurancePolicy(2, july23);
            expect(actual.baseSalary.eq(expectedResult.baseSalary)).to.be.true;
            expect(actual.minWage).to.equal(expectedResult.minWage);
        });

        test('should find correct policy for region 3 in July 2024', () => {
            const expectedResult = {
                baseSalary: new Big(2_340_000),
                minWage: 3_860_000
            };

            const actual = findInsurancePolicy(3, july24);
            expect(actual.baseSalary.eq(expectedResult.baseSalary)).to.be.true;
            expect(actual.minWage).to.equal(expectedResult.minWage);
        });

        test('should find correct policy for region 4 in July 2024', () => {
            const expectedResult = {
                baseSalary: new Big(2_340_000),
                minWage: 3_450_000
            };

            const actual = findInsurancePolicy(4, july24);
            expect(actual.baseSalary.eq(expectedResult.baseSalary)).to.be.true;
            expect(actual.minWage).to.equal(expectedResult.minWage);
        });
    });
});
