import React, { act, createRef, StrictMode } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { Button, Dialog } from '../src/index.js';

// jsdom supplies neither native modal layout nor inertness; Chromium checks those.
let show: ReturnType<typeof vi.fn>;
beforeEach(() => {
  const query = document.querySelector.bind(document);
  vi.spyOn(document, 'querySelector').mockImplementation(selector => selector === 'dialog:modal' ? null : query(selector));
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockImplementation(function () {
    return this.closest('[hidden], [style="display: none;"]') ? [] as unknown as DOMRectList : [new DOMRect(0,0,100,40)] as unknown as DOMRectList;
  });
  show = vi.fn(function (this: HTMLDialogElement) { this.setAttribute('open', ''); });
  HTMLDialogElement.prototype.showModal = show;
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new Event('close')); };
});
afterEach(() => vi.restoreAllMocks());

it('rejects missing names, conflicting naming, forced close controls and unsupported modes', () => {
  const bad = (props: any) => () => renderToString(<Dialog open={false} onOpenChange={() => {}} {...props}>Content</Dialog>);
  expect(bad({})).toThrow(/accessibleLabel/);
  expect(bad({ title:'Title', accessibleLabel:'Other' })).toThrow(/omit accessibleLabel/);
  expect(bad({ title:'Title', dismissal:'forced-decision', showClose:true, actions:<button>Resolve</button> })).toThrow(/forbids showClose/);
  expect(bad({ title:'Title', size:'huge' })).toThrow(/size/);
  expect(bad({ title:'Title', tabIndex:-1 })).toThrow(/tabIndex/);
});

it('renders closed SSR markup with stable title IDs and hydrates without opening or callbacks', async () => {
  const change=vi.fn(); const ref=createRef<HTMLDialogElement>();
  const app=<Dialog ref={ref} open={false} onOpenChange={change} title="Edit profile" headingLevel={3}><p>Content</p></Dialog>;
  const host=document.createElement('div'); document.body.append(host);host.innerHTML=renderToString(app);
  const titleId=host.querySelector('dialog')!.getAttribute('aria-labelledby');
  const errors: unknown[]=[]; let root: ReturnType<typeof hydrateRoot>;
  await act(async () => { root=hydrateRoot(host,app,{ onRecoverableError:e=>errors.push(e) }); });
  expect(ref.current?.open).toBe(false);expect(show).not.toHaveBeenCalled();expect(change).not.toHaveBeenCalled();
  expect(ref.current?.querySelector('h3')?.id).toBe(titleId);expect(errors).toEqual([]);
  await act(async () => root!.unmount());host.remove();
});

it('keeps controlled ownership and restores exact host overflow across replay, prop close and unmount', async () => {
  const change=vi.fn();const ref=createRef<HTMLDialogElement>();
  document.documentElement.style.setProperty('overflow','clip','important');document.body.style.overflow='auto';
  const app=(open:boolean)=><StrictMode><Dialog ref={ref} open={open} onOpenChange={change} title="Title">Content</Dialog></StrictMode>;
  const view=render(app(true));expect(show).toHaveBeenCalledTimes(1);expect(ref.current?.autofocus).toBe(true);
  const cancel=new Event('cancel',{ cancelable:true });fireEvent(ref.current!,cancel);
  expect(cancel.defaultPrevented).toBe(true);expect(change).toHaveBeenCalledExactlyOnceWith(false,{ reason:'escape' });expect(ref.current?.open).toBe(true);
  view.rerender(app(false));expect(change).toHaveBeenCalledTimes(1);expect(ref.current?.open).toBe(false);
  expect(document.documentElement.style.getPropertyValue('overflow')).toBe('clip');expect(document.documentElement.style.getPropertyPriority('overflow')).toBe('important');expect(document.body.style.overflow).toBe('auto');
  view.rerender(app(true));view.unmount();await act(async () => {});
  expect(document.documentElement.style.overflow).toBe('clip');expect(document.body.style.overflow).toBe('auto');
  document.documentElement.style.removeProperty('overflow');document.body.style.removeProperty('overflow');
});

it('rejects dead-end forced decisions and restores the page lock on validation failure', () => {
  expect(() => render(<Dialog open onOpenChange={() => {}} title="Choose" dismissal="forced-decision" actions={<Button disabled>Unavailable</Button>}>Consequences</Dialog>)).toThrow(/enabled resolving button/);
  expect(document.body.style.overflow).not.toBe('hidden');
});

it('prevents forced-decision cancellation and does not invent a close request', () => {
  const change=vi.fn();const ref=createRef<HTMLDialogElement>();
  render(<Dialog ref={ref} open onOpenChange={change} title="Choose" dismissal="forced-decision" actions={<Button onClick={() => {}}>Keep existing choice</Button>}>Consequences</Dialog>);
  const cancel=new Event('cancel',{ cancelable:true });fireEvent(ref.current!,cancel);
  expect(cancel.defaultPrevented).toBe(true);expect(change).not.toHaveBeenCalled();expect(ref.current?.open).toBe(true);
});
