'use client';
import {forwardRef,useEffect,useId,useImperativeHandle,useRef,useState} from 'react';
import type {BreadcrumbProps} from '../types.js';
import {Button} from './Button.js';
import {Link} from './Link.js';
import {classes,text} from '../internal/validation.js';
import {metadataOnly,navigationAttributes,navigationHref,useNavigationMeasure} from '../internal/navigation.js';
export const Breadcrumb=forwardRef<HTMLElement,BreadcrumbProps>(function Breadcrumb({label='Breadcrumb',ancestors,currentPage,expanded,defaultExpanded,onExpandedChange,showFullPathLabel='Show full path',showCompactPathLabel='Show compact path',className,id,...props},ref){
  metadataOnly(props,'Breadcrumb');text(label,'Breadcrumb label');text(showFullPathLabel,'showFullPathLabel');text(showCompactPathLabel,'showCompactPathLabel');
  if(!Array.isArray(ancestors))throw new Error('OwlA11y: Breadcrumb requires ancestors.');
  const keys=ancestors.map(item=>{text(item.id,'Breadcrumb ancestor id');text(item.label,'Breadcrumb ancestor label');navigationHref(item.href);navigationAttributes(item.linkAttributes);return item.id;});
  if(new Set(keys).size!==keys.length)throw new Error('OwlA11y: Breadcrumb ancestor IDs must be unique.');if(currentPage!==undefined)text(currentPage,'Breadcrumb currentPage');
  const controlled=expanded!==undefined;const ownership=useRef(controlled);if(controlled!==ownership.current)throw new Error('OwlA11y: Breadcrumb must not switch expansion ownership.');
  if(controlled&&(!onExpandedChange||defaultExpanded!==undefined))throw new Error('OwlA11y: controlled Breadcrumb requires onExpandedChange and forbids defaultExpanded.');
  const [own,setOwn]=useState(defaultExpanded??false);const desired=expanded??own;
  const generated=useId();const prefix=id??`owl-breadcrumb-${generated}`;text(prefix,'Breadcrumb id');if(/\s/.test(prefix))throw new Error('OwlA11y: Breadcrumb id must not contain whitespace.');
  const root=useRef<HTMLElement>(null);const viewport=useRef<HTMLDivElement>(null);const measure=useRef<HTMLDivElement>(null);const toggle=useRef<HTMLButtonElement>(null);useImperativeHandle(ref,()=>root.current!,[]);
  const [view,setView]=useState({ready:false,overflow:false,keepToggle:false});const previous=useRef(desired);
  useNavigationMeasure(root,measure,()=>{
    const node=root.current;const scroll=viewport.current;const sample=measure.current;if(!node||!scroll||!sample||!scroll.clientWidth)return;
    const inset=parseFloat(getComputedStyle(scroll).paddingInlineStart)||0;
    const width=`${Math.max(0,scroll.clientWidth-inset*2)}px`;
    if(node.style.getPropertyValue('--owl-breadcrumb-item-width')!==width)node.style.setProperty('--owl-breadcrumb-item-width',width);
    const overflow=sample.getBoundingClientRect().width>scroll.clientWidth+0.5;const keepToggle=node.ownerDocument.activeElement===toggle.current;
    setView(old=>old.ready&&old.overflow===overflow&&old.keepToggle===keepToggle?old:{ready:true,overflow,keepToggle});
  },ancestors.length>0);
  useEffect(()=>{
    if(previous.current&&!desired&&view.ready){const first=viewport.current?.querySelector('li');first?.scrollIntoView?.({block:'nearest',inline:'start',behavior:'instant'});const active=root.current?.ownerDocument.activeElement;if(active instanceof HTMLElement&&viewport.current?.contains(active))active.scrollIntoView?.({block:'nearest',inline:'nearest',behavior:'instant'});}
    previous.current=desired;
  },[desired,view.ready]);
  if(!ancestors.length)return null;
  const labels=[...ancestors.map(item=>item.label),...(currentPage?[currentPage]:[])];const layout=!view.ready||desired?'expanded':view.overflow?'scrollable':'inline';
  const separator=<span className="owla11y-breadcrumb__separator" aria-hidden="true">/</span>;
  return <nav {...props} id={prefix} ref={root} aria-label={label} className={classes('owla11y-breadcrumb',className)} data-layout={layout}>
    <div className="owla11y-nav-measure-clip" aria-hidden="true"><div ref={measure} className="owla11y-breadcrumb__measure">{labels.map((name,index)=><span className="owla11y-breadcrumb__item" key={index}>{index>0&&separator}<span className="owla11y-breadcrumb__target">{name}</span></span>)}</div></div>
    <div ref={viewport} className="owla11y-breadcrumb__viewport" id={`${prefix}-path`}>
      <ol className="owla11y-breadcrumb__list" role="list">
        {ancestors.map((item,index)=><li key={item.id} className="owla11y-breadcrumb__item">{index>0&&separator}<Link {...item.linkAttributes} href={item.href} className={classes('owla11y-breadcrumb__target',item.linkAttributes?.className)} onFocus={event=>{item.linkAttributes?.onFocus?.(event);event.currentTarget.scrollIntoView?.({block:'nearest',inline:'nearest',behavior:'instant'});}}><bdi>{item.label}</bdi></Link></li>)}
        {currentPage&&<li className="owla11y-breadcrumb__item">{separator}<span className="owla11y-breadcrumb__target" aria-current="page"><bdi>{currentPage}</bdi></span></li>}
      </ol>
    </div>
    {view.ready&&(view.overflow||view.keepToggle)&&<Button ref={toggle} type="button" variant="text" size="compact" className="owla11y-breadcrumb__toggle" aria-expanded={desired} aria-controls={`${prefix}-path`} onClick={()=>{if(!controlled)setOwn(!desired);onExpandedChange?.(!desired);}}>{desired?showCompactPathLabel:showFullPathLabel}</Button>}
  </nav>;
});
