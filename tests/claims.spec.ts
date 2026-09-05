import { expect, test, type Page } from '@playwright/test';

async function openDemo(page: Page) {
  await page.goto('/demo');
  await expect(page.getByLabel('Demo controls')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Equal steps, equal expressions');
}

async function answerCurrentPrompt(page: Page, answer = 'I would apply the same operation to both sides.') {
  const response = page.locator('[data-response]').last();
  await response.fill(answer);
  const reveal = page.getByRole('button', { name: /Reveal the note/ }).last();
  await expect(reveal).toBeEnabled();
  await reveal.click();
}

async function completeDemo(page: Page) {
  await openDemo(page);
  for (let step = 0; step < 3; step += 1) await answerCurrentPrompt(page, `Reasoning for step ${step + 1}`);
  await expect(page.getByText('Lesson complete')).toBeVisible();
}

test('@claim:free-use completes the sample without a checkout step', async ({ page }) => {
  await completeDemo(page);
  await expect(page.locator('form[action*="checkout" i], [data-payment], iframe[src*="checkout" i]')).toHaveCount(0);
});

test('@claim:no-account opens and uses the sample without sign-in', async ({ page }) => {
  await openDemo(page);
  await answerCurrentPrompt(page);
  await expect(page.locator('input[type="password"], input[autocomplete="username"], input[autocomplete="email"]')).toHaveCount(0);
});

test('@claim:no-textbook-upload presents a populated lesson without a file', async ({ page }) => {
  await openDemo(page);
  await expect(page.getByText('An equation stays balanced when the same operation is applied to both sides.')).toBeVisible();
  await expect(page.locator('input[type="file"]')).toHaveCount(0);
});

test('@claim:answers-local keeps an answer in the demo browser without external requests', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await openDemo(page);
  await page.getByLabel('Your response').fill('Add four to both sides.');
  await page.reload();
  await expect(page.getByLabel('Your response')).toHaveValue('Add four to both sides.');
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:no-server-database completes a sample without a data-changing request', async ({ page }) => {
  const requests: Array<{ method: string; url: string }> = [];
  page.on('request', (request) => requests.push({ method: request.method(), url: request.url() }));
  await completeDemo(page);
  expect(requests.filter((request) => request.method !== 'GET' && request.method !== 'HEAD')).toEqual([]);
  expect(requests.every((request) => new URL(request.url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:answer-before-reveal keeps a note closed until there is an answer', async ({ page }) => {
  await openDemo(page);
  const reveal = page.getByRole('button', { name: /Reveal the note/ });
  await expect(reveal).toBeDisabled();
  await answerCurrentPrompt(page, 'It would not stay equal.');
  await expect(page.getByRole('region', { name: 'Teacher note' })).toContainText('Changing only one side');
});

test('@claim:local-progress-states reloads an answer with a named symbol state', async ({ page }) => {
  await openDemo(page);
  await page.getByLabel('Your response').fill('I predict the equation changes.');
  await expect(page.getByText('◒ Answered — note ready')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Your response')).toHaveValue('I predict the equation changes.');
  await expect(page.getByText('Answered', { exact: true })).toBeVisible();
});

test('@claim:one-page-record exports the completed sample on one A4 page', async ({ page }) => {
  await completeDemo(page);
  const pdf = await page.pdf({ format: 'A4', printBackground: true });
  expect(pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)?.length).toBe(1);
});

test('@claim:phone-desktop completes a response on desktop and a 390px phone viewport', async ({ page, browser }) => {
  await openDemo(page);
  await answerCurrentPrompt(page);
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mobile = await mobileContext.newPage();
  try {
    await openDemo(mobile);
    await answerCurrentPrompt(mobile);
    const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  } finally {
    await mobileContext.close();
  }
});

test('@claim:keyboard-reduced-motion reveals a note with Space and near-instant motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openDemo(page);
  await page.getByLabel('Your response').fill('I predict it no longer balances.');
  const reveal = page.getByRole('button', { name: /Reveal the note/ });
  await reveal.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('region', { name: 'Teacher note' })).toBeVisible();
  const duration = await page.locator('.student-prompt').first().evaluate((element) => getComputedStyle(element).animationDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.001);
});

test('@claim:offline-return reloads the demo after its first visit offline', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:4173/demo');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await expect.poll(() => page.evaluate(() => caches.keys())).toContain('margins-shell-v5');
    await page.reload();
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByLabel('Demo controls')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Equal steps, equal expressions');
  } finally {
    await context.close();
  }
});
