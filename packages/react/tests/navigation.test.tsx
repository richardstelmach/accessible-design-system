import React,{act,createRef,StrictMode} from 'react';
import {beforeEach,expect,it,vi} from 'vitest';
import {fireEvent,render,screen} from '@testing-library/react';
import {renderToString} from 'react-dom/server';
import {hydrateRoot} from 'react-dom/client';
import userEvent from '@testing-library/user-event';
import {Badge,Breadcrumb,Button,Card,Pagination} from '../src/index.js';
import {paginationWindow} from '../src/internal/navigation.js';
beforeEach(()=>{(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;});
const ancestors=[{id:'home',label:'Home',href:'/'},{id:'resources',label:'Resources',href:'/resources'}];
const pageHref=(page:number)=>`/results?filter=accessible&page=${page}`;
it('Card supplies ordinary semantics, heading/link/ref, real images and independent composed actions',()=>{
 const ref=createRef<HTMLDivElement>();const save=vi.fn();render(<Card ref={ref} title="Garden guide" headingLevel={3} titleHref="/garden" image={{src:'/garden.jpg',alt:'Accessible garden paths',width:800,height:450,fit:'contain'}} imageBadge={<Badge label="New"/>} actions={<Button onClick={save}>Save</Button>}>Information</Card>);
 expect(ref.current?.tagName).toBe('DIV');expect(ref.current).not.toHaveAttribute('role');expect(ref.current).not.toHaveAttribute('tabindex');expect(screen.getByRole('heading',{level:3})).toHaveTextContent('Garden guide');expect(screen.getByRole('link')).toHaveAttribute('href','/garden');expect(screen.getByRole('img')).toHaveAttribute('width','800');fireEvent.click(screen.getByRole('button'));expect(save).toHaveBeenCalledOnce();expect(screen.getByText('New')).toBeVisible();
});
it('Card SSR does not pretend surface enhancement exists; absent slots leave a padding-only shell',()=>{
 const host=document.createElement('div');host.innerHTML=renderToString(<Card/>);expect(host.querySelector('.owla11y-card__body')?.children).toHaveLength(0);expect(host.querySelector('h2,p,img,a,[data-clickable],[role],[tabindex]')).toBeNull();
 const html=renderToString(<Card title="Visit" titleHref="/visit" wholeCardClickable/>);expect(html).toContain('href="/visit"');expect(html).not.toContain('data-clickable');
});
it('Card independently selects semantic heading and compact appearance and collapses empty slots',()=>{
 render(<Card title="Title" headingLevel={2} titleStyle="compact" actions={<></>}>{false}</Card>);expect(screen.getByRole('heading',{level:2})).toHaveAttribute('data-title-style','h5');expect(document.querySelector('.owla11y-card__actions,.owla11y-card__content')).toBeNull();
});
it('Card rejects unsupported action models, invalid images, badge dependencies and unsafe destinations',()=>{
 for(const props of [{wholeCardClickable:true},{titleHref:'/a'},{titleStyle:'compact'},{headingLevel:1},{title:' '},{image:{src:'/a',alt:'',width:0,height:100}},{image:{src:'/a',width:100,height:100}},{imageBadge:<Badge label="New"/>},{image:{src:'/a',alt:'',width:100,height:100},imageBadge:<span>Fake</span>},{title:'A',titleHref:'javascript:alert(1)'},{onClick:()=>{}},{role:'link'},{tabIndex:0}])expect(()=>renderToString(<Card {...props as any}/>)).toThrow(/OwlA11y/);
});
it('Breadcrumb baseline is a named hierarchy with all native links, plain current text and no toggle',()=>{
 const ref=createRef<HTMLElement>();render(<Breadcrumb ref={ref} ancestors={ancestors} currentPage="Current"/>);expect(ref.current?.tagName).toBe('NAV');expect(screen.getByRole('navigation')).toHaveAccessibleName('Breadcrumb');expect(screen.getAllByRole('link').map(n=>n.textContent)).toEqual(['Home','Resources']);expect(document.querySelector('[aria-current=page]')).toHaveTextContent('Current');expect(screen.queryByRole('button')).toBeNull();expect(document.querySelectorAll('[aria-hidden=true]')).not.toHaveLength(0);
});
it('Breadcrumb omits empty ancestor sets and does not mark the final ancestor current',()=>{
 const view=render(<Breadcrumb ancestors={[]} currentPage="Here"/>);expect(screen.queryByRole('navigation')).toBeNull();view.rerender(<Breadcrumb ancestors={ancestors}/>);expect(document.querySelector('[aria-current]')).toBeNull();expect(screen.getAllByRole('link')).toHaveLength(2);
});
it('Breadcrumb rejects empty/duplicate entries, unsupported semantics and conflicting ownership',()=>{
 for(const props of [{label:''},{ancestors:[ancestors[0],ancestors[0]]},{ancestors:[{...ancestors[0],href:''}]},{ancestors:[{...ancestors[0],label:''}]},{expanded:true},{expanded:true,defaultExpanded:true,onExpandedChange:()=>{}},{role:'menu'}])expect(()=>renderToString(<Breadcrumb ancestors={ancestors} {...props as any}/>)).toThrow(/OwlA11y/);
});
it('Pagination window is bounded, ordered, contains endpoints/current and represents meaningful omissions',()=>{
 for(let total=2;total<=300;total++)for(let current=1;current<=total;current++){
  const sequence=paginationWindow(current,total);const numbers=sequence.filter((p):p is number=>typeof p==='number');expect(sequence.length).toBeLessThanOrEqual(7);expect(numbers).toContain(1);expect(numbers).toContain(total);expect(numbers).toContain(current);expect(numbers).toEqual([...new Set(numbers)].sort((a,b)=>a-b));
  sequence.forEach((item,i)=>{if(typeof item!=='number')expect((sequence[i+1] as number)-(sequence[i-1] as number)).toBeGreaterThanOrEqual(3);});
 }
 for(const current of [1,4,5,Number.MAX_SAFE_INTEGER-4,Number.MAX_SAFE_INTEGER])expect(paginationWindow(current,Number.MAX_SAFE_INTEGER)).toHaveLength(7);
},15000);
it('Pagination renders a single real current link, bounded native hrefs and noninteractive omissions',()=>{
 render(<Pagination currentPage={500} totalPages={10000} pageHref={pageHref}/>);const current=screen.getByRole('link',{name:'Page 500',exact:true});expect(current).toHaveAttribute('aria-current','page');expect(current).toHaveAttribute('href',pageHref(500));expect(screen.getAllByRole('link')).toHaveLength(7);expect(screen.getAllByText('Pages omitted')).toHaveLength(2);expect(document.querySelector('[role=tablist],[tabindex],[aria-selected]')).toBeNull();expect(screen.queryByLabelText('Go to page')).toBeNull();
});
it('Pagination omits unavailable directions and all navigation for zero/one page',()=>{
 const view=render(<Pagination currentPage={1} totalPages={0} pageHref={pageHref}/>);expect(screen.queryByRole('navigation')).toBeNull();view.rerender(<Pagination currentPage={1} totalPages={1} pageHref={pageHref}/>);expect(screen.queryByRole('navigation')).toBeNull();view.rerender(<Pagination currentPage={1} totalPages={8} pageHref={pageHref}/>);expect(screen.queryByRole('link',{name:'Previous'})).toBeNull();expect(screen.getByRole('link',{name:'Next'})).toHaveAttribute('rel','next');view.rerender(<Pagination currentPage={8} totalPages={8} pageHref={pageHref}/>);expect(screen.queryByRole('link',{name:'Next'})).toBeNull();
});
it('Pagination only intercepts unmodified primary navigation and respects native attributes/consumer prevention',()=>{
 const navigate=vi.fn();const view=render(<Pagination currentPage={3} totalPages={8} pageHref={pageHref} onNavigate={navigate}/>);const next=screen.getByRole('link',{name:'Next'});fireEvent.click(next,{button:0});expect(navigate).toHaveBeenLastCalledWith(4,{href:pageHref(4),source:'link'});navigate.mockClear();next.addEventListener('click',e=>{if(e.ctrlKey)e.preventDefault();});fireEvent.click(next,{button:0,ctrlKey:true});expect(navigate).not.toHaveBeenCalled();view.rerender(<Pagination currentPage={3} totalPages={8} pageHref={pageHref} onNavigate={navigate} linkAttributes={()=>({onClick:e=>e.preventDefault(),target:'_blank'})}/>);fireEvent.click(screen.getByRole('link',{name:'Next'}));expect(navigate).not.toHaveBeenCalled();
});
it('Pagination page entry validates the entire raw string, focuses inline errors and preserves GET parameters',async()=>{
 const user=userEvent.setup();const navigate=vi.fn();render(<Pagination currentPage={3} totalPages={10000} pageHref={pageHref} onNavigate={navigate} pageJump jumpForm={{action:'/results',pageName:'page',hiddenFields:[{name:'filter',value:'accessible'}]}}/>);const input=screen.getByRole('textbox',{name:'Go to page'});const form=input.closest('form')!;expect(form).toHaveAttribute('method','get');expect(new FormData(form).get('filter')).toBe('accessible');expect(input).toBeRequired();expect(input).toHaveAttribute('inputmode','numeric');
 for(const raw of ['','2x','-2','+2','2.5','2e2','0','10001','9007199254740992']){fireEvent.change(input,{target:{value:raw}});await user.click(screen.getByRole('button',{name:'Go',exact:true}));expect(input).toHaveFocus();expect(input).toHaveAttribute('aria-invalid','true');expect(navigate).not.toHaveBeenCalled();}
 fireEvent.change(input,{target:{value:'004'}});await user.click(screen.getByRole('button',{name:'Go',exact:true}));expect(navigate).toHaveBeenLastCalledWith(4,{href:pageHref(4),source:'jump'});expect(input).not.toHaveAttribute('aria-invalid');
});
it('Submitting the current page is a polite no-op without moving focus or navigating',async()=>{
 const user=userEvent.setup();const navigate=vi.fn();render(<Pagination currentPage={3} totalPages={8} pageHref={pageHref} onNavigate={navigate} pageJump jumpForm={{action:'/results',pageName:'page'}}/>);await user.type(screen.getByRole('textbox'),'3');const go=screen.getByRole('button',{name:'Go',exact:true});await user.click(go);expect(go).toHaveFocus();expect(navigate).not.toHaveBeenCalled();await screen.findByText('Already on page 3');expect(screen.getByRole('status')).toHaveTextContent('Already on page 3');
});
it('Pagination rejects unknown/invalid totals, bad labels, unsupported widgets and absent GET fallback',()=>{
 for(const props of [{totalPages:-1},{currentPage:0},{currentPage:2,totalPages:0},{currentPage:9,totalPages:8},{totalPages:Infinity},{totalPages:Number.MAX_SAFE_INTEGER+1},{currentPage:1.5},{pageJump:true},{pageJump:true,jumpForm:{action:'/a',pageName:'page',hiddenFields:[{name:'page',value:'4'}]}},{labels:{next:''}},{labels:{formatPageLabel:()=>''}},{labels:{formatPageLabel:()=> 'Go'}},{role:'tablist'},{pageHref:()=>''}])expect(()=>renderToString(<Pagination currentPage={3} totalPages={8} pageHref={pageHref} {...props as any}/>)).toThrow(/OwlA11y/);
});
it('all three hydrate in StrictMode with stable refs/IDs, native links and no hydration failures',async()=>{
 const card=createRef<HTMLDivElement>();const breadcrumb=createRef<HTMLElement>();const pagination=createRef<HTMLElement>();const app=<StrictMode><Card ref={card} title="Title" titleHref="/title" wholeCardClickable/><Breadcrumb ref={breadcrumb} ancestors={ancestors} currentPage="Here"/><Pagination ref={pagination} currentPage={3} totalPages={8} pageHref={pageHref}/></StrictMode>;const host=document.createElement('div');document.body.append(host);host.innerHTML=renderToString(app);const ids=[...host.querySelectorAll('[id]')].map(n=>n.id);const errors:unknown[]=[];let root:ReturnType<typeof hydrateRoot>;await act(async()=>{root=hydrateRoot(host,app,{onRecoverableError:e=>errors.push(e)});});expect(errors).toEqual([]);expect([...host.querySelectorAll('[id]')].map(n=>n.id)).toEqual(ids);expect(card.current).toHaveAttribute('data-clickable','true');expect(breadcrumb.current?.tagName).toBe('NAV');expect(pagination.current?.tagName).toBe('NAV');await act(async()=>root!.unmount());host.remove();
});
