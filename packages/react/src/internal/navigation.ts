import {useEffect,useRef} from 'react';
import type {RefObject} from 'react';
import type {NavigationLinkAttributes} from '../types.js';
import {text} from './validation.js';
export function navigationHref(value:unknown) {
  text(value,'navigation href');
  if(/^[\s\u0000-\u0020]*(?:javascript|data|vbscript)\s*:/i.test(value.replace(/[\u0000-\u0020]/g,'')))throw new Error('OwlA11y: navigation href must be a real navigation destination.');
  return value;
}
export function navigationAttributes(attributes:NavigationLinkAttributes|undefined){
  for(const key of ['href','children','role','tabIndex','aria-label','aria-labelledby','aria-current','dangerouslySetInnerHTML'])if(attributes&&key in attributes)throw new Error(`OwlA11y: linkAttributes does not support ${key}.`);
  return attributes;
}
export function metadataOnly(props:object,component:string){
  for(const key of Object.keys(props))if(!['id','className','style','lang','dir'].includes(key)&&!key.startsWith('data-'))throw new Error(`OwlA11y: ${component} does not support ${key}.`);
}
/** Read current measurements after resize, font loading, prop changes or focus departure. */
export function useNavigationMeasure(root:RefObject<HTMLElement|null>,measure:RefObject<HTMLElement|null>,read:()=>void,enabled=true){
  const latest=useRef(read);latest.current=read;const update=useRef(()=>{});
  useEffect(()=>{
    const node=root.current;const sample=measure.current;if(!node||!sample)return;
    const document=node.ownerDocument;const window=document.defaultView!;
    if(!window.ResizeObserver)return; // Keep the complete baseline when measurement is unavailable.
    const check=()=>latest.current();update.current=check;
    const observer=new window.ResizeObserver(check);observer.observe(node);observer.observe(sample);
    const focus=()=>queueMicrotask(check);
    document.addEventListener('focusin',focus);document.addEventListener('focusout',focus);
    document.fonts?.addEventListener('loadingdone',check);window.addEventListener('resize',check);check();
    return()=>{update.current=()=>{};observer.disconnect();document.removeEventListener('focusin',focus);document.removeEventListener('focusout',focus);document.fonts?.removeEventListener('loadingdone',check);window.removeEventListener('resize',check);};
  },[enabled]);
  useEffect(()=>{update.current();});
}
export function paginationWindow(current:number,total:number):Array<number|'omission-start'|'omission-end'>{
  if(total<=7)return Array.from({length:total},(_,i)=>i+1);
  if(current<=4)return [1,2,3,4,5,'omission-end',total];
  if(current>=total-3)return [1,'omission-start',total-4,total-3,total-2,total-1,total];
  return [1,'omission-start',current-1,current,current+1,'omission-end',total];
}
