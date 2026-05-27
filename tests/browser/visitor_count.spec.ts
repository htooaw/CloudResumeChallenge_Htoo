import { test, expect } from '@playwright/test';

const SITE_URL =
  (globalThis as { process?: { env?: { SITE_URL?: string } } }).process?.env?.SITE_URL ||
  'https://htooaungwin.com';

test('homepage loads', async ({ page }) => {
  await page.goto(SITE_URL);
  await expect(page).toHaveTitle(/.+/);  // title is not empty
});

test('visitor counter shows a number', async ({ page }) => {
  await page.goto(SITE_URL);

  // Wait for the counter to update from "Loading..." to a real value
  const counter = page.getByText(/Visitor: \d+/);
  await expect(counter).toBeVisible({ timeout: 10000 });
});

test('no critical console errors on page load', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto(SITE_URL);
  await page.waitForLoadState('networkidle');

  // Filter out known noisy errors (analytics, third-party scripts, etc.)
  const realErrors = errors.filter((e) => !e.includes('favicon'));

  expect(realErrors).toEqual([]);
});
