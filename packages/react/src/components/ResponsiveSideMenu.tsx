'use client';
import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ResponsiveSideMenuProps } from '../types.js';
import { Accordion } from './Accordion.js';
import { Button } from './Button.js';
import { Dialog } from './Dialog.js';
import { SideMenu } from './SideMenu.js';
import { oneOf, text } from '../internal/validation.js';

export const ResponsiveSideMenu = forwardRef<HTMLElement, ResponsiveSideMenuProps>(function ResponsiveSideMenu({
  label, open, onOpenChange, mobilePresentation='drawer', inlineHeadingLevel, toggleLabel='Menu', closeLabel='Close navigation', returnFocusRef,
  expandedIds, defaultExpandedIds, onExpandedChange, drawerTriggerContainer, id, ...navigation
}, ref) {
  oneOf(mobilePresentation,['drawer','inline'],'ResponsiveSideMenu mobilePresentation');
  text(label,'ResponsiveSideMenu label');
  text(toggleLabel,'ResponsiveSideMenu toggleLabel');text(closeLabel,'ResponsiveSideMenu closeLabel');
  if(typeof open!=='boolean'||typeof onOpenChange!=='function')throw new Error('OwlA11y: ResponsiveSideMenu requires controlled open and onOpenChange.');
  const previousPresentation=useRef(mobilePresentation);
  if(previousPresentation.current!==mobilePresentation&&open)throw new Error('OwlA11y: close ResponsiveSideMenu before changing mobilePresentation.');
  previousPresentation.current=mobilePresentation;
  if(!Array.isArray(navigation.items)||!navigation.items.length)throw new Error('OwlA11y: ResponsiveSideMenu requires items.');
  if(mobilePresentation==='inline'&&(!inlineHeadingLevel||![2,3,4,5].includes(inlineHeadingLevel)))throw new Error('OwlA11y: in-flow navigation requires explicit inlineHeadingLevel 2 through 5.');
  if(mobilePresentation==='inline'&&navigation.headingLevel&&navigation.headingLevel!=='none'&&navigation.headingLevel<=inlineHeadingLevel!)throw new Error('OwlA11y: menu group headings must be below the outer Accordion heading.');
  const controlled=expandedIds!==undefined, ownership=useRef(controlled);
  if(ownership.current!==controlled)throw new Error('OwlA11y: ResponsiveSideMenu cannot switch expansion ownership.');
  if(controlled && (defaultExpandedIds!==undefined||!onExpandedChange))throw new Error('OwlA11y: controlled expansion requires onExpandedChange and forbids defaultExpandedIds.');
  const groupKeys=navigation.items.filter(item=>item.expandable).map(item=>item.id);
  for(const ids of [expandedIds,defaultExpandedIds])if(ids!==undefined&&(!Array.isArray(ids)||new Set(ids).size!==ids.length||ids.some(key=>!groupKeys.includes(key))))throw new Error('OwlA11y: ResponsiveSideMenu expanded IDs must identify unique expandable groups.');
  const currentGroup=navigation.items.find(item=>item.expandable&&item.items?.some((link: import('../types.js').SideMenuLink)=>link.id===navigation.currentId))?.id;
  const [own,setOwn]=useState<readonly string[]>(()=>[...new Set([...(defaultExpandedIds??[]),...(currentGroup?[currentGroup]:[])])]);
  useEffect(()=>{
    if(!controlled&&own.some(key=>!groupKeys.includes(key)))setOwn(ids=>ids.filter(key=>groupKeys.includes(key)));
  });
  const generated=useId(), prefix=id??`owl-responsive-menu-${generated}`;
  const root=useRef<HTMLDivElement>(null), nav=useRef<HTMLElement|null>(null), trigger=useRef<HTMLButtonElement>(null);
  const [compact,setCompact]=useState(false);
  const latest=useRef({open,mobilePresentation});latest.current={open,mobilePresentation};
  useEffect(()=>{
    const node=root.current!,document=node.ownerDocument,window=document.defaultView!;
    if(drawerTriggerContainer && (!drawerTriggerContainer.isConnected || drawerTriggerContainer.ownerDocument!==document))throw new Error('OwlA11y: drawerTriggerContainer must be a mounted element in the navigation document.');
    if(!window.ResizeObserver || typeof window.HTMLDialogElement?.prototype.showModal!=='function')return;
    const read=()=>{
      const next=window.getComputedStyle(node).getPropertyValue('--owl-side-menu-compact').trim()==='1';
      const active=document.activeElement;
      setCompact(old=>{
        if(old===next)return old;
        // A breakpoint must not dismiss a modal, remove its trigger, or move a focused link.
        const activeTrigger=latest.current.mobilePresentation==='inline'?document.getElementById(`${prefix}-inline-trigger-navigation`):trigger.current;
        if(old&&((latest.current.mobilePresentation==='drawer'&&latest.current.open)||active===activeTrigger))return old;
        if(nav.current?.contains(active))return old;
        return next;
      });
    };
    const observer=new window.ResizeObserver(read);observer.observe(node);
    const focus=()=>queueMicrotask(read);
    window.addEventListener('resize',read);document.addEventListener('focusin',focus);document.addEventListener('focusout',focus);read();
    return()=>{observer.disconnect();window.removeEventListener('resize',read);document.removeEventListener('focusin',focus);document.removeEventListener('focusout',focus);};
  },[open,mobilePresentation,prefix,drawerTriggerContainer]);
  const menu=<SideMenu {...navigation} id={prefix} expandedIds={(expandedIds??own).filter(key=>groupKeys.includes(key))}
    onExpandedChange={ids=>{if(!controlled)setOwn(ids);onExpandedChange?.(ids);}}
    ref={node=>{nav.current=node;if(typeof ref==='function')ref(node);else if(ref)ref.current=node;}}/>;
  const modal=compact&&mobilePresentation==='drawer';
  const drawerTrigger=modal?<Button className="owla11y-side-menu-drawer-trigger" ref={trigger} dir={navigation.dir} lang={navigation.lang} aria-expanded={open} aria-controls={`${prefix}-drawer`}
    aria-haspopup="dialog" onClick={()=>onOpenChange(!open)}>{toggleLabel}</Button>:null;
  return <div ref={root} className="owla11y-side-menu-layout" data-layout={compact?'compact':'persistent'} data-trigger-placement={modal&&drawerTriggerContainer?'external':'local'} dir={navigation.dir} lang={navigation.lang}>
    {drawerTriggerContainer&&drawerTrigger?createPortal(drawerTrigger,drawerTriggerContainer):drawerTrigger}
    {modal?<Dialog id={`${prefix}-drawer`} className="owla11y-side-menu-drawer" open={open} onOpenChange={next=>onOpenChange(next)}
      title={label} closeLabel={closeLabel} size="small" returnFocusRef={returnFocusRef}>{menu}</Dialog>
      :compact?<Accordion id={`${prefix}-inline`} className="owla11y-side-menu-inline" headingLevel={inlineHeadingLevel!} titleStyle="h6"
        items={[{id:'navigation',title:toggleLabel,content:menu}]} expandedIds={open?['navigation']:[]}
        onExpandedChange={ids=>onOpenChange(ids.includes('navigation'))}/>:menu}
  </div>;
});
