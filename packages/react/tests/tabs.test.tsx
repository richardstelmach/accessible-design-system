import React, { act, createRef, StrictMode } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { Tabs } from '../src/index.js';
import type { TabsItem } from '../src/index.js';

const items: TabsItem[]=[
  {id:'details',label:'Details',heading:'Details',content:<input aria-label="Notes" defaultValue="Saved text"/>},
  {id:'history',label:'History',heading:'History',content:<p>Earlier changes</p>},
  {id:'help',label:'Help',heading:'Help',content:<p>Support information</p>},
];
let wide=true;let observers: (()=>void)[]=[];
let previousMedia: PropertyDescriptor | undefined;let previousResize: PropertyDescriptor | undefined;
beforeEach(()=>{
  wide=true;observers=[];
  previousMedia=Object.getOwnPropertyDescriptor(window,'matchMedia');previousResize=Object.getOwnPropertyDescriptor(window,'ResizeObserver');
  Object.defineProperty(window,'matchMedia',{configurable:true,value:(query:string)=>({get matches(){return query==='print'?false:wide;},addEventListener(){},removeEventListener(){}})});
  Object.defineProperty(window,'ResizeObserver',{configurable:true,value:class{constructor(callback:()=>void){observers.push(callback);}observe(){}disconnect(){}}});
  vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(){return new DOMRect(0,0,this.classList.contains('owla11y-tabs__measure')?240:800,48);});
  vi.spyOn(HTMLElement.prototype,'getClientRects').mockReturnValue([new DOMRect(0,0,100,40)] as unknown as DOMRectList);
});
afterEach(()=>{
  vi.restoreAllMocks();
  if(previousMedia)Object.defineProperty(window,'matchMedia',previousMedia);else delete (window as any).matchMedia;
  if(previousResize)Object.defineProperty(window,'ResizeObserver',previousResize);else delete (window as any).ResizeObserver;
});

it('rejects invalid inventory, ambiguous names and invalid selection ownership',()=>{
  const bad=(props:any)=>()=>renderToString(<Tabs label="Sections" items={items} {...props}/>);
  expect(bad({items:items.slice(0,1)})).toThrow(/at least two/);
  expect(bad({items:[items[0],items[0]]})).toThrow(/unique/);
  expect(bad({items:[items[0],{...items[1],label:' '}]})).toThrow(/label/);
  expect(bad({items:[items[0],{...items[1],heading:''}]})).toThrow(/heading/);
  expect(bad({items:[items[0],{...items[1],content:null}]})).toThrow(/content/);
  expect(bad({labelledBy:'heading'})).toThrow(/not both/);
  expect(bad({selectedId:'missing',onSelectedChange:()=>{}})).toThrow(/existing item/);
  expect(bad({selectedId:'details'})).toThrow(/requires onSelectedChange/);
  expect(bad({selectedId:'details',defaultSelectedId:'history',onSelectedChange:()=>{}})).toThrow(/forbids defaultSelectedId/);
  expect(bad({activation:'delayed'})).toThrow(/activation/);
});

it('server-renders linked sections with stable encoded IDs and no widget semantics or hiding',()=>{
  const html=renderToString(<Tabs id="server-tabs" label="Sections" items={[items[0],{...items[1],id:'past / updates'}]} defaultSelectedId="past / updates" headingLevel={2}/>);
  const host=document.createElement('div');host.innerHTML=html;
  expect(host.querySelectorAll('section')).toHaveLength(2);expect(host.querySelector('[hidden],[role=tab],[role=tabpanel],[tabindex],[aria-selected],[aria-controls]')).toBeNull();
  expect(host.querySelector('section')?.firstElementChild?.tagName).toBe('H2');
  for(const link of host.querySelectorAll('a'))expect([...host.querySelectorAll('section')].some(section=>section.id===decodeURIComponent(link.hash.slice(1)))).toBe(true);
});

it('hydrates the baseline without mismatch and enhances only after layout support is available',async()=>{
  const errors:unknown[]=[];const ref=createRef<HTMLDivElement>();
  const app=<StrictMode><Tabs ref={ref} label="Sections" items={items} defaultSelectedId="history"/></StrictMode>;
  const host=document.createElement('div');document.body.append(host);host.innerHTML=renderToString(app);const ids=[...host.querySelectorAll('[id]')].map(n=>n.id);
  let root:ReturnType<typeof hydrateRoot>;await act(async()=>{root=hydrateRoot(host,app,{onRecoverableError:e=>errors.push(e)});});
  expect(ref.current).toBe(host.firstElementChild);expect([...host.querySelectorAll('[id]')].map(n=>n.id)).toEqual(ids);expect(errors).toEqual([]);
  expect(within(host).getByRole('tab',{name:'History'})).toHaveAttribute('aria-selected','true');
  await act(async()=>root!.unmount());host.remove();
});

it('automatic activation requests once and keeps hidden input DOM mounted',()=>{
  const change=vi.fn();render(<Tabs label="Sections" items={items} onSelectedChange={change}/>);
  const input=screen.getByLabelText('Notes');fireEvent.change(input,{target:{value:'Edited'}});
  fireEvent.click(screen.getByRole('tab',{name:'History'}));expect(change).toHaveBeenCalledExactlyOnceWith('history');
  expect(input.closest('section')).toHaveAttribute('hidden');
  fireEvent.click(screen.getByRole('tab',{name:'Details'}));expect(screen.getByLabelText('Notes')).toBe(input);expect(input).toHaveValue('Edited');
});

it('manual focus leaves selection intact until explicit activation and preserves modified keys',()=>{
  const change=vi.fn();render(<Tabs label="Sections" items={items} activation="manual" onSelectedChange={change}/>);
  const details=screen.getByRole('tab',{name:'Details'});const history=screen.getByRole('tab',{name:'History'});
  act(()=>details.focus());fireEvent.keyDown(details,{key:'ArrowRight'});expect(history).toHaveFocus();expect(details).toHaveAttribute('aria-selected','true');expect(change).not.toHaveBeenCalled();
  const modified=new KeyboardEvent('keydown',{key:'ArrowRight',ctrlKey:true,bubbles:true,cancelable:true});fireEvent(history,modified);expect(modified.defaultPrevented).toBe(false);
  fireEvent.keyDown(history,{key:' '});expect(history).toHaveAttribute('aria-selected','true');expect(change).toHaveBeenCalledExactlyOnceWith('history');
});

it('controlled requests do not change selection until the owner accepts',()=>{
  const change=vi.fn();const view=render(<Tabs label="Sections" items={items} selectedId="history" onSelectedChange={change} activation="manual"/>);
  fireEvent.click(screen.getByRole('tab',{name:'Help'}));expect(change).toHaveBeenCalledExactlyOnceWith('help');expect(screen.getByRole('tab',{name:'History'})).toHaveAttribute('aria-selected','true');
  view.rerender(<Tabs label="Sections" items={items} selectedId="help" onSelectedChange={change} activation="manual"/>);expect(screen.getByRole('tab',{name:'Help'})).toHaveAttribute('aria-selected','true');
});

it('fallback preserves nodes and picks the focused section before enhancing again',()=>{
  render(<Tabs label="Sections" items={items} defaultSelectedId="history"/>);
  const history=screen.getByRole('tab',{name:'History'});
  act(()=>{wide=false;observers.forEach(callback=>callback());});
  expect(screen.getByRole('link',{name:'History'})).toBe(history);expect(history).not.toHaveAttribute('aria-selected');expect(screen.getAllByRole('region')).toHaveLength(3);
  act(()=>screen.getByLabelText('Notes').focus());
  act(()=>{wide=true;observers.forEach(callback=>callback());});
  expect(screen.getByRole('tab',{name:'Details'})).toHaveAttribute('aria-selected','true');expect(screen.getByLabelText('Notes')).toHaveFocus();
});

it('keeps all sections available without measurement support and isolates generated instance IDs',()=>{
  Object.defineProperty(window,'ResizeObserver',{configurable:true,value:undefined});
  const view=render(<><Tabs label="First" items={items}/><Tabs label="Second" items={items}/></>);
  expect(screen.queryByRole('tab')).toBeNull();expect(screen.getAllByRole('region')).toHaveLength(6);
  const ids=[...view.container.querySelectorAll('[id]')].map(n=>n.id);expect(new Set(ids).size).toBe(ids.length);
});

it('defers controlled hiding when a panel still contains focus',()=>{
  const change=vi.fn();const view=render(<><button>Outside</button><Tabs label="Sections" items={items} selectedId="details" onSelectedChange={change}/></>);
  act(()=>screen.getByLabelText('Notes').focus());
  view.rerender(<><button>Outside</button><Tabs label="Sections" items={items} selectedId="history" onSelectedChange={change}/></>);
  expect(screen.queryByRole('tab')).toBeNull();expect(screen.getByLabelText('Notes')).toHaveFocus();expect(screen.getAllByRole('region')).toHaveLength(3);
  expect(change).toHaveBeenCalledExactlyOnceWith('details');
  act(()=>screen.getByRole('button',{name:'Outside'}).focus());
  expect(screen.getByRole('tab',{name:'History'})).toHaveAttribute('aria-selected','true');
});

it('automatic controlled activation permits retries without duplicating pointer focus requests',()=>{
  const change=vi.fn();render(<Tabs label="Sections" items={items} selectedId="details" onSelectedChange={change}/>);
  const history=screen.getByRole('tab',{name:'History'});
  fireEvent(history,new MouseEvent('pointerdown',{button:0,bubbles:true}));act(()=>history.focus());fireEvent.click(history);
  expect(change).toHaveBeenCalledExactlyOnceWith('history');
  fireEvent.click(history);expect(change).toHaveBeenCalledTimes(2);
  fireEvent(history,new MouseEvent('pointerdown',{button:0,bubbles:true}));fireEvent.click(history);expect(change).toHaveBeenCalledTimes(3);
  expect(screen.getByRole('tab',{name:'Details'})).toHaveAttribute('aria-selected','true');
});
