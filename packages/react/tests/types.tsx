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
