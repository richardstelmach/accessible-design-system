import {expect,test} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {Accordion} from '../../dist/index.js';

test.beforeEach(async({page})=>{await page.goto('/?accordion-boundary-review');await page.evaluate(()=>document.fonts.ready);});

test('gapless dividers share one edge and optional item outlines keep content within each item',async({page})=>{
  const root=page.locator('#boundary-page');await expect(root).toHaveCSS('gap','0px');
  const geometry=()=>root.locator(':scope > .owla11y-accordion__item').evaluateAll(nodes=>nodes.map(n=>{const c=getComputedStyle(n),r=n.getBoundingClientRect();return{top:r.top,bottom:r.bottom,topBorder:c.borderTopWidth,bottomBorder:c.borderBottomWidth,leftBorder:c.borderLeftWidth,rightBorder:c.borderRightWidth,radius:c.borderTopLeftRadius};}));
  let boxes=await geometry();expect(boxes[0].topBorder).toBe('1px');
  for(let i=0;i<boxes.length;i++){expect(boxes[i].bottomBorder).toBe('1px');expect(boxes[i].leftBorder).toBe('0px');if(i){expect(boxes[i].topBorder).toBe('0px');expect(boxes[i].top).toBeCloseTo(boxes[i-1].bottom,1);}}
  await page.getByLabel('Compare outlines on every stacked item',{exact:true}).check();await expect(root).toHaveAttribute('data-outlined','true');
  boxes=await geometry();for(const box of boxes){expect(box.leftBorder).toBe('1px');expect(box.rightBorder).toBe('1px');}expect(boxes[0].radius).toBe('8px');
  for(let i=1;i<boxes.length;i++)expect(boxes[i].top).toBeCloseTo(boxes[i-1].bottom,1);
  await page.getByLabel('Outline the standalone item',{exact:true}).uncheck();await expect(page.locator('#boundary-standalone')).not.toHaveAttribute('data-outlined');
});

test('outlined disclosure retains native keyboard, independent expansion and unclipped focus during pointer states',async({page})=>{
  const root=page.locator('#boundary-standalone'),trigger=root.getByRole('button');await trigger.focus();await trigger.press('Space');await expect(trigger).toHaveAttribute('aria-expanded','true');await expect(trigger).toBeFocused();
  await expect(root.getByRole('link').first()).toBeVisible();await trigger.press('Tab');await expect(root.getByRole('link').first()).toBeFocused();await page.keyboard.press('Shift+Tab');await expect(trigger).toBeFocused();
  await expect(trigger).toHaveCSS('outline-style','solid');await expect(root.locator('.owla11y-accordion__item')).toHaveCSS('overflow','visible');await trigger.hover();await page.keyboard.down('Space');await expect(trigger).toHaveCSS('outline-style','solid');await page.keyboard.up('Space');
  const stack=page.locator('#boundary-page'),first=stack.getByRole('button').nth(0),second=stack.getByRole('button').nth(1);await second.click();await expect(first).toHaveAttribute('aria-expanded','true');await expect(second).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('.owla11y-accordion [role=region]')).toHaveCount(0);
  for(const card of await page.locator('.owla11y-card').all()){await expect(card).not.toHaveAttribute('tabindex');await expect(card).not.toHaveAttribute('role');}
});

test('outlined cards reflow at 320px, grow with text spacing, and keep system boundaries in forced colours',async({page})=>{
  await page.setViewportSize({width:320,height:900});await page.getByLabel('Compare outlines on every stacked item',{exact:true}).check();
  await page.addStyleTag({content:'html{font-size:200%}.owla11y-accordion__trigger,.owla11y-accordion__panel{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  for(const trigger of await page.locator('.owla11y-accordion__trigger').all())expect(await trigger.evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);
  await page.emulateMedia({forcedColors:'active'});const root=page.locator('#boundary-standalone'),trigger=root.getByRole('button');await trigger.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
  await expect(trigger).toHaveCSS('outline-style','solid');await expect(root.locator('.owla11y-accordion__item')).toHaveCSS('border-left-style','solid');
});

test('Side menu keeps reviewed disclosure geometry and has no new top or side borders',async({page})=>{
  await page.goto('/?side-menu');const item=page.locator('.owla11y-side-menu__accordion > .owla11y-accordion__item').first();
  await expect(item).toHaveCSS('border-top-width','0px');await expect(item).toHaveCSS('border-left-width','0px');await expect(item).toHaveCSS('border-bottom-width','0px');await expect(item).not.toHaveCSS('box-shadow','none');
  await page.setViewportSize({width:320,height:900});await page.getByLabel('Mobile presentation').selectOption('inline');const outer=page.locator('.owla11y-side-menu-inline > .owla11y-accordion__item');await expect(outer).toHaveCSS('border-top-width','0px');
});

test('outlined baseline and print expose complete native content and no extra landmarks',async({browser,page})=>{
  const html=renderToString(React.createElement(Accordion,{headingLevel:2,outlined:true,items:[{id:'one',title:'One',content:React.createElement('a',{href:'#after'},'Read more')},{id:'two',title:'Two',content:React.createElement('p',null,'Complete second body')}]}));
  const context=await browser.newContext({javaScriptEnabled:false});const baseline=await context.newPage();await baseline.setContent(`<style>${readFileSync('packages/react/dist/styles.css','utf8')}</style>${html}`);
  await expect(baseline.getByRole('button')).toHaveCount(0);await expect(baseline.getByText('Complete second body')).toBeVisible();await expect(baseline.locator('[role=region],[tabindex]')).toHaveCount(0);await expect(baseline.locator('.owla11y-accordion__item').first()).toHaveCSS('border-left-width','1px');await context.close();
  const trigger=page.locator('#boundary-standalone').getByRole('button');await expect(trigger).toHaveAttribute('aria-expanded','false');await page.emulateMedia({media:'print'});await expect(page.locator('#boundary-standalone').getByRole('link').first()).toBeVisible();await expect(trigger).toHaveAttribute('aria-expanded','false');
});

test('outlined and divided compositions pass automated accessibility and contrast checks',async({page})=>{
  await page.getByLabel('Compare outlines on every stacked item',{exact:true}).check();await page.addScriptTag({content:readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'),'utf8')});
  const violations=await page.evaluate(async()=>{const r=await(window as any).axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map((v:any)=>({id:v.id,targets:v.nodes.map((n:any)=>n.target)}));});expect(violations).toEqual([]);
});
