import { expect, test } from '@playwright/test';

async function testHomepageLoadsSuccessfully({ page }, testInfo) {

  await page.goto('/');

  await expect(page).toHaveTitle(/Welcome to Dong Thin website/);

  const heading = page.locator('h1');
  await expect(heading).toBeVisible();
}

test('homepage loads successfully', testHomepageLoadsSuccessfully);