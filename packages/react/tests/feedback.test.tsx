import React, { act, createRef, StrictMode } from 'react';
import { beforeEach, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { Alert, Badge } from '../src/index.js';
import type { AlertState, BadgeTone } from '../src/index.js';
beforeEach(()=>{(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;});
const states:AlertState[]=['success','info','warning','error'];
const tones:BadgeTone[]=['neutral',...states];

it('Alert defaults to static info with one prefix, decorative icon and paragraph title',()=>{
  const ref=createRef<HTMLDivElement>();render(<Alert ref={ref} id="notice" titleText="Maintenance at 8pm"/>);
  expect(ref.current).toBe(document.getElementById('notice'));expect(ref.current).toHaveAttribute('data-state','info');
  expect(ref.current!.textContent).toBe('Information: Maintenance at 8pm');expect(ref.current!.querySelectorAll('p')).toHaveLength(1);
  expect(ref.current).not.toHaveAttribute('role');expect(ref.current).not.toHaveAttribute('tabindex');
  expect(ref.current!.querySelector('svg')).toHaveAttribute('aria-hidden','true');expect(ref.current!.querySelector('svg')).toHaveAttribute('focusable','false');
  expect(ref.current!.querySelector('svg title,button,a,h1,h2,[aria-live],[aria-atomic]')).toBeNull();
});
it('Alert heading semantics are explicit, independent of description, and never h1',()=>{
  const view=render(<Alert titleText="Before continuing" headingLevel={3} descriptionText="Check your answers"/>);
  expect(screen.getByRole('heading',{level:3})).toHaveTextContent('Information: Before continuing');
  view.rerender(<Alert titleText="Before continuing" headingLevel={3}/>);expect(screen.getByRole('heading',{level:3})).toBeVisible();
  for(const level of [2,3,4,5,6] as const){view.rerender(<Alert titleText="Section" headingLevel={level}/>);expect(screen.getByRole('heading',{level})).toHaveTextContent('Section');}
});
it('Alert urgency is independent of state and never moves focus on updates',()=>{
  const view=render(<><button>Origin</button><Alert titleText="Saved" state="error"/></>);screen.getByRole('button').focus();
  view.rerender(<><button>Origin</button><Alert titleText="New outcome" state="error" announcement="polite"/></>);
  expect(screen.getByRole('status')).toHaveTextContent('New outcome');expect(screen.queryByRole('alert')).toBeNull();expect(screen.getByRole('button')).toHaveFocus();
  view.rerender(<><button>Origin</button><Alert titleText="At risk" state="success" announcement="assertive"/></>);
  expect(screen.getByRole('alert')).toHaveTextContent('Success: At risk');expect(screen.queryByRole('status')).toBeNull();expect(screen.getByRole('button')).toHaveFocus();
  expect(view.container.querySelector('[aria-live],[aria-atomic],[tabindex]')).toBeNull();
});
it('Alert escapes content, omits blank descriptions, and supports complete localised prefixes',()=>{
  const view=render(<Alert titleText="<script>text</script>" descriptionText=" " stateLabels={{success:'Réussite :',info:'Information :',warning:'Attention :',error:'Erreur :'}}/>);
  expect(view.container.textContent).toBe('Information : <script>text</script>');expect(view.container.querySelector('script')).toBeNull();expect(view.container.querySelectorAll('p')).toHaveLength(1);
  view.rerender(<Alert titleText="Title" descriptionText="<b>Detail</b>"/>);expect(view.container.querySelectorAll('p')).toHaveLength(2);expect(view.container.querySelector('b')).toBeNull();
});
it('Badge is an ordinary span, defaults to neutral and exposes only the same visible label for every tone',()=>{
  const ref=createRef<HTMLSpanElement>();const view=render(<Badge ref={ref} label="Completed"/>);
  expect(ref.current!.tagName).toBe('SPAN');expect(ref.current).toHaveAttribute('data-tone','neutral');
  for(const tone of tones){view.rerender(<Badge ref={ref} label="Completed" tone={tone}/>);expect(ref.current!.textContent).toBe('Completed');expect(ref.current!.querySelector('*')).toBeNull();expect(ref.current).not.toHaveAttribute('role');expect(ref.current).not.toHaveAttribute('tabindex');expect(ref.current).not.toHaveAttribute('aria-label');}
});
it('Badge escapes the complete label and accepts layout/language/data metadata without adding semantics',()=>{
  render(<Badge label="<img> Awaiting review" lang="en" dir="rtl" data-testid="badge" className="application-status"/>);
  const badge=screen.getByTestId('badge');expect(badge).toHaveTextContent('<img> Awaiting review');expect(badge).toHaveAttribute('lang','en');expect(badge).toHaveAttribute('dir','rtl');expect(badge).toHaveClass('application-status');expect(badge.querySelector('img')).toBeNull();
});
it('both components reject rich/empty text, unsupported enums, interactions, widget/live overrides and arbitrary slots',()=>{
  const badAlert=(props:any)=>()=>renderToString(<Alert titleText="Title" {...props}/>);
  const badBadge=(props:any)=>()=>renderToString(<Badge label="Status" {...props}/>);
  for(const props of [{titleText:' '},{titleText:<b>Rich</b>},{descriptionText:5},{state:'neutral'},{headingLevel:1},{headingLevel:'3'},{announcement:'urgent'},{stateLabels:{info:'Info'}}])expect(badAlert(props)).toThrow(/OwlA11y/);
  for(const props of [{label:''},{label:' '},{label:<b>Rich</b>},{tone:'other'}])expect(badBadge(props)).toThrow(/OwlA11y/);
  for(const props of [{children:'Extra'},{role:'status'},{tabIndex:-1},{onClick:()=>{}},{onMouseEnter:()=>{}},{'aria-live':'polite'},{'aria-label':'Hidden'},{'aria-hidden':true},{contentEditable:true},{dangerouslySetInnerHTML:{__html:'<b>Rich</b>'}},{icon:<svg/>},{as:'button'}]){expect(badAlert(props)).toThrow(/does not support/);expect(badBadge(props)).toThrow(/does not support/);}
});
it('all visual states server-render and hydrate with stable refs/content and no passive live roles',async()=>{
  const ref=createRef<HTMLDivElement>();const app=<StrictMode><div>{states.map(state=><Alert key={state} state={state} titleText="Outcome" descriptionText="Detail" ref={state==='info'?ref:undefined}/>)}{tones.map(tone=><Badge key={tone} tone={tone} label="Status"/>)}</div></StrictMode>;
  const host=document.createElement('div');document.body.append(host);host.innerHTML=renderToString(app);const html=host.innerHTML;const errors:unknown[]=[];
  let root:ReturnType<typeof hydrateRoot>;await act(async()=>{root=hydrateRoot(host,app,{onRecoverableError:error=>errors.push(error)});});
  expect(host.innerHTML).toBe(html);expect(errors).toEqual([]);expect(ref.current?.dataset.state).toBe('info');expect(host.querySelector('[role],[tabindex],[aria-live],[aria-atomic]')).toBeNull();
  await act(async()=>root!.unmount());host.remove();
});
