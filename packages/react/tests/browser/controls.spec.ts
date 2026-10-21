import {expect,test} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {Accordion} from '../../dist/index.js';
test.beforeEach(async({page})=>{await page.setViewportSize({width:1200,height:1000});await page.goto('/?controls');await page.evaluate(()=>document.fonts.ready);});
test('Stepper and Accordion match canonical responsive geometry and all title styles',async({page})=>{
  for(const [width,font,height,fonts,lines] of [[600,16,50,[24,20,18,16,16],[28.8,24,27,24,24]],[800,16,50,[30,24,20,18,16],[36,28.8,24,27,24]],[1200,18,53,[36,30,24,20,18],[43.2,36,28.8,24,27]]] as const){
    await page.setViewportSize({width,height:1000});const input=page.locator('#rooms');await expect(input).toHaveCSS('font-size',`${font}px`);await expect(input).toHaveCSS('padding','12px 16px');expect((await input.boundingBox())!.height).toBe(height);await expect(input.locator('..')).toHaveCSS('gap','8px');for(const button of await input.locator('..').getByRole('button').all()){const box=(await button.boundingBox())!;expect(box.height).toBe(44);expect(box.width).toBe(44);}
    for(const [index,style]of ['h2','h3','h4','h5','h6'].entries()){await page.getByLabel('Accordion title style').selectOption(style);const trigger=page.locator('#application-sections .owla11y-accordion__trigger').first();await expect(trigger).toHaveCSS('font-size',`${fonts[index]}px`);await expect(trigger).toHaveCSS('padding','12px 16px');await expect(trigger).toHaveCSS('gap','8px');expect(await trigger.evaluate(n=>parseFloat(getComputedStyle(n).lineHeight))).toBeCloseTo(lines[index],1);expect((await trigger.boundingBox())!.height).toBeCloseTo(lines[index]+24,1);expect((await trigger.locator('svg').boundingBox())!.width).toBe(20);}
  }
  await page.getByLabel('Accordion title style').selectOption('h3');await page.screenshot({path:'/tmp/owla11y-controls-desktop.png',fullPage:true});
});
test('native stepping, Arrow keys, boundaries, focus fallback, one announcement owner and reset',async({page})=>{
  const input=page.locator('#rooms');const plus=page.getByRole('button',{name:'Add a room',exact:true});const minus=page.getByRole('button',{name:'Remove a room',exact:true});const status=input.locator('../..').getByRole('status');
  await minus.focus();await page.keyboard.press('Tab');await expect(input).toBeFocused();await page.keyboard.press('Tab');await expect(plus).toBeFocused();await page.keyboard.press('Enter');await expect(input).toHaveValue('3');await expect(plus).toBeFocused();await expect(status).toHaveText('Number of rooms: 3');
  await input.fill('9');await expect(status).toBeEmpty();await plus.click();await expect(input).toHaveValue('10');await expect(plus).toBeDisabled();await expect(input).toBeFocused();await expect(status).toBeEmpty();
  await page.keyboard.press('ArrowDown');await expect(input).toHaveValue('9');await expect(plus).toBeEnabled();await expect(status).toBeEmpty();
  await page.getByRole('button',{name:'Reset quantities'}).click();await expect(input).toHaveValue('2');await expect(plus).toBeEnabled();await expect(status).toBeEmpty();
  await page.getByRole('button',{name:'Increase weight'}).click();await expect(page.locator('#fraction')).toHaveValue('0.3');
  for(const button of await page.locator('#fixed').locator('..').getByRole('button').all())await expect(button).toBeDisabled();
});
test('raw invalid entry stays editable, badInput is not replaced by button stepping and errors target input',async({page})=>{
  const input=page.locator('#rooms');await input.fill('2.5');await expect(input).toHaveValue('2.5');expect(await input.evaluate((n:HTMLInputElement)=>n.validity.stepMismatch)).toBe(true);
  await page.getByRole('button',{name:'Request rooms'}).click();await expect(page.locator('.owla11y-error-summary')).toBeFocused();await expect(input).toHaveValue('2.5');await page.locator('.owla11y-error-summary a').click();await expect(input).toBeFocused();
  await input.fill('');await input.pressSequentially('e');expect(await input.evaluate((n:HTMLInputElement)=>n.validity.badInput)).toBe(true);await page.getByRole('button',{name:'Add a room',exact:true}).click();expect(await input.evaluate((n:HTMLInputElement)=>n.validity.badInput)).toBe(true);await expect(input).toHaveValue('');
});
test('disabled and inherited fieldset states retain native exclusion and suppress stale errors',async({page})=>{
  await page.getByLabel('Disable quantities').check();await expect(page.locator('#rooms')).toBeDisabled();for(const button of await page.locator('#rooms').locator('..').getByRole('button').all())await expect(button).toBeDisabled();expect(await page.locator('#quantity-form').evaluate((n:HTMLFormElement)=>new FormData(n).has('rooms'))).toBe(false);
  await expect(page.getByRole('spinbutton',{name:'Unavailable quantity'})).toBeDisabled();await expect(page.getByText('This error is suppressed.')).toHaveCount(0);
});
test('Accordion independent expansion, native keyboard, controlled decline and retained values',async({page})=>{
  const first=page.getByRole('button',{name:'Application details',exact:true});const second=page.getByRole('button',{name:'Earlier applications',exact:true});const input=page.locator('#application-reference');
  await input.fill('Edited reference');await first.focus();await page.keyboard.press('Space');await expect(input).toBeHidden();await expect(first).toBeFocused();await page.keyboard.press('ArrowDown');await expect(first).toBeFocused();await page.keyboard.press('Tab');await expect(second).toBeFocused();await page.keyboard.press('Enter');await expect(second).toHaveAttribute('aria-expanded','true');await first.click();await expect(input).toHaveValue('Edited reference');await expect(second).toHaveAttribute('aria-expanded','true');
  await page.getByLabel('Accept expansion requests').uncheck();await first.click();await expect(first).toHaveAttribute('aria-expanded','true');await expect(input).toBeVisible();await page.getByLabel('Accept expansion requests').check();
  // External prop collapse while focus remains inside the panel (click() would move it).
  await input.focus();await page.locator('#collapse-sections').evaluate((n:HTMLButtonElement)=>n.click());await expect(first).toBeFocused();await expect(input).toBeHidden();await page.locator('#reveal-reference').click();await expect(input).toBeVisible();await expect(input).toBeFocused();await expect(input).toHaveValue('Edited reference');
  await expect(page.locator('#application-sections [role=region]')).toHaveCount(0);await page.getByRole('button',{name:'Help with quantities',exact:true}).click();await expect(page.getByRole('region',{name:'Help with quantities'})).toBeVisible();
});
test('Accordion print reveals all panels without changing expansion state; forced colours retain boundaries and focus',async({page})=>{
  const first=page.getByRole('button',{name:'Application details',exact:true});await first.click();await page.emulateMedia({media:'print'});await expect(page.locator('#application-reference')).toBeVisible();await expect(first).toHaveAttribute('aria-expanded','false');await expect(first.locator('svg')).toBeHidden();await page.emulateMedia({media:'screen',forcedColors:'active'});await expect(page.locator('#application-reference')).toBeHidden();await first.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(first).toHaveCSS('outline-style','solid');await expect(first.locator('../..')).toHaveCSS('border-bottom-style','solid');
});
test('320px reflow, text spacing, doubled text, RTL order and scoped token overrides',async({page})=>{
  await page.setViewportSize({width:320,height:900});await page.getByLabel('Long text').check();await page.getByLabel('Right to left').check();await page.getByLabel('Accordion title style').selectOption('h2');await page.addStyleTag({content:'html{font-size:200%} .owla11y-accordion__trigger,.owla11y-accordion__panel,.owla11y-stepper{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);const row=page.locator('#rooms').locator('..');const rects=await row.locator(':scope > *').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().left));expect(rects[0]).toBeLessThan(rects[1]);expect(rects[1]).toBeLessThan(rects[2]);
  for(const trigger of await page.locator('.owla11y-accordion__trigger').all())expect(await trigger.evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);
  await page.locator('main').evaluate(n=>n.style.setProperty('--component-accordion-spacing-padding-inline','20px'));await expect(page.locator('.owla11y-accordion__trigger').first()).toHaveCSS('padding-inline-start','20px');await page.locator('#application-sections').screenshot({path:'/tmp/owla11y-controls-mobile-accordion.png'});
});
test('Stepper and Accordion pass axe including rendered contrast',async({page})=>{
  await page.addScriptTag({content:readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'),'utf8')});const violations=await page.evaluate(async()=>{const result=await(window as any).axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return result.violations.map((v:any)=>({id:v.id,nodes:v.nodes.map((n:any)=>n.target)}));});expect(violations).toEqual([]);
});
test('Accordion no-JavaScript server baseline contains ordinary headings and usable complete content',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();const html=renderToString(React.createElement(Accordion,{headingLevel:2,items:[{id:'one',title:'One',content:React.createElement('input',{'aria-label':'Saved note',defaultValue:'Stored'})},{id:'two',title:'Two',content:React.createElement('p',null,'Second body')}]}));await page.setContent(`<style>${readFileSync('packages/react/dist/styles.css','utf8')}</style>${html}`);await expect(page.getByRole('button')).toHaveCount(0);await expect(page.getByRole('heading')).toHaveCount(2);await expect(page.getByText('Second body')).toBeVisible();await page.getByLabel('Saved note').fill('Edited before enhancement');await expect(page.getByLabel('Saved note')).toHaveValue('Edited before enhancement');await context.close();
});
