import React, { useState } from 'react';
import { Alert, Badge, Button, Checkbox, Select } from '@owla11y/react';
import type { AlertProps, AlertState, BadgeTone } from '@owla11y/react';
const states: AlertState[]=['success','info','warning','error'];
const tones: BadgeTone[]=['neutral','info','success','warning','error'];
export function FeedbackPreview(){
  const [heading,setHeading]=useState<AlertProps['headingLevel']>('none');const [long,setLong]=useState(false);const [rtl,setRtl]=useState(false);
  const [priority,setPriority]=useState<'polite'|'assertive'>('polite');const [event,setEvent]=useState(0);
  const title=long?'ApplicationReference'.repeat(9):'Important information';
  return <main className="owla11y-preview" dir={rtl?'rtl':'ltr'} style={{maxWidth:'64rem',margin:'2rem auto',padding:'1rem'}}>
    <h1>OwlA11y Alert and Badge</h1><p>Contextual feedback and status labels. These messages have no actions, dismissal or automatic expiry.</p>
    <div style={{display:'grid',gap:'1rem'}}>
      <Select label="Alert title semantics" name="heading" value={String(heading)} onChange={e=>setHeading(e.target.value&&e.target.value!=='none'?Number(e.target.value) as 2|3|4|5|6:'none')}>
        <option value="">Choose title semantics</option><option value="none">Paragraph (default)</option>{[2,3,4,5,6].map(n=><option key={n} value={String(n)}>Heading {n}</option>)}
      </Select>
      <Checkbox label="Long text" name="long" value="yes" checked={long} onChange={e=>setLong(e.target.checked)}/>
      <Checkbox label="Right to left" name="rtl" value="yes" checked={rtl} onChange={e=>setRtl(e.target.checked)}/>
    </div>
    <h2>Alert states</h2><p>Titles are paragraphs by default. Choose a heading only when it fits the surrounding page structure.</p>
    <div id="alert-examples" style={{display:'grid',gap:'1rem'}}>{states.flatMap(state=>[false,true].map(description=><Alert key={`${state}-${description}`} data-testid={`alert-${state}-${description}`} state={state} headingLevel={heading} titleText={title} descriptionText={description?'Supporting information about this alert.':undefined}/>))}</div>
    <h2>Badge tones</h2><p>Application statuses use visible text. Tone adds no hidden status wording.</p>
    <div id="badge-examples" style={{display:'flex',flexWrap:'wrap',alignItems:'flex-start',gap:'1rem'}}>{tones.map(tone=><Badge key={tone} data-testid={`badge-${tone}`} tone={tone} label={long?'AwaitingApplicationReview'.repeat(9):'Status'}/>)}</div>
    <p id="constrained-badge" style={{maxWidth:'10rem'}}>Application: <Badge label="Awaiting additional application information"/></p>
    <h2>One announcement owner</h2><p>This example keeps an empty announcement region mounted before publishing a new result. The Alert inside uses its default static semantics.</p>
    <Select label="Update priority" name="priority" value={priority} onChange={e=>{setPriority(e.target.value==='assertive'?'assertive':'polite');setEvent(0);}}>
      <option value="">Choose priority</option><option value="polite">Polite</option><option value="assertive">Assertive (urgent only)</option>
    </Select>
    <p><Button id="update-feedback" onClick={()=>setEvent(n=>n+1)}>Publish result</Button></p>
    <div id="feedback-polite" role="status">{priority==='polite'&&event>0&&<Alert state="success" titleText={`Application update ${event} was saved`} descriptionText="Your answers remain available in the application."/>}</div>
    <div id="feedback-assertive" role="alert">{priority==='assertive'&&event>0&&<Alert state="warning" titleText={`Connection warning ${event}`} descriptionText="Unsaved changes are at risk. Stay on this page."/>}</div>
    <p><Button id="after-feedback">After feedback</Button></p>
  </main>;
}
