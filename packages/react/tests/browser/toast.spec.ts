import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

test.beforeEach(async({page})=>{await page.setViewportSize({width:1200,height:1000});await page.goto('/?toast');await page.evaluate(()=>document.fonts.ready);});

test('arrivals preserve focus, eight variants match geometry and chronological source order',async({page})=>{
  await page.getByRole('button',{name:'Show eight variants'}).click();
  const cards=page.locator('.owla11y-toast');await expect(cards).toHaveCount(8);
  await expect(page.getByRole('button',{name:'Show eight variants'})).toBeFocused();
  const geometry=await cards.evaluateAll(nodes=>nodes.map(node=>{
    const css=getComputedStyle(node);const icon=node.querySelector('svg')!;const close=node.querySelector('button')!;const title=node.querySelector('p')!;
    return {state:node.getAttribute('data-state'),height:node.getBoundingClientRect().height,padding:css.padding,gap:css.gap,radius:css.borderRadius,icon:icon.getBoundingClientRect().width,close:close.getBoundingClientRect().width,weight:getComputedStyle(title).fontWeight,font:getComputedStyle(title).fontSize};
  }));
  expect(geometry.map(item=>item.state)).toEqual(['success','success','info','info','warning','warning','error','error']);
  geometry.forEach((item,index)=>{expect(item).toMatchObject({padding:'16px',gap:'12px',radius:'8px',icon:24,close:44,weight:'600',font:'18px'});expect(item.height).toBe(index%2?90:76);});
  await expect(page.getByRole('status')).toContainText('8 notifications.');await expect(page.getByRole('alert')).toBeEmpty();
  expect(await page.locator('[aria-live],[aria-atomic]').count()).toBe(0);
  await page.screenshot({path:'/tmp/owla11y-toast-desktop.png',fullPage:true});
});

test('Tab, Enter, Space and scoped Escape recover focus without moving outside focus',async({page})=>{
  await page.getByRole('button',{name:'Send burst',exact:true}).click();
  const entry=page.getByRole('button',{name:'Notifications (3)'});await entry.click();await expect(page.getByRole('region',{name:'Notifications'})).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.locator('.owla11y-toast button').nth(0)).toBeFocused();
  await page.keyboard.press('Tab');await page.keyboard.press('Escape');await expect(page.locator('.owla11y-toast button').nth(1)).toBeFocused();
  await page.keyboard.press('Space');await expect(page.locator('.owla11y-toast button').nth(0)).toBeFocused();
  await page.keyboard.press('Enter');await expect(page.getByRole('button',{name:'Notifications (0)'})).toBeFocused();
  await page.getByRole('button',{name:'Send notification',exact:true}).click();await page.getByLabel('Task notes').focus();await page.keyboard.press('Escape');await expect(page.locator('.owla11y-toast')).toHaveCount(1);await expect(page.getByLabel('Task notes')).toBeFocused();
});

test('natural Tab origin is restored after the final notification, pointerdown alone never removes it',async({page})=>{
  await page.getByRole('button',{name:'Send notification',exact:true}).click();await page.getByRole('button',{name:'Notifications (1)'}).focus();await page.keyboard.press('Tab');
  const close=page.locator('.owla11y-toast button');await expect(close).toBeFocused();await close.dispatchEvent('pointerdown',{button:0});await expect(close).toBeVisible();
  await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Notifications (0)'})).toBeFocused();
});

test('separate repeated text events create fresh live mutations, bursts aggregate, and no message expires',async({page})=>{
  await page.evaluate(()=>{(window as any).speechLog=[];new MutationObserver(()=>{(window as any).speechLog.push(document.querySelector('[role=status]')!.textContent);}).observe(document.querySelector('[role=status]')!,{childList:true,characterData:true,subtree:true});});
  const send=page.getByRole('button',{name:'Send notification',exact:true});await send.click();await expect(page.getByRole('status')).toContainText('Your changes were saved');
  await send.click();await expect.poll(()=>page.evaluate(()=>(window as any).speechLog.filter((text:string)=>text.includes('Your changes were saved')).length)).toBe(2);
  await page.getByRole('button',{name:'Send burst',exact:true}).click();await expect(page.getByRole('status')).toContainText('3 notifications.');await expect(page.locator('.owla11y-toast')).toHaveCount(5);
  await page.clock.install();await page.clock.fastForward(600000);await expect(page.locator('.owla11y-toast')).toHaveCount(5);
  await page.getByRole('button',{name:'Change view'}).click();await expect(page.locator('.owla11y-toast')).toHaveCount(5);
});

test('modal defers both channels until controls become reachable and Escape remains owned by Dialog',async({page})=>{
  await page.getByLabel('Assertive announcement (urgent events only)').check();await page.getByRole('button',{name:'Open modal',exact:true}).click();
  const dialog=page.getByRole('dialog');await dialog.getByRole('button',{name:'Queue notification'}).click();
  await expect(page.getByRole('alert')).toBeEmpty();await expect(page.getByRole('status')).toBeEmpty();
  await expect(dialog.getByRole('button',{name:'Queue notification'})).toBeFocused();await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('alert')).toContainText('Your changes were saved');await expect(page.locator('.owla11y-toast')).toHaveCount(1);await expect(page.getByRole('button',{name:'Open modal',exact:true})).toBeFocused();
});

test('320px reflow, 200% root text and spacing overrides preserve all content and targets',async({page})=>{
  await page.setViewportSize({width:320,height:900});await page.getByRole('button',{name:'Send long text'}).click();
  await page.addStyleTag({content:'html{font-size:200%} .owla11y-toast p{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important;margin-block-end:2em!important}'});
  const card=page.locator('.owla11y-toast');await expect(card).toBeVisible();
  const result=await card.evaluate(node=>({width:node.getBoundingClientRect().width,overflow:document.documentElement.scrollWidth>innerWidth,close:node.querySelector('button')!.getBoundingClientRect().width,text:node.querySelector('.owla11y-toast__message')!.getBoundingClientRect().width}));
  expect(result.overflow).toBe(false);expect(result.width).toBeLessThanOrEqual(288);expect(result.close).toBe(88);expect(result.text).toBeGreaterThan(0);
  await card.screenshot({path:'/tmp/owla11y-toast-text-stress.png'});
  await page.locator('.owla11y-toast button').focus();await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Send long text'})).toBeFocused();
});

test('RTL retains chronological DOM order and forced colours retain boundary, icon and focus',async({page})=>{
  await page.getByLabel('Right to left').check();await page.getByRole('button',{name:'Send burst',exact:true}).click();
  const card=page.locator('.owla11y-toast').first();expect(await card.evaluate(n=>n.querySelector('svg')!.getBoundingClientRect().left>n.querySelector('button')!.getBoundingClientRect().left)).toBe(true);
  await page.emulateMedia({forcedColors:'active'});await page.getByRole('button',{name:'Notifications (3)'}).focus();await page.keyboard.press('Tab');
  expect(await card.evaluate(n=>getComputedStyle(n).borderTopStyle)).toBe('solid');expect(await card.locator('button').evaluate(n=>getComputedStyle(n).outlineStyle)).toBe('solid');
  await page.keyboard.press('Tab');await expect(page.locator('.owla11y-toast button').nth(1)).toBeFocused();
});

test('responsive body typography follows base/md/lg and axe includes all visual states',async({page})=>{
  await page.getByRole('button',{name:'Show eight variants'}).click();
  for(const [width,font] of [[320,'16px'],[600,'16px'],[800,'16px'],[1200,'18px']] as const){await page.setViewportSize({width,height:1000});expect(await page.locator('.owla11y-toast__title').first().evaluate(n=>getComputedStyle(n).fontSize)).toBe(font);}
  await page.addScriptTag({content:readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'),'utf8')});
  const violations=await page.evaluate(async()=>{const result=await (window as any).axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return result.violations.map((v:any)=>({id:v.id,nodes:v.nodes.map((n:any)=>n.target)}));});expect(violations).toEqual([]);
});
