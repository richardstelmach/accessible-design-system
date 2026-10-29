import React from 'react';
import {renderToString} from 'react-dom/server';
import {Table} from '../../dist/index.js';
import {expect,test} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
test.beforeEach(async({page})=>{await page.setViewportSize({width:1200,height:900});await page.goto('/?table');await page.evaluate(()=>document.fonts.ready);});
test('native caption and scopes name the table without an extra fitting viewport stop',async({page})=>{
 const table=page.getByRole('table',{name:'Button props and defaults'});await expect(table).toHaveCount(1);
 await expect(table.getByRole('columnheader')).toHaveCount(4);await expect(table.getByRole('rowheader')).toHaveCount(3);
 await expect(table).toHaveCSS('border-collapse','separate');await expect(table).toHaveCSS('border-top-style','solid');
 await expect(table).toHaveCSS('border-top-left-radius','8px');
 const headers=table.getByRole('columnheader');await expect(headers.nth(0)).toHaveCSS('border-right-style','solid');await expect(headers.nth(3)).toHaveCSS('border-right-width','0px');
 await expect(table.locator('tbody tr:last-child td').last()).toHaveCSS('border-bottom-width','0px');
 const viewport=page.locator('.owla11y-table-viewport');await expect(viewport).not.toHaveAttribute('tabindex');await expect(table).not.toHaveAttribute('tabindex');await expect(viewport).not.toHaveAttribute('role');
 await page.locator('#table-before').focus();await page.keyboard.press('Tab');await expect(table.getByRole('link')).toBeFocused();
 await page.getByLabel('Visually hidden caption',{exact:true}).check();await expect(table).toHaveAccessibleName('Button props and defaults');await expect(table.locator('caption')).toHaveClass('owla11y-table__caption--hidden');
});
test('wide content scrolls with native arrow keys and cell links keep their Tab order',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.getByLabel('Wide content',{exact:true}).check();
 const viewport=page.locator('.owla11y-table-viewport');await expect(viewport).toBeVisible();
 await page.locator('#table-before').focus();await page.keyboard.press('Tab');await expect(page.locator('.owla11y-table')).toBeFocused();await expect(page.locator('.owla11y-table')).toHaveAccessibleDescription('Button props and defaults, horizontally scrollable');await expect(viewport).not.toHaveAttribute('aria-label');await expect(viewport).toHaveCSS('outline-style','solid');
 await page.keyboard.press('ArrowRight');await expect.poll(()=>viewport.evaluate(n=>n.scrollLeft)).toBeGreaterThan(0);
 await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Usage guidance'})).toBeFocused();await page.keyboard.press('Tab');await expect(page.locator('#table-after')).toBeFocused();
});
test('ordinary content scrolls before columns become illegible without the wide toggle',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 const viewport=page.locator('.owla11y-table-viewport');
 await expect(viewport).toBeVisible();expect(await page.getByLabel('Wide content',{exact:true}).isChecked()).toBe(false);
 const header=page.getByRole('columnheader',{name:'Property',exact:true});
 expect(await header.evaluate(n=>{const range=document.createRange();range.selectNodeContents(n);return range.getClientRects().length;})).toBe(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.locator('#table-before').focus();await page.keyboard.press('Tab');await expect(page.locator('.owla11y-table')).toBeFocused();
 await page.keyboard.press('ArrowRight');await expect.poll(()=>viewport.evaluate(n=>n.scrollLeft)).toBeGreaterThan(0);
 await page.setViewportSize({width:320,height:900});await page.addStyleTag({content:'html{font-size:200%}'});
 for(const cell of await page.locator('.owla11y-table :is(th,td)').all())expect((await cell.boundingBox())!.width).toBeLessThanOrEqual((await viewport.boundingBox())!.width+1);
});
test('updated Table retains native semantics without creating a landmark',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await expect(page.getByRole('region')).toHaveCount(0);await expect(page.getByRole('group')).toHaveCount(0);
 const viewport=page.locator('.owla11y-table-viewport');await expect(viewport).not.toHaveAttribute('role');await expect(viewport).not.toHaveAttribute('aria-label');await expect(viewport).not.toHaveAttribute('tabindex');
 const table=page.getByRole('table',{name:'Button props and defaults'});await expect(table).toHaveAttribute('tabindex','0');
 await expect(table.getByRole('columnheader')).toHaveCount(4);await expect(table.getByRole('rowheader')).toHaveCount(3);
});
 await expect(table.getByRole('columnheader')).toHaveCount(3);await expect(table.getByRole('rowheader')).toHaveCount(2);
});
test('resizing a focused viewport retains access until blur, then removes an unnecessary stop',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.getByLabel('Wide content',{exact:true}).check();const viewport=page.locator('.owla11y-table-viewport');await page.locator('.owla11y-table').focus();
 await page.setViewportSize({width:1440,height:900});await expect.poll(()=>viewport.evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);
 await expect(page.locator('.owla11y-table')).toBeFocused();await expect(page.locator('.owla11y-table')).toHaveAttribute('tabindex','0');await expect(viewport).not.toHaveAttribute('role');
 await page.locator('#table-after').focus();await expect(viewport).not.toHaveAttribute('tabindex');await expect(page.locator('.owla11y-table')).not.toHaveAttribute('tabindex');await expect(viewport).not.toHaveAttribute('role');
});
test('320px long content, caption, text spacing and RTL stay inside the page',async({page})=>{
 await page.setViewportSize({width:320,height:900});await page.getByLabel('Long content',{exact:true}).check();await page.getByLabel('Wide content',{exact:true}).check();
 await page.addStyleTag({content:'html{font-size:200%}.owla11y-table *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}.owla11y-table p{margin-block-end:2em!important}'});
 const viewport=page.locator('.owla11y-table-viewport');const caption=page.locator('.owla11y-table caption');
 expect((await caption.boundingBox())!.width).toBeLessThanOrEqual((await viewport.boundingBox())!.width+1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 for(const cell of await page.locator('.owla11y-table :is(th,td)').all())expect(await cell.evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);
 await page.getByLabel('Right-to-left layout',{exact:true}).check();await expect(viewport).toHaveCSS('direction','rtl');
 await page.locator('.owla11y-table').focus();const start=await viewport.evaluate(n=>n.scrollLeft);await page.keyboard.press('ArrowLeft');await expect.poll(()=>viewport.evaluate(n=>n.scrollLeft)).not.toBe(start);
});
test('actual table and overflowing viewport pass axe; forced colours preserve focus',async({page})=>{
 const require=createRequire(import.meta.url);await page.addScriptTag({content:readFileSync(require.resolve('axe-core/axe.min.js'),'utf8')});
 const scan=()=>page.evaluate(async()=>(await (window as any).axe.run(document)).violations.map((v:any)=>v.id));expect(await scan()).toEqual([]);
 await page.setViewportSize({width:390,height:844});await page.getByLabel('Wide content',{exact:true}).check();expect(await scan()).toEqual([]);
 await page.emulateMedia({forcedColors:'active'});await page.locator('#table-before').focus();await page.keyboard.press('Tab');await expect(page.locator('.owla11y-table-viewport')).toHaveCSS('outline-style','solid');
});
test('print reveals wide data without a clipped scrolling viewport',async({page})=>{
 await page.setViewportSize({width:320,height:900});await page.getByLabel('Wide content',{exact:true}).check();await page.getByLabel('Long content',{exact:true}).check();await page.emulateMedia({media:'print'});
 const viewport=page.locator('.owla11y-table-viewport');await expect(viewport).toHaveCSS('overflow-x','visible');
 expect(await viewport.evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);await expect(page.getByRole('rowheader',{name:'children',exact:true})).toBeVisible();
});
test('no ResizeObserver retains the named keyboard fallback',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(window,'ResizeObserver',{value:undefined,configurable:true}));await page.reload();await expect(page.getByRole('table',{name:'Button props and defaults'})).toHaveAttribute('tabindex','0');await expect(page.locator('.owla11y-table-viewport')).not.toHaveAttribute('tabindex');
});
test('no-JavaScript SSR keeps native table and keyboard access to wide content',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:700}});const page=await context.newPage();
 const html=renderToString(React.createElement(Table,{caption:'Delivery schedule',style:{minWidth:'60rem'}},React.createElement('thead',null,React.createElement('tr',null,React.createElement('th',{scope:'col'},'Day'))),React.createElement('tbody',null,React.createElement('tr',null,React.createElement('th',{scope:'row'},'Monday')))));
 await page.setContent('<!doctype html><html lang="en"><head><title>SSR Table</title><style>'+readFileSync('packages/react/dist/styles.css','utf8')+'</style></head><body>'+html+'</body></html>');
 const region=page.getByRole('table',{name:'Delivery schedule'});await page.keyboard.press('Tab');await expect(region).toBeFocused();await page.keyboard.press('ArrowRight');await expect.poll(()=>page.locator('.owla11y-table-viewport').evaluate(n=>n.scrollLeft)).toBeGreaterThan(0);
 await expect(page.getByRole('table',{name:'Delivery schedule'})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await context.close();
});
