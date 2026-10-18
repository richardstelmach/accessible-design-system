import React, { useState } from 'react';
import { Button, Checkbox, Fieldset, Radio, Select, Textarea } from '@owla11y/react';

const countries = <><option value="">Select a country</option><optgroup label="Countries">
  <option value="gb">United Kingdom</option><option value="ie">Ireland</option>
  <option value="long">A deliberately long country name to verify space for the dropdown indicator</option>
</optgroup></>;

export function Forms() {
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState('');
  return <main style={{ maxWidth: '40rem', margin: '2rem auto', padding: '1rem', fontFamily: 'Inter, sans-serif', overflowWrap: 'anywhere' }}>
    <h1>OwlA11y form components</h1>
    <p>Development comparison for Textarea, Select, Fieldset, Checkbox and Radio. Use the keyboard to inspect focus and native interaction.</p>
    <style>{`.forms-stack { display:grid; gap:var(--form-field-gap-controlToNextField); }`}</style>
    <form className="forms-stack" data-testid="forms" onSubmit={event => {
      event.preventDefault(); setSaved(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
    }} onReset={() => { setNotes(''); setSaved(''); }}>
      <Textarea label="What happened?" name="notes" helperText="Include dates and relevant details."
        value={notes} onChange={event => setNotes(event.target.value)} />
      <Select label="Country" name="country" helperText="Where do you currently live?">{countries}</Select>
      <Fieldset legend="How should we contact you?" legendStyle="compact" helperText="Choose one contact method.">
        <Radio label="Email" name="contact" value="email" required description="We will send a message to your inbox." />
        <Radio label="Telephone" name="contact" value="phone" required />
      </Fieldset>
      <Fieldset legend="Which updates would you like? (optional)" legendStyle="compact">
        <Checkbox label="Product news" name="news" value="yes" defaultChecked />
        <Checkbox label="Research invitations" name="research" value="yes" description="Occasional opportunities to share your experience." />
      </Fieldset>
      <Checkbox label="I agree to the terms" name="terms" value="accepted" required />
      <div><Button type="submit" variant="primary">Save answers</Button>{' '}<Button type="reset">Reset answers</Button></div>
      <output aria-live="polite">{saved}</output>
    </form>
    <h2>States and shared errors</h2>
    <div className="forms-stack">
      <Textarea label="Additional information" name="additional" requirement="optional" defaultValue={'First line\nSecond line'} />
      <Textarea label="Explanation" name="explanation" helperText="Include the missing details."
        error={{ message: 'Error: Explain what happened.' }} />
      <Textarea label="Read-only notes" name="readonly" readOnly defaultValue="Saved answer" />
      <Select label="Preferred country" name="preferred" requirement="optional" error={{ message: 'Error: Choose a country.' }}>{countries}</Select>
      <Fieldset legend="Shared group question" legendStyle="compact" helperText="Choose at least one."
        error={{ message: 'Error: Select a preference.' }}>
        <Checkbox label="Preference one" name="preferences" value="one" />
        <Checkbox label="Preference two" name="preferences" value="two" />
      </Fieldset>
      <Fieldset legend="Delivery details" legendStyle="compact" helperText="Use the address where you receive parcels."
        errorAssociation="children" error={{ id: 'delivery-error', message: 'Error: Explain how to find the address.' }}>
        <Textarea label="Directions" name="directions" helperText="Mention nearby landmarks." errorDescribedBy="delivery-error" />
        <Select label="Delivery country" name="delivery-country">{countries}</Select>
      </Fieldset>
      <Checkbox label="All topics" name="all-topics" value="all" indeterminate description="Partially selected aggregate; checkedness still controls submission." />
      <Checkbox label="Individually invalid choice" name="invalid-choice" value="yes" defaultChecked
        error={{ message: 'Error: This option is unavailable for your account.' }} />
      <Fieldset legend="Unavailable controls" legendStyle="compact" disabled>
        <Textarea label="Unavailable notes" name="disabled-notes" defaultValue="Saved notes" />
        <Select label="Unavailable country" name="disabled-country" defaultValue="gb">{countries}</Select>
        <Checkbox label="Unavailable checked choice" name="disabled-choice" value="yes" defaultChecked />
        <Radio label="Unavailable selected radio" name="disabled-radio" value="yes" defaultChecked />
      </Fieldset>
      <Fieldset legend="A long grouped question that must wrap naturally at narrow widths without clipping or hiding any part of the question" headingLevel="h3">
        <Checkbox label="A long option label that wraps as ordinary text and remains a complete accessible name (optional)" name="long-option" value="yes"
          description="A longer explanation for this particular answer that must remain separate from the accessible name and wrap within the available width." />
      </Fieldset>
    </div>
  </main>;
}
