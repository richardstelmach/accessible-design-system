import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width:1200, height:1000 });
  await page.goto('/?tabs'); await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('#profile-tabs').getByRole('tablist')).toBeVisible();
});

test('automatic keyboard navigation wraps and Tab visits only the selected panel', async ({ page }) => {
  const originalUrl=page.url();
  const root=page.locator('#profile-tabs'); const tabs=root.getByRole('tab');
  await expect(tabs).toHaveCount(3);await expect(root.locator('[role=tab][tabindex="0"]')).toHaveCount(1);
  await page.locator('#before-primary').focus();await page.keyboard.press('Tab');await expect(tabs.nth(0)).toBeFocused();
  await page.keyboard.press('ArrowLeft');await expect(tabs.nth(2)).toBeFocused();await expect(tabs.nth(2)).toHaveAttribute('aria-selected','true');
  await page.keyboard.press('ArrowRight');await expect(tabs.nth(0)).toBeFocused();
  await page.keyboard.press('End');await expect(tabs.nth(2)).toBeFocused();
  await page.keyboard.press('Home');await expect(tabs.nth(0)).toBeFocused();
  await page.keyboard.press('ArrowRight');await expect(tabs.nth(1)).toHaveAttribute('aria-selected','true');
  await page.keyboard.press('Tab');await expect(root.getByRole('tabpanel',{ name:'History' })).toBeFocused();
  await page.keyboard.press('Tab');await expect(root.getByRole('button',{ name:'Add saved change' })).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.locator('#after-primary')).toBeFocused();
  await page.keyboard.press('Shift+Tab');await page.keyboard.press('Shift+Tab');await page.keyboard.press('Shift+Tab');await expect(tabs.nth(1)).toBeFocused();expect(page.url()).toBe(originalUrl);
});

test('manual selection and roving focus remain independent without trapping forward or backward Tab', async ({ page }) => {
  await page.getByLabel('Keyboard activation').selectOption('manual');
  const root=page.locator('#profile-tabs');const tabs=root.getByRole('tab');
  await tabs.nth(1).click();await expect(tabs.nth(1)).toHaveAttribute('aria-selected','true');
  await page.keyboard.press('ArrowLeft');await expect(tabs.nth(0)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected','true');
  await page.keyboard.press('Tab');await expect(root.getByRole('tabpanel',{name:'History'})).toBeFocused();
  await page.keyboard.press('Shift+Tab');await expect(tabs.nth(1)).toBeFocused();
  await page.keyboard.press('ArrowLeft');await page.keyboard.press('Shift+Tab');await expect(page.locator('#before-primary')).toBeFocused();
  await page.keyboard.press('Tab');await expect(tabs.nth(1)).toBeFocused();
  await page.keyboard.press('End');await expect(tabs.nth(2)).toBeFocused();await expect(tabs.nth(1)).toHaveAttribute('aria-selected','true');
  await page.keyboard.press('Tab');await expect(root.getByRole('tabpanel',{name:'History'})).toBeFocused();
  await page.keyboard.press('Shift+Tab');await page.keyboard.press('End');await page.keyboard.press('Space');
  await expect(tabs.nth(2)).toHaveAttribute('aria-selected','true');await expect(tabs.nth(2)).toBeFocused();
  await page.keyboard.press('Home');await page.keyboard.press('Enter');await expect(tabs.nth(0)).toHaveAttribute('aria-selected','true');
});

test('panel values/state persist; panel keys and modified shortcuts are not intercepted', async ({ page }) => {
  const root=page.locator('#profile-tabs');const tabs=root.getByRole('tab');
  const input=root.getByLabel('Preferred display name');await input.fill('Grace Hopper');
  const unhandled=await input.evaluate(node => {
    const event=new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true,cancelable:true});node.dispatchEvent(event);return !event.defaultPrevented;
  });expect(unhandled).toBe(true);
  await tabs.nth(1).click();await root.getByRole('button',{name:'Add saved change'}).click();
  await tabs.nth(0).click();await expect(input).toHaveValue('Grace Hopper');
  await tabs.nth(1).click();await expect(root.getByText('Saved changes: 1')).toBeVisible();
  for(const key of ['ArrowUp','ArrowDown']) expect(await tabs.nth(1).evaluate((node,key)=>{
    const event=new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true});node.dispatchEvent(event);return event.defaultPrevented;
  },key)).toBe(false);
  expect(await tabs.nth(1).evaluate(node=>{const e=new KeyboardEvent('keydown',{key:'ArrowRight',ctrlKey:true,bubbles:true,cancelable:true});node.dispatchEvent(e);return e.defaultPrevented;})).toBe(false);
  expect(await root.locator('#profile-tabs-panel-details input').evaluate(n=>n.getClientRects().length)).toBe(0);
});

test('narrow fallback and re-enhancement retain the same links and focus within newly selected sections', async ({ page }) => {
  const root=page.locator('#profile-tabs');const history=root.getByRole('tab',{name:'History'});
  await history.click();await history.evaluate(node=>(window as any).savedTab=node);
  await page.setViewportSize({width:767,height:1000});await expect(root.getByRole('tab')).toHaveCount(0);
  const link=root.getByRole('link',{name:'History',exact:true});await expect(link).toBeFocused();
  expect(await link.evaluate(node=>node===(window as any).savedTab)).toBe(true);
  await expect(root.getByRole('region')).toHaveCount(3);await expect(link).not.toHaveAttribute('aria-selected');await expect(link).not.toHaveAttribute('tabindex');
  await root.getByLabel('Preferred display name').focus();
  await page.setViewportSize({width:800,height:1000});await expect(root.getByRole('tab',{name:'Details',exact:true})).toHaveAttribute('aria-selected','true');
  await expect(root.getByLabel('Preferred display name')).toBeFocused();
  await page.setViewportSize({width:600,height:1000});await root.getByRole('link',{name:'Help',exact:true}).focus();
  await page.setViewportSize({width:1200,height:1000});await expect(root.getByRole('tab',{name:'Help',exact:true})).toBeFocused();await expect(root.getByRole('tab',{name:'Help',exact:true})).toHaveAttribute('aria-selected','true');
});

test('actual container width and label growth trigger fallback without page overflow', async ({ page }) => {
  const root=page.locator('#profile-tabs');
  await page.getByLabel('Use a narrow embedded container').check();await expect(root.getByRole('tab')).toHaveCount(0);
  await page.getByLabel('Use a narrow embedded container').uncheck();await expect(root.getByRole('tab')).toHaveCount(3);
  await page.getByLabel('Use long labels').check();await expect(root.getByRole('tab')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.getByLabel('Use long labels').uncheck();await expect(root.getByRole('tab')).toHaveCount(3);
});

test('controlled owner can decline requests; focus-containing fallback stays visible until acceptance', async ({ page }) => {
  const root=page.locator('#controlled-tabs');await expect(root.getByRole('tab',{name:'History',exact:true})).toHaveAttribute('aria-selected','true');
  await page.getByLabel('Accept selection requests').uncheck();
  await root.getByRole('tab',{name:'Help',exact:true}).click();await expect(root.getByRole('tab',{name:'History',exact:true})).toHaveAttribute('aria-selected','true');
  await expect(page.getByRole('status')).toHaveText('Last requested section: help');
  await page.setViewportSize({width:600,height:1000});await root.getByRole('link',{name:'Details',exact:true}).focus();
  await page.setViewportSize({width:1200,height:1000});await expect(root.getByRole('tab')).toHaveCount(0);
  await expect(root.getByRole('link',{name:'Details',exact:true})).toBeFocused();await expect(root.getByRole('region')).toHaveCount(3);
  await page.getByLabel('Accept selection requests').check();
  await expect(root.getByRole('tab',{name:'History',exact:true})).toHaveAttribute('aria-selected','true');
  await root.getByRole('tab',{name:'Details',exact:true}).click();await expect(root.getByRole('tab',{name:'Details',exact:true})).toHaveAttribute('aria-selected','true');
});

test('source geometry and persistent selection/focus match responsive Figma modes and forced colours', async ({ page }) => {
  const root=page.locator('#profile-tabs');
  for(const [width,font,height] of [[800,16,48],[1200,18,51]]) {
    await page.setViewportSize({width,height:1000});const tabs=root.getByRole('tab');
    await expect(tabs.nth(0)).toHaveCSS('font-size',`${font}px`);expect((await tabs.nth(0).boundingBox())!.height).toBe(height);
    const initial=await tabs.nth(0).boundingBox();await tabs.nth(1).click();const after=await tabs.nth(0).boundingBox();expect(after).toEqual(initial);
    await expect(tabs.nth(1)).toHaveCSS('border-bottom-width','4px');await expect(tabs.nth(0)).toHaveCSS('border-bottom-width','0px');
    const row=root.getByRole('tablist');await expect(row).toHaveCSS('gap','8px');
    expect(await root.getByRole('tabpanel').evaluate(node=>node.getBoundingClientRect().top-node.parentElement!.querySelector('[role=tablist]')!.getBoundingClientRect().bottom)).toBe(16);
    await expect(root.locator('.owla11y-tabs__heading').first()).toHaveCSS('font-size',width===800?'24px':'30px');
    await tabs.nth(0).focus();await page.keyboard.press('ArrowRight');await expect(tabs.nth(1)).toHaveCSS('outline-width','2px');
  }
  await page.emulateMedia({forcedColors:'active'});const selected=root.locator('[role=tab][aria-selected=true]');await expect(selected).toHaveCSS('border-bottom-style','solid');await expect(selected).toHaveCSS('outline-style','solid');
});

test('320px, doubled text, text spacing and print preserve all content; rendered accessibility passes', async ({ page }) => {
  const root=page.locator('#profile-tabs');
  const require=createRequire(import.meta.url);await page.addScriptTag({content:readFileSync(require.resolve('axe-core/axe.min.js'),'utf8')});
  const audit=()=>page.evaluate(async()=> (await (window as any).axe.run(document.querySelector('main'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map((v:any)=>({id:v.id,nodes:v.nodes.map((n:any)=>n.target)})));
  expect(await audit()).toEqual([]);
  await page.setViewportSize({width:320,height:1000});await expect(root.getByRole('tab')).toHaveCount(0);expect(await audit()).toEqual([]);
  await page.addStyleTag({content:'html{font-size:200%} main *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);await expect(root.getByRole('region')).toHaveCount(3);
  await page.reload();await page.setViewportSize({width:1200,height:1000});await expect(root.getByRole('tab')).toHaveCount(3);
  await page.emulateMedia({media:'print'});await expect(root.locator('section')).toHaveCount(3);
  for(const section of await root.locator('section').all()) await expect(section).toBeVisible();
});

test('right-to-left labels keep DOM-order arrows and independent sets have unique IDs', async ({ page }) => {
  await page.getByLabel('Use right-to-left content').check();const tabs=page.locator('#profile-tabs').getByRole('tab');
  await tabs.nth(0).focus();await page.keyboard.press('ArrowRight');await expect(tabs.nth(1)).toBeFocused();
  await expect(page.locator('#controlled-tabs').getByRole('tab',{name:'History',exact:true})).toHaveAttribute('aria-selected','true');
  expect(await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(n=>n.id);return ids.length===new Set(ids).size;})).toBe(true);
});

test('no JavaScript serves every section and ordinary contents anchors', async ({ browser }) => {
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
  // The packed SSR fixture below supplies DOM-free server HTML; Vite is a client-only harness.
  const { renderToString }=await import('react-dom/server');const React=await import('react');
  const { Tabs }=await import('../../src/index.js');
  const html=renderToString(React.createElement(Tabs,{id:'plain-tabs',label:'Plain sections',items:[{id:'one',label:'One',heading:'One',content:'First body'},{id:'two',label:'Two',heading:'Two',content:'Second body'}]}));
  const css=readFileSync(new URL('../../dist/styles.css',import.meta.url),'utf8');
  await page.setContent(`<style>${css}</style>${html}`);await expect(page.getByRole('tab')).toHaveCount(0);await expect(page.getByRole('region')).toHaveCount(2);
  await page.getByRole('link',{name:'Two',exact:true}).click();expect(new URL(page.url()).hash).toBe('#plain-tabs-panel-two');
  await context.close();
});
