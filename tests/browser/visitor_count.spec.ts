import { expect, test } from '@playwright/test';

const SITE_URL = process.env.SITE_URL || 'https://htooaungwin.com';
const IS_LOCAL = SITE_URL.startsWith('http://127.0.0.1') || SITE_URL.startsWith('http://localhost');

test('homepage exposes the primary portfolio content', async ({ page }) => {
  await page.goto(SITE_URL);

  await expect(page).toHaveTitle(/Htoo Aung Win/);
  await expect(page.getByRole('heading', { level: 1, name: /Cloud & DevOps Engineer/i })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: /Cloud and infrastructure projects/i })).toBeVisible();
  await expect(page.getByRole('heading', { level: 3, name: 'Cloud Resume Challenge' })).toBeVisible();
});

test('resume and external profile links are real destinations', async ({ page }) => {
  await page.goto(SITE_URL);

  const resume = page.getByRole('link', { name: /résumé/i }).first();
  await expect(resume).toHaveAttribute('href', '/Htoo_Aung_Win_Resume_DevOps.pdf');

  const placeholderLinks = page.locator('a[href*="your-username"], a[href*="example.com"]');
  await expect(placeholderLinks).toHaveCount(0);
});

test('visitor counter resolves without critical console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(SITE_URL);
  await expect(page.getByText(/(?:[\d,]+ visits recorded|Visitor count unavailable)/)).toBeVisible({ timeout: 10000 });
  const realErrors = errors.filter((error) => {
    if (error.includes('favicon')) return false;
    if (IS_LOCAL && (error.includes('blocked by CORS policy') || error.includes('net::ERR_FAILED'))) return false;
    return true;
  });
  expect(realErrors).toEqual([]);
});

test('mobile navigation and page remain usable without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(SITE_URL);

  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});
