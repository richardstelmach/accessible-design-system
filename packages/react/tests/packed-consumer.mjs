import React from 'react';
import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
// Establish the DOM before loading the dependency's browser tab-order helpers.
// renderToString still exercises server output; no effects run during that call.
const dom = new JSDOM('<div id="root"></div>', { url:'https://example.test/' });
globalThis.window=dom.window; globalThis.document=dom.window.document;
globalThis.HTMLElement=dom.window.HTMLElement; globalThis.Element=dom.window.Element;
globalThis.getComputedStyle=dom.window.getComputedStyle;
const {renderToString}=await import('react-dom/server');
const {hydrateRoot}=await import('react-dom/client');
const { Button, IconButton, Link, TextInput, Textarea, Select, Fieldset, Checkbox, Radio, DateInput, ErrorSummary, getDateInputIds, Dialog, Tabs, ToastProvider, ToastRegion, ToastNotificationsButton, useToast, Alert, Badge, Stepper, Accordion, Card, Breadcrumb, Pagination, CodeBlock } = await import('@owla11y/react');

const h = React.createElement;
const dateIds = getDateInputIds('packed-date');
const codeBlockRef = React.createRef();
const codeSource = '\n  <Button>Save</Button>\n';
const app = h('form', null,
  h(CodeBlock, { label:'React', code:codeSource, ref:codeBlockRef }),
  h(ErrorSummary, { errors: [{ id: 'date', text: 'Enter a year', targetId: dateIds.year }, { id: 'name', text: 'Check the name', targetId: 'packed-name' }], focusRequestKey: 1 }),
  h(TextInput, { id: 'packed-name', label: 'Name', name: 'name', defaultValue: 'Ada' }),
  h(DateInput, { id: dateIds.group, legend: 'Birth date', name: 'date', purpose: 'date-of-birth', defaultValue: { day: '01', month: '02', year: '2000' }, error: { message: 'Enter a year' }, errorAssociation: 'children', invalidParts: ['year'] }),
  h(Textarea, { label: 'Notes', name: 'notes', defaultValue: 'Saved notes' }),
  h(Select, { label: 'Country', name: 'country', defaultValue: 'gb' },
    h('option', { value: '' }, 'Select a country'), h('option', { value: 'gb' }, 'United Kingdom')),
  h(Fieldset, { id: 'packed-contact', legend: 'Contact', helperText: 'Choose one', error: { id: 'contact-error', message: 'Error: Choose a method' } },
    h(Radio, { label: 'Email', name: 'contact', value: 'email', defaultChecked: true }),
    h(Radio, { label: 'Phone', name: 'contact', value: 'phone' })),
  h(Checkbox, { label: 'Updates', name: 'updates', value: 'yes', defaultChecked: true, indeterminate: true }),
  h(Button, null, 'Save'), h(IconButton, { 'aria-label': 'Add', icon: h('svg') }), h(Link, { href: '/help' }, 'Help'));

const html = renderToString(app);
document.getElementById('root').innerHTML=html;
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
// Layout/scroll are supplied by the real-browser suite; jsdom verifies relationships/lifecycle.
dom.window.HTMLElement.prototype.getClientRects = function () { return [new dom.window.DOMRect(0, 0, 100, 40)]; };
dom.window.HTMLElement.prototype.scrollIntoView = function () {};
document.title = 'Packed example';
const root = document.getElementById('root');
const ids = [...root.querySelectorAll('[id]')].map(node => node.id);
assert.equal(new Set(ids).size, ids.length);
assert.equal(root.querySelector('.owla11y-code-block code').textContent, codeSource);
assert.equal(root.querySelector('.owla11y-code-block button'), null);
const errors = [];
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let hydrated;
await React.act(async () => {
  hydrated = hydrateRoot(root, app, { onRecoverableError: error => errors.push(error) });
});
assert.deepEqual([...root.querySelectorAll('[id]')].map(node => node.id).filter(id => ids.includes(id)), ids);
assert.equal(new Set([...root.querySelectorAll('[id]')].map(node => node.id)).size, root.querySelectorAll('[id]').length);
assert.deepEqual(errors, []);
assert.equal(codeBlockRef.current, root.querySelector('.owla11y-code-block'));
assert.equal(root.querySelector('.owla11y-code-block code').textContent, codeSource);
assert.equal(root.querySelector('.owla11y-code-block button').getAttribute('aria-label'), 'Copy React code');
for (const label of root.querySelectorAll('label')) assert.ok(document.getElementById(label.htmlFor));
assert.equal(root.querySelector('button').type, 'button');
assert.equal(root.querySelector('.owla11y-link').getAttribute('href'), '/help');
const fieldset = root.querySelector('#packed-contact');
assert.equal(fieldset.firstElementChild.tagName, 'LEGEND');
assert.ok(fieldset.getAttribute('aria-describedby').includes('contact-error'));
assert.equal(fieldset.querySelector('input').hasAttribute('aria-invalid'), false);
assert.equal(root.querySelector('#packed-date').firstElementChild.tagName, 'LEGEND');
assert.equal(root.querySelector('#packed-date-year').getAttribute('aria-describedby'), 'packed-date-error');
assert.equal(root.querySelector('#packed-date-day').hasAttribute('aria-invalid'), false);
assert.ok(document.activeElement === root.querySelector('.owla11y-error-summary'), 'Committed summary must own focus');
assert.deepEqual([...root.querySelectorAll('.owla11y-error-summary a')].map(a => a.textContent), ['Check the name', 'Enter a year']);
assert.equal(document.title, 'Error: Packed example');
root.querySelector('.owla11y-error-summary a[href="#packed-date-year"]').click();
assert.ok(document.activeElement === root.querySelector('#packed-date-year'), 'Date summary link must focus Year');
const checkbox = root.querySelector('[type=checkbox]');
assert.equal(checkbox.indeterminate, true);
const form = root.querySelector('form');
assert.equal(new dom.window.FormData(form).get('updates'), 'yes');
root.querySelector('[name=name]').value = 'Changed';
root.querySelector('textarea').value = 'Changed notes';
root.querySelector('select').value = '';
checkbox.checked = false;
root.querySelector('[value=phone]').checked = true;
root.querySelector('#packed-date-year').value = 'Changed year';
form.reset();
assert.equal(root.querySelector('[name=name]').value, 'Ada');
assert.equal(root.querySelector('textarea').value, 'Saved notes');
assert.equal(root.querySelector('select').value, 'gb');
assert.equal(checkbox.checked, true);
assert.equal(root.querySelector('[value=email]').checked, true);
assert.equal(root.querySelector('#packed-date-year').value, '2000');
await React.act(async () => hydrated.unmount());
assert.equal(document.title, 'Packed example');
// Native modal APIs are stubbed here; real inertness, layout and focus use Chromium.
const query=document.querySelector.bind(document);
document.querySelector=selector=>selector==='dialog:modal'?null:query(selector);
dom.window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
dom.window.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new dom.window.Event('close'));};
let requested=[]; const modalRef=React.createRef();
const modal=open=>h(Dialog,{ref:modalRef,open,onOpenChange:(next,detail)=>requested.push([next,detail.reason]),title:'Packed modal'},h('p',null,'Information'));
root.innerHTML=renderToString(modal(false)); const titleId=root.querySelector('dialog').getAttribute('aria-labelledby');
await React.act(async()=>{hydrated=hydrateRoot(root,modal(false),{onRecoverableError:error=>errors.push(error)});});
assert.equal(modalRef.current.open,false);assert.equal(modalRef.current.querySelector('h2').id,titleId);
await React.act(async()=>hydrated.render(modal(true)));assert.equal(modalRef.current.open,true);assert.equal(document.body.style.overflow,'hidden');
const cancel=new dom.window.Event('cancel',{cancelable:true});await React.act(async()=>modalRef.current.dispatchEvent(cancel));
assert.equal(cancel.defaultPrevented,true);assert.deepEqual(requested,[[false,'escape']]);assert.equal(modalRef.current.open,true);
await React.act(async()=>hydrated.render(modal(false)));assert.equal(document.body.style.overflow,'');assert.deepEqual(errors,[]);
await React.act(async()=>hydrated.unmount());
// Simulated layout drives enhancement deterministically; Chromium owns actual fit/reflow evidence.
let wide=true;const resized=[];
dom.window.matchMedia=query=>({get matches(){return query==='print'?false:wide;},addEventListener(){},removeEventListener(){}});
dom.window.ResizeObserver=class{constructor(callback){resized.push(callback);}observe(){}disconnect(){}};
dom.window.HTMLElement.prototype.getBoundingClientRect=function(){return new dom.window.DOMRect(0,0,this.classList.contains('owla11y-tabs__measure')?200:800,48);};
const tabsRef=React.createRef();const changes=[];
const tabsApp=h(Tabs,{ref:tabsRef,label:'Packed sections',defaultSelectedId:'history',activation:'manual',onSelectedChange:id=>changes.push(id),items:[
 {id:'details',label:'Details',heading:'Details',content:h('input',{'aria-label':'Notes',defaultValue:'Saved note'})},
 {id:'history',label:'History',heading:'History',content:h('p',null,'Earlier activity')}
]});
root.innerHTML=renderToString(tabsApp);assert.equal(root.querySelector('[role=tab]'),null);assert.equal(root.querySelectorAll('section:not([hidden])').length,2);
const tabIds=[...root.querySelectorAll('[id]')].map(n=>n.id);
await React.act(async()=>{hydrated=hydrateRoot(root,tabsApp,{onRecoverableError:error=>errors.push(error)});});
assert.ok(tabsRef.current===root.firstElementChild);assert.deepEqual([...root.querySelectorAll('[id]')].map(n=>n.id),tabIds);
assert.equal(root.querySelector('[role=tab][aria-selected=true]').textContent,'History');
const detailTab=[...root.querySelectorAll('[role=tab]')].find(n=>n.textContent==='Details');
await React.act(async()=>detailTab.click());assert.deepEqual(changes,['details']);
const notes=root.querySelector('input');notes.value='Edited note';
await React.act(async()=>root.querySelectorAll('[role=tab]')[1].click());
assert.ok(notes===root.querySelector('input'));assert.ok(notes.closest('section').hidden);
await React.act(async()=>{wide=false;resized.forEach(callback=>callback());});
assert.equal(root.querySelector('[role=tab]'),null);assert.equal(root.querySelectorAll('section:not([hidden])').length,2);
await React.act(async()=>notes.focus());await React.act(async()=>{wide=true;resized.forEach(callback=>callback());});
assert.equal(root.querySelector('[role=tab][aria-selected=true]').textContent,'Details');assert.equal(notes.value,'Edited note');assert.ok(document.activeElement===notes);
assert.deepEqual(errors,[]);await React.act(async()=>hydrated.unmount());
let toastAPI;
function ToastEvents(){toastAPI=useToast();return h('button',null,'Event origin');}
const toastApp=h(React.StrictMode,null,h(ToastProvider,null,h(ToastEvents),h(ToastNotificationsButton),h(ToastRegion)));
root.innerHTML=renderToString(toastApp);assert.equal(root.querySelector('[role=status]').textContent,'');assert.equal(root.querySelector('[role=alert]').textContent,'');
const notificationId=root.querySelector('section').id;
await React.act(async()=>{hydrated=hydrateRoot(root,toastApp,{onRecoverableError:error=>errors.push(error)});});
assert.equal(root.querySelector('section').id,notificationId);
await React.act(async()=>{toastAPI.add({id:'packed-save',state:'success',titleText:'Saved',dismissLabel:'Dismiss packed save'});});
for(let tries=0;tries<100&&!root.querySelector('[role=status]').textContent.includes('Saved');tries++)await React.act(async()=>{await new Promise(resolve=>setTimeout(resolve,10));});
assert.equal(root.querySelector('[role=status]').textContent,'Success: Saved');assert.equal(root.querySelectorAll('[data-toast-id]').length,1);
assert.equal(root.querySelector('[aria-live],[aria-atomic]'),null);
await React.act(async()=>root.querySelector('[aria-controls]').click());assert.ok(document.activeElement===root.querySelector('section'));
await React.act(async()=>root.querySelector('[data-toast-id] button').focus());await React.act(async()=>toastAPI.dismiss('packed-save'));
assert.equal(root.querySelectorAll('[data-toast-id]').length,0);assert.ok(document.activeElement===root.querySelector('[aria-controls]'));
assert.deepEqual(errors,[]);await React.act(async()=>hydrated.unmount());
const alertRef=React.createRef();const badgeRef=React.createRef();
const feedbackApp=(announcement='none',headingLevel='none')=>h(React.StrictMode,null,h('div',null,
 h(Alert,{ref:alertRef,state:'error',titleText:'Review the application',descriptionText:'Check the details',announcement,headingLevel}),
 h(Badge,{ref:badgeRef,tone:'success',label:'Completed'})));
root.innerHTML=renderToString(feedbackApp());const feedbackHTML=root.innerHTML;
assert.equal(root.querySelector('[role],[tabindex],[aria-live],[aria-atomic]'),null);
await React.act(async()=>{hydrated=hydrateRoot(root,feedbackApp(),{onRecoverableError:error=>errors.push(error)});});
assert.equal(root.innerHTML,feedbackHTML);assert.equal(alertRef.current.textContent,'Error: Review the applicationCheck the details');assert.equal(badgeRef.current.tagName,'SPAN');assert.equal(badgeRef.current.textContent,'Completed');
await React.act(async()=>hydrated.render(feedbackApp('polite',3)));
assert.equal(alertRef.current.getAttribute('role'),'status');assert.equal(alertRef.current.querySelector('h3').textContent,'Error: Review the application');assert.equal(root.querySelector('[aria-live],[aria-atomic],[tabindex]'),null);
assert.deepEqual(errors,[]);await React.act(async()=>hydrated.unmount());
const controlsRef=React.createRef();const requests=[];
const controlsApp=h(React.StrictMode,null,h('form',null,
 h(Stepper,{ref:controlsRef,id:'packed-quantity',label:'Quantity',name:'quantity',step:0.1,min:0,max:1,defaultValue:'0.2',incrementLabel:'Increase quantity',decrementLabel:'Decrease quantity',onValueChange:(value,detail)=>requests.push([value,detail.source])}),
 h(Accordion,{id:'packed-disclosure',headingLevel:3,items:[{id:'one',title:'First section',content:h('input',{'aria-label':'Panel note',defaultValue:'Saved'})},{id:'two',title:'Second section',content:h('p',null,'Second body')}]})
));
root.innerHTML=renderToString(controlsApp);assert.equal(root.querySelector('.owla11y-accordion button'),null);assert.equal(root.querySelector('.owla11y-accordion [hidden]'),null);
const controlIds=[...root.querySelectorAll('[id]')].map(n=>n.id);
await React.act(async()=>{hydrated=hydrateRoot(root,controlsApp,{onRecoverableError:error=>errors.push(error)});});
assert.deepEqual([...root.querySelectorAll('[id]')].map(n=>n.id),controlIds);assert.equal(controlsRef.current.type,'number');
await React.act(async()=>root.querySelector('[aria-label="Increase quantity"]').click());assert.equal(controlsRef.current.value,'0.3');assert.deepEqual(requests,[['0.3','increment']]);assert.equal(root.querySelector('[role=status]').textContent,'Quantity: 0.3');
await React.act(async()=>root.querySelector('form').reset());assert.equal(controlsRef.current.value,'0.2');assert.equal(root.querySelector('[role=status]').textContent,'');
const disclosure=root.querySelector('.owla11y-accordion button');await React.act(async()=>disclosure.click());assert.equal(disclosure.getAttribute('aria-expanded'),'true');
const panelNote=root.querySelector('[aria-label="Panel note"]');panelNote.value='Edited';await React.act(async()=>disclosure.click());assert.equal(panelNote.closest('.owla11y-accordion__panel').hidden,true);assert.equal(panelNote.value,'Edited');
assert.deepEqual(errors,[]);await React.act(async()=>hydrated.unmount());
const cardRef=React.createRef();const trailRef=React.createRef();const pagingRef=React.createRef();const navigationRequests=[];
const navigationApp=h(React.StrictMode,null,
 h(Card,{ref:cardRef,title:'Packed resource',headingLevel:3,titleHref:'/resource',wholeCardClickable:true,image:{src:'/photo.jpg',alt:'',width:800,height:450},imageBadge:h(Badge,{label:'New'})},h('p',null,'Resource details')),
 h(Breadcrumb,{ref:trailRef,id:'packed-path',ancestors:[{id:'home',label:'Home',href:'/'},{id:'resources',label:'Resources',href:'/resources'}],currentPage:'Current'}),
 h(Pagination,{ref:pagingRef,id:'packed-pages',currentPage:500,totalPages:10000,pageHref:page=>'/results?filter=accessible&page='+page,pageJump:true,jumpForm:{action:'/results',pageName:'page',hiddenFields:[{name:'filter',value:'accessible'}]},onNavigate:(page,detail)=>navigationRequests.push([page,detail.source])})
);
root.innerHTML=renderToString(navigationApp);assert.equal(root.querySelector('[data-clickable]'),null);assert.equal(root.querySelector('.owla11y-breadcrumb button'),null);assert.equal(root.querySelector('.owla11y-pagination__numbered').hidden,false);
const navigationIds=[...root.querySelectorAll('[id]')].map(n=>n.id);
await React.act(async()=>{hydrated=hydrateRoot(root,navigationApp,{onRecoverableError:error=>errors.push(error)});});
assert.deepEqual([...root.querySelectorAll('[id]')].map(n=>n.id),navigationIds);assert.equal(cardRef.current.getAttribute('role'),null);assert.equal(cardRef.current.getAttribute('data-clickable'),'true');assert.equal(trailRef.current.tagName,'NAV');assert.equal(pagingRef.current.tagName,'NAV');
assert.equal(root.querySelectorAll('.owla11y-pagination__numbered [aria-current=page]').length,1);assert.equal(root.querySelector('.owla11y-pagination__numbered [aria-current=page]').getAttribute('href'),'/results?filter=accessible&page=500');
await React.act(async()=>root.querySelector('.owla11y-pagination__numbered a[rel=next]').click());assert.deepEqual(navigationRequests,[[501,'link']]);
await React.act(async()=>root.querySelector('.owla11y-pagination__jump').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true})));assert.equal(root.querySelector('#packed-pages-jump').getAttribute('aria-invalid'),'true');assert.ok(document.activeElement===root.querySelector('#packed-pages-jump'));assert.equal(new dom.window.FormData(root.querySelector('.owla11y-pagination__jump')).get('filter'),'accessible');
assert.deepEqual(errors,[]);await React.act(async()=>hydrated.unmount());
console.log('Packed package: React ' + React.version + ' standalone components including CodeBlock (exact text, SSR, hydration, ref), Card/Breadcrumb/Pagination plus Toast host (announcement, focus, StrictMode), Tabs fallback/state, Dialog lifecycle, date IDs, types, SSR, hydration, error routing, title and native reset passed');
