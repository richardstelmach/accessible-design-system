import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 1000 });
  await page.goto('/?date-errors');
  await page.evaluate(() => document.fonts.ready);
});

test('failed submissions focus once, sort document order and preserve answers during correction', async ({ page }) => {
  const title = await page.title();
  await page.evaluate(() => {
    document.body.dataset.summaryFocusCount = '0';
    document.addEventListener('focusin', event => {
      if ((event.target as Element).classList.contains('owla11y-error-summary')) document.body.dataset.summaryFocusCount = String(Number(document.body.dataset.summaryFocusCount) + 1);
    });
  });
  await page.getByRole('button', { name: 'Submit application' }).click();
  const summary = page.locator('.owla11y-error-summary');
  await expect(summary).toBeFocused(); await expect(summary).toHaveAttribute('tabindex', '-1');
  await expect(summary.locator('h2')).toHaveText('There is a problem');
  await expect(summary.locator('li > a')).toHaveText(['Enter your full name.', 'Enter your date of birth.', 'Tell us what happened.', 'Select a country.', 'Choose a contact method.', 'Confirm that you agree to the terms.']);
  await expect(page.locator('body')).toHaveAttribute('data-summary-focus-count', '1');
  await page.keyboard.press('Tab'); await expect(summary.getByRole('link').first()).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.getByLabel('Full name', { exact: true })).toBeFocused();
  await page.keyboard.type('Ada Lovelace');
  await expect(page.locator('body')).toHaveAttribute('data-summary-focus-count', '1');
  await page.getByRole('button', { name: 'Submit application' }).click();
  await expect(summary).toBeFocused(); await expect(page.locator('body')).toHaveAttribute('data-summary-focus-count', '2');
  await expect(page.getByLabel('Full name', { exact: true })).toHaveValue('Ada Lovelace');
  await expect(page).toHaveTitle(`Error: ${title}`);
  await page.getByRole('button', { name: 'Reset application' }).click();
  await expect(summary).toHaveCount(0); await expect(page).toHaveTitle(title);
});

test('whole-date and specific-part links focus the right input and retain one shared error owner', async ({ page }) => {
  const date = page.locator('#birth-date');
  await page.getByRole('button', { name: 'Submit application' }).click();
  await page.getByRole('link', { name: 'Enter your date of birth.', exact: true }).click();
  await expect(date.getByLabel('Day', { exact: true })).toBeFocused();
  await expect(date).toHaveAccessibleDescription('For example, 31 3 1980. Enter your date of birth.');
  await expect(date.getByLabel('Day', { exact: true })).not.toHaveAttribute('aria-invalid');
  await date.getByLabel('Day', { exact: true }).fill('31'); await date.getByLabel('Month', { exact: true }).fill('3');
  await page.getByRole('button', { name: 'Submit application' }).click();
  await page.getByRole('link', { name: 'Date of birth must include a year.', exact: true }).click();
  await expect(date.getByLabel('Year', { exact: true })).toBeFocused();
  await expect(date.getByLabel('Year', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(date.getByLabel('Year', { exact: true })).toHaveAccessibleDescription('Date of birth must include a year.');
  await expect(date).toHaveAccessibleDescription('For example, 31 3 1980.');
  await expect(date).not.toHaveAttribute('aria-invalid');
  await expect(date.getByLabel('Month', { exact: true })).toHaveValue('3');
  await expect(date.locator('.owla11y-error')).toHaveCount(1);
});

test('summary navigation covers textarea, select, group radio and standalone checkbox', async ({ page }) => {
  await page.getByRole('button', { name: 'Submit application' }).click();
  for (const [text, id] of [['Tell us what happened.', 'case-notes'], ['Select a country.', 'country'], ['Choose a contact method.', 'contact-email'], ['Confirm that you agree to the terms.', 'terms']]) {
    const link = page.getByRole('link', { name: text, exact: true });
    await expect(link).toHaveAttribute('href', `#${id}`); await link.click(); await expect(page.locator(`#${id}`)).toBeFocused();
  }
  await expect(page.locator('#contact-group')).toHaveAccessibleDescription('Choose one. Choose a contact method.');
  await expect(page.locator('#contact-email')).not.toHaveAttribute('aria-invalid');
});

test('valid leap-day answers resolve errors, restore title and reset native date values', async ({ page }) => {
  const title = await page.title();
  await page.getByRole('button', { name: 'Submit application' }).click();
  await page.getByLabel('Full name', { exact: true }).fill('Ada');
  await page.locator('#birth-date-day').fill('29'); await page.locator('#birth-date-month').fill('2'); await page.locator('#birth-date-year').fill('2000');
  await page.getByLabel('What happened?', { exact: true }).fill('A detailed answer');
  await page.getByLabel('Country', { exact: true }).selectOption('gb');
  await page.locator('#contact-email').check(); await page.locator('#terms').check();
  await page.getByRole('button', { name: 'Submit application' }).click();
  await expect(page.locator('.owla11y-error-summary')).toHaveCount(0); await expect(page.getByRole('status')).toContainText('passed');
  await expect(page).toHaveTitle(title); await expect(page.locator('#birth-date-year')).toHaveValue('2000');
  await page.getByRole('button', { name: 'Reset application' }).click(); await expect(page.locator('#birth-date-year')).toHaveValue('');
});

test('date geometry matches responsive source modes and focus stays on one native part', async ({ page }) => {
  for (const [width, height] of [[600, 50], [800, 50], [1200, 53]]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const part of ['day', 'month', 'year']) expect((await page.locator(`#birth-date-${part}`).boundingBox())!.height).toBe(height);
    await expect(page.locator('#birth-date .owla11y-date-fields')).toHaveCSS('gap', '16px');
    await expect(page.locator('#birth-date .owla11y-date-fields')).toHaveCSS('margin-top', '24px');
  }
  await page.locator('#birth-date-day').focus(); await page.keyboard.type('123');
  await expect(page.locator('#birth-date-day')).toBeFocused(); await expect(page.locator('#birth-date-day')).toHaveValue('123');
  await page.keyboard.press('Tab'); await expect(page.locator('#birth-date-month')).toBeFocused();
  await expect(page.locator('#optional-date')).toHaveAccessibleName('Previous date (optional)');
  await expect(page.locator('#optional-date-day')).not.toHaveAttribute('required');
  await expect(page.locator('#disabled-date-day')).toBeDisabled(); await expect(page.locator('#readonly-date-day')).toHaveAttribute('readonly');
});

test('errors reflow with long content, enlarged text, spacing and forced-colour focus', async ({ page }) => {
  await page.getByRole('button', { name: 'Submit application' }).click();
  await page.setViewportSize({ width: 320, height: 900 });
  await page.addStyleTag({ content: '* { letter-spacing:0.12em !important; word-spacing:0.16em !important; line-height:1.5 !important; } p { margin-bottom:2em !important; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.screenshot({ path: 'test-results/date-errors-mobile.png', fullPage: true });
  await page.addStyleTag({ content: 'html { font-size:200%; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.emulateMedia({ forcedColors: 'active' });
  await page.locator('.owla11y-error-summary').focus(); await expect(page.locator('.owla11y-error-summary')).toHaveCSS('outline-style', 'solid');
  await page.getByRole('link', { name: 'Enter your date of birth.', exact: true }).click();
  await expect(page.locator('#birth-date-day')).toBeFocused(); await expect(page.locator('#birth-date-day')).toHaveCSS('outline-style', 'solid');
});

test('rendered errors pass axe including contrast with focus-only announcements', async ({ page }) => {
  await page.getByRole('button', { name: 'Submit application' }).click();
  const require = createRequire(import.meta.url);
  await page.addScriptTag({ content: readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8') });
  const violations = await page.evaluate(async () => {
    const axe = (window as unknown as { axe: { run(): Promise<{ violations: { id: string }[] }> } }).axe;
    return (await axe.run()).violations.map(item => item.id);
  });
  expect(violations).toEqual([]); await expect(page.locator('[role=alert], [aria-live]')).toHaveCount(0);
});
