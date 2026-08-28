import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const textAtLimit = (length: number, word = 'math') => `${word} `.repeat(Math.ceil(length / (word.length + 1))).slice(0, length);

async function expectNoSeriousAxe(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
}

test('home is accessible and has a single primary heading', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Math Textbook Margins/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('thinking');
  await expectNoSeriousAxe(page);
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
  await expectNoSeriousAxe(page);
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

test('dark home and the light/dark builder have no serious contrast findings', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expectNoSeriousAxe(page);

  await page.goto('/#/build');
  await expectNoSeriousAxe(page);
  await page.getByRole('button', { name: 'Switch color theme' }).click();
  await expectNoSeriousAxe(page);
  await page.getByRole('button', { name: 'Switch color theme' }).click();
  await expectNoSeriousAxe(page);
});

test('accepted boundary content prints on one A4 page', async ({ page }) => {
  await page.goto('/#/build');
  await page.getByLabel('Lesson title').fill(textAtLimit(80, 'algebra'));
  for (const prompt of await page.locator('textarea[name^="question-"]').all()) {
    await prompt.fill(textAtLimit(240, 'equation'));
  }
  await page.getByRole('button', { name: /Create student link/ }).click();
  await page.getByRole('link', { name: /Preview lesson/ }).click();

  const responses = page.locator('[data-response]');
  for (let step = 0; step < 3; step += 1) {
    await responses.last().fill(textAtLimit(240, 'reasoning'));
    await page.getByRole('button', { name: /Reveal the note/ }).click();
  }

  await expect(page.getByText('Margin complete')).toBeVisible();
  const pdf = await page.pdf({ format: 'A4', printBackground: true });
  expect(pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)?.length).toBe(1);
});

test('unbroken accepted title and prompt do not overflow at 390px', async ({ page }) => {
  await page.goto('/#/build');
  await page.getByLabel('Lesson title').fill('x'.repeat(80));
  await page.locator('textarea[name^="question-"]').first().fill('x'.repeat(240));
  await page.getByRole('button', { name: /Create student link/ }).click();
  await page.getByRole('link', { name: /Preview lesson/ }).click();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('bad lesson links provide a recovery path', async ({ page }) => {
  await page.goto('/#/lesson/not-a-lesson');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This margin could not be opened.');
  await expect(page.getByRole('link', { name: 'Go to Margins home' })).toBeVisible();
});

test('privacy and terms are real standalone pages', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy');
  await expectNoSeriousAxe(page);
  await page.goto('/terms/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Terms');
  await expectNoSeriousAxe(page);
});

test('keyboard users can reach the skip link and toggle the theme', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  const theme = page.getByRole('button', { name: 'Switch color theme' });
  await theme.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('the cached shell reopens offline', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => caches.keys())).toContain('margins-shell-v3');
  await page.evaluate(() => navigator.serviceWorker.getRegistration().then((registration) => registration?.update()));
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('thinking');
});
