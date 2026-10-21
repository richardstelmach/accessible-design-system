'use client';
import {Children,Fragment,forwardRef,isValidElement,useEffect,useImperativeHandle,useRef,useState} from 'react';
import type {ReactNode} from 'react';
import type {CardProps} from '../types.js';
import {Badge} from './Badge.js';
import {Link} from './Link.js';
import {classes,oneOf,text} from '../internal/validation.js';
import {metadataOnly,navigationAttributes,navigationHref} from '../internal/navigation.js';
function present(value:ReactNode):boolean{return Children.toArray(value).some(node=>typeof node==='string'?Boolean(node.trim()):isValidElement<{children?:ReactNode}>(node)&&node.type===Fragment?present(node.props.children):true);}
const interactive='a,button,input,select,textarea,label,summary,[contenteditable]:not([contenteditable="false"]),audio[controls],video[controls],[role],[tabindex],[data-owla11y-card-ignore]';
export const Card=forwardRef<HTMLDivElement,CardProps>(function Card({layout='vertical',title,headingLevel='none',titleStyle='auto',titleHref,titleLinkAttributes,wholeCardClickable=false,image,children,actions,imageBadge,className,...props},ref){
  metadataOnly(props,'Card');oneOf(layout,['vertical','horizontal'],'Card layout');oneOf(titleStyle,['auto','compact'],'Card titleStyle');
  if(!['none',2,3,4,5,6].includes(headingLevel))throw new Error('OwlA11y: Card headingLevel must be none or 2 through 6.');
  if(title!==undefined)text(title,'Card title');
  if(titleHref!==undefined){navigationHref(titleHref);if(!title)throw new Error('OwlA11y: Card titleHref requires title.');}
  if(titleLinkAttributes&&!titleHref)throw new Error('OwlA11y: Card titleLinkAttributes requires titleHref.');navigationAttributes(titleLinkAttributes);
  if(wholeCardClickable&&(!title||!titleHref))throw new Error('OwlA11y: wholeCardClickable requires a linked title.');
  if(titleStyle==='compact'&&headingLevel==='none')throw new Error('OwlA11y: compact Card titleStyle requires a semantic heading.');
  if(image){text(image.src,'Card image src');if(typeof image.alt!=='string')throw new Error('OwlA11y: Card image requires explicit alt text.');for(const n of [image.width,image.height])if(!Number.isSafeInteger(n)||n<=0)throw new Error('OwlA11y: Card image requires positive intrinsic dimensions.');oneOf(image.fit??'cover',['cover','contain'],'Card image fit');}
  if(imageBadge&&(!image||!isValidElement(imageBadge)||imageBadge.type!==Badge))throw new Error('OwlA11y: imageBadge requires an image and one OwlA11y Badge.');
  const root=useRef<HTMLDivElement>(null);const primary=useRef<HTMLAnchorElement>(null);useImperativeHandle(ref,()=>root.current!,[]);
  const [ready,setReady]=useState(false);const forwarding=useRef(false);
  const gesture=useRef<{id:number;x:number;y:number;blocked:boolean;ended:boolean}|null>(null);
  const selectionIntersects=()=>{const selection=root.current!.ownerDocument.getSelection();if(!selection||selection.isCollapsed)return false;for(let i=0;i<selection.rangeCount;i++)if(selection.getRangeAt(i).intersectsNode(root.current!))return true;return false;};
  useEffect(()=>{
    if(!wholeCardClickable)return;setReady(true);const document=root.current!.ownerDocument;
    const move=(event:PointerEvent)=>{const g=gesture.current;if(g&&event.pointerId===g.id&&Math.hypot(event.clientX-g.x,event.clientY-g.y)>8)g.blocked=true;};
    const cancel=()=>{if(gesture.current)gesture.current.blocked=true;};
    const end=(event:PointerEvent)=>{const g=gesture.current;if(g&&event.pointerId===g.id){g.ended=true;if(!event.composedPath().includes(root.current!))g.blocked=true;}};
    const selection=()=>{if(gesture.current&&selectionIntersects())gesture.current.blocked=true;};
    document.addEventListener('pointermove',move,true);document.addEventListener('pointerup',end,true);document.addEventListener('pointercancel',cancel,true);document.addEventListener('scroll',cancel,true);document.addEventListener('dragstart',cancel,true);document.addEventListener('contextmenu',cancel,true);document.addEventListener('selectionchange',selection);
    return()=>{gesture.current=null;document.removeEventListener('pointermove',move,true);document.removeEventListener('pointerup',end,true);document.removeEventListener('pointercancel',cancel,true);document.removeEventListener('scroll',cancel,true);document.removeEventListener('dragstart',cancel,true);document.removeEventListener('contextmenu',cancel,true);document.removeEventListener('selectionchange',selection);};
  },[wholeCardClickable]);
  const Heading=headingLevel==='none'?'p':`h${headingLevel}` as 'h2'|'h3'|'h4'|'h5'|'h6';
  const titleClass=titleStyle==='compact'?'h5':headingLevel==='none'?'body':`h${headingLevel}`;
  return <div {...props} ref={root} className={classes('owla11y-card',className)} data-owla11y-card="" data-clickable={ready&&wholeCardClickable||undefined}
    onPointerDownCapture={event=>{if(!ready||!wholeCardClickable)return;gesture.current=event.button===0&&event.isPrimary!==false?{id:event.pointerId,x:event.clientX,y:event.clientY,ended:false,blocked:selectionIntersects()}:null;}}
    onClick={event=>{
      if(!ready||!wholeCardClickable||forwarding.current)return;
      const g=gesture.current;gesture.current=null;
      if(!g||!g.ended||g.blocked||event.detail===0||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey||selectionIntersects())return;
      for(const node of event.nativeEvent.composedPath()){
        if(node===event.currentTarget)break;
        if(node instanceof event.currentTarget.ownerDocument.defaultView!.Element&&(node.matches(interactive)||node.hasAttribute('data-owla11y-card')||node.shadowRoot))return;
      }
      if(primary.current){forwarding.current=true;try{primary.current.click();}finally{forwarding.current=false;}}
    }}>
    <div className="owla11y-card__layout" data-layout={layout} data-media={Boolean(image)}>
      {image&&<div className="owla11y-card__media"><img src={image.src} alt={image.alt} width={image.width} height={image.height} srcSet={image.srcSet} sizes={image.sizes} loading={image.loading} decoding={image.decoding} style={{objectFit:image.fit??'cover',objectPosition:image.position??'center'}}/>{imageBadge&&<div className="owla11y-card__badge">{imageBadge}</div>}</div>}
      <div className="owla11y-card__body">
        {title&&<Heading className="owla11y-card__title" data-title-style={titleClass}>{titleHref?<Link {...titleLinkAttributes} ref={primary} href={titleHref} className={classes('owla11y-card__title-link',titleLinkAttributes?.className)}>{title}</Link>:title}</Heading>}
        {present(children)&&<div className="owla11y-card__content">{children}</div>}
        {present(actions)&&<div className="owla11y-card__actions">{actions}</div>}
      </div>
    </div>
  </div>;
});
