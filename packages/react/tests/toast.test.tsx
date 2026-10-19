import React, { act, StrictMode } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { ToastProvider, ToastRegion, ToastNotificationsButton, useToast } from '../src/index.js';
import type { ToastAPI, ToastMessage, ToastProviderProps } from '../src/index.js';

let api: ToastAPI;
function Consumer(){api=useToast();return <button>Origin</button>;}
function App(props: Omit<ToastProviderProps,'children'>){return <ToastProvider {...props}><Consumer/><ToastNotificationsButton/><ToastRegion/></ToastProvider>;}
const message=(id='one', more:Partial<ToastMessage>={}):ToastMessage=>({id,titleText:'Saved',dismissLabel:`Dismiss ${id}`,...more});
const add=(id='one',more:Partial<ToastMessage>={})=>act(()=>{api.add(message(id,more));});
const publish=()=>act(()=>vi.advanceTimersByTime(50));
beforeEach(()=>{(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;vi.useFakeTimers();vi.spyOn(HTMLElement.prototype,'getClientRects').mockReturnValue([new DOMRect(0,0,100,40)] as unknown as DOMRectList);});
afterEach(()=>{vi.useRealTimers();vi.restoreAllMocks();});

it('SSR mounts two empty implicit live roles and stable empty host, then hydrates in StrictMode',async()=>{
  const app=<StrictMode><App/></StrictMode>;const node=document.createElement('div');document.body.append(node);node.innerHTML=renderToString(app);
  expect(node.querySelector('[role=status]')?.textContent).toBe('');expect(node.querySelector('[role=alert]')?.textContent).toBe('');
  expect(node.querySelector('[aria-live],[aria-atomic]')).toBeNull();const errors:unknown[]=[];const id=node.querySelector('section')!.id;
  let root:ReturnType<typeof hydrateRoot>;await act(async()=>{root=hydrateRoot(node,app,{onRecoverableError:e=>errors.push(e)});});
  expect(node.querySelector('section')!.id).toBe(id);expect(errors).toEqual([]);add();publish();expect(node.querySelectorAll('[data-toast-id]')).toHaveLength(1);
  await act(async()=>root!.unmount());node.remove();
});
it('requires one complete host and rejects nested/duplicate parts',()=>{
  expect(()=>renderToString(<ToastRegion/>)).toThrow(/ToastProvider/);
  expect(()=>renderToString(<ToastProvider><ToastProvider>Nested</ToastProvider></ToastProvider>)).toThrow(/nest/);
  const view=render(<ToastProvider><Consumer/></ToastProvider>);
  expect(()=>api.add(message())).toThrow(/mount/);view.unmount();
  expect(()=>render(<ToastProvider><ToastRegion/><ToastRegion/><ToastNotificationsButton/></ToastProvider>)).toThrow(/exactly one/);
});
it('rejects invalid plain text, unsupported policy props and duplicate active IDs synchronously',()=>{
  render(<App/>);
  for(const props of [{titleText:' '},{dismissLabel:''},{id:''},{state:'other'},{announcement:'none'},{descriptionText:<b>Rich</b>},{duration:1000},{onDismiss:()=>{}}])
    expect(()=>api.add({...message(),...props} as any)).toThrow(/OwlA11y/);
  act(()=>expect(api.add(message())).toBe('one'));expect(()=>api.add(message())).toThrow(/unique/);
  act(()=>api.dismiss('one'));add();expect(screen.getAllByRole('listitem')).toHaveLength(1);
});
it('escapes text, omits blank descriptions, and announces exactly one new event through the selected channel',()=>{
  render(<App/>);const origin=screen.getByText('Origin');act(()=>origin.focus());
  add('one',{state:'error',titleText:'<img src=x>',descriptionText:' '});publish();expect(origin).toHaveFocus();
  expect(screen.getByRole('status')).toHaveTextContent('Error: <img src=x>');expect(screen.getByRole('alert')).toBeEmptyDOMElement();
  const item=screen.getByRole('listitem');expect(item.querySelector('img,h1,h2')).toBeNull();expect(item.querySelectorAll('p')).toHaveLength(1);
  expect(item.querySelector('[role],[aria-live],[aria-atomic]')).toBeNull();expect(item).not.toHaveAttribute('tabindex');
  expect(item.querySelector('svg')).toHaveAttribute('aria-hidden','true');expect(screen.getByRole('button',{name:'Dismiss one'})).toHaveAttribute('type','button');
  add('two',{announcement:'assertive',descriptionText:'At risk'});publish();expect(screen.getByRole('alert')).toHaveTextContent('Information: Saved. At risk');
  expect(screen.getByRole('alert')).not.toHaveTextContent('Dismiss');expect(screen.getByRole('alert')).not.toHaveTextContent('<img');
});
it('batches same-turn events per urgency, preserving every chronological message without eviction',()=>{
  render(<App/>);act(()=>{for(let i=0;i<24;i++)api.add(message(String(i),{announcement:i===23?'assertive':'polite'}));});publish();
  expect(screen.getAllByRole('listitem').map(node=>node.dataset.toastId)).toEqual(Array.from({length:24},(_,i)=>String(i)));
  expect(screen.getByRole('status').textContent).toBe('23 notifications. Information: Saved');expect(screen.getByRole('alert')).toHaveTextContent('Information: Saved');
  act(()=>vi.advanceTimersByTime(600000));expect(screen.getAllByRole('listitem')).toHaveLength(24);
});
it('clears between separate identical-text events; dismissal never republishes and cancels unpublished messages',()=>{
  render(<App/>);add();publish();const status=screen.getByRole('status');expect(status).toHaveTextContent('Saved');
  add('two');expect(status).toBeEmptyDOMElement();publish();expect(status).toHaveTextContent('Saved');
  const unchanged=status.textContent;act(()=>api.dismiss('one'));expect(status.textContent).toBe(unchanged);
  add('three');act(()=>api.dismiss('three'));publish();expect(status).toBeEmptyDOMElement();
});
it('localizes count, state prefixes, empty text and burst summary without putting labels in announcement text',()=>{
  const formatter=vi.fn((messages:readonly ToastMessage[])=>`${messages.length} nouveaux : ${messages.map(m=>m.titleText).join(', ')}`);
  render(<App regionLabel="Notifications françaises" emptyText="Aucun message" stateLabels={{success:'Réussite :',info:'Information :',warning:'Attention :',error:'Erreur :'}} formatCountLabel={n=>`Messages (${n})`} formatAnnouncement={formatter}/>);
  expect(screen.getByText('Aucun message')).toBeVisible();add();add('two');publish();
  expect(screen.getByRole('button',{name:'Messages (2)'})).toBeVisible();expect(screen.getByRole('status')).toHaveTextContent('2 nouveaux : Saved, Saved');expect(formatter).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('region',{name:'Notifications françaises'})).toBeVisible();
});
it('entry focuses the region deliberately and focused dismissal chooses next, previous, then origin',()=>{
  const dismissed=vi.fn();render(<App onDismiss={dismissed}/>);add();add('two');add('three');
  fireEvent.click(screen.getByRole('button',{name:'Notifications (3)'}));expect(screen.getByRole('region')).toHaveFocus();
  const close=screen.getByRole('button',{name:'Dismiss two'});act(()=>close.focus());fireEvent.keyDown(close,{key:'Escape'});
  expect(screen.getByRole('button',{name:'Dismiss three'})).toHaveFocus();fireEvent.click(screen.getByRole('button',{name:'Dismiss three'}));expect(screen.getByRole('button',{name:'Dismiss one'})).toHaveFocus();
  fireEvent.click(screen.getByRole('button',{name:'Dismiss one'}));expect(screen.getByRole('button',{name:'Notifications (0)'})).toHaveFocus();expect(dismissed.mock.calls.flat()).toEqual(['two','three','one']);
});
it('captures Tab origin, preserves outside focus on background removal, and rejects disconnected origins',()=>{
  render(<App/>);add();add('two');const origin=screen.getByText('Origin');act(()=>origin.focus());
  fireEvent.keyDown(origin,{key:'Escape'});expect(screen.getAllByRole('listitem')).toHaveLength(2);
  act(()=>api.dismiss('two'));expect(origin).toHaveFocus();
  const close=screen.getByRole('button',{name:'Dismiss one'});fireEvent.focus(close,{relatedTarget:origin});act(()=>close.focus());
  fireEvent.click(close);expect(origin).toHaveFocus();
  add();fireEvent.focus(screen.getByRole('button',{name:'Dismiss one'}),{relatedTarget:origin});act(()=>screen.getByRole('button',{name:'Dismiss one'}).focus());origin.hidden=true;
  act(()=>api.dismiss('one'));expect(screen.getByRole('button',{name:'Notifications (0)'})).toHaveFocus();
});
it('defers both urgency channels while a modal owns focus; close delivers only still-active pending events',async()=>{
  const original=document.querySelector.bind(document);let modal=true;
  vi.spyOn(document,'querySelector').mockImplementation((selector:string)=>selector==='dialog:modal'?(modal?document.createElement('dialog'):null):original(selector));
  render(<App/>);add();add('urgent',{announcement:'assertive'});publish();expect(screen.getByRole('status')).toBeEmptyDOMElement();expect(screen.getByRole('alert')).toBeEmptyDOMElement();
  act(()=>api.dismiss('one'));modal=false;fireEvent(document,new Event('close'));publish();expect(screen.getByRole('status')).toBeEmptyDOMElement();expect(screen.getByRole('alert')).toHaveTextContent('Saved');
});
it('keeps queue across app rerenders and cancels announcement work when the host unmounts',()=>{
  const view=render(<App/>);add();view.rerender(<App regionLabel="Updates"/>);expect(screen.getByRole('listitem')).toBeVisible();
  view.unmount();publish();const next=render(<App/>);expect(screen.queryByRole('listitem')).toBeNull();expect(screen.getByRole('status')).toBeEmptyDOMElement();next.unmount();
});

it('rechecks modal ownership at delivery time and flushes only after it closes',()=>{
  const original=document.querySelector.bind(document);let modal=false;
  vi.spyOn(document,'querySelector').mockImplementation((selector:string)=>selector==='dialog:modal'?(modal?document.createElement('dialog'):null):original(selector));
  render(<App/>);add();modal=true;publish();expect(screen.getByRole('status')).toBeEmptyDOMElement();
  modal=false;fireEvent(document,new Event('close'));publish();expect(screen.getByRole('status')).toHaveTextContent('Saved');
});
it('rejects a second document announcement owner and releases ownership after unmount',()=>{
  const first=render(<App/>);
  expect(()=>render(<App/>)).toThrow(/one ToastProvider per document/);
  first.unmount();const next=render(<App/>);add();publish();expect(screen.getByRole('status')).toHaveTextContent('Saved');next.unmount();
});
