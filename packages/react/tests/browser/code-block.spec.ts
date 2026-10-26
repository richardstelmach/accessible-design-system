import {test, expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
test.beforeEach(async({page})=>{await page.goto('/?code-block');await page.evaluate(()=>document.fonts.ready);});
test('copy, repeated copy, unavailable/denied feedback and focus',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  const block=page.locator('#code-example'), button=block.getByRole('button'), live=block.locator('[aria-live]');
  await expect(block.locator('pre')).toHaveAttribute('tabindex','-1');
  await expect(live).toHaveText('Ready to copy.');
  await button.click(); await expect(live).toHaveText('Copied.'); await expect(button).toBeFocused();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe("import '@owla11y/react/styles.css';");
  await button.click(); await expect(live).toHaveText('Copied. Copy 2 complete.');
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied')}}}));
  await button.click(); await expect(live).toContainText('Select and copy'); await expect(button).toBeFocused();
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:undefined}));
  await button.click(); await expect(live).toContainText('Attempt 4.');
});
test('Tab skips short code, enters named overflow and Arrow scrolls with inset focus',async({page})=>{
  const block=page.locator('#code-example'), pre=block.locator('pre'), button=block.getByRole('button');
  await button.focus(); await page.keyboard.press('Tab'); await expect(pre).not.toBeFocused();
  await page.getByRole('button',{name:'Show long code'}).click(); await page.setViewportSize({width:320,height:900});
  await expect(pre).toHaveAttribute('tabindex','0'); await button.focus(); await page.keyboard.press('Tab'); await expect(pre).toBeFocused();
  await expect(pre).toHaveAccessibleName('React code, horizontally scrollable');
  await page.keyboard.press('ArrowRight'); await expect.poll(()=>pre.evaluate(n=>n.scrollLeft)).toBeGreaterThan(0);
  expect(await pre.evaluate(n=>parseFloat(getComputedStyle(n).outlineOffset))).toBeLessThan(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
test('responsive, doubled text, text spacing, RTL, forced colours and scoped tokens',async({page})=>{
  await page.getByRole('button',{name:'Show long code'}).click();
  for(const width of [320,768,1024]){
    await page.setViewportSize({width,height:1000});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await page.setViewportSize({width:320,height:900});
  await page.addStyleTag({content:'html{font-size:200%} .owla11y-code-block{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} .owla11y-code-block p{margin-bottom:2em!important}'});
  await page.locator('#code-example').evaluate(n=>{n.setAttribute('dir','rtl');n.setAttribute('style','--color-text-default:rgb(20, 30, 40)')});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  expect(await page.locator('#code-example code').evaluate(n=>getComputedStyle(n).color)).toBe('rgb(20, 30, 40)');
  await page.emulateMedia({forcedColors:'active'});
  const pre=page.locator('#code-example pre');await page.locator('#code-example button').focus();await page.keyboard.press('Tab');await expect(pre).toBeFocused();
  expect(await pre.evaluate(n=>getComputedStyle(n).outlineStyle)).toBe('solid');
});
test('axe reports no violations including rendered contrast',async({page})=>{
  await page.addScriptTag({content:readFileSync(require.resolve('axe-core/axe.min.js'),'utf8')});
  const violations=await page.evaluate(async()=> (await (window as any).axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations);
  expect(violations).toEqual([]);
});
test('print reveals complete wrapping code and removes copy UI',async({page})=>{
  await page.getByRole('button',{name:'Show long code'}).click();await page.emulateMedia({media:'print'});
  await expect(page.locator('#code-example button')).toBeHidden();
  expect(await page.locator('#code-example pre').evaluate(n=>getComputedStyle(n).whiteSpace)).toBe('pre-wrap');
});
test('no-JavaScript baseline has exact code, wrapping content and no copy action',async({browser})=>{
  // Vite is a client-only preview. Intercept its document with actual package SSR output.
  const {renderToString}=await import('react-dom/server'), React=await import('react');
  const {CodeBlock}=await import('../../dist/index.js');
  const content='\n  <Button>Save</Button>\n\t'+ 'long '.repeat(100)+'\n';
  const html=renderToString(React.createElement(CodeBlock,{label:'React',code:content}));
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:800}});const p=await context.newPage();
  await p.route('**/baseline',route=>route.fulfill({contentType:'text/html',body:`<!doctype html><html lang="en"><title>SSR</title><style>${readFileSync('packages/react/dist/styles.css','utf8')}</style><main>${html}</main></html>`}));
  await p.goto('http://127.0.0.1:4180/baseline');await expect(p.locator('button')).toHaveCount(0);
  expect(await p.locator('code').textContent()).toBe(content);expect(await p.locator('pre').evaluate(n=>getComputedStyle(n).whiteSpace)).toBe('pre-wrap');
  expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);await context.close();
});
