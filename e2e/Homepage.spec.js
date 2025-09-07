import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://thin-pham.web.app/');
  });
  
  test('Homepage has title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Công cụ tính lương Gross sang Net và ngược lại [Chuẩn 2025]');
  });
})