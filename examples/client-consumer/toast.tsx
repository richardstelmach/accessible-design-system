import React, { useRef, useState } from 'react';
import { Button, Checkbox, Dialog, Select, TextInput, ToastProvider, ToastRegion, ToastNotificationsButton, useToast } from '@owla11y/react';
import type { ToastState } from '@owla11y/react';

function Workspace() {
  const { add } = useToast(); const sequence = useRef(0);
  const [state, setState] = useState<ToastState>('success');
  const [description, setDescription] = useState(true); const [urgent, setUrgent] = useState(false);
  const [rtl, setRtl] = useState(false); const [modal, setModal] = useState(false); const [route, setRoute] = useState(false);
  const send = (selected: ToastState = state, long = false, details = description) => {
    const titles = { success:'Your changes were saved', info:'Your download is ready', warning:'Your connection is unstable', error:'We could not upload the file' };
    const descriptions = { success:'Your new settings are now active.', info:'Find the file in your downloads.', warning:'Your changes are still on this device.', error:'Try again from the upload panel.' };
    const title = long ? 'LongNotificationReference'.repeat(12) : titles[selected];
    add({ id:`event-${++sequence.current}`, state:selected, titleText:title,
      descriptionText:details ? descriptions[selected] : undefined,
      dismissLabel:`Dismiss notification: ${title}`, announcement:urgent ? 'assertive' : 'polite' });
  };
  return <main className="owla11y-preview" dir={rtl?'rtl':'ltr'} style={{maxWidth:'48rem',margin:'2rem auto',padding:'1rem'}}>
    <h1>OwlA11y Toast</h1><p>Persistent event feedback. Messages stay until dismissed; important outcomes also belong in the task UI.</p>
    <div style={{display:'grid',gap:'1rem'}}>
      <Select label="Visual state" name="state" value={state} onChange={event=>setState((event.target.value || 'success') as ToastState)}>
        <option value="">Choose a visual state</option><option value="success">Success</option><option value="info">Information</option><option value="warning">Warning</option><option value="error">Error</option>
      </Select>
      <Checkbox label="Include description" name="description" value="yes" checked={description} onChange={event=>setDescription(event.target.checked)}/>
      <Checkbox label="Assertive announcement (urgent events only)" name="urgent" value="yes" checked={urgent} onChange={event=>setUrgent(event.target.checked)}/>
      <Checkbox label="Right to left" name="rtl" value="yes" checked={rtl} onChange={event=>setRtl(event.target.checked)}/>
      <div style={{display:'flex',flexWrap:'wrap',gap:'1rem'}}>
        <Button onClick={()=>send()}>Send notification</Button>
        <Button onClick={()=>{send();send();send();}}>Send burst</Button>
        <Button onClick={()=>states.forEach((item)=>{send(item,false,false);send(item,false,true);})}>Show eight variants</Button>
        <Button onClick={()=>send(state,true)}>Send long text</Button>
        <Button onClick={()=>setModal(true)}>Open modal</Button>
        <Button onClick={()=>setRoute(!route)}>Change view</Button>
      </div>
      {route ? <p>Another view. The notification host remains mounted.</p> : <TextInput label="Task notes" name="notes" helperText="Arrival leaves your focus here."/>}
      <ToastNotificationsButton/>
      <ToastRegion/>
      <Button id="after-notifications">After notifications</Button>
    </div>
    <Dialog title="Modal task" open={modal} onOpenChange={setModal} actions={<Button onClick={()=>setModal(false)}>Finish modal task</Button>}>
      <p>Notifications created here wait for this modal to close. Put immediate feedback in the modal itself.</p>
      <Button onClick={()=>send()}>Queue notification</Button>
    </Dialog>
  </main>;
}
const states: ToastState[]=['success','info','warning','error'];
export function ToastPreview() { return <ToastProvider><Workspace/></ToastProvider>; }
