import { expect, test } from '@playwright/test';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width:1200, height:900 });
  await page.goto('/?dialogs');
  await page.evaluate(() => document.fonts.ready);
});

test('native modal opens once under Strict Mode, focuses container and restores trigger', async ({ page }) => {
  await page.evaluate(() => {
    (window as any).modalCount = 0;
    const show = HTMLDialogElement.prototype.showModal;
    HTMLDialogElement.prototype.showModal = function () { (window as any).modalCount++; show.call(this); };
  });
  const trigger = page.getByRole('button', { name:'Edit profile', exact:true });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeFocused(); await expect(dialog).toHaveAccessibleName('Edit profile');
  expect(await page.evaluate(() => (window as any).modalCount)).toBe(1);
  expect(await dialog.evaluate(node => node.matches(':modal'))).toBe(true);
  await expect(dialog).not.toHaveAttribute('tabindex');
  await expect(page.locator('html')).toHaveCSS('overflow','hidden');
  await page.keyboard.press('Tab'); await expect(dialog.getByRole('button', { name:'Close dialog' })).toBeFocused();
  await page.keyboard.press('Shift+Tab'); await expect(dialog.getByRole('button', { name:'Save profile' })).toBeFocused();
  await page.keyboard.press('Tab'); await expect(dialog.getByRole('button', { name:'Close dialog' })).toBeFocused();
  await page.keyboard.press('Escape'); await expect(dialog).toHaveCount(0); await expect(trigger).toBeFocused();
  await expect(page.getByRole('status')).toContainText('escape');
  await expect(page.locator('html')).not.toHaveCSS('overflow','hidden');
});

test('controlled dismissal and pointer gestures distinguish backdrop from drag or surface', async ({ page }) => {
  await page.getByLabel('Accept dismissal requests').uncheck();
  await page.getByRole('button', { name:'Edit profile', exact:true }).click();
  const dialog = page.getByRole('dialog');
  await page.keyboard.press('Escape'); await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name:'Close dialog' }).click(); await expect(dialog).toBeVisible();
  await expect(page.getByRole('status')).toContainText('close-button');
  // Native light dismissal is disabled: owner may decline the close request.
  await page.mouse.click(5,5); await expect(dialog).toBeVisible(); await expect(page.getByRole('status')).toContainText('backdrop');
  await page.reload();
  await page.getByRole('button', { name:'Edit profile', exact:true }).click();
  const box = (await dialog.boundingBox())!;
  await page.mouse.move(box.x+60,box.y+60); await page.mouse.down(); await page.mouse.move(5,5); await page.mouse.up();
  await expect(dialog).toBeVisible();
  await page.mouse.click(box.x+10,box.y+10); await expect(dialog).toBeVisible();
  await page.mouse.click(5,5); await expect(dialog).toHaveCount(0);
});

test('forced decision blocks Escape and backdrop until an enabled explicit action resolves it', async ({ page }) => {
  await page.getByRole('button', { name:'Review decision' }).click();
  const dialog=page.getByRole('dialog');
  await expect(dialog).toBeFocused(); await expect(dialog.getByRole('button', { name:'Close dialog' })).toHaveCount(0);
  await page.keyboard.press('Escape'); await page.mouse.click(5,5); await expect(dialog).toBeVisible();
  await page.keyboard.press('Shift+Tab'); await expect(dialog.getByRole('button', { name:'Confirm profile' })).toBeFocused();
  await dialog.getByRole('button', { name:'Keep existing profile' }).click();
  await expect(dialog).toHaveCount(0); await expect(page.getByRole('button', { name:'Review decision' })).toBeFocused();
});

test('dynamic order handles radios, disabled fieldsets, inert ancestors, negative tabIndex and shadow roots', async ({ page }) => {
  await page.getByRole('button', { name:'Edit profile', exact:true }).click();
  const dialog=page.getByRole('dialog');
  await page.keyboard.press('Tab'); // Close
  await page.keyboard.press('Tab'); await expect(dialog.getByLabel('Display name')).toBeFocused();
  await page.keyboard.press('Tab'); await expect(dialog.getByLabel('Email', { exact:true })).toBeFocused();
  await page.keyboard.press('ArrowDown'); await expect(dialog.getByLabel('Phone', { exact:true })).toBeFocused();
  await page.keyboard.press('Tab'); await expect(dialog.getByRole('button', { name:'Add extra control' })).toBeFocused();
  await page.keyboard.press('Enter'); await page.keyboard.press('Tab'); await expect(dialog.getByRole('button', { name:'Extra control', exact:true })).toBeFocused();
  await dialog.evaluate(node => {
    const inert = document.createElement('div'); inert.inert=true; inert.innerHTML='<button>Inert control</button>'; node.append(inert);
    const host = document.createElement('div'); host.id='shadow-host'; const shadow=host.attachShadow({ mode:'open' }); shadow.innerHTML='<button>Shadow last</button>'; node.append(host);
  });
  await dialog.getByRole('button', { name:'Shadow last' }).focus();
  await page.keyboard.press('Tab'); await expect(dialog.getByRole('button', { name:'Close dialog' })).toBeFocused();
  await page.keyboard.press('Shift+Tab'); await expect(dialog.getByRole('button', { name:'Shadow last' })).toBeFocused();
});

test('form method dialog requests action close, preserves content and restores fallback for a removed trigger', async ({ page }) => {
  await page.getByRole('button', { name:'Edit profile', exact:true }).click();
  await page.getByRole('dialog').getByLabel('Display name').fill('Grace Hopper');
  // A form's explicit service validation may prevent closing.
  await page.locator('#dialog-profile').evaluate(form => form.addEventListener('submit', event => event.preventDefault(), { once:true }));
  await page.getByRole('button', { name:'Save profile' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name:'Save profile' }).click();
  await expect(page.getByRole('status')).toContainText('action'); await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name:'Edit profile', exact:true }).click();
  await expect(page.getByLabel('Display name')).toHaveValue('Grace Hopper');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name:'Open then remove trigger' }).click();
  await page.getByRole('button', { name:'Remove opening trigger' }).click(); await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name:'Restore trigger' })).toBeFocused();
  await page.getByRole('button', { name:'Open without controls' }).click();
  await page.keyboard.press('Tab'); await expect(page.getByRole('dialog')).toBeFocused();
  await page.keyboard.press('Shift+Tab'); await expect(page.getByRole('dialog')).toBeFocused();
});

test('source sizing, responsive typography and native backdrop match at every breakpoint', async ({ page }) => {
  for (const [width,title,body] of [[600,20,16],[800,24,16],[1200,30,18]]) {
    await page.setViewportSize({ width, height:900 });
    for (const [size,max] of [['small',512],['medium',640],['large',896]] as const) {
      await page.getByLabel('Dialog size').selectOption(size);
      await page.getByRole('button', { name:'Edit profile', exact:true }).click();
      const dialog=page.getByRole('dialog');
      await expect(dialog).toHaveCSS('width',`${Math.min(max,width-32)}px`);
      await expect(dialog.locator('.owla11y-dialog__title')).toHaveCSS('font-size',`${title}px`);
      await expect(dialog).toHaveCSS('font-size',`${body}px`);
      await expect(dialog.locator('header')).toHaveCSS('padding','24px');
      await expect(dialog).toHaveCSS('border-radius','12px');
      expect(await dialog.evaluate(node => getComputedStyle(node,'::backdrop').backgroundColor)).toBe('rgba(17, 24, 39, 0.72)');
      await page.keyboard.press('Escape');
    }
  }
});

test('320px reflow, scrolling content, full screen, text overrides and rendered contrast', async ({ page }) => {
  await page.setViewportSize({ width:320, height:800 });
  await page.getByRole('button', { name:'Read long information' }).click();
  const dialog=page.getByRole('dialog');
  expect((await dialog.boundingBox())!.x).toBe(16);
  expect(await dialog.evaluate(n => n.scrollWidth <= n.clientWidth)).toBe(true);
  const content=dialog.locator('.owla11y-dialog__content');
  expect(await content.evaluate(n => n.scrollHeight > n.clientHeight)).toBe(true);
  await expect(dialog.locator('footer')).toHaveCSS('flex-direction','column');
  await expect(content).toHaveAttribute('tabindex','0');
  await content.focus(); await page.keyboard.press('PageDown');
  await expect.poll(() => content.evaluate(n => n.scrollTop)).toBeGreaterThan(0);
  await content.evaluate(n => n.scrollTop=n.scrollHeight); await expect(dialog.getByRole('button', { name:'Close information' })).toBeInViewport();
  await page.addStyleTag({ content:'.owla11y-dialog * { line-height:1.5 !important; letter-spacing:.12em !important; word-spacing:.16em !important; }' });
  expect(await dialog.evaluate(n => n.scrollWidth <= n.clientWidth)).toBe(true);
  await page.keyboard.press('Escape'); await page.getByLabel('Mobile presentation').selectOption('fullscreen');
  await page.getByRole('button', { name:'Edit profile', exact:true }).click();
  await expect(dialog).toHaveCSS('width','320px'); await expect(dialog).toHaveCSS('height','800px'); await expect(dialog).toHaveCSS('border-radius','0px');
  const require=createRequire(import.meta.url); await page.addScriptTag({ content:readFileSync(require.resolve('axe-core/axe.min.js'),'utf8') });
  const violations=await page.evaluate(async () => (await (window as any).axe.run(document.querySelector('dialog'), { runOnly:{ type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa'] } })).violations.map((v:any)=>({id:v.id,nodes:v.nodes.map((n:any)=>n.target)})));
  expect(violations).toEqual([]);
  await page.emulateMedia({ forcedColors:'active' }); await dialog.focus(); await expect(dialog).toHaveCSS('outline-style','solid');
});

test('legacy closedby fallback and scroll locking preserve page position and existing styles', async ({ page }) => {
  await page.evaluate(() => {
    document.documentElement.style.overflow='scroll'; document.body.style.overflow='auto';
    window.scrollTo(0,300);
    const trigger=[...document.querySelectorAll('button')].find(n=>n.textContent==='Edit profile')!;
    trigger.focus({ preventScroll:true });trigger.click();
    document.querySelector('dialog')!.removeAttribute('closedby');
  });
  const position=await page.evaluate(()=>window.scrollY);
  expect(position).toBe(300);
  await page.mouse.move(5,5);await page.mouse.wheel(0,400);
  expect(await page.evaluate(()=>window.scrollY)).toBe(position);
  await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.evaluate(()=>window.scrollY)).toBe(position);
  await expect(page.locator('html')).toHaveCSS('overflow','scroll');
  await expect(page.locator('body')).toHaveCSS('overflow','auto');
});
