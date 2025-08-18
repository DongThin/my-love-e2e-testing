import { test, expect } from '@playwright/test';
test.describe('Homepage Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://thin-pham.web.app/');
  });

test('Homepage has title', async ({ page }) => {
  await expect(page.locator('h1')).toHaveText('Công cụ tính lương Gross sang Net và ngược lại [Chuẩn 2025]');
});

test('Check Input  field', async ({ page }) => {
  const incomeInput = page.locator('#income');

  // Check visible
  await expect(incomeInput).toBeVisible();

  // Check placeholder
  await expect(incomeInput).toHaveAttribute('placeholder', '(VND)');

  // Check input value
  await incomeInput.click()
  await page.pause();
  await incomeInput.fill('10000000');
  await expect(incomeInput).toHaveValue('10000000');
});

test('Tính lương Net từ Gross', async ({ page }) => {
   const luongGross = page.locator('#gross'); 
   const luongNet = page.locator('#net'); 
   
  await page.goto('https://thin-pham.web.app/');

  const incomeInput = page.locator('#income');
  await incomeInput.fill('20000000');

  await page.getByRole('button', { name: 'Gross sang Net' }).click();

  await expect(luongGross).toHaveText('20.000.000 ₫');
  await expect(luongNet).toHaveText('17.460.000 ₫');
  })
  })