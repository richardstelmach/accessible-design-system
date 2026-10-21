import React,{useEffect,useRef,useState} from 'react';
import {Alert,Badge,Breadcrumb,Button,Card,Checkbox,Link,Pagination,Select,TextInput} from '@owla11y/react';
import type {PaginationProps} from '@owla11y/react';
const art='/card-placeholder.svg';
export function NavigationPreview(){
  const [width,setWidth]=useState('wide');const [long,setLong]=useState(false);const [rtl,setRtl]=useState(false);const [layout,setLayout]=useState<'vertical'|'horizontal'>('horizontal');const [fit,setFit]=useState<'cover'|'contain'>('cover');
  const [page,setPage]=useState(()=>{const n=Number(new URL(location.href).searchParams.get('page')||500);return Number.isSafeInteger(n)&&n>=1&&n<=10000?n:500;});const [presentation,setPresentation]=useState<PaginationProps['presentation']>('auto');
  const [jump,setJump]=useState(true);const [deny,setDeny]=useState(false);const [expanded,setExpanded]=useState(false);const [saved,setSaved]=useState(0);const [cardVisits,setCardVisits]=useState(0);
  const [loading,setLoading]=useState(false);const [error,setError]=useState('');const [fail,setFail]=useState(false);const request=useRef(0);const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);const heading=useRef<HTMLHeadingElement>(null);
  const pageHref=(number:number)=>`?navigation&page=${number}&filter=accessible&sort=title#results`;
  useEffect(()=>{const old=document.title;document.title=`OwlA11y examples – Page ${page}`;return()=>{document.title=old;};},[page]);
  useEffect(()=>{const pop=()=>{request.current++;clearTimeout(timer.current);setLoading(false);setError('');const n=Number(new URL(location.href).searchParams.get('page')||500);if(Number.isSafeInteger(n)&&n>=1&&n<=10000)setPage(n);};window.addEventListener('popstate',pop);return()=>{window.removeEventListener('popstate',pop);request.current++;clearTimeout(timer.current);};},[]);
  const navigate:NonNullable<PaginationProps['onNavigate']>=(next,detail)=>{const id=++request.current;clearTimeout(timer.current);setLoading(true);setError('');timer.current=setTimeout(()=>{if(id!==request.current)return;setLoading(false);if(fail){setError('The page could not be loaded. Try again.');return;}history.pushState(null,'',detail.href);setPage(next);requestAnimationFrame(()=>{heading.current?.focus();heading.current?.scrollIntoView({block:'start'});});},100);};
  const text=long?'ApplicationInformation'.repeat(8):'Accessible resources';
  return <main className="owla11y-preview" dir={rtl?'rtl':'ltr'} style={{maxWidth:'70rem',margin:'2rem auto',padding:'1rem'}}>
    <h1>OwlA11y Card, Breadcrumb and Pagination</h1><p>Reusable content and navigation components. The examples retain native links and use OwlA11y controls.</p>
    <div className="navigation-settings" style={{display:'grid',gap:'1rem'}}>
      <Select label="Example container" name="width" value={width} onChange={e=>setWidth(e.target.value||'wide')}><option value="">Choose a width</option><option value="wide">Wide</option><option value="narrow">Narrow (18rem)</option></Select>
      <Select label="Card layout" name="layout" value={layout} onChange={e=>setLayout(e.target.value==='vertical'?'vertical':'horizontal')}><option value="">Choose a layout</option><option value="vertical">Vertical</option><option value="horizontal">Horizontal</option></Select>
      <Select label="Image treatment" name="fit" value={fit} onChange={e=>setFit(e.target.value==='contain'?'contain':'cover')}><option value="">Choose image treatment</option><option value="cover">Cover</option><option value="contain">Contain</option></Select>
      <Select label="Pagination presentation" name="presentation" value={presentation} onChange={e=>setPresentation((e.target.value||'auto') as PaginationProps['presentation'])}><option value="">Choose a presentation</option><option value="auto">Automatic</option><option value="numbered">Numbered</option><option value="compact">Compact</option></Select>
      <Checkbox label="Long text" name="long" value="yes" checked={long} onChange={e=>setLong(e.target.checked)}/>
      <Checkbox label="Right to left" name="rtl" value="yes" checked={rtl} onChange={e=>setRtl(e.target.checked)}/>
      <Checkbox label="Enable page entry" name="jump" value="yes" checked={jump} onChange={e=>setJump(e.target.checked)}/>
      <Checkbox label="Decline breadcrumb expansion requests" name="deny" value="yes" checked={deny} onChange={e=>setDeny(e.target.checked)}/>
      <Checkbox label="Simulate a failed page request" name="fail" value="yes" checked={fail} onChange={e=>setFail(e.target.checked)}/>
    </div>
    <div id="navigation-examples" style={{maxWidth:width==='narrow'?'18rem':'100%',marginBlock:'2rem'}}>
      <h2>Breadcrumb</h2>
      <Breadcrumb id="resource-path" label="Resource breadcrumb" ancestors={[{id:'home',label:'Home',href:'?navigation#home'},{id:'resources',label:text,href:'?navigation#resources'},{id:'guides',label:'Design system guidance',href:'?navigation#guides'},{id:'components',label:'React components',href:'?navigation#components'}]} currentPage="Component examples" expanded={expanded} onExpandedChange={next=>{if(!deny)setExpanded(next);}}/>
      <h2>Cards</h2>
      <div style={{display:'grid',gap:'1rem'}}>
        <Card id="linked-card" title={text} headingLevel={3} layout={layout} wholeCardClickable titleHref="?navigation#card-destination" titleLinkAttributes={{onClick:e=>{e.preventDefault();setCardVisits(n=>n+1);}}} image={{src:art,alt:'',width:800,height:450,fit}} imageBadge={<Badge label="New resource" tone="info"/>} actions={<Button id="save-card" onClick={()=>setSaved(n=>n+1)}>Save resource</Button>}>
          <p id="card-copy">Read the guidance and explore practical examples. Select this text without opening the resource.</p>
          <p><Link href="?navigation#related">Related guidance</Link></p>
          <div data-owla11y-card-ignore><TextInput label="Private note" name="note" requirement="optional"/></div>
        </Card>
        <p id="card-events">Resource openings: {cardVisits}. Saves: {saved}.</p>
        <Card id="static-card" title="Static information" headingLevel={3}><p>Ordinary content without a surface action.</p></Card>
        <Card id="shell-card"/>
        <Card id="compact-card" title="Compact semantic heading" headingLevel={3} titleStyle="compact"><p>The H3 semantics use the existing H5 visual style.</p></Card>
      </div>
      <h2 id="results" ref={heading} tabIndex={-1}>Resources — Page {page} of 10,000</h2>
      <section aria-label="Example results" aria-busy={loading}><p>Results remain on page {page} until the requested page loads successfully.</p></section>
      <p role="status">{loading?'Loading the requested page…':''}</p><div role="alert">{error&&<Alert state="error" titleText={error}/>}</div>
      <Pagination id="resource-pagination" label="Resource results pagination" currentPage={page} totalPages={10000} pageHref={pageHref} presentation={presentation} onNavigate={navigate} {...(jump?{pageJump:true as const,jumpForm:{action:'/',pageName:'page',hiddenFields:[{name:'navigation',value:''},{name:'filter',value:'accessible'},{name:'sort',value:'title'}]}}:{pageJump:false as const})}/>
    </div>
    <h2>Boundary examples</h2><Pagination id="first-pagination" label="First page example" currentPage={1} totalPages={8} pageHref={n=>`?navigation&page=${n}`}/><Pagination id="last-pagination" label="Last page example" currentPage={8} totalPages={8} pageHref={n=>`?navigation&page=${n}`}/>
    <p><Button id="after-navigation">After examples</Button></p>
  </main>;
}
