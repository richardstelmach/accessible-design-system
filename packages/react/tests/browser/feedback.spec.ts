import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

test.beforeEach(async({page})=>{await page.setViewportSize({width:1200,height:1000});await page.goto('/?feedback');await page.evaluate(()=>document.fonts.ready);});

test('Alert and Badge geometry matches source/Figma at every breakpoint',async({page})=>{
  for(const [width,body,alertHeight,descriptionHeight,badgeFont,badgeHeight] of [[600,16,56,84,14,29],[800,16,56,84,14,29],[1200,18,59,90,16,32]]){
    await page.setViewportSize({width,height:1000});
    const alerts=await page.locator('#alert-examples .owla11y-alert').evaluateAll(nodes=>nodes.map(n=>{
      const css=getComputedStyle(n);const title=n.querySelector('.owla11y-alert__title')!;const description=n.querySelector('.owla11y-alert__description');
      return {height:n.getBoundingClientRect().height,padding:css.padding,gap:css.gap,radius:css.borderRadius,font:getComputedStyle(title).fontSize,weight:getComputedStyle(title).fontWeight,icon:n.querySelector('svg')!.getBoundingClientRect().width,descriptionGap:description?description.getBoundingClientRect().top-title.getBoundingClientRect().bottom:null};
    }));
    expect(alerts).toHaveLength(8);alerts.forEach((item,index)=>{expect(item).toMatchObject({padding:'16px',gap:'12px',radius:'8px',font:`${body}px`,weight:'600',icon:24});expect(item.height).toBe(index%2?descriptionHeight:alertHeight);if(index%2)expect(item.descriptionGap).toBe(4);});
    const badges=page.locator('#badge-examples .owla11y-badge');await expect(badges).toHaveCount(5);
    for(const badge of await badges.all()){await expect(badge).toHaveCSS('font-size',`${badgeFont}px`);await expect(badge).toHaveCSS('font-weight','400');await expect(badge).toHaveCSS('padding','4px 8px');await expect(badge).toHaveCSS('border-radius','9999px');expect((await badge.boundingBox())!.height).toBe(badgeHeight);expect((await badge.boundingBox())!.width).toBeLessThan(240);}
  }
  await page.screenshot({path:'/tmp/owla11y-feedback-desktop.png',fullPage:true});
});

test('all six Alert title styles follow semantic typography with an exact visible description gap',async({page})=>{
  const modes=[{width:600,fonts:[16,24,20,18,16,16],lines:[24,28.8,24,27,24,24]}, {width:800,fonts:[16,30,24,20,18,16],lines:[24,36,28.8,24,27,24]}, {width:1200,fonts:[18,36,30,24,20,18],lines:[27,43.2,36,28.8,24,27]}];
  for(const mode of modes){await page.setViewportSize({width:mode.width,height:1000});for(const [index,level] of ['none','2','3','4','5','6'].entries()){
    await page.getByLabel('Alert title semantics').selectOption(level);
    const title=page.getByTestId('alert-info-true').locator('.owla11y-alert__title');
    expect(await title.evaluate(n=>n.tagName)).toBe(level==='none'?'P':`H${level}`);await expect(title).toHaveCSS('font-size',`${mode.fonts[index]}px`);
    expect(await title.evaluate(n=>parseFloat(getComputedStyle(n).lineHeight))).toBeCloseTo(mode.lines[index],1);
    const gap=await page.getByTestId('alert-info-true').evaluate(n=>n.querySelector('.owla11y-alert__description')!.getBoundingClientRect().top-n.querySelector('.owla11y-alert__title')!.getBoundingClientRect().bottom);expect(gap).toBeCloseTo(4,2);
  }}
});

test('Badge remains noninteractive; Tab skips static feedback and dynamic updates preserve focus with one live owner',async({page})=>{
  await expect(page.locator('#alert-examples [role],#alert-examples [tabindex],#badge-examples [role],#badge-examples [tabindex]')).toHaveCount(0);
  await page.getByLabel('Right to left').focus();await page.keyboard.press('Tab');await expect(page.getByLabel('Update priority')).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.getByRole('button',{name:'Publish result'})).toBeFocused();await page.keyboard.press('Enter');
  await expect(page.locator('#feedback-polite')).toHaveText('Success: Application update 1 was savedYour answers remain available in the application.');await expect(page.getByRole('button',{name:'Publish result'})).toBeFocused();
  await expect(page.locator('#feedback-polite [role],#feedback-polite [aria-live],#feedback-polite [aria-atomic]')).toHaveCount(0);
  await page.getByLabel('Update priority').selectOption('assertive');await expect(page.locator('#feedback-assertive')).toBeEmpty();
  await page.getByRole('button',{name:'Publish result'}).click();await expect(page.locator('#feedback-assertive')).toContainText('Warning: Connection warning 1');await expect(page.locator('#feedback-polite')).toBeEmpty();
  await page.keyboard.press('Tab');await expect(page.locator('#after-feedback')).toBeFocused();
  const badge=page.getByTestId('badge-success');const original=await badge.evaluate(n=>({colour:getComputedStyle(n).color,background:getComputedStyle(n).backgroundColor,cursor:getComputedStyle(n).cursor}));await badge.hover();expect(await badge.evaluate(n=>({colour:getComputedStyle(n).color,background:getComputedStyle(n).backgroundColor,cursor:getComputedStyle(n).cursor}))).toEqual(original);
});

test('320px reflow, unbroken labels, doubled text and spacing overrides preserve all content',async({page})=>{
  await page.setViewportSize({width:320,height:900});await page.getByLabel('Long text').check();await page.getByLabel('Alert title semantics').selectOption('2');
  await page.addStyleTag({content:'html{font-size:200%} .owla11y-alert__title,.owla11y-alert__description,.owla11y-badge{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} .owla11y-alert__description{margin-block-end:2em!important}'});
  expect(await page.evaluate(()=>({overflows:document.documentElement.scrollWidth>innerWidth,width:document.documentElement.scrollWidth,viewport:innerWidth}))).toMatchObject({overflows:false});
  for(const badge of await page.locator('.owla11y-badge').all()){const box=(await badge.boundingBox())!;expect(box.width).toBeLessThanOrEqual(288);expect(box.height).toBeGreaterThan(48);expect(await badge.evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);}
  for(const alert of await page.locator('#alert-examples .owla11y-alert').all()){expect(await alert.evaluate(n=>n.querySelector('.owla11y-alert__content')!.getBoundingClientRect().width)).toBeGreaterThan(0);expect(await alert.evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);}
  await page.getByTestId('alert-info-true').screenshot({path:'/tmp/owla11y-feedback-mobile-alert.png'});
  await page.getByTestId('badge-info').screenshot({path:'/tmp/owla11y-feedback-mobile-badge.png'});
});

test('logical RTL layout, scoped token overrides and forced-colour boundaries retain meaning',async({page})=>{
  await page.getByLabel('Right to left').check();const alert=page.getByTestId('alert-info-true');
  expect(await alert.evaluate(n=>n.querySelector('svg')!.getBoundingClientRect().left>n.querySelector('.owla11y-alert__content')!.getBoundingClientRect().left)).toBe(true);
  await page.getByLabel('Long text').check();await page.locator('main').evaluate(n=>n.style.setProperty('--component-badge-sizing-max-width','8rem'));
  for(const badge of await page.locator('#badge-examples .owla11y-badge').all())expect((await badge.boundingBox())!.width).toBeLessThanOrEqual(128);
  await page.emulateMedia({forcedColors:'active'});await expect(alert).toHaveCSS('border-top-style','solid');await expect(page.getByTestId('badge-error')).toHaveCSS('border-top-style','solid');
  await expect(page.getByTestId('badge-error')).toHaveText('AwaitingApplicationReview'.repeat(9));await expect(alert.locator('svg')).toHaveAttribute('aria-hidden','true');
});

test('all Alert states and Badge tones pass axe including rendered contrast',async({page})=>{
  await page.addScriptTag({content:readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'),'utf8')});
  const violations=await page.evaluate(async()=>{const result=await (window as any).axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return result.violations.map((v:any)=>({id:v.id,nodes:v.nodes.map((n:any)=>n.target)}));});expect(violations).toEqual([]);
});
