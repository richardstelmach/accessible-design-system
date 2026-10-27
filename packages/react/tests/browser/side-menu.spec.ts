import React from 'react';
import {renderToString} from 'react-dom/server';
import {ResponsiveSideMenu} from '../../dist/index.js';
import {expect,test} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
test.beforeEach(async({page})=>{await page.setViewportSize({width:1200,height:900});await page.goto('/?side-menu');await page.evaluate(()=>document.fonts.ready);});
test('primary and section contexts combine static captions and independent disclosures',async({page})=>{
 const nav=page.getByRole('navigation',{name:'Documentation'});await expect(page.getByRole('button',{name:'Menu',exact:true})).toHaveCount(0);
 await expect(nav.getByText('Start here',{exact:true})).toBeVisible();await expect(nav.getByRole('button',{name:'Start here'})).toHaveCount(0);
 await expect(nav.getByRole('link',{name:'Foundations',exact:true})).toBeVisible();await expect(nav.getByRole('link',{name:'Button',exact:true})).toHaveAttribute('aria-current','page');
 await nav.getByRole('button',{name:'Resources'}).click();await expect(nav.getByRole('button',{name:'Components'})).toHaveAttribute('aria-expanded','true');
 await page.getByRole('combobox',{name:/^Usage context/}).selectOption('workspace');await expect(page.getByRole('navigation',{name:'Workspace'}).getByRole('link',{name:'Projects'})).toHaveAttribute('aria-current','page');
 await page.getByRole('combobox',{name:/^Usage context/}).selectOption('section');await expect(page.getByRole('navigation',{name:'Account settings'})).toBeVisible();
});
test('mobile drawer uses existing Dialog focus, modal inertness, dismissal and scroll restoration',async({page})=>{
 await page.setViewportSize({width:768,height:800});const trigger=page.getByRole('button',{name:'Menu',exact:true});await expect(trigger).toHaveAttribute('aria-haspopup','dialog');
 await trigger.focus();await page.keyboard.press('Enter');const dialog=page.getByRole('dialog',{name:'Documentation',exact:true});await expect(dialog).toBeFocused();
 await expect(dialog.getByRole('navigation')).toHaveCount(1);await expect(page.locator('html')).toHaveCSS('overflow','hidden');
 expect(await page.locator('#after-side-menu').evaluate(n=>{n.focus();return document.activeElement===n;})).toBe(false);
 await page.keyboard.press('Tab');await expect(dialog.getByRole('button',{name:'Close navigation'})).toBeFocused();
 await page.keyboard.press('Shift+Tab');await expect(dialog.getByRole('button',{name:'Resources'})).toBeFocused();
 await page.keyboard.press('Tab');await expect(dialog.getByRole('button',{name:'Close navigation'})).toBeFocused();
 await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(trigger).toBeFocused();expect(await page.locator('html').evaluate(n=>n.style.overflow)).toBe('');
 await trigger.click();await page.mouse.click(730,400);await expect(page.getByRole('dialog')).toHaveCount(0);await expect(trigger).toBeFocused();
 await trigger.click();await page.getByRole('button',{name:'Close navigation'}).click();await expect(trigger).toBeFocused();
});
test('accepted navigation closes the drawer and focuses the destination; failed navigation stays open',async({page})=>{
 await page.getByLabel('Simulate failed navigation',{exact:true}).check();await page.setViewportSize({width:390,height:800});await page.getByRole('button',{name:'Menu',exact:true}).click();
 await page.getByRole('link',{name:'Accordion',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('link',{name:'Button',exact:true})).toHaveAttribute('aria-current','page');
 await page.getByRole('button',{name:'Close navigation'}).click();await page.getByLabel('Simulate failed navigation',{exact:true}).uncheck();await page.getByRole('button',{name:'Menu',exact:true}).click();
 await page.getByRole('link',{name:'Accordion',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.locator('#side-menu-main')).toBeFocused();
 await page.getByRole('button',{name:'Menu',exact:true}).click();await expect(page.getByRole('link',{name:'Accordion',exact:true})).toHaveAttribute('aria-current','page');
});
test('breakpoints never dismiss an open drawer or hide a focused desktop link; group choices survive placement',async({page})=>{
 const nav=page.getByRole('navigation',{name:'Documentation'});const current=nav.getByRole('link',{name:'Button',exact:true});await current.focus();await page.setViewportSize({width:320,height:800});
 await expect(current).toBeFocused();await expect(current).toBeVisible();await expect(page.getByRole('button',{name:'Menu',exact:true})).toHaveCount(0);
 await page.locator('#after-side-menu').focus();await expect(page.getByRole('button',{name:'Menu',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('button',{name:'Components',exact:true}).click();
 await page.setViewportSize({width:1200,height:900});await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('button',{name:'Close navigation'}).click();await expect(page.getByRole('button',{name:'Menu',exact:true})).toBeFocused();
 await page.locator('#after-side-menu').focus();await expect(page.getByRole('button',{name:'Menu',exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Components',exact:true})).toHaveAttribute('aria-expanded','false');await expect(page.getByRole('navigation')).toHaveCount(1);
});
test('inline alternative has no modal trap and retains native button keyboard behaviour',async({page})=>{
 await page.getByRole('combobox',{name:/^Mobile presentation/}).selectOption('inline');await page.setViewportSize({width:1023,height:800});
 const trigger=page.getByRole('button',{name:'Menu',exact:true});await expect(trigger).not.toHaveAttribute('aria-haspopup');await trigger.focus();await page.keyboard.press('Space');
 await expect(trigger).toHaveAttribute('aria-expanded','true');await expect(page.getByRole('link',{name:'Overview',exact:true})).toBeVisible();await expect(page.getByRole('dialog')).toHaveCount(0);await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Overview',exact:true})).toBeFocused();
 await page.keyboard.press('Shift+Tab');await page.keyboard.press('Enter');await expect(trigger).toHaveAttribute('aria-expanded','false');
 await page.setViewportSize({width:1024,height:800});await expect(trigger).toBeFocused();await page.locator('#after-side-menu').focus();await expect(trigger).toHaveCount(0);
});
test('320px RTL drawer reflows long labels, doubled text and spacing, and print exposes all groups',async({page})=>{
 await page.getByLabel('Long labels',{exact:true}).check();await page.locator('.side-menu-review').evaluate(n=>n.setAttribute('dir','rtl'));await page.setViewportSize({width:320,height:800});await page.getByRole('button',{name:'Menu',exact:true}).click();
 await page.addStyleTag({content:'html{font-size:200%} #documentation-menu *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} #documentation-menu p{margin-block-end:2em!important}'});
 const nav=page.getByRole('navigation',{name:'Documentation'});
 for(const link of await nav.getByRole('link').all()){await link.focus();const r=await link.evaluate(n=>({w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height,scroll:n.scrollWidth,client:n.clientWidth}));expect(r.w).toBeGreaterThanOrEqual(44);expect(r.h).toBeGreaterThanOrEqual(44);expect(r.scroll).toBeLessThanOrEqual(r.client+1);}
 const dialog=page.getByRole('dialog');expect(await dialog.evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);
 await page.getByRole('button',{name:'Close navigation'}).click();await page.emulateMedia({media:'print'});await expect(page.getByRole('link',{name:'Support',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Menu',exact:true})).toBeHidden();
});
test('axe, rendered contrast and forced colours cover desktop and open drawer',async({page})=>{
 const require=createRequire(import.meta.url);await page.addScriptTag({content:readFileSync(require.resolve('axe-core/axe.min.js'),'utf8')});
 const scan=()=>page.evaluate(async()=>{const axe=(window as unknown as {axe:{run:Function}}).axe;return(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations;});expect(await scan()).toEqual([]);
 await page.setViewportSize({width:390,height:800});await page.getByRole('button',{name:'Menu',exact:true}).click();expect(await scan()).toEqual([]);
 await page.emulateMedia({forcedColors:'active'});await page.keyboard.press('Tab');const current=page.getByRole('link',{name:'Button',exact:true});await current.focus();await expect(current).toHaveCSS('outline-style','solid');await expect(current).toHaveCSS('border-inline-start-style','solid');
 const systemText=await page.evaluate(()=>{const probe=document.createElement('span');probe.style.color='CanvasText';document.body.appendChild(probe);const colour=getComputedStyle(probe).color;probe.remove();return colour;});
 await current.hover();expect(await current.evaluate(n=>getComputedStyle(n,'::before').backgroundColor)).toBe(systemText);
 await page.mouse.down();expect(await current.evaluate(n=>getComputedStyle(n,'::before').backgroundColor)).toBe(systemText);await page.mouse.move(380,0);await page.mouse.up();
});
test('SSR without JavaScript retains the entire navigation and no inactive controls',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:700}});const page=await context.newPage();
 const html=renderToString(React.createElement(ResponsiveSideMenu,{label:'Primary',headingLevel:3,open:false,onOpenChange:()=>{},currentId:'one',items:[{id:'group',label:'Components',expandable:true,items:[{id:'one',label:'Button',href:'/button'},{id:'two',label:'Accordion',href:'/accordion'}]}]}));
 await page.setContent('<!doctype html><html lang="en"><head><style>'+readFileSync('packages/react/dist/styles.css','utf8')+'</style></head><body>'+html+'</body></html>');
 await expect(page.getByRole('link')).toHaveCount(2);await expect(page.getByRole('link',{name:'Accordion'})).toBeVisible();await expect(page.getByRole('button')).toHaveCount(0);await expect(page.getByRole('dialog')).toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await context.close();
});
test('modified activation retains native href and does not commit current state',async({page})=>{
 const [activation]=await Promise.all([page.evaluate(()=>new Promise<{prevented:boolean;modified:boolean}>(resolve=>document.addEventListener('click',event=>resolve({prevented:event.defaultPrevented,modified:event.ctrlKey||event.metaKey}),{once:true}))),page.getByRole('link',{name:'Accordion',exact:true}).click({modifiers:['ControlOrMeta']})]);expect(activation.modified).toBe(true);expect(activation.prevented).toBe(false);await expect(page.getByRole('link',{name:'Button',exact:true})).toHaveAttribute('aria-current','page');
});

test('inline navigation success, including the current destination, closes and focuses main',async({page})=>{
 await page.getByRole('combobox',{name:/^Mobile presentation/}).selectOption('inline');await page.setViewportSize({width:390,height:800});
 for(const name of ['Accordion','Accordion']){await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('link',{name,exact:true}).click();await expect(page.locator('#side-menu-main')).toBeFocused();await expect(page.getByRole('button',{name:'Menu',exact:true})).toHaveAttribute('aria-expanded','false');}
});

test('uses neutral Accordion sections and the selected leading-rule colours in all pointer states',async({page})=>{
 await expect(page.getByRole('combobox',{name:/^Direction/})).toHaveCount(0);
 const group=page.getByRole('button',{name:'Components',exact:true});await expect(group).toHaveClass('owla11y-accordion__trigger');
 await expect(group).toHaveCSS('color','rgb(89, 89, 89)');await expect(group).toHaveCSS('background-color','rgb(255, 255, 255)');
 const current=page.getByRole('link',{name:'Button',exact:true});
 await expect(current).toHaveCSS('background-color','rgb(255, 255, 255)');await expect(current).toHaveCSS('color','rgb(61, 61, 61)');await expect(current).toHaveCSS('border-inline-start-width','0px');
 const marker=()=>current.evaluate(n=>({colour:getComputedStyle(n,'::before').backgroundColor,width:getComputedStyle(n,'::before').width}));
 expect(await marker()).toEqual({colour:'rgb(1, 113, 242)',width:'4px'});
 await current.hover();await expect(current).toHaveCSS('background-color','rgb(214, 214, 214)');expect((await marker()).colour).toBe('rgb(0, 85, 185)');
 await page.mouse.down();await expect(current).toHaveCSS('background-color','rgb(181, 181, 181)');expect((await marker()).colour).toBe('rgb(0, 59, 127)');await page.mouse.move(1190,10);await page.mouse.up();
 await current.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(current).toBeFocused();await expect(current).toHaveCSS('outline-style','solid');
});
test('the outer and inner in-flow Accordions remain independent and recover focus at each boundary',async({page})=>{
 await page.getByRole('combobox',{name:/^Mobile presentation/}).selectOption('inline');await page.setViewportSize({width:390,height:800});
 const outer=page.getByRole('button',{name:'Menu',exact:true});await expect(outer).toHaveClass('owla11y-accordion__trigger');await outer.click();
 const inner=page.getByRole('button',{name:'Components',exact:true});await expect(inner).toHaveClass('owla11y-accordion__trigger');
 await page.getByRole('button',{name:'Resources',exact:true}).click();await inner.click();
 await outer.click();await outer.click();await expect(inner).toHaveAttribute('aria-expanded','false');await expect(page.getByRole('button',{name:'Resources',exact:true})).toHaveAttribute('aria-expanded','true');
 await inner.click();await expect(outer).toHaveAttribute('aria-expanded','true');await expect(page.getByRole('link',{name:'Button',exact:true})).toBeVisible();
});
test('drawer aligns parent captions with its title and indents destination labels once',async({page})=>{
 await page.setViewportSize({width:390,height:800});await page.getByRole('button',{name:'Menu',exact:true}).click();
 const dimensions=await page.getByRole('dialog').evaluate(dialog=>{
  const title=dialog.querySelector('.owla11y-dialog__title')!.getBoundingClientRect();
  const caption=dialog.querySelector('.owla11y-side-menu__caption')!;
  const range=document.createRange();range.selectNodeContents(caption);const label=range.getBoundingClientRect();
  const current=dialog.querySelector('[aria-current="page"] bdi')!.getBoundingClientRect();
  return {captionOffset:Math.abs(title.left-label.left),currentOffset:Math.abs(title.left-current.left),gap:label.top-title.bottom};
 });
 expect(dimensions.captionOffset).toBeLessThanOrEqual(1);expect(dimensions.currentOffset).toBe(16);expect(dimensions.gap).toBeLessThanOrEqual(36);
});

test('core nav has no outer padding or divider; the page composes the desktop separator and header trigger',async({page})=>{
 const nav=page.getByRole('navigation',{name:'Documentation'});await expect(nav).toHaveCSS('padding','0px');await expect(nav).toHaveCSS('border-inline-end-width','0px');
 const shell=page.locator('.side-menu-preview-shell > .owla11y-side-menu-layout');await expect(shell).toHaveCSS('border-inline-end-width','1px');
 await page.setViewportSize({width:390,height:800});const header=page.locator('.side-menu-review__header');const menu=header.getByRole('button',{name:'Menu',exact:true});
 await expect(menu).toBeVisible();await expect(shell.getByRole('button',{name:'Menu',exact:true})).toHaveCount(0);await expect(page.getByRole('button',{name:'Menu',exact:true})).toHaveCount(1);await expect(shell).toHaveCSS('border-inline-end-width','0px');
 await menu.click();await page.keyboard.press('Escape');await expect(menu).toBeFocused();
 await page.addStyleTag({content:'@media print {.side-menu-review__menu-slot{display:block!important}}'});await page.emulateMedia({media:'print'});await expect(header.locator('.owla11y-side-menu-drawer-trigger')).toHaveCSS('display','none');
});
test('section drawer controls remain local and return focus to their local trigger',async({page})=>{
 await page.getByRole('combobox',{name:/^Usage context/}).selectOption('section');await page.setViewportSize({width:390,height:800});
 const shell=page.locator('.side-menu-preview-shell > .owla11y-side-menu-layout');const local=shell.getByRole('button',{name:'Account navigation',exact:true});await expect(local).toBeVisible();
 await expect(page.locator('.side-menu-review__header').getByRole('button')).toHaveCount(0);await local.click();await expect(page.getByRole('dialog',{name:'Account settings',exact:true})).toBeVisible();
 await page.keyboard.press('Escape');await expect(local).toBeFocused();
});
test('a header trigger survives open-drawer resizing and focus return before desktop takeover',async({page})=>{
 await page.setViewportSize({width:390,height:800});const headerMenu=page.locator('.side-menu-review__header').getByRole('button',{name:'Menu',exact:true});await headerMenu.click();
 await page.setViewportSize({width:1200,height:900});await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(headerMenu).toBeFocused();
 await expect(headerMenu).toBeVisible();await page.locator('#after-side-menu').focus();await expect(headerMenu).toHaveCount(0);await expect(page.getByRole('navigation',{name:'Documentation'})).toBeVisible();
});
test('in-flow Accordion controls stay local even when a primary header slot is supplied',async({page})=>{
 await page.getByRole('combobox',{name:/^Mobile presentation/}).selectOption('inline');await page.setViewportSize({width:390,height:800});
 await expect(page.locator('.side-menu-review__header').getByRole('button')).toHaveCount(0);
 const local=page.locator('.side-menu-preview-shell').getByRole('button',{name:'Menu',exact:true});await expect(local).toHaveClass('owla11y-accordion__trigger');await local.click();await expect(page.getByRole('link',{name:'Button',exact:true})).toBeVisible();
});

test('open inline navigation becomes persistent on desktop only after focus safely leaves',async({page})=>{
 await page.getByRole('combobox',{name:/^Mobile presentation/}).selectOption('inline');
 await page.setViewportSize({width:600,height:800});
 const outer=page.getByRole('button',{name:'Menu',exact:true});await outer.click();
 const current=page.getByRole('link',{name:'Button',exact:true});await current.focus();
 await page.setViewportSize({width:1280,height:900});
 await expect(current).toBeFocused();await expect(outer).toBeVisible();
 await page.locator('#after-side-menu').focus();await expect(outer).toHaveCount(0);
 await expect(page.locator('.owla11y-side-menu-layout')).toHaveAttribute('data-layout','persistent');
 await expect(page.locator('#after-side-menu')).toBeFocused();
 // An already-open inline menu with focus outside must also transition on resize.
 await page.setViewportSize({width:600,height:800});await expect(outer).toHaveAttribute('aria-expanded','true');
 await page.setViewportSize({width:1280,height:900});await expect(outer).toHaveCount(0);
 await expect(page.getByRole('navigation',{name:'Documentation'})).toBeVisible();
});

test('the empty mobile presentation prompt safely uses the default drawer',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 const choice=page.getByRole('combobox',{name:/^Mobile presentation/});
 await choice.selectOption('inline');await page.setViewportSize({width:390,height:800});
 await choice.selectOption('');await expect(choice).toHaveValue('');
 await page.getByRole('button',{name:'Menu',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'Documentation',exact:true})).toBeVisible();
 await expect(page.getByRole('navigation',{name:'Documentation'})).toBeVisible();expect(errors).toEqual([]);
});


test('static and Accordion children share one logical indent while top-level parents stay aligned',async({page})=>{
 const nav=page.getByRole('navigation',{name:'Documentation'});
 for(const direction of ['ltr','rtl']){
  await nav.evaluate((n,dir)=>n.setAttribute('dir',dir),direction);
  const positions=await nav.evaluate(n=>{
   const rtl=getComputedStyle(n).direction==='rtl',sign=rtl?-1:1;
   const edge=(el:Element)=>{const r=el.getBoundingClientRect();return rtl?r.right:r.left;};
   const caption=n.querySelector('.owla11y-side-menu__caption')!,trigger=n.querySelector('.owla11y-accordion__trigger')!;
   return {static:sign*(edge(n.querySelector('.owla11y-side-menu__group > ul a')!)-edge(caption)),accordion:sign*(edge(n.querySelector('.owla11y-side-menu__accordion-links a')!)-edge(trigger)),parents:Math.abs(edge(caption)-edge(trigger)),rule:getComputedStyle(n.querySelector('[aria-current="page"]')!,'::before').getPropertyValue(rtl?'right':'left')};
  });
  expect(positions).toEqual({static:16,accordion:16,parents:0,rule:'0px'});
 }
});
test('touch activation never leaves a sticky current-row hover and preserves focus',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:800},isMobile:true,hasTouch:true});
 const page=await context.newPage();await page.goto('http://127.0.0.1:4180/?side-menu');
 await page.getByLabel('Mobile presentation',{exact:false}).selectOption('inline');
 await page.getByLabel('Simulate failed navigation',{exact:true}).check();
 await page.getByRole('button',{name:'Menu',exact:true}).tap();
 const current=page.getByRole('link',{name:'Button',exact:true});
 expect(await page.evaluate(()=>matchMedia('(hover:hover) and (pointer:fine)').matches)).toBe(false);
 for(let i=0;i<2;i++){
  await current.tap();await expect(current).toHaveCSS('background-color','rgb(255, 255, 255)');await expect(current).toBeFocused();
  expect(await current.evaluate(n=>getComputedStyle(n,'::before').backgroundColor)).toBe('rgb(1, 113, 242)');
 }
 await context.close();
});
