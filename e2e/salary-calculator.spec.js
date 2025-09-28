import { test, expect } from '@playwright/test';
import { testData } from '../src/utils/testdata.js';

const { beforeEach, describe } = test;

let incomeInput;
let luongGross;
let baoHiem;
let luongNet;
let grossSangNetBtn;
let thueTNCN;

beforeEach(async ({ page }) => {

    await page.goto('https://thin-pham.web.app/');
    incomeInput = page.locator('#income');
    luongGross = page.locator('#gross');
    baoHiem = page.locator('#insurance');
    luongNet = page.locator('#net');
    grossSangNetBtn = page.getByRole('button', { name: 'Gross sang Net' })
    thueTNCN = page.locator('#tax');
});


describe('Salary Calculator - Gross to Net', function () {

    test('Display homepage title correctly', async ({ page }) => {
        await expect(page.locator('h1')).toHaveText('Công cụ tính lương Gross sang Net và ngược lại [Chuẩn 2025]');
    });

    for (const c of testData.salary) {
        test(`Net salary is calculated correctly for gross = ${c.luongGross.toLocaleString('vi-VN')} (${c.desc})`, async ({ page }) => {
            await incomeInput.fill(c.luongGross.toString());
            await grossSangNetBtn.click();


            await expect(luongGross).toHaveText(c.expected.luongGross);
            await expect(baoHiem).toHaveText(c.expected.baoHiem);
            await expect(thueTNCN).toHaveText(c.expected.thueTNCN);
            await expect(luongNet).toHaveText(c.expected.luongNet);
        });
    }
})