import { test, expect } from '@playwright/test';
import { testData } from '../src/utils/testdata.js';

let incomeInput;
let luongGross;
let baoHiem;
let luongNet;
let grossSangNetBtn;
let thueTNCN;

test.beforeEach(async ({ page }) => {
    await page.goto('https://thin-pham.web.app/');
    incomeInput = page.locator('#income');
    luongGross = page.locator('#gross');
    baoHiem = page.locator('#insurance');
    luongNet = page.locator('#net');
    grossSangNetBtn = page.getByRole('button', { name: 'Gross sang Net' })
    thueTNCN = page.locator('#tax');
});


test.describe('Homepage test UI', () => {

    test('Homepage has title', async ({ page }) => {
        await expect(page.locator('h1')).toHaveText('Công cụ tính lương Gross sang Net và ngược lại [Chuẩn 2025]');
    });


    test('Check Input field', async ({ page }) => {

        // Check visible
        await expect(incomeInput).toBeVisible();

        // Check placeholder
        await expect(incomeInput).toHaveAttribute('placeholder', '(VND)');

        // Check input value
        await incomeInput.click()
        await page.pause();
        await incomeInput.fill('10000000');
        await expect(incomeInput).toHaveValue('10000000');
    })
})

test.describe('Calculator Functionality', () => {

    test('It should return no tax when taxableIncome is lte 0', async ({ page }) => {

        await incomeInput.click();
        await incomeInput.fill(testData.users.notax.luongGross.toString());

        await grossSangNetBtn.click();

        await expect(luongGross).toHaveText('5.000.000 ₫');
        await expect(baoHiem).toHaveText('525.000 ₫');
        await expect(thueTNCN).toHaveText('0 ₫');
        await expect(luongNet).toHaveText('4.475.000 ₫');
    })

    test('It applies tax rate 1 only', async ({ page }) => {

        await incomeInput.click();
        await incomeInput.fill(testData.users.lv1.luongGross.toString());

        await grossSangNetBtn.click();
        await expect(luongGross).toHaveText('12.300.000 ₫');
        await expect(baoHiem).toHaveText('1.291.500 ₫');
        await expect(thueTNCN).toHaveText('425 ₫');
        await expect(luongNet).toHaveText('11.008.075 ₫');
    })

    test('It applies 2 first tax rates', async ({ page }) => {

        await incomeInput.click();
        await incomeInput.fill('17_900_000');

        await grossSangNetBtn.click();

        await expect(luongGross).toHaveText('17.900.000 ₫');
        await expect(baoHiem).toHaveText('1.879.500 ₫');
        await expect(thueTNCN).toHaveText('252.050 ₫');
        await expect(luongNet).toHaveText('15.768.450 ₫');
    })

    test('It applies 3 first tax rates', async ({ page }) => {

        await incomeInput.click();
        await incomeInput.fill('23_463_687');

        await grossSangNetBtn.click();

        await expect(luongGross).toHaveText('23.463.687 ₫');
        await expect(baoHiem).toHaveText('2.463.687 ₫');
        await expect(thueTNCN).toHaveText('750.000 ₫');
        await expect(luongNet).toHaveText('20.250.000 ₫');
    })

    test('It applies 4 first tax rates', async ({ page }) => {

        await incomeInput.click();
        await incomeInput.fill('32.402.235');

        await grossSangNetBtn.click();

        await expect(luongGross).toHaveText('32.402.235 ₫');
        await expect(baoHiem).toHaveText('3.402.235 ₫');
        await expect(thueTNCN).toHaveText('1.950.000 ₫');
        await expect(luongNet).toHaveText('27.050.000 ₫');
    })
    test('It applies 5 first tax rates', async ({ page }) => {

        await incomeInput.click();
        await incomeInput.fill('48.044.693');

        await grossSangNetBtn.click();

        await expect(luongGross).toHaveText('48.044.693 ₫');
        await expect(baoHiem).toHaveText('4.926.447 ₫');
        await expect(thueTNCN).toHaveText('4.779.562 ₫');
        await expect(luongNet).toHaveText('38.338.685 ₫');
    })

    test('It applies 6 first tax rates', async ({ page }) => {

        await incomeInput.click();
        await incomeInput.fill('70.391.061');

        await grossSangNetBtn.click();

        await expect(luongGross).toHaveText('70.391.061 ₫');
        await expect(baoHiem).toHaveText('5.149.911 ₫');
        await expect(thueTNCN).toHaveText('10.422.345 ₫');
        await expect(luongNet).toHaveText('54.818.805 ₫');
    })

    test('It applies all tax rates', async ({ page }) => {

        await incomeInput.click();
        await incomeInput.fill('101.675.978');

        await grossSangNetBtn.click();

        await expect(luongGross).toHaveText('101.675.978 ₫');
        await expect(baoHiem).toHaveText('5.438.000 ₫');
        await expect(thueTNCN).toHaveText('19.983.292 ₫');
        await expect(luongNet).toHaveText('76.254.686 ₫');
    })

})