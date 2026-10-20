import { expect, test } from '@playwright/test';

const SITE_URL = process.env.SITE_URL || 'https://htooaungwin.com';
const IS_LOCAL = SITE_URL.startsWith('http://127.0.0.1') || SITE_URL.startsWith('http://localhost');

// The rendered label is `${count.toLocaleString()} visits recorded`, so a real
// count always matches this. "Visitor count unavailable" deliberately does not.
const REAL_COUNT = /[\d,]+ visits recorded/;

async function readVisitorCount(page: import('@playwright/test').Page): Promise<number> {
  const counter = page.getByText(REAL_COUNT);
  await expect(counter).toBeVisible({ timeout: 10000 });
  const text = await counter.textContent();
  return Number((text ?? '').replace(/[^\d]/g, ''));
}

test('homepage exposes the primary portfolio content', async ({ page }) => {
  await page.goto(SITE_URL);

  await expect(page).toHaveTitle(/Htoo Aung Win/);
  await expect(page.getByRole('heading', { level: 1, name: 'Htoo Aung Win' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Projects' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 3, name: 'Cloud Resume Challenge' })).toBeVisible();
});

test('resume and external profile links are real destinations', async ({ page }) => {
  await page.goto(SITE_URL);

  const resume = page.getByRole('link', { name: /résumé/i }).first();
  await expect(resume).toHaveAttribute('href', '/HtooAungWin_resume.pdf');

  const placeholderLinks = page.locator('a[href*="your-username"], a[href*="example.com"]');
  await expect(placeholderLinks).toHaveCount(0);
});

test('visitor counter renders a real number, not the fallback', async ({ page }) => {
  // Locally the API is cross-origin and blocked, so the fallback is expected.
  test.skip(IS_LOCAL, 'API is CORS-blocked from localhost; fallback is correct there');

  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(SITE_URL);

  // Fails if the counter shows "Visitor count unavailable", which is the whole
  // point: the component swallows API errors, so asserting on the fallback text
  // as an acceptable outcome made this test unable to detect a dead backend.
  await expect(page.getByText(REAL_COUNT)).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Visitor count unavailable')).toHaveCount(0);

  const realErrors = errors.filter((error) => !error.includes('favicon'));
  expect(realErrors).toEqual([]);
});

test('visitor counter increments across page loads', async ({ page }) => {
  test.skip(IS_LOCAL, 'API is CORS-blocked from localhost');

  await page.goto(SITE_URL);
  const before = await readVisitorCount(page);

  await page.reload();
  const after = await readVisitorCount(page);

  // The Lambda does an atomic DynamoDB UpdateItem on every GET, so a second
  // load must observe a higher number. A counter stuck on a cached or constant
  // value passes the "shows a number" check but fails this one.
  expect(after).toBeGreaterThan(before);
});

test('mobile profile links and page remain usable without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(SITE_URL);

  await expect(page.getByRole('navigation', { name: 'Profile links' })).toBeVisible();
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});
