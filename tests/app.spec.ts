import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home is accessible and has a single primary heading', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Math Textbook Margins/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('thinking');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('teacher creates a gated lesson and student completes it', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/#/build');
  await page.getByLabel('Lesson title').fill('Balancing equations');
  await page.getByLabel('Source label').fill('Chapter 2, page 18');
  await page.getByRole('button', { name: /Create student link/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('link', { name: /Preview lesson/ }).click();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Balancing equations');
  const a11y = await new AxeBuilder({ page }).analyze();
  expect(a11y.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  const revealButtons = page.getByRole('button', { name: /Reveal the note/ });
  await expect(revealButtons).toHaveCount(1);
  await expect(revealButtons.first()).toBeDisabled();

  for (let step = 0; step < 3; step += 1) {
    const response = page.locator('[data-response]').nth(step);
    await response.fill(`Student reasoning for step ${step + 1}`);
    await page.getByRole('button', { name: /Reveal the note/ }).last().click();
  }

  await expect(page.getByText('Margin complete')).toBeVisible();
  await expect(page.getByRole('button', { name: /Print \/ save answer record/ })).toBeVisible();
  await expect(page.getByText('Revealed', { exact: true })).toHaveCount(3);
  const pdf = await page.pdf({ format: 'A4', printBackground: true });
  expect(pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)?.length).toBe(1);
});

test('builder works at 390px without horizontal overflow', async ({ page }) => {
  await page.goto('/#/build');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole('button', { name: '+ Prediction' })).toBeDisabled();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Remove pause 3' }).click();
  await page.getByRole('button', { name: '+ Prediction' }).click();
  await expect(page.locator('.prompt-slip')).toHaveCount(3);
});

test('bad lesson links provide a recovery path', async ({ page }) => {
  await page.goto('/#/lesson/not-a-lesson');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This margin could not be opened.');
  await expect(page.getByRole('link', { name: 'Go to Margins home' })).toBeVisible();
});

test('privacy and terms are real standalone pages', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy');
  await page.goto('/terms/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Terms');
});

test('the cached shell reopens offline', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('thinking');
});
