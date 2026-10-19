import React, { StrictMode, useState } from 'react';
import { Button, Checkbox, Link, Select, Tabs, TextInput } from '@owla11y/react';
import type { TabsItem } from '@owla11y/react';

function PanelCounter() {
  const [count, setCount] = useState(0);
  return <><p>Saved changes: {count}</p><Button onClick={() => setCount(count + 1)}>Add saved change</Button></>;
}
export function TabsPreview() { return <StrictMode><TabsExamples/></StrictMode>; }
function TabsExamples() {
  const [activation, setActivation] = useState<'automatic' | 'manual'>('automatic');
  const [narrow, setNarrow] = useState(false);
  const [long, setLong] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [selected, setSelected] = useState('history');
  const [accept, setAccept] = useState(true);
  const [request, setRequest] = useState('None');
  const items: TabsItem[] = [
    { id:'details', label:long ? 'Details about your account and contact information' : 'Details', heading:'Details', content:<><p>Manage optional profile information. Tab changes preserve entered values.</p><TextInput label="Preferred display name" name="tabs-display-name" requirement="optional" defaultValue="Ada Lovelace"/><p><Link href="#after-primary">Continue after the example</Link></p></> },
    { id:'history', label:long ? 'History of recent account updates and saved changes' : 'History', heading:'History', content:<PanelCounter/> },
    { id:'help', label:long ? 'Help with managing your profile and understanding this account' : 'Help', heading:'Help', content:<p>Contact your service team if you need help with your account.</p> },
  ];
  return <main className="owla11y-preview" style={{ maxWidth:'52rem', padding:'1rem', margin:'2rem auto', overflowWrap:'anywhere' }}>
    <h1>OwlA11y tabs</h1>
    <p>Use the arrow keys to move between tabs. On small screens or in a container that cannot fit the full row, all sections appear below ordinary contents links.</p>
    <div style={{ display:'grid', gap:'var(--form-field-gap-controlToNextField)', marginBlock:'1.5rem' }}>
      <Select label="Keyboard activation" name="tabs-activation" value={activation} onChange={event => setActivation(event.target.value === 'manual' ? 'manual' : 'automatic')}>
        <option value="">Use default (Automatic)</option><option value="automatic">Automatic</option><option value="manual">Manual</option>
      </Select>
      <Checkbox label="Use a narrow embedded container" name="tabs-narrow" value="yes" checked={narrow} onChange={event => setNarrow(event.target.checked)}/>
      <Checkbox label="Use long labels" name="tabs-long-labels" value="yes" checked={long} onChange={event => setLong(event.target.checked)}/>
      <Checkbox label="Use right-to-left content" name="tabs-rtl" value="yes" checked={rtl} onChange={event => setRtl(event.target.checked)}/>
    </div>
    <h2 id="profile-tabs-heading">Profile information</h2>
    <Button id="before-primary" onClick={() => {}}>Before profile information</Button>
    <div data-testid="tabs-container" dir={rtl ? 'rtl' : 'ltr'} style={{ maxWidth:narrow ? '14rem' : '100%', marginBlock:'1rem' }}>
      <Tabs id="profile-tabs" labelledBy="profile-tabs-heading" items={items} activation={activation}/>
    </div>
    <Button id="after-primary" onClick={() => {}}>After profile information</Button>
    <h2 id="controlled-tabs-heading">Controlled selection</h2>
    <p>History is selected initially. The application decides whether to accept selection requests.</p>
    <Checkbox label="Accept selection requests" name="tabs-accept" value="yes" checked={accept} onChange={event => setAccept(event.target.checked)}/>
    <p role="status">Last requested section: {request}</p>
    <Tabs id="controlled-tabs" labelledBy="controlled-tabs-heading" items={[
      { id:'details',label:'Details',heading:'Details',content:<p>Current account details.</p> },
      { id:'history',label:'History',heading:'History',content:<p>Earlier account activity.</p> },
      { id:'help',label:'Help',heading:'Help',content:<p>Support information.</p> },
    ]} selectedId={selected} onSelectedChange={next => { setRequest(next); if (accept) setSelected(next); }} activation="manual"/>
  </main>;
}
