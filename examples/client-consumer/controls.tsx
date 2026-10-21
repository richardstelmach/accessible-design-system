import React, { useState, useEffect } from 'react';
import { Accordion, Button, Checkbox, ErrorSummary, Fieldset, Select, Stepper, TextInput } from '@owla11y/react';
import type { AccordionProps } from '@owla11y/react';
export function ControlsPreview() {
    const [disabled, setDisabled] = useState(false);
    const [long, setLong] = useState(false);
    const [rtl, setRtl] = useState(false);
    const [titleStyle, setTitleStyle] = useState<AccordionProps['titleStyle']>('h3');
    const [expanded, setExpanded] = useState<readonly string[]>(['details']);
    const [accept, setAccept] = useState(true);
    const [focusRequest, setFocusRequest] = useState(0);
    useEffect(() => {
        if (!focusRequest)
            return;
        const input = document.getElementById('application-reference')!;
        const panel = input.closest('.owla11y-accordion__panel') as HTMLElement;
        const observer = new MutationObserver(() => { if (!panel.hidden) {
            observer.disconnect();
            input.focus();
        } });
        if (!panel.hidden)
            input.focus();
        else
            observer.observe(panel, { attributes: true, attributeFilter: ['hidden'] });
        return () => observer.disconnect();
    }, [focusRequest]);
    const [error, setError] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const [result, setResult] = useState('');
    const title = long ? 'ApplicationInformation'.repeat(9) : 'Application details';
    return <main className="owla11y-preview" dir={rtl ? 'rtl' : 'ltr'} style={{ maxWidth: '64rem', margin: '2rem auto', padding: '1rem' }}>
    <h1>OwlA11y Stepper and Accordion</h1><p>Native quantities and independently expandable sections. Settings use the library components.</p>
    <Select label="Accordion title style" name="title-style" value={titleStyle} onChange={e => setTitleStyle((e.target.value || 'h3') as AccordionProps['titleStyle'])}>
      <option value="">Choose a title style</option>{['h2', 'h3', 'h4', 'h5', 'h6'].map(style => <option key={style} value={style}>{style.toUpperCase()}</option>)}
    </Select>
    <Checkbox label="Disable quantities" name="disabled" value="yes" checked={disabled} onChange={e => setDisabled(e.target.checked)}/>
    <Checkbox label="Long text" name="long" value="yes" checked={long} onChange={e => setLong(e.target.checked)}/>
    <Checkbox label="Right to left" name="rtl" value="yes" checked={rtl} onChange={e => setRtl(e.target.checked)}/>
    <h2>Quantities</h2>
    <form id="quantity-form" noValidate onReset={() => { setError(false); setResult(''); }} onSubmit={e => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem('rooms') as HTMLInputElement;
            if (!input.validity.valid) {
                setError(true);
                setAttempt(n => n + 1);
                setResult('');
                return;
            }
            setError(false);
            setResult(`Requested ${input.value} rooms`);
        }}>
      {error && <ErrorSummary focusRequestKey={attempt} errors={[{ id: 'rooms-error-summary', text: 'Enter a whole number from 1 to 10.', targetId: 'rooms' }]}/>}
      <Stepper id="rooms" label={long ? 'NumberOfRooms'.repeat(8) : 'Number of rooms'} name="rooms" min={1} max={10} step={1} defaultValue="2" incrementLabel="Add a room" decrementLabel="Remove a room" helperText="Choose a whole number from 1 to 10." disabled={disabled} error={error ? { message: 'Error: Enter a whole number from 1 to 10.' } : undefined}/>
      <p><Button type="submit">Request rooms</Button> <Button type="reset">Reset quantities</Button></p>
      <output aria-live="off">{result}</output>
    </form>
    <div style={{ display: 'grid', gap: '1rem', marginBlock: '1rem' }}>
      <Stepper id="fraction" label="Weight" name="weight" min={0} max={1} step={0.1} defaultValue="0.2" incrementLabel="Increase weight" decrementLabel="Decrease weight" disabled={disabled}/>
      <Stepper id="fixed" label="Fixed quantity" name="fixed" min={2} max={2} step={1} defaultValue="2" incrementLabel="Increase fixed quantity" decrementLabel="Decrease fixed quantity"/>
      <Fieldset legend="Unavailable order" legendStyle="compact" disabled><Stepper label="Unavailable quantity" name="unavailable" step={1} defaultValue="1" incrementLabel="Increase unavailable quantity" decrementLabel="Decrease unavailable quantity" error={{ message: 'This error is suppressed.' }}/></Fieldset>
    </div>
    <h2>Independent sections</h2><p>Both sections may be open, or both closed. Inputs stay mounted when their section closes.</p>
    <Checkbox label="Accept expansion requests" name="accept" value="yes" checked={accept} onChange={e => setAccept(e.target.checked)}/>
    <p><Button id="collapse-sections" onClick={() => setExpanded([])}>Collapse sections</Button> <Button id="reveal-reference" onClick={() => { setExpanded(ids => [...new Set([...ids, 'details'])]); setFocusRequest(n => n + 1); }}>Reveal and focus reference</Button></p>
    <Accordion id="application-sections" headingLevel={3} titleStyle={titleStyle} expandedIds={expanded} onExpandedChange={ids => { if (accept)
        setExpanded(ids); }} items={[
            { id: 'details', title, content: <TextInput id="application-reference" label="Application reference" name="reference" defaultValue="Saved reference"/> },
            { id: 'history', title: 'Earlier applications', content: <p>Earlier applications remain available in your account.</p> }
        ]}/>
    <h2>Named panels</h2><Accordion id="named-sections" headingLevel={3} panelLandmark items={[{ id: 'help', title: 'Help with quantities', content: <p>Use the number field or the adjacent buttons.</p> }]}/>
    <p><Button id="after-controls">After examples</Button></p>
  </main>;
}
