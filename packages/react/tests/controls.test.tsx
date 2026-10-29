import React, {act, createRef, StrictMode} from 'react';
import {beforeEach,expect,it,vi} from 'vitest';
import {fireEvent,render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderToString} from 'react-dom/server';
import {hydrateRoot} from 'react-dom/client';
import {Accordion, Fieldset, Stepper} from '../src/index.js';
import {quantity} from '../src/internal/stepper.js';
beforeEach(()=>{(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;});
const items=[{id:'one',title:'First section',content:<input aria-label="Notes" defaultValue="Saved"/>},{id:'two',title:'Second section',content:<p>Second body</p>}];
const base={label:'Quantity',name:'quantity',step:1,incrementLabel:'Increase quantity',decrementLabel:'Decrease quantity'};
it('Accordion SSR is usable ordinary headings with every body visible and stable unique IDs',()=>{
  const html=renderToString(<><Accordion headingLevel={3} items={items}/><Accordion headingLevel={2} items={items}/></>);const host=document.createElement('div');host.innerHTML=html;
  expect(host.querySelector('button,[hidden],[role],[tabindex]')).toBeNull();expect(host.querySelectorAll('h3,h2')).toHaveLength(4);expect(host.querySelectorAll('input')).toHaveLength(2);
  const ids=[...host.querySelectorAll('[id]')].map(n=>n.id);expect(new Set(ids).size).toBe(ids.length);
});
it('Accordion native buttons independently toggle any number of mounted panels',async()=>{
  const user=userEvent.setup();const changes=vi.fn();render(<Accordion headingLevel={3} items={items} onExpandedChange={changes}/>);
  const first=screen.getByRole('button',{name:'First section'});const second=screen.getByRole('button',{name:'Second section'});const input=screen.getByLabelText('Notes',{selector:'input'});
  expect(first).toHaveAttribute('type','button');expect(first).toHaveAttribute('aria-expanded','false');expect(first.parentElement!.tagName).toBe('H3');expect(first.parentElement!.children).toHaveLength(1);
  await user.click(first);await user.type(input,' edit');await user.click(second);expect(changes).toHaveBeenLastCalledWith(['one','two']);
  await user.click(first);expect(input).not.toBeVisible();expect(input).toHaveValue('Saved edit');expect(input).toBe(document.querySelector('input'));
  await user.click(second);expect(changes).toHaveBeenLastCalledWith([]);expect(second).toHaveFocus();expect(document.querySelector('[role=region]')).toBeNull();
  fireEvent.keyDown(second,{key:'ArrowUp'});expect(second).toHaveFocus();expect(second).toHaveAttribute('aria-expanded','false');
});
it('Accordion controlled owners may decline and external collapse recovers focus before hiding',()=>{
  const onExpandedChange=vi.fn();const view=render(<Accordion id="sections" headingLevel={4} titleStyle="h2" items={items} expandedIds={['one']} onExpandedChange={onExpandedChange} panelLandmark/>);
  const first=screen.getByRole('button',{name:'First section'});fireEvent.click(first);expect(onExpandedChange).toHaveBeenLastCalledWith([]);expect(first).toHaveAttribute('aria-expanded','true');
  const panel=screen.getByRole('region',{name:'First section'});expect(panel).toHaveAttribute('id',first.getAttribute('aria-controls'));expect(first.parentElement).toHaveAttribute('data-title-style','h2');
  act(()=>screen.getByLabelText('Notes').focus());view.rerender(<Accordion id="sections" headingLevel={4} items={items} expandedIds={[]} onExpandedChange={onExpandedChange} panelLandmark/>);
  expect(first).toHaveFocus();expect(panel).not.toBeVisible();
});
it('Accordion hydration preserves pre-existing panel focus, combines defaults, and never hides the focused field',async()=>{
  const app=<StrictMode><Accordion headingLevel={3} items={items} defaultExpandedIds={['two']}/></StrictMode>;const host=document.createElement('div');document.body.append(host);host.innerHTML=renderToString(app);const input=host.querySelector('input')!;input.focus();const ids=[...host.querySelectorAll('[id]')].map(n=>n.id);const errors:unknown[]=[];let root:ReturnType<typeof hydrateRoot>;
  await act(async()=>{root=hydrateRoot(host,app,{onRecoverableError:e=>errors.push(e)});});expect(errors).toEqual([]);expect(input).toHaveFocus();expect(host.querySelectorAll('[aria-expanded=true]')).toHaveLength(2);expect([...host.querySelectorAll('[id]')].map(n=>n.id)).toEqual(ids);
  await act(async()=>root!.unmount());host.remove();
});
it('Accordion controlled hydration keeps focused baseline content even if the owner declines',async()=>{
  const change=vi.fn();const app=<Accordion headingLevel={2} items={items} expandedIds={['two']} onExpandedChange={change}/>;const host=document.createElement('div');document.body.append(host);host.innerHTML=renderToString(app);host.querySelector('input')!.focus();let root:ReturnType<typeof hydrateRoot>;
  await act(async()=>{root=hydrateRoot(host,app);});expect(change).toHaveBeenCalledWith(['one','two']);expect(host.querySelectorAll('[aria-expanded=true]')).toHaveLength(2);expect(host.querySelector('input')).toHaveFocus();await act(async()=>root!.unmount());host.remove();
});
it('Accordion rejects unsupported structure, invalid keys and ownership',()=>{
  for(const props of [{headingLevel:1},{items:[]},{items:[items[0],items[0]]},{items:[{...items[0],title:' '}]},{defaultExpandedIds:['missing']},{expandedIds:[]},{expandedIds:[],defaultExpandedIds:[],onExpandedChange:()=>{}},{singleOpen:true},{role:'tablist'}])expect(()=>renderToString(<Accordion headingLevel={3} items={items} {...props as any}/>)).toThrow(/OwlA11y/);
});
it('Stepper exposes native number semantics, associations, input ref and three-control order',()=>{
  const ref=createRef<HTMLInputElement>();render(<Stepper {...base} ref={ref} min={1} max={3} defaultValue="2" helperText="Choose 1 to 3" error={{message:'Error: Check quantity'}}/>);
  const input=screen.getByRole('spinbutton',{name:'Quantity'});expect(ref.current).toBe(input);expect(input).toBeRequired();expect(input).toHaveAttribute('type','number');expect(input).toHaveAccessibleDescription('Choose 1 to 3 Error: Check quantity');expect(input).toHaveAttribute('aria-invalid','true');
  expect([...input.parentElement!.children].map(n=>n.tagName)).toEqual(['BUTTON','INPUT','BUTTON']);expect(screen.getByRole('status')).toBeEmptyDOMElement();expect(input).not.toHaveAttribute('aria-valuenow');
});
it('Stepper uses native decimal stepping, updates boundaries and supports native reset',async()=>{
  const user=userEvent.setup();const change=vi.fn();render(<form><Stepper {...base} min={0} max={0.3} step={0.1} defaultValue="0.2" onValueChange={change}/><button type="reset">Reset</button></form>);
  const plus=screen.getByRole('button',{name:'Increase quantity'});const input=screen.getByRole('spinbutton');await user.click(plus);expect(input).toHaveValue(0.3);expect(plus).toBeDisabled();expect(change).toHaveBeenLastCalledWith('0.3',{source:'increment'});expect(input).toHaveFocus();expect(screen.getByRole('status')).toBeEmptyDOMElement();
  await user.click(screen.getByRole('button',{name:'Reset'}));expect(input).toHaveValue(0.2);expect(plus).toBeEnabled();expect(new FormData(document.querySelector('form')!).get('quantity')).toBe('0.2');
});
it('Stepper direct entry preserves invalid quantities and does not announce typing',()=>{
  const change=vi.fn();render(<Stepper {...base} min={0} max={4} step={2} defaultValue="2" onValueChange={change}/>);const input=screen.getByRole('spinbutton');fireEvent.change(input,{target:{value:'3'}});expect(input).toHaveValue(3);expect(input).toBeInvalid();expect(change).toHaveBeenLastCalledWith('3',{source:'input'});expect(screen.getByRole('button',{name:'Increase quantity'})).toBeEnabled();expect(screen.getByRole('status')).toBeEmptyDOMElement();
  fireEvent.change(input,{target:{value:'99'}});expect(input).toHaveValue(99);expect(input).toBeInvalid();
});
it('Stepper controlled owners can decline native-step requests without changing the displayed value or announcing',()=>{
  const change=vi.fn();const view=render(<Stepper {...base} value="2" onValueChange={change}/>);fireEvent.click(screen.getByRole('button',{name:'Increase quantity'}));expect(change).toHaveBeenLastCalledWith('3',{source:'increment'});expect(screen.getByRole('spinbutton')).toHaveValue(2);expect(screen.getByRole('status')).toBeEmptyDOMElement();
  view.rerender(<Stepper {...base} value="3" onValueChange={change}/>);expect(screen.getByRole('spinbutton')).toHaveValue(3);expect(screen.getByRole('status')).toHaveTextContent('Quantity: 3');
});
it('Stepper inherited disabling suppresses errors, excludes submission and disables every control',()=>{
  render(<form><Fieldset legend="Unavailable" disabled><Stepper {...base} defaultValue="1" error={{message:'Stale error'}}/></Fieldset></form>);expect(screen.getByRole('spinbutton')).toBeDisabled();for(const button of screen.getAllByRole('button'))expect(button).toBeDisabled();expect(screen.queryByText('Stale error')).toBeNull();expect(screen.getByRole('spinbutton')).not.toHaveAttribute('aria-invalid');expect(new FormData(document.querySelector('form')!).has('quantity')).toBe(false);
});
it('Stepper empty values can be stepped, equal boundaries disable both buttons, and no mount focus is taken',()=>{
  const view=render(<Stepper {...base} min={2} max={2} defaultValue="2"/>);for(const button of screen.getAllByRole('button'))expect(button).toBeDisabled();expect(screen.getByRole('spinbutton')).not.toHaveFocus();view.unmount();render(<Stepper {...base} requirement="optional"/>);expect(screen.getByRole('spinbutton')).not.toBeRequired();fireEvent.click(screen.getByRole('button',{name:'Increase quantity'}));expect(screen.getByRole('spinbutton')).toHaveValue(1);expect(screen.getByRole('status')).toHaveTextContent('Quantity: 1');
});
it('Stepper SSR/hydration preserves raw default, IDs, ref and empty announcement',async()=>{
  const ref=createRef<HTMLInputElement>();const app=<StrictMode><Stepper {...base} ref={ref} defaultValue="2"/></StrictMode>;const host=document.createElement('div');document.body.append(host);host.innerHTML=renderToString(app);const html=host.innerHTML;const errors:unknown[]=[];let root:ReturnType<typeof hydrateRoot>;
  await act(async()=>{root=hydrateRoot(host,app,{onRecoverableError:e=>errors.push(e)});});expect(host.innerHTML).toBe(html);expect(errors).toEqual([]);expect(ref.current?.value).toBe('2');await act(async()=>root!.unmount());host.remove();
});
it('Stepper rejects invalid configuration and does not treat large mismatched quantities as valid boundaries',()=>{
  for(const props of [{step:0},{step:Infinity},{min:4,max:2},{min:0,step:2,defaultValue:'3'},{defaultValue:'abc'},{defaultValue:'Infinity'},{defaultValue:2},{value:'2'},{value:'2',defaultValue:'2',onValueChange:()=>{}},{incrementLabel:''},{readOnly:true},{placeholder:'Enter'},{onChange:()=>{}},{tabIndex:-1}])expect(()=>renderToString(<Stepper {...base} {...props as any}/>)).toThrow(/OwlA11y/);
  expect(quantity('1000000000000.5',0,1000000000000.5,1,0).valid).toBe(false);
});

it('Accordion optional outline changes presentation without changing semantics, keys or ownership',async()=>{
  const user=userEvent.setup();const ref=createRef<HTMLDivElement>();const view=render(<Accordion ref={ref} headingLevel={3} items={items}/>);
  expect(ref.current).not.toHaveAttribute('data-outlined');const trigger=screen.getByRole('button',{name:items[0].title});const controls=trigger.getAttribute('aria-controls');
  await user.click(trigger);expect(trigger).toHaveAttribute('aria-expanded','true');
  view.rerender(<Accordion ref={ref} headingLevel={3} items={items} outlined/>);
  expect(ref.current).toHaveAttribute('data-outlined','true');expect(trigger).toHaveAttribute('aria-controls',controls);expect(trigger).toHaveAttribute('aria-expanded','true');expect(ref.current!.querySelectorAll('[role=region]')).toHaveLength(0);
  await user.click(trigger);expect(trigger).toHaveAttribute('aria-expanded','false');expect(trigger).toHaveFocus();
  view.rerender(<Accordion ref={ref} headingLevel={3} items={items} outlined={false}/>);expect(ref.current).not.toHaveAttribute('data-outlined');
});
it('Accordion rejects non-boolean outline values at runtime',()=>{
  for(const outlined of ['true',null,0])expect(()=>renderToString(<Accordion headingLevel={3} items={items} outlined={outlined as any}/>)).toThrow(/outlined must be a boolean/);
});
