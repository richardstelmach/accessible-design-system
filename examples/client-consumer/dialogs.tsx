import React, { StrictMode, useRef, useState } from 'react';
import { Button, Dialog, Fieldset, Radio, TextInput } from '@owla11y/react';
import type { DialogProps } from '@owla11y/react';

export function Dialogs() {
  return <StrictMode><DialogExamples/></StrictMode>;
}
function DialogExamples() {
  const [mode, setMode] = useState<string | null>(null);
  const [size, setSize] = useState<NonNullable<DialogProps['size']>>('medium');
  const [presentation, setPresentation] = useState<NonNullable<DialogProps['presentation']>>('inset');
  const [reason, setReason] = useState('None');
  const [extra, setExtra] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [acceptDismissal, setAcceptDismissal] = useState(true);
  const fallback = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => { setReason('action'); setMode(null); };
  return <main className="owla11y-preview" style={{ maxWidth:'40rem', padding:'1rem', margin:'2rem auto', overflowWrap:'anywhere' }}>
    <h1>OwlA11y dialogs</h1>
    <p>Native modal examples. Content is preserved when closed; Escape and backdrop dismissal never save changes.</p>
    <p><label>Dialog size <select value={size} onChange={e => setSize(e.target.value as typeof size)}><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></label></p>
    <p><label>Mobile presentation <select value={presentation} onChange={e => setPresentation(e.target.value as typeof presentation)}><option value="inset">Inset</option><option value="fullscreen">Full screen</option></select></label></p>
    <p><label><input type="checkbox" checked={acceptDismissal} onChange={e => setAcceptDismissal(e.target.checked)}/>Accept dismissal requests</label></p>
    <div style={{ display:'flex', flexWrap:'wrap', gap:16 }}>
      <Button onClick={() => setMode('edit')}>Edit profile</Button>
      <Button onClick={() => setMode('forced')}>Review decision</Button>
      <Button onClick={() => setMode('long')}>Read long information</Button>
      <Button onClick={() => setMode('unnamed')}>Open labelled dialog</Button>
      <Button onClick={() => setMode('empty')}>Open without controls</Button>
      {!removed && <Button onClick={() => { setMode('remove'); }}>Open then remove trigger</Button>}
      <Button ref={fallback} onClick={() => setRemoved(false)}>Restore trigger</Button>
    </div>
    <p role="status">Last close reason: {reason}</p>
    <div style={{ minHeight:'120vh' }}>Background content for scroll-lock verification.</div>
    <Dialog ref={dialog} open={mode !== null} onOpenChange={(next, detail) => { setReason(detail.reason); if (acceptDismissal) setMode(next ? 'edit' : null); }}
      {...(mode === 'forced' ? { dismissal:'forced-decision' as const, showClose:false as const, actions:<><Button onClick={close}>Keep existing profile</Button><Button variant="primary" onClick={close}>Confirm profile</Button></> } : {
        showClose:mode !== 'empty', actions:mode === 'empty' || mode === 'unnamed' ? undefined : mode === 'long' ? <Button variant="primary" onClick={close}>Close information</Button> : <><Button onClick={close}>Cancel changes</Button><Button variant="primary" form="dialog-profile" type="submit">Save profile</Button></>
      })}
      {...(mode === 'unnamed' || mode === 'empty' ? { accessibleLabel:'About your profile', showTitle:false as const } : { title:mode === 'long' ? 'Important information about updating your profile and keeping your contact details safe' : mode === 'forced' ? 'Choose how to continue' : 'Edit profile' })}
      size={size} presentation={presentation}
      returnFocusRef={removed ? fallback : undefined}>
      {mode === 'forced' ? <p>Choose whether to keep the current details or confirm the update. Neither Escape nor the backdrop makes this decision.</p> : mode === 'long' ? Array.from({ length:30 }, (_, i) => <p key={i}>Profile information {i + 1}. Keep your contact details up to date so that you receive important messages. This content scrolls within the dialog.</p>) : mode === 'empty' ? <p>There are no controls. Escape or the backdrop can dismiss this information.</p> : <form id="dialog-profile" method="dialog" onSubmit={() => {}} style={{ display:'grid', gap:24 }}>
        <TextInput name="dialog-name" label="Display name" defaultValue="Ada Lovelace"/>
        <Fieldset legend="Preferred contact" legendStyle="compact"><Radio label="Email" name="dialog-contact" value="email" defaultChecked/><Radio label="Phone" name="dialog-contact" value="phone"/></Fieldset>
        <fieldset disabled><legend>Unavailable</legend><button type="button">Disabled by fieldset</button></fieldset>
        <button type="button" tabIndex={-2}>Outside the tab order</button>
        <div hidden><button type="button">Hidden control</button></div>
        <Button onClick={() => setExtra(!extra)}>{extra ? 'Remove extra control' : 'Add extra control'}</Button>
        {extra && <Button onClick={() => {}}>Extra control</Button>}
        {mode === 'remove' && <Button onClick={() => setRemoved(true)}>Remove opening trigger</Button>}
      </form>}
    </Dialog>
  </main>;
}
