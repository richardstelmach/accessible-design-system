import React, {createRef} from 'react';
import {describe,expect,it,vi} from 'vitest';
import {fireEvent,render,screen} from '@testing-library/react';
import {renderToString} from 'react-dom/server';
import {SideMenu,ResponsiveSideMenu} from '../src/index.js';
import type {SideMenuProps} from '../src/index.js';
const items:SideMenuProps['items']=[{id:'start',label:'Start here',items:[{id:'overview',label:'Overview',href:'/'}]},
 {id:'components',label:'Components',expandable:true,items:[{id:'button',label:'Button',href:'/button'},{id:'accordion',label:'Accordion',href:'/accordion'}]},
 {id:'foundations',label:'Foundations',expandable:true,items:[{id:'colour',label:'Colour',href:'/colour'}]}];
const base={'aria-label':'Primary',headingLevel:3 as const,items,currentId:'button'};
describe('SideMenu',()=>{
 it('supports static captions, expandable groups, a named nav and one current link with actual Accordion groups',()=>{
  const ref=createRef<HTMLElement>();render(<SideMenu {...base} ref={ref}/>);
  expect(ref.current).toBe(screen.getByRole('navigation',{name:'Primary'}));
  expect(screen.getByText('Start here')).toBeVisible();expect(screen.queryByRole('button',{name:'Start here'})).toBeNull();
  expect(screen.getByRole('link',{name:'Overview'})).toBeVisible();expect(screen.getAllByRole('heading',{level:3})).toHaveLength(3);
  expect(ref.current!.querySelectorAll('.owla11y-accordion')).toHaveLength(2);
  expect(screen.getByRole('button',{name:'Components'})).toHaveClass('owla11y-accordion__trigger');
  expect(screen.getByRole('link',{name:'Button'})).toHaveAttribute('aria-current','page');expect(ref.current!.querySelectorAll('[aria-current]')).toHaveLength(1);
  expect(screen.getByRole('button',{name:'Components'})).toHaveAttribute('aria-expanded','true');expect(screen.getByRole('button',{name:'Foundations'})).toHaveAttribute('aria-expanded','false');
 });
 it('expands independently and recovers focus before a group hides',()=>{
  render(<SideMenu {...base}/>);const foundations=screen.getByRole('button',{name:'Foundations'});fireEvent.click(foundations);
  screen.getByRole('link',{name:'Button'}).focus();const components=screen.getByRole('button',{name:'Components'});fireEvent.click(components);
  expect(components).toHaveFocus();expect(screen.queryByRole('link',{name:'Button'})).toBeNull();expect(foundations).toHaveAttribute('aria-expanded','true');
 });
 it('reveals a new current branch and preserves unrelated expansion',()=>{
  const {rerender}=render(<SideMenu {...base}/>);rerender(<SideMenu {...base} currentId="colour"/>);
  expect(screen.getByRole('link',{name:'Colour'})).toHaveAttribute('aria-current','page');expect(screen.getByRole('button',{name:'Components'})).toHaveAttribute('aria-expanded','true');
 });
 it('allows controlled decline and recovers focused content on external collapse',()=>{
  const change=vi.fn();const {rerender}=render(<SideMenu {...base} expandedIds={['components']} onExpandedChange={change}/>);
  fireEvent.click(screen.getByRole('button',{name:'Foundations'}));expect(change).toHaveBeenLastCalledWith(['components','foundations']);expect(screen.queryByRole('link',{name:'Colour'})).toBeNull();
  screen.getByRole('link',{name:'Button'}).focus();rerender(<SideMenu {...base} expandedIds={[]} onExpandedChange={change}/>);
  expect(screen.getByRole('button',{name:'Components'})).toHaveFocus();expect(screen.queryByRole('link',{name:'Button'})).toBeNull();
 });
 it('permits explicit heading semantics without making static labels interactive',()=>{
  render(<SideMenu {...base} headingLevel={3}/>);expect(screen.getAllByRole('heading',{level:3})).toHaveLength(3);expect(screen.queryByRole('button',{name:'Start here'})).toBeNull();
 });
 it('has complete SSR baselines for navigation and responsive shell, with unique relationships after enhancement',()=>{
  for(const html of [renderToString(<SideMenu {...base}/>),renderToString(<ResponsiveSideMenu label="Primary" {...base} open={true} onOpenChange={()=>{}}/>)]){
   expect(html).toContain('href="/colour"');expect(html).not.toContain('<button');expect(html).not.toContain('<dialog');expect(html).not.toContain('hidden=');
  }
  const {container}=render(<><SideMenu {...base}/><SideMenu {...base}/></>);const ids=[...container.querySelectorAll('[id]')].map(n=>n.id);expect(new Set(ids).size).toBe(ids.length);
  for(const button of screen.getAllByRole('button'))expect(container.querySelector(`[id="${button.getAttribute('aria-controls')}"]`)).not.toBeNull();
 });
 it('rejects unsafe, ambiguous and unsupported structures and ownership',()=>{
  for(const bad of [{...base,currentId:'missing'},{...base,defaultExpandedIds:['start']},{...base,items:[]},
   {...base,items:[{id:'same',label:'One',href:'/one'},{id:'same',label:'Two',href:'/two'}]},
   {...base,items:[{id:'bad',label:'Bad',href:'javascript:alert(1)'}]},
   {...base,items:[{id:'bad',label:'Bad',href:'/bad',items:[{id:'one',label:'One',href:'/one'}]}]},
   {...base,headingLevel:'none'},{...base,expandedIds:[]},{...base,role:'menu'},{...base,headingLevel:1}
  ])expect(()=>renderToString(<SideMenu {...bad as SideMenuProps}/>)).toThrow(/OwlA11y/);
 });
});

it('keeps static-only navigation heading-free and rejects invalid in-flow heading composition',()=>{
 render(<SideMenu aria-label="Section" items={[{id:'static',label:'Static',items:[{id:'a',label:'A',href:'/a'}]}]}/>);
 expect(screen.queryByRole('heading')).toBeNull();
 expect(()=>renderToString(<ResponsiveSideMenu label="Primary" {...base} open={false} onOpenChange={()=>{}} mobilePresentation="inline"/>)).toThrow(/inlineHeadingLevel/);
 expect(()=>renderToString(<ResponsiveSideMenu label="Primary" {...base} open={false} onOpenChange={()=>{}} mobilePresentation="inline" inlineHeadingLevel={3}/>)).toThrow(/below/);
});

it.each(['core','responsive'] as const)('prunes removed uncontrolled groups in the %s menu without losing retained choices',kind=>{
 const menu=(props:Partial<SideMenuProps>={})=>kind==='core'
  ?<SideMenu {...base} {...props}/>
  :<ResponsiveSideMenu label="Drawer title" open={false} onOpenChange={()=>{}} {...base} {...props}/>;
 const {rerender}=render(menu());
 fireEvent.click(screen.getByRole('button',{name:'Foundations'}));
 rerender(menu({currentId:'overview',items:items.filter(item=>item.id!=='components')}));
 rerender(menu({currentId:'overview'}));
 expect(screen.getByRole('button',{name:'Components'})).toHaveAttribute('aria-expanded','false');
 expect(screen.getByRole('button',{name:'Foundations'})).toHaveAttribute('aria-expanded','true');
});

it('allows an unnamed navigation landmark and distinct optional aria-labels, independent of the drawer title',()=>{
 const links=[{id:'home',label:'Home',href:'/'}];
 const {rerender}=render(<SideMenu items={links}/>);
 expect(screen.getByRole('navigation')).not.toHaveAttribute('aria-label');
 rerender(<><SideMenu aria-label="Main navigation" items={links}/><SideMenu aria-label="Account navigation" items={links}/></>);
 expect(screen.getByRole('navigation',{name:'Main navigation'})).toBeVisible();
 expect(screen.getByRole('navigation',{name:'Account navigation'})).toBeVisible();
 rerender(<ResponsiveSideMenu label="Drawer title" open={false} onOpenChange={()=>{}} items={links}/>);
 expect(screen.getByRole('navigation')).not.toHaveAttribute('aria-label');
 rerender(<ResponsiveSideMenu label="Drawer title" aria-label="Main navigation" open={false} onOpenChange={()=>{}} items={links}/>);
 expect(screen.getByRole('navigation',{name:'Main navigation'})).toBeVisible();
 expect(()=>renderToString(<SideMenu aria-label=" " items={links}/>)).toThrow(/aria-label/);
});
