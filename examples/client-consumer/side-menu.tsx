import React, {useEffect, useRef, useState} from 'react';
import {Button, Checkbox, ResponsiveSideMenu, Select} from '@owla11y/react';
import type {SideMenuProps} from '@owla11y/react';
export function SideMenuPreview() {
  const [current,setCurrent]=useState('button'),[context,setContext]=useState('documentation');
  const [long,setLong]=useState(false),[open,setOpen]=useState(false);
  const [mobile,setMobile]=useState<'drawer'|'inline'|''>('drawer'),[failed,setFailed]=useState(false),[message,setMessage]=useState('');
  const [headerTriggerContainer,setHeaderTriggerContainer]=useState<HTMLDivElement|null>(null);
  const content=useRef<HTMLElement>(null),pendingFocus=useRef(false);
  const [routeFocus,setRouteFocus]=useState(false);
  useEffect(()=>{if(pendingFocus.current&&!open){pendingFocus.current=false;content.current?.focus();}},[current,open]);
  const names:Record<string,string>=context==='workspace'?{button:'Projects',accordion:'People','side-menu':'Reports'}:{button:'Button',accordion:'Accordion','side-menu':'Side menu'};
  const destination=(id:string,label=names[id])=>({id,label,href:`?side-menu#${id}`,linkAttributes:{onClick:(event:React.MouseEvent<HTMLAnchorElement>)=>{
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();
    if(failed){setMessage('The example destination could not be loaded. Navigation remains available.');return;}
    pendingFocus.current=true;setRouteFocus(true);setOpen(false);setMessage('');
    if(current===id&&!open){pendingFocus.current=false;content.current?.focus();}
    setCurrent(id);history.pushState(null,'',`?side-menu#${id}`);
  }}});
  const items:SideMenuProps['items']=[
    {id:'start',label:context==='workspace'?'Workspace':'Start here',items:[destination('overview','Overview'),destination('getting-started',context==='workspace'?'Activity':'Getting started')]},
    {id:'foundations',label:context==='workspace'?'Administration':'Design and build',items:[destination('colour',context==='workspace'?'Settings':'Foundations'),destination('type',context==='workspace'?'Permissions':'Accessibility')]},
    {id:'components',label:long?'Destinations and categories with very long translated navigation labels':context==='workspace'?'Work':'Components',expandable:true,items:[destination('button'),destination('accordion'),destination('side-menu',long?'SideMenuWithAnIntentionallyUnbrokenLongNavigationLabelForReflow':names['side-menu'])]},
    {id:'resources',label:'Resources',expandable:true,items:[destination('support','Support'),destination('updates','Updates')]}
  ];
  const scopeLabel=context==='workspace'?'Workspace':context==='section'?'Account settings':'Documentation';
  return <div className="owla11y-preview side-menu-review">
    <a href="#side-menu-main">Skip navigation</a>
    <header className="side-menu-review__header"><div className="side-menu-review__identity"><div ref={setHeaderTriggerContainer} className="side-menu-review__menu-slot"/><strong>{context==='workspace'?'Northstar Workspace':'Atlas Docs'}</strong></div><span>{context==='section'?'Section navigation example':'Primary navigation example'}</span></header>
    <div className="side-menu-review__controls">
      <Select label="Usage context" name="context" requirement="optional" value={context} onChange={e=>setContext(e.target.value)}><option value="">Choose context</option><option value="documentation">Documentation site — primary</option><option value="workspace">B2B application — primary</option><option value="section">Account area — section</option></Select>
      <Select label="Mobile presentation" name="mobile" requirement="optional" value={mobile} onChange={e=>{setOpen(false);setMobile(e.target.value as 'drawer'|'inline'|'');}}><option value="">Choose presentation</option><option value="drawer">Modal drawer</option><option value="inline">In-flow disclosure</option></Select>
      <Checkbox label="Long labels" name="long-labels" value="yes" checked={long} onChange={e=>setLong(e.target.checked)}/>
      <Checkbox label="Simulate failed navigation" name="failed-navigation" value="yes" checked={failed} onChange={e=>setFailed(e.target.checked)}/>
    </div>
    <div className="side-menu-preview-shell">
      <ResponsiveSideMenu id="documentation-menu" label={scopeLabel} aria-label={scopeLabel} headingLevel={3} inlineHeadingLevel={2} items={items} currentId={current}
        drawerTriggerContainer={context==='section'?null:headerTriggerContainer} toggleLabel={context==='section'?'Account navigation':'Menu'}
        open={open} onOpenChange={next=>{setRouteFocus(false);setOpen(next);}} mobilePresentation={mobile||'drawer'}
        returnFocusRef={routeFocus?content:undefined}/>
      <main id="side-menu-main" ref={content} tabIndex={-1}>
        <p>{context==='section'?'Account / Settings':context==='workspace'?'Workspace / Work':'Components'}</p>
        <h1>{names[current]??items.flatMap(item=>'items' in item?item.items??[]:[]).find(item=>item.id===current)?.label??'Overview'}</h1>
        <p>A side menu can provide the primary navigation for a documentation site or B2B application, or navigation within a substantial section.</p>
        <p>Use visible groups for destinations people need to scan frequently. Expandable groups reduce the initial list when there are many secondary destinations. The two group types can coexist.</p>
        <h2>Try the navigation</h2><p>On mobile, primary drawer navigation opens from the header. Section controls stay beside their section, and the in-flow option stays local. The desktop divider belongs to this page layout.</p><p>Start here and Design and build are static groups. Components and Resources expand independently. Resize below the large breakpoint to try the mobile drawer or choose the in-flow alternative.</p>
        <Button id="after-side-menu">Continue reading</Button>
        {message&&<p role="status">{message}</p>}
        <p>This generic review fixture illustrates the reusable design pattern. It does not implement a production site, search, permissions or account switching.</p>
      </main>
    </div>
  </div>;
}
