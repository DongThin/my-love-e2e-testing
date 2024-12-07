import findInsurancePolicy from './findInsurancePolicy';
import assert from 'assert';
import {it as test} from 'mocha'
import Big from 'big.js';

describe('Find Insurance Policy', () => {
    const july22 = new Date("2022-07-01");
    const july23 = new Date("2023-07-01");
    const july24 = new Date("2024-07-01");

    describe('Throw error', () => {

        test('Throw error when invalid region', () => {
            assert.throws(() => findInsurancePolicy(5, july23)
                , new Error("Invalid region entered. Please enter again! (1, 2, 3, 4)"));
        })

        test('Throw error when effectiveDate before July 22', () => {
            const july20 = new Date("2020-07-01");
            assert.throws(() => findInsurancePolicy(4, july20)
                , new Error(`There is no insurance policy available for the date provided ${july20.toISOString()}`));
        })

    })
    describe('Find policy', () => {

        test('Find policy for region 1 on July, 2022', () => {
            const expectedResult = {
                baseSalary: new Big(1_490_000),
                minWage: 4_420_000
            };

            const actual = findInsurancePolicy(1, july22);
            assert.deepEqual(actual, expectedResult);
        });

        test('Find policy for region 2 on July, 2023', () => {
            const expectedResult = {
                baseSalary: new Big(1_800_000),
                minWage: 4_160_000
            };

            const actual = findInsurancePolicy(2, july23);
            assert.deepEqual(actual, expectedResult);
        })

        test('Find policy for region 3 on July, 2024', () => {
            const expectedResult = {
                baseSalary: new Big(2_340_000),
                minWage: 3_860_000
            };

            const actual = findInsurancePolicy(3, july24);
            assert.deepEqual(actual, expectedResult);
        })

        test('Find policy for region 4 on July, 2024', () => {
            const expectedResult = {
                baseSalary: new Big(2_340_000),
                minWage: 3_450_000
            };

            const actual = findInsurancePolicy(4, july24);
            assert.deepEqual(actual, expectedResult);
        })

    });
})
