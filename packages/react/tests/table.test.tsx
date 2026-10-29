import React, {createRef} from 'react';
import {render, screen, fireEvent, act, waitFor} from '@testing-library/react';
import {renderToString} from 'react-dom/server';
import {describe,it,expect,vi,afterEach} from 'vitest';
import {Table} from '../src/index.js';
const cells=<><thead><tr><th scope="col">Name</th><th scope="col">Status</th></tr></thead><tbody><tr><th scope="row">Button</th><td><a href="/button">Read guide</a></td></tr></tbody></>;
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});
describe('Table',()=>{
 it('keeps native caption, scopes, cell links and a table ref',()=>{
  const ref=createRef<HTMLTableElement>();render(<Table ref={ref} id="catalogue" caption="Component status" aria-describedby="help">{cells}</Table>);
  expect(ref.current).toBe(screen.getByRole('table',{name:'Component status'}));
  expect(ref.current!.getAttribute('aria-describedby')!.split(' ')).toContain('help');expect(screen.getByRole('rowheader')).toHaveAttribute('scope','row');
  expect(screen.getAllByRole('columnheader')).toHaveLength(2);expect(screen.getByRole('link')).toHaveAttribute('href','/button');
 });
 it('SSR exposes a named keyboard fallback and retains a hidden native caption',()=>{
  const html=renderToString(<Table caption="Component status" captionVisibility="visually-hidden">{cells}</Table>);
  expect(html).toContain('tabindex="0"');expect(html).not.toContain('role="group"');expect(html).toContain('aria-describedby=');expect(html).toContain('Component status, horizontally scrollable');
  expect(html).toContain('owla11y-table__caption--hidden');expect(html).not.toContain('role="grid"');expect(html).not.toContain('role="region"');
 });
 it('measures overflow and retains focused scroll access until blur',async()=>{
  let width=200;let resize!:()=>void;
  vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockReturnValue(100);vi.spyOn(HTMLElement.prototype,'scrollWidth','get').mockImplementation(()=>width);
  vi.stubGlobal('ResizeObserver',class{constructor(callback:()=>void){resize=callback;}observe(){}disconnect(){}});
  render(<Table caption="Components" scrollLabel={c=>`Défilement : ${c}`}>{cells}</Table>);
  const region=screen.getByRole('table',{name:'Components'});act(()=>region.focus());width=50;act(()=>resize());
  expect(region).toHaveAttribute('tabindex','0');fireEvent.blur(region);await waitFor(()=>expect(region).not.toHaveAttribute('tabindex'));expect(region).not.toHaveAttribute('role');
  width=250;act(()=>resize());expect(region).toHaveAttribute('tabindex','0');expect(region).toHaveAccessibleDescription('Défilement : Components');
 });
 it('retains a conservative keyboard fallback without ResizeObserver',()=>{
  vi.stubGlobal('ResizeObserver',undefined);render(<Table caption="Components">{cells}</Table>);expect(screen.getByRole('table')).toHaveAttribute('tabindex','0');
 });
 it('multiple Tables use native focus targets without groups or landmarks',()=>{
  vi.stubGlobal('ResizeObserver',undefined);
  render(<><Table caption="First">{cells}</Table><Table caption="Second">{cells}</Table></>);
  expect(screen.queryAllByRole('region')).toHaveLength(0);expect(screen.queryAllByRole('group')).toHaveLength(0);
  expect(screen.getAllByRole('table')).toHaveLength(2);
  expect(screen.getByRole('table',{name:'First'})).toHaveAttribute('tabindex','0');
  expect(screen.getByRole('table',{name:'Second'})).toHaveAttribute('tabindex','0');
 });
 it('a fitting table cannot acquire a synthetic scroll group or tab stop through programmatic focus',()=>{
  vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockReturnValue(300);vi.spyOn(HTMLElement.prototype,'scrollWidth','get').mockReturnValue(200);
  vi.stubGlobal('ResizeObserver',class{observe(){}disconnect(){}});
  render(<><p id="help">Author description</p><Table caption="Components" aria-describedby="help">{cells}</Table></>);
  const table=screen.getByRole('table',{name:'Components'});const wrapper=table.parentElement!;
  expect(table).not.toHaveAttribute('tabindex');expect(table).toHaveAccessibleDescription('Author description');
  fireEvent.focus(table);expect(table).not.toHaveAttribute('tabindex');expect(table).toHaveAttribute('aria-describedby','help');
  expect(wrapper).not.toHaveAttribute('role');expect(wrapper).not.toHaveAttribute('tabindex');expect(wrapper).not.toHaveAttribute('aria-label');
 });
 it('rejects conflicting semantics, duplicate captions, invalid options and missing body',()=>{
  vi.spyOn(console,'error').mockImplementation(()=>{});
  expect(()=>render(<Table caption=" ">{cells}</Table>)).toThrow(/caption/);
  expect(()=>render(React.createElement(Table,{caption:'Test',role:'grid',children:cells} as any))).toThrow(/role/);
  expect(()=>render(<Table caption="Test"><caption>Duplicate</caption><tbody/></Table>)).toThrow(/caption/);
  expect(()=>render(React.createElement(Table,{caption:'Test',captionVisibility:'removed',children:cells} as any))).toThrow(/captionVisibility/);
  expect(()=>render(<Table caption="Test"><thead/></Table>)).toThrow(/tbody/);
 });
});
