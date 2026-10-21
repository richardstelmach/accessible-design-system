'use client';
import {forwardRef,useEffect,useId,useImperativeHandle,useRef,useState} from 'react';
import type {MouseEvent} from 'react';
import type {PaginationProps,PaginationLabels} from '../types.js';
import {Button} from './Button.js';
import {Link} from './Link.js';
import {TextInput} from './TextInput.js';
import {classes,oneOf,text} from '../internal/validation.js';
import {metadataOnly,navigationAttributes,navigationHref,paginationWindow,useNavigationMeasure} from '../internal/navigation.js';
const number=(page:number)=>new Intl.NumberFormat('en-GB').format(page);
const defaults:PaginationLabels={previous:'Previous',next:'Next',first:'First',last:'Last',omissions:'Pages omitted',goToPage:'Go to page',go:'Go',formatNumber:number,formatPageLabel:page=>`Page ${number(page)}`,formatSummary:(page,total)=>`Page ${number(page)} of ${number(total)}`,formatHelp:total=>`Enter a page from 1 to ${number(total)}.`,formatError:total=>`Error: Enter a page number from 1 to ${number(total)}.`,formatAlreadyOnPage:page=>`Already on page ${number(page)}`};
export const Pagination=forwardRef<HTMLElement,PaginationProps>(function Pagination({label='Pagination',currentPage,totalPages,pageHref,presentation='auto',labels:customLabels,pageJump=false,jumpForm,onNavigate,linkAttributes,className,id,...props},ref){
  metadataOnly(props,'Pagination');text(label,'Pagination label');oneOf(presentation,['auto','numbered','compact'],'Pagination presentation');
  if(!Number.isSafeInteger(totalPages)||totalPages<0||!Number.isSafeInteger(currentPage)||currentPage<1||(totalPages===0?currentPage!==1:currentPage>totalPages))throw new Error('OwlA11y: Pagination requires exact safe-integer totals and an in-range currentPage.');
  if(typeof pageHref!=='function')throw new Error('OwlA11y: Pagination requires pageHref.');
  const labels={...defaults,...customLabels};
  for(const [key,value]of Object.entries(labels))if(typeof defaults[key as keyof PaginationLabels]==='string')text(value,`Pagination labels.${key}`);else if(typeof value!=='function')throw new Error(`OwlA11y: Pagination labels.${key} must be a formatter.`);
  const formatted=(value:string,field:string)=>{text(value,`Pagination ${field} result`);return value;};
  const n=(page:number)=>formatted(labels.formatNumber(page),'formatNumber');
  const pageLabel=(page:number)=>{const value=formatted(labels.formatPageLabel(page),'formatPageLabel');if(!value.includes(n(page)))throw new Error('OwlA11y: formatPageLabel must include the complete visible page number.');return value;};
  if(pageJump){if(!jumpForm)throw new Error('OwlA11y: pageJump requires an explicit native GET jumpForm.');navigationHref(jumpForm.action);text(jumpForm.pageName,'jumpForm pageName');const names=new Set([jumpForm.pageName]);for(const item of jumpForm.hiddenFields??[]){text(item.name,'jumpForm hidden field name');if(typeof item.value!=='string'||names.has(item.name))throw new Error('OwlA11y: jumpForm requires distinct field names and string values.');names.add(item.name);}}
  else if(jumpForm!==undefined)throw new Error('OwlA11y: jumpForm requires pageJump.');
  const generated=useId();const prefix=id??`owl-pagination-${generated}`;text(prefix,'Pagination id');if(/\s/.test(prefix))throw new Error('OwlA11y: Pagination id must not contain whitespace.');
  const root=useRef<HTMLElement>(null);const measure=useRef<HTMLDivElement>(null);const numbered=useRef<HTMLDivElement>(null);const input=useRef<HTMLInputElement>(null);useImperativeHandle(ref,()=>root.current!,[]);
  const [enhanced,setEnhanced]=useState(false);
  useEffect(()=>{setEnhanced(true);},[]);
  const [view,setView]=useState<'numbered'|'compact'>('numbered');
  const [raw,setRaw]=useState('');const [error,setError]=useState<string>();const [errorRequest,setErrorRequest]=useState(0);
  const [notice,setNotice]=useState<{message:string}>();const [speech,setSpeech]=useState('');
  useEffect(()=>{if(errorRequest)input.current?.focus();},[errorRequest]);
  useEffect(()=>{setSpeech('');if(!notice)return;const timer=setTimeout(()=>setSpeech(notice.message),50);return()=>clearTimeout(timer);},[notice]);
  useNavigationMeasure(root,measure,()=>{
    const node=root.current;const sample=measure.current;if(!node||!sample||!node.clientWidth)return;
    const next=presentation==='compact'||presentation==='auto'&&sample.getBoundingClientRect().width>node.clientWidth+0.5?'compact':'numbered';
    if(next==='compact'&&numbered.current?.contains(node.ownerDocument.activeElement))return;
    setView(old=>old===next?old:next);
  },totalPages>1);
  if(totalPages<=1)return null;
  const sequence=paginationWindow(currentPage,totalPages);
  const href=(page:number)=>navigationHref(pageHref(page));
  const previous=currentPage>1;const next=currentPage<totalPages;
  const navigate=(event:MouseEvent<HTMLAnchorElement>,page:number)=>{
    if(!onNavigate||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey||event.currentTarget.hasAttribute('download')||event.currentTarget.target&&event.currentTarget.target!=='_self')return;
    event.preventDefault();onNavigate(page,{href:href(page),source:'link'});
  };
  const link=(page:number,content:string,kind?:'prev'|'next'|'endpoint')=>{
    const attributes=navigationAttributes(linkAttributes?.(page));
    return <Link {...attributes} href={href(page)} className={classes('owla11y-pagination__target',attributes?.className)} rel={kind==='endpoint'?attributes?.rel:kind??attributes?.rel}
      aria-label={kind?undefined:pageLabel(page)} aria-current={!kind&&page===currentPage?'page':undefined}
      onClick={event=>{attributes?.onClick?.(event);navigate(event,page);}}><bdi>{content}</bdi></Link>;
  };
  const summary=formatted(labels.formatSummary(currentPage,totalPages),'formatSummary');
  return <nav {...props} id={prefix} ref={root} aria-label={label} className={classes('owla11y-pagination',className)} data-layout={view}>
    <div className="owla11y-nav-measure-clip" aria-hidden="true"><div ref={measure} className="owla11y-pagination__measure">
      {previous&&<span className="owla11y-pagination__target">{labels.previous}</span>}
      <div className="owla11y-pagination__measure-pages">{sequence.map(page=>typeof page==='number'?<span key={page} className="owla11y-pagination__target" data-current={page===currentPage||undefined}>{n(page)}</span>:<span key={page} className="owla11y-pagination__ellipsis">…</span>)}</div>
      {next&&<span className="owla11y-pagination__target">{labels.next}</span>}
    </div></div>
    <div ref={numbered} className="owla11y-pagination__numbered" hidden={view!=='numbered'}>
      {previous&&link(currentPage-1,labels.previous,'prev')}
      <ul className="owla11y-pagination__pages" role="list">{sequence.map(page=><li key={page}>{typeof page==='number'?link(page,n(page)):<span className="owla11y-pagination__ellipsis"><span aria-hidden="true">…</span><span className="owla11y-feedback-sr">{labels.omissions}</span></span>}</li>)}</ul>
      {next&&link(currentPage+1,labels.next,'next')}
    </div>
    <div className="owla11y-pagination__compact" hidden={view!=='compact'}>
      <span className="owla11y-pagination__summary" aria-current="page"><bdi>{summary}</bdi></span>
      <div className="owla11y-pagination__directions">{previous&&link(currentPage-1,labels.previous,'prev')}{next&&link(currentPage+1,labels.next,'next')}</div>
      <div className="owla11y-pagination__directions">{previous&&link(1,labels.first,'endpoint')}{next&&link(totalPages,labels.last,'endpoint')}</div>
    </div>
    {pageJump&&jumpForm&&<form className="owla11y-pagination__jump" method="get" action={jumpForm.action} noValidate={enhanced} onSubmit={event=>{
      event.preventDefault();setNotice(undefined);const value=raw.trim();const page=Number(value);
      if(!/^[0-9]+$/.test(value)||!Number.isSafeInteger(page)||page<1||page>totalPages){setError(formatted(labels.formatError(totalPages),'formatError'));setErrorRequest(n=>n+1);return;}
      setError(undefined);
      if(page===currentPage){setNotice({message:formatted(labels.formatAlreadyOnPage(page),'formatAlreadyOnPage')});return;}
      const destination=href(page);if(onNavigate)onNavigate(page,{href:destination,source:'jump'});else root.current!.ownerDocument.defaultView!.location.assign(destination);
    }}>
      {(jumpForm.hiddenFields??[]).map(item=><input type="hidden" key={item.name} name={item.name} value={item.value}/>)}
      <TextInput ref={input} id={`${prefix}-jump`} name={jumpForm.pageName} label={labels.goToPage} helperText={formatted(labels.formatHelp(totalPages),'formatHelp')} error={error?{message:error}:undefined}
        type="text" inputMode="numeric" pattern="[0-9]+" width="20ch" value={raw} onChange={event=>{setRaw(event.currentTarget.value);setNotice(undefined);}}/>
      <Button type="submit" size="compact">{labels.go}</Button>
    </form>}
    {pageJump&&<span className="owla11y-feedback-sr" role="status">{speech}</span>}
  </nav>;
});
