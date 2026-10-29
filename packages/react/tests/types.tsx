import React, {createRef} from 'react';
import {Button,IconButton,Link,TextInput} from '../src/index.js';
import {Textarea,Select,Fieldset,Checkbox,Radio} from '../src/index.js';
import {DateInput,ErrorSummary,getDateInputIds} from '../src/index.js';
import type {DateInputValue} from '../src/index.js';
<Button ref={createRef<HTMLButtonElement>()} onClick={e=>e.currentTarget.focus()}>Save</Button>;
<IconButton aria-label="Add" icon={<svg/>}/>;
<Link href="/" ref={createRef<HTMLAnchorElement>()}>Home</Link>;
<TextInput label="Name" name="name" value="Ada" onChange={e=>e.currentTarget.value}/>;
<TextInput label="Name" name="name" value="Ada" readOnly/>;
// @ts-expect-error accessible name required
<IconButton icon={<svg/>}/>;
// @ts-expect-error text variant absent from IconButton
<IconButton aria-label="Add" icon={<svg/>} variant="text"/>;
// @ts-expect-error conflicting value ownership
<TextInput label="Name" name="name" value="Ada" defaultValue="B" onChange={()=>{}}/>;
// @ts-expect-error controlled editable input requires callback
<TextInput label="Name" name="name" value="Ada"/>;
// @ts-expect-error submit input is outside this component contract
<TextInput label="Submit" name="submit" type="submit"/>;

<TextInput label="Code" name="code" width="4ch"/>;
// @ts-expect-error source prohibits placeholder text
<TextInput label="Name" name="name" placeholder="Your name"/>;
// @ts-expect-error visible label must own the accessible name
<TextInput label="Name" name="name" aria-label="Different name"/>;
// @ts-expect-error width must be a canonical width
<TextInput label="Name" name="name" width="50%"/>;

<Textarea label="Notes" name="notes" ref={createRef<HTMLTextAreaElement>()} value="Saved" onChange={e=>e.currentTarget.value}/>;
<Textarea label="Notes" name="notes" value="Saved" readOnly/>;
<Select label="Country" name="country" ref={createRef<HTMLSelectElement>()} value="" onChange={e=>e.currentTarget.value}><option value="">Select a country</option></Select>;
<Fieldset legend="Contact" ref={createRef<HTMLFieldSetElement>()} legendStyle="compact" headingLevel="h3"><Radio label="Email" name="contact" value="email"/></Fieldset>;
<Fieldset legend="Address" errorAssociation="children" error={{id:'shared',message:'Error'}}><Textarea label="Location" name="location" errorDescribedBy="shared"/></Fieldset>;
<Checkbox label="Updates" name="updates" value="yes" ref={createRef<HTMLInputElement>()} checked indeterminate onChange={e=>e.currentTarget.checked}/>;
<Radio label="Email" name="contact" value="email" ref={createRef<HTMLInputElement>()} checked onChange={e=>e.currentTarget.checked}/>;
<Select label="Country" name="country" size={1} tabIndex={0}><option value="">Choose</option></Select>;
// @ts-expect-error a select list is outside this single-choice dropdown contract
<Select label="Country" name="country" size={3}><option value="">Choose</option></Select>;
// @ts-expect-error editable controlled textarea needs callback
<Textarea label="Notes" name="notes" value="Saved"/>;
// @ts-expect-error visible label owns textarea name
<Textarea label="Notes" name="notes" placeholder="Write here"/>;
// @ts-expect-error select is single-choice only
<Select label="Country" name="country" multiple><option value="">Choose</option></Select>;
// @ts-expect-error controlled select needs callback
<Select label="Country" name="country" value=""><option value="">Choose</option></Select>;
// @ts-expect-error children mode needs an explicit shared error ID
<Fieldset legend="Address" errorAssociation="children" error={{message:'Error'}}><div/></Fieldset>;
// @ts-expect-error fieldset itself cannot be invalid
<Fieldset legend="Contact" aria-invalid><div/></Fieldset>;
// @ts-expect-error controlled checkbox needs change callback
<Checkbox label="Updates" name="updates" value="yes" checked/>;
// @ts-expect-error ambiguous choice ownership
<Radio label="Email" name="contact" value="email" checked defaultChecked onChange={()=>{}}/>;
// @ts-expect-error radios have group errors, not individual errors
<Radio label="Email" name="contact" value="email" error={{message:'Error'}}/>;
// @ts-expect-error choice value is mandatory
<Checkbox label="Updates" name="updates"/>;

const dateIds = getDateInputIds('dob');
<DateInput id={dateIds.group} legend="Date of birth" name="dob" ref={createRef<HTMLInputElement>()} purpose="date-of-birth" />;
<DateInput legend="Date" name="date" defaultValue={{day:'01',month:'02',year:'2000'}} />;
<DateInput legend="Date" name="date" value={{day:'1',month:'2',year:'2000'}} onValueChange={(value:DateInputValue,detail)=>detail.part} />;
<DateInput legend="Date" name="date" value={{day:'1',month:'2',year:'2000'}} readOnly />;
<DateInput legend="Date" name="date" error={{message:'Enter year'}} errorAssociation="children" invalidParts={['year']} />;
<ErrorSummary ref={createRef<HTMLDivElement>()} errors={[{id:'dob',text:'Enter date',targetId:dateIds.day,contextId:dateIds.group}]} focusRequestKey={1} />;
// @ts-expect-error DateInput controlled owner requires callback or readonly
<DateInput legend="Date" name="date" value={{day:'1',month:'2',year:'2000'}} />;
// @ts-expect-error children association needs affected parts
<DateInput legend="Date" name="date" errorAssociation="children" error={{message:'Enter date'}} />;
// @ts-expect-error group errors do not mark children invalid
<DateInput legend="Date" name="date" invalidParts={['year']} />;
// @ts-expect-error raw date strings must not be coerced to numbers
<DateInput legend="Date" name="date" defaultValue={{day:1,month:'2',year:'2000'}} />;
// @ts-expect-error DateInput has one value owner
<DateInput legend="Date" name="date" onChange={()=>{}} />;
// @ts-expect-error summary owns native focus semantics
<ErrorSummary errors={[{id:'dob',text:'Enter date',targetId:dateIds.day}]} tabIndex={0} />;
// @ts-expect-error untested duplicate live-announcement strategies are excluded
<ErrorSummary errors={[{id:'dob',text:'Enter date',targetId:dateIds.day}]} role="alert" />;

import {Dialog} from '../src/index.js';
<Dialog ref={createRef<HTMLDialogElement>()} open={false} onOpenChange={(next,detail)=>{const reason: 'close-button'|'escape'|'backdrop'|'action'=detail.reason;}} title="Edit" headingLevel={3}>Content</Dialog>;
<Dialog open={false} onOpenChange={()=>{}} accessibleLabel="Information" showClose={false}>Content</Dialog>;
<Dialog open={false} onOpenChange={()=>{}} title="Choose" dismissal="forced-decision" actions={<Button>Keep existing choice</Button>}>Consequences</Dialog>;
// @ts-expect-error every Dialog has an accessible name
<Dialog open={false} onOpenChange={()=>{}}>Content</Dialog>;
// @ts-expect-error controlled ownership requires a callback
<Dialog open={false} title="Edit">Content</Dialog>;
// @ts-expect-error one naming strategy only
<Dialog open={false} onOpenChange={()=>{}} title="Edit" accessibleLabel="Other">Content</Dialog>;
// @ts-expect-error a hidden title requires an explicit accessible label
<Dialog open={false} onOpenChange={()=>{}} title="Edit" showTitle={false}>Content</Dialog>;
// @ts-expect-error forced decisions cannot expose a close control
<Dialog open={false} onOpenChange={()=>{}} title="Choose" dismissal="forced-decision" showClose actions={<Button>Resolve</Button>}>Content</Dialog>;
// @ts-expect-error forced decisions require actions
<Dialog open={false} onOpenChange={()=>{}} title="Choose" dismissal="forced-decision">Content</Dialog>;
// @ts-expect-error native dialog must not have tabIndex
<Dialog open={false} onOpenChange={()=>{}} title="Edit" tabIndex={-1}>Content</Dialog>;

import {Tabs} from '../src/index.js';
import type {TabsItem} from '../src/index.js';
const tabItems:TabsItem[]=[{id:'details',label:'Details',heading:'Details',content:<p>Details content</p>},{id:'history',label:'History',heading:'History',content:<p>History content</p>}];
<Tabs ref={createRef<HTMLDivElement>()} label="Profile" items={tabItems} defaultSelectedId="history" onSelectedChange={id=>id.toUpperCase()}/>;
<Tabs labelledBy="profile-heading" items={tabItems} selectedId="details" onSelectedChange={()=>{}} activation="manual" headingLevel={2}/>;
// @ts-expect-error an accessible set name is required
<Tabs items={tabItems}/>;
// @ts-expect-error only one naming strategy
<Tabs label="Profile" labelledBy="heading" items={tabItems}/>;
// @ts-expect-error controlled selection requires a callback
<Tabs label="Profile" items={tabItems} selectedId="details"/>;
// @ts-expect-error ownership modes cannot be combined
<Tabs label="Profile" items={tabItems} selectedId="details" defaultSelectedId="history" onSelectedChange={()=>{}}/>;
// @ts-expect-error only horizontal tabs are supported
<Tabs label="Profile" items={tabItems} orientation="vertical"/>;
// @ts-expect-error each panel requires a plain heading
<Tabs label="Profile" items={[{id:'one',label:'One',content:'Content'}]}/>;
// @ts-expect-error structural roles are owned by the component
<Tabs label="Profile" items={tabItems} role="tablist"/>;

// @ts-expect-error raw HTML cannot replace Tabs-owned structure
<Tabs label="Profile" items={tabItems} dangerouslySetInnerHTML={{__html:'<p>Other</p>'}}/>;

import {ToastProvider,ToastRegion,ToastNotificationsButton,useToast} from '../src/index.js';
import type {ToastMessage,ToastAPI} from '../src/index.js';
const toastMessage:ToastMessage={id:'save-1',state:'success',titleText:'Saved',dismissLabel:'Dismiss saved notification'};
<ToastProvider regionLabel="Updates" formatCountLabel={count=>`${count} updates`} formatAnnouncement={messages=>`${messages.length} events`} onDismiss={id=>id.toUpperCase()}><ToastNotificationsButton/><ToastRegion className="rail"/></ToastProvider>;
function ToastTypes(){const api:ToastAPI=useToast();const id:string=api.add(toastMessage);api.dismiss(id);return null;}
// @ts-expect-error required contextual dismiss label
const unnamedToast:ToastMessage={id:'one',titleText:'Saved'};
// @ts-expect-error messages must be plain text
const richToast:ToastMessage={...toastMessage,titleText:<b>Saved</b>};
// @ts-expect-error automatic dismissal is unsupported
const timedToast:ToastMessage={...toastMessage,duration:5000};
// @ts-expect-error visible region semantics belong to the host
<ToastRegion role="alert"/>;
// @ts-expect-error entry text is generated from the active count
<ToastNotificationsButton>Custom</ToastNotificationsButton>;

import {Alert,Badge} from '../src/index.js';
<Alert titleText="Saved" state="success" ref={createRef<HTMLDivElement>()}/>;
<Alert titleText="Before continuing" headingLevel={3} announcement="polite" descriptionText="Check your answers"/>;
<Badge label="Pending" tone="info" ref={createRef<HTMLSpanElement>()}/>;
// @ts-expect-error Alert title is required
<Alert/>;
// @ts-expect-error semantic headings exclude h1
<Alert titleText="Title" headingLevel={1}/>;
// @ts-expect-error noninteractive feedback has no action slot
<Alert titleText="Title"><button>Action</button></Alert>;
// @ts-expect-error roles are derived from announcement
<Alert titleText="Title" role="alert"/>;
// @ts-expect-error rich label content is unsupported
<Badge label={<strong>Pending</strong>}/>;
// @ts-expect-error Badge is not a button
<Badge label="Pending" onClick={()=>{}}/>;
// @ts-expect-error Badge never supplies live semantics
<Badge label="Pending" role="status"/>;
// @ts-expect-error Badge is not focusable
<Badge label="Pending" tabIndex={0}/>;
// @ts-expect-error Badge labels are required
<Badge tone="success"/>;

import {Accordion,Stepper} from '../src/index.js';
const accordionItems=[{id:'one',title:'One',content:<p>Content</p>}];
<Accordion headingLevel={3} items={accordionItems} defaultExpandedIds={['one']} ref={createRef<HTMLDivElement>()}/>;
<Accordion headingLevel={2} titleStyle="h4" panelLandmark items={accordionItems} expandedIds={[]} onExpandedChange={ids=>ids.map(id=>id.toUpperCase())}/>;
<Stepper label="Quantity" name="quantity" step={1} incrementLabel="Increase quantity" decrementLabel="Decrease quantity" defaultValue="2" ref={createRef<HTMLInputElement>()}/>;
<Stepper label="Quantity" name="quantity" step={0.1} incrementLabel="Increase quantity" decrementLabel="Decrease quantity" value="2" onValueChange={(raw,detail)=>{const source:'input'|'increment'|'decrement'=detail.source;raw.toUpperCase();}}/>;
// @ts-expect-error semantic heading is required
<Accordion items={accordionItems}/>;
// @ts-expect-error controlled expansion requires a callback
<Accordion headingLevel={3} items={accordionItems} expandedIds={[]}/>;
// @ts-expect-error no single-open mode
<Accordion headingLevel={3} items={accordionItems} singleOpen/>;
// @ts-expect-error Stepper requires an explicit finite positive step
<Stepper label="Quantity" name="quantity" incrementLabel="Increase" decrementLabel="Decrease"/>;
// @ts-expect-error raw strings only
<Stepper label="Quantity" name="quantity" step={1} incrementLabel="Increase" decrementLabel="Decrease" defaultValue={2}/>;
// @ts-expect-error controlled value requires callback
<Stepper label="Quantity" name="quantity" step={1} incrementLabel="Increase" decrementLabel="Decrease" value="2"/>;
// @ts-expect-error no readOnly mode
<Stepper label="Quantity" name="quantity" step={1} incrementLabel="Increase" decrementLabel="Decrease" readOnly/>;
// @ts-expect-error single value owner
<Stepper label="Quantity" name="quantity" step={1} incrementLabel="Increase" decrementLabel="Decrease" onChange={()=>{}}/>;

import {Card,Breadcrumb,Pagination} from '../src/index.js';
<Card title="Resource" titleHref="/resource" headingLevel={3} wholeCardClickable image={{src:'/image.jpg',alt:'',width:800,height:450}} imageBadge={<Badge label="New"/>} actions={<Button>Save</Button>}>Description</Card>;
<Card ref={createRef<HTMLDivElement>()} title="Heading" headingLevel={2} titleStyle="compact"/>;
<Breadcrumb ancestors={[{id:'home',label:'Home',href:'/'}]} currentPage="Here" ref={createRef<HTMLElement>()} defaultExpanded/>;
<Breadcrumb ancestors={[]} expanded={false} onExpandedChange={()=>{}}/>;
<Pagination currentPage={3} totalPages={10000} pageHref={n=>`?page=${n}`} ref={createRef<HTMLElement>()}/>;
<Pagination currentPage={3} totalPages={10000} pageHref={n=>`?page=${n}`} pageJump jumpForm={{action:'/search',pageName:'page',hiddenFields:[{name:'sort',value:'title'}]}} onNavigate={(page,detail)=>{const source:'link'|'jump'=detail.source;detail.href.toUpperCase();}}/>;
// @ts-expect-error roots are not link widgets
<Card title="Resource" role="link"/>;
// @ts-expect-error image dimensions are required
<Card image={{src:'/a.jpg',alt:''}}/>;
// @ts-expect-error semantic heading excludes h1
<Card headingLevel={1}/>;
// @ts-expect-error controlled expansion requires callback
<Breadcrumb ancestors={[]} expanded/>;
// @ts-expect-error page entry needs an explicit GET fallback
<Pagination currentPage={1} totalPages={8} pageHref={n=>`?page=${n}`} pageJump/>;
// @ts-expect-error navigation is not a tablist
<Pagination currentPage={1} totalPages={8} pageHref={n=>`?page=${n}`} role="tablist"/>;
// @ts-expect-error current location belongs to the component
<Breadcrumb ancestors={[{id:'home',label:'Home',href:'/',linkAttributes:{'aria-current':'page'}}]}/>;

import {CodeBlock} from '../src/index.js';
const codeBlock = <CodeBlock label="React" code="const n = 1;" copyable labels={{success: n => `Copied ${n}`}} onCopy={code => code.toUpperCase()} />;
// @ts-expect-error Plain text is the only code source; no arbitrary JSX.
const invalidCodeBlock = <CodeBlock label="React" code={<b>code</b>}/>;
// @ts-expect-error Required visible context label.
const unlabelledCodeBlock = <CodeBlock code="text"/>;
// @ts-expect-error Semantics are component-owned.
const roleCodeBlock = <CodeBlock label="CSS" code="" role="button"/>;


import {SideMenu,ResponsiveSideMenu} from '../src/index.js';
<SideMenu aria-label="Primary" items={[{id:'one',label:'One',href:'/one'}]} ref={createRef<HTMLElement>()}/>;
<SideMenu aria-label="Section" headingLevel={3} items={[{id:'group',label:'Group',expandable:true,items:[{id:'one',label:'One',href:'/one'}]}]}/>;
<ResponsiveSideMenu label="Primary" open={false} onOpenChange={()=>{}} items={[{id:'one',label:'One',href:'/one'}]}/>;
// @ts-expect-error explicit mobile ownership required
<ResponsiveSideMenu label="Primary" items={[{id:'one',label:'One',href:'/one'}]}/>;
// @ts-expect-error groups cannot both navigate and disclose
<SideMenu aria-label="Primary" items={[{id:'group',label:'Group',href:'/group',items:[{id:'one',label:'One',href:'/one'}]}]}/>;
// @ts-expect-error controlled group expansion requires callback
<SideMenu aria-label="Primary" expandedIds={[]} items={[{id:'one',label:'One',href:'/one'}]}/>;
// @ts-expect-error no ARIA menu override
<SideMenu aria-label="Primary" items={[{id:'one',label:'One',href:'/one'}]} role="menu"/>;

<ResponsiveSideMenu label="Primary" headingLevel={3} inlineHeadingLevel={2} mobilePresentation="inline" open={false} onOpenChange={()=>{}} items={[{id:'one',label:'One',href:'/one'}]}/>;
// @ts-expect-error no heading level remains below h6 for nested menu sections
<ResponsiveSideMenu label="Primary" inlineHeadingLevel={6} mobilePresentation="inline" open={false} onOpenChange={()=>{}} items={[{id:'one',label:'One',href:'/one'}]}/>;

<ResponsiveSideMenu label="Primary" drawerTriggerContainer={null} open={false} onOpenChange={()=>{}} items={[{id:'one',label:'One',href:'/one'}]}/>;
// @ts-expect-error a trigger host is a DOM element, not a selector or raw ID
<ResponsiveSideMenu label="Primary" drawerTriggerContainer="#header" open={false} onOpenChange={()=>{}} items={[{id:'one',label:'One',href:'/one'}]}/>;

<SideMenu items={[{id:'home',label:'Home',href:'/'}]}/>;
<ResponsiveSideMenu label="Documentation" aria-label="Main navigation" open={false} onOpenChange={()=>{}} items={[{id:'home',label:'Home',href:'/'}]}/>;
// @ts-expect-error Navigation aria-label must be text.
<SideMenu aria-label={42} items={[{id:'home',label:'Home',href:'/'}]}/>;
// @ts-expect-error Responsive drawer still needs its visible title.
<ResponsiveSideMenu open={false} onOpenChange={()=>{}} items={[{id:'home',label:'Home',href:'/'}]}/>;

import {Table} from '../src/index.js';
<Table caption="Plan comparison" ref={React.createRef<HTMLTableElement>()}><tbody><tr><th scope="row">Plan</th><td>Starter</td></tr></tbody></Table>;
<Table caption="Plans" captionVisibility="visually-hidden" scrollLabel={c=>`Scroll ${c}`}><tbody/></Table>;
// @ts-expect-error caption is mandatory
<Table><tbody/></Table>;
// @ts-expect-error native table semantics cannot become a grid
<Table caption="Plans" role="grid"><tbody/></Table>;
// @ts-expect-error no widget tab stop on the table
<Table caption="Plans" tabIndex={0}><tbody/></Table>;
// @ts-expect-error caption name is component-owned
<Table caption="Plans" aria-label="Other"><tbody/></Table>;
