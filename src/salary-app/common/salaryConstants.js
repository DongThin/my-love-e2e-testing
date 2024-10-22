import Big from 'big.js';

export const DEDUCTION_PER_PERSON = 4_400_000;

export const SELF_DEDUCTION = 11_000_000;

export const BIG_20 = new Big(20);

export const TAX_RATES = [
    {name: 'Tax level 1', rate: 0.05, deduction: 5000000},
    {name: 'Tax level 2', rate: 0.1, deduction: 5000000},
    {name: 'Tax level 3', rate: 0.15, deduction: 8000000},
    {name: 'Tax level 4', rate: 0.2, deduction: 14000000},
    {name: 'Tax level 5', rate: 0.25, deduction: 20000000},
    {name: 'Tax level 6', rate: 0.3, deduction: 28000000},
    {name: 'Tax level 7', rate: 0.35, deduction: 80000000}
];
