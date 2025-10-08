import { test, expect } from '@playwright/test';
import { testData } from '../src/utils/testdata.js';

const { beforeEach, describe } = test;

describe('Salary Calculator - Gross to Net', function () {

    let grossInput;
    let gross;
    let insurances;
    let netSalary;
    let grossSangNetBtn;
    let taxes;

    beforeEach(async function({ page }) {

        await page.goto('https://thin-pham.web.app/');
        grossInput = page.locator('#income');
        gross = page.locator('#gross');
        insurances = page.locator('#insurance');
        netSalary = page.locator('#net');
        grossSangNetBtn = page.getByRole('button', { name: 'Gross sang Net' })
        taxes = page.locator('#tax');
    });

    test('Display homepage title correctly', async function ({ page }) {
        await expect(page.locator('h1')).toHaveText('Công cụ tính lương Gross sang Net và ngược lại [Chuẩn 2025]');
    });

    for (const c of testData.salaries) {
        test(`Net salary is calculated correctly for gross = ${c.gross.toLocaleString('vi-VN')} (${c.desc})`, async function({ page }) {
            await grossInput.fill(c.gross.toString());
            await grossSangNetBtn.click();

            await expect(gross).toHaveText(c.expected.gross);
            await expect(insurances).toHaveText(c.expected.insurances);
            await expect(taxes).toHaveText(c.expected.taxes);
            await expect(netSalary).toHaveText(c.expected.netSalary);
        });
    }
})