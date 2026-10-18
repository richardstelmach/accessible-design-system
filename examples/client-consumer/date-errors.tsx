import React, { useState } from 'react';
import { Button, Checkbox, DateInput, ErrorSummary, Fieldset, getDateInputIds, Radio, Select, Textarea, TextInput } from '@owla11y/react';
import type { ErrorSummaryItem, DateInputValue } from '@owla11y/react';
import { validateBirthDate } from './date-validation';
import type { DateValidation } from './date-validation';

export function DateErrors() {
  const [errors, setErrors] = useState<ErrorSummaryItem[]>([]);
  const [dateError, setDateError] = useState<DateValidation>({});
  const [submitKey, setSubmitKey] = useState(0);
  const [result, setResult] = useState('');
  const ids = getDateInputIds('birth-date');
  const fieldError = (id: string) => {
    const item = errors.find(error => error.id === id);
    return item ? { message: item.text } : undefined;
  };
  return <main style={{ maxWidth: '40rem', padding: '1rem', margin: '2rem auto', fontFamily: 'Inter, sans-serif', overflowWrap: 'anywhere' }}>
    <h1>OwlA11y date and error summary</h1>
    <p>Submit an incomplete form to inspect error routing. Answers are preserved; errors update only on explicit submission.</p>
    <style>{`.date-example-stack { display:grid; gap:var(--form-field-gap-controlToNextField); }`}</style>
    <form data-testid="date-form" className="date-example-stack" noValidate onReset={() => {
      setErrors([]); setDateError({}); setResult('');
    }} onSubmit={event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const next: ErrorSummaryItem[] = [];
      const add = (id: string, text: string, targetId: string, contextId?: string) => next.push({ id, text, targetId, contextId });
      const value: DateInputValue = { day: String(data.get('birth-day')), month: String(data.get('birth-month')), year: String(data.get('birth-year')) };
      const date = validateBirthDate(value);
      // Deliberately return the date issue before the earlier Name question.
      if (date.error) {
        const target = date.errorAssociation === 'children' ? ['day', 'month', 'year'].find(part => date.invalidParts.includes(part as 'day' | 'month' | 'year'))! as 'day' | 'month' | 'year' : 'day';
        add('birth-date', date.error.message, ids[target], date.errorAssociation === 'children' ? undefined : ids.group);
      }
      if (!String(data.get('full-name')).trim()) add('full-name', 'Enter your full name.', 'full-name');
      if (!String(data.get('notes')).trim()) add('notes', 'Tell us what happened.', 'case-notes');
      if (!data.get('country')) add('country', 'Select a country.', 'country');
      if (!data.get('contact')) add('contact', 'Choose a contact method.', 'contact-email', 'contact-group');
      if (!data.get('terms')) add('terms', 'Confirm that you agree to the terms.', 'terms');
      setDateError(date); setErrors(next); setSubmitKey(key => key + 1);
      setResult(next.length ? '' : 'Your answers passed this example validation.');
    }}>
      {errors.length > 0 && <ErrorSummary errors={errors} focusRequestKey={submitKey} />}
      <TextInput id="full-name" name="full-name" label="Full name" autoComplete="name" error={fieldError('full-name')} />
      <DateInput id="birth-date" legend="What is your date of birth?" name="birth" purpose="date-of-birth"
        helperText="For example, 31 3 1980." {...dateError} />
      <Textarea id="case-notes" name="notes" label="What happened?" error={fieldError('notes')} />
      <Select id="country" name="country" label="Country" error={fieldError('country')}>
        <option value="">Select a country</option><option value="gb">United Kingdom</option><option value="ie">Ireland</option>
      </Select>
      <Fieldset id="contact-group" legend="How should we contact you?" legendStyle="compact" helperText="Choose one." error={fieldError('contact')}>
        <Radio id="contact-email" name="contact" value="email" label="Email" required />
        <Radio id="contact-phone" name="contact" value="phone" label="Telephone" required />
      </Fieldset>
      <Checkbox id="terms" name="terms" value="yes" label="I agree to the terms" required error={fieldError('terms')} />
      <div><Button type="submit" variant="primary">Submit application</Button>{' '}<Button type="reset">Reset application</Button></div>
      {result && <p role="status">{result}</p>}
    </form>
    <h2>Other date configurations</h2>
    <div className="date-example-stack">
      <DateInput id="optional-date" name="optional-date" legend="Previous date" required={false} />
      <DateInput id="readonly-date" name="readonly-date" legend="Read-only date" readOnly value={{ day: '01', month: '02', year: '2000' }} />
      <DateInput id="disabled-date" name="disabled-date" legend="Unavailable date" disabled defaultValue={{ day: '01', month: '02', year: '2000' }} />
    </div>
  </main>;
}
