import findInsurancePolicy from './findInsurancePolicy';
import assert from 'assert';
import {it as test} from 'mocha'

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
    // describe("Find policy", ()=>{
    //     test("")
    // })
})

