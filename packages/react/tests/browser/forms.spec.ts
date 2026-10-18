import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 1000 });
  await page.goto('/?forms');
  await page.evaluate(() => document.fonts.ready);
});

test('form geometry and typography follow source tokens across responsive modes', async ({ page }) => {
  for (const [width, font, height] of [[600, 16, 50], [800, 16, 50], [1200, 18, 53]]) {
    await page.setViewportSize({ width, height: 1000 });
    const textarea = page.getByLabel('What happened?', { exact: true });
    await expect(textarea).toHaveCSS('height', '160px');
    await expect(textarea).toHaveCSS('min-height', '128px');
    await expect(textarea).toHaveCSS('resize', 'vertical');
    await expect(textarea).toHaveCSS('font-size', `${font}px`);
    const select = page.getByLabel('Country', { exact: true });
    expect((await select.boundingBox())!.height).toBe(height);
    await expect(page.getByLabel('Email', { exact: true })).toHaveCSS('width', '24px');
    await expect(page.getByLabel('Product news', { exact: true })).toHaveCSS('height', '24px');
    const row = page.getByLabel('Product news', { exact: true }).locator('..');
    expect((await row.boundingBox())!.height).toBe(width >= 1024 ? 51 : 48);
    await expect(page.locator('.owla11y-legend[data-style=default]')).toHaveCSS('font-size', width === 600 ? '24px' : width === 800 ? '30px' : '36px');
  }
});

test('single-field and Fieldset error spacing keep distinct source rules', async ({ page }) => {
  const gap = async (selector: string, child: string) => page.locator(selector).evaluate((el, child) => {
    const target = el.querySelector(child)!;
    const previous = target.previousElementSibling!;
    return target.getBoundingClientRect().top - previous.getBoundingClientRect().bottom;
  }, child);
  expect(await gap('.owla11y-field:has([name=explanation])', 'textarea')).toBe(8);
  expect(await gap('.owla11y-field:has([name=preferred])', '.owla11y-select-wrap')).toBe(8);
  const group = page.getByRole('group', { name: 'Shared group question', exact: true });
  expect(await group.evaluate(el => {
    const error = el.querySelector(':scope > .owla11y-error')!;
    const option = el.querySelector('.owla11y-choice')!;
    return option.getBoundingClientRect().top - error.getBoundingClientRect().bottom;
  })).toBe(24);
  await expect(group).toHaveAccessibleDescription('Choose at least one. Error: Select a preference.');
  await expect(page.getByLabel('Preference one', { exact: true })).not.toHaveAttribute('aria-invalid');
  await expect(page.getByLabel('Directions', { exact: true })).toHaveAccessibleDescription('Mention nearby landmarks. Error: Explain how to find the address.');
});

test('native keyboard, checkedness, selection, submission and reset work together', async ({ page }) => {
  const form = page.getByTestId('forms');
  await page.getByLabel('What happened?', { exact: true }).fill('A multiline\nanswer');
  const select = form.getByLabel('Country', { exact: true });
  await select.focus(); await page.keyboard.press('u'); await page.keyboard.press('Enter');
  await expect(select).toHaveValue('gb');
  const email = form.getByLabel('Email', { exact: true });
  expect(await email.evaluate(el => getComputedStyle(el, '::before').visibility)).toBe('hidden');
  await email.focus(); await page.keyboard.press('Space'); await page.keyboard.press('ArrowDown');
  await expect(form.getByLabel('Telephone', { exact: true })).toBeChecked();
  await expect(email).not.toBeChecked();
  await page.keyboard.press('Tab'); await expect(form.getByLabel('Product news')).toBeFocused();
  await page.keyboard.press('Space'); await expect(form.getByLabel('Product news')).not.toBeChecked();
  await form.getByLabel('I agree to the terms', { exact: true }).check();
  await page.getByRole('button', { name: 'Save answers' }).click();
  await expect(form.locator('output')).toContainText('"contact":"phone"');
  await expect(form.locator('output')).toContainText('"terms":"accepted"');
  await page.getByRole('button', { name: 'Reset answers' }).click();
  await expect(form.getByLabel('What happened?', { exact: true })).toHaveValue('');
  await expect(select).toHaveValue(''); await expect(form.getByLabel('Product news')).toBeChecked();
  await expect(form.getByLabel('Telephone', { exact: true })).not.toBeChecked();
  await expect(page.getByLabel('All topics', { exact: true })).toHaveJSProperty('indeterminate', true);
});

test('focus and disabled states retain selected indicators and forced-colour visibility', async ({ page }) => {
  const checkbox = page.getByLabel('Product news', { exact: true });
  await page.keyboard.press('Tab'); await checkbox.focus();
  await expect(checkbox).toHaveCSS('outline-style', 'solid');
  await expect(checkbox).toHaveCSS('border-radius', '4px');
  const radio = page.getByLabel('Email', { exact: true });
  await radio.focus(); await expect(radio).toHaveCSS('outline-style', 'solid');
  await expect(radio).toHaveCSS('border-radius', '9999px');
  await expect(page.getByLabel('Unavailable notes')).toBeDisabled();
  const disabled = page.getByLabel('Unavailable checked choice');
  await expect(disabled).toBeChecked(); await expect(disabled).toBeDisabled();
  expect(await disabled.evaluate(el => getComputedStyle(el, '::before').visibility)).toBe('visible');
  await page.emulateMedia({ forcedColors: 'active' });
  await checkbox.focus(); await expect(checkbox).toHaveCSS('outline-style', 'solid');
  await expect(page.getByLabel('Country', { exact: true })).toHaveCSS('appearance', 'auto');
});

test('long content reflows at 320px with text-spacing overrides and large text', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.addStyleTag({ content: '* { letter-spacing:0.12em !important; word-spacing:0.16em !important; line-height:1.5 !important; } p { margin-bottom:2em !important; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.screenshot({ path: 'test-results/forms-mobile.png', fullPage: true });
  await page.addStyleTag({ content: 'html { font-size:200%; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('integrated form passes rendered accessibility checks including colour contrast', async ({ page }) => {
  const require = createRequire(import.meta.url);
  await page.addScriptTag({ content: readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8') });
  const violations = await page.evaluate(async () => {
    const axe = (window as unknown as { axe: { run(): Promise<{ violations: { id: string; nodes: unknown[] }[] }> } }).axe;
    return (await axe.run()).violations.map(v => ({ id: v.id, nodes: v.nodes.length }));
  });
  expect(violations).toEqual([]);
});
