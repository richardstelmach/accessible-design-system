'use client';

import { forwardRef, useId, useRef } from 'react';
import type { DateInputProps, DateInputValue, DatePart } from '../types.js';
import { classes, describedBy, oneOf, text } from '../internal/validation.js';
import { rejectProps, useUnavailable } from '../internal/forms.js';
import { getDateInputIds } from '../internal/date.js';

const parts = ['day', 'month', 'year'] as const;
const empty: DateInputValue = { day: '', month: '', year: '' };

function checkValue(value: DateInputValue) {
  if (!value || parts.some(part => typeof value[part] !== 'string')) {
    throw new Error('OwlA11y: date values must contain raw day, month and year strings.');
  }
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(function DateInput({
  id, legend, name, helperText, required = true, optionalLabel = '(optional)',
  value, defaultValue, onValueChange, readOnly, disabled, purpose = 'date',
  error, errorAssociation = 'group', invalidParts, labels, partNames, className,
  'aria-describedby': externalDescription, ...props
}, ref) {
  const generated = useId();
  const ids = getDateInputIds(id ?? `owla11y-${generated}`);
  const unavailable = useUnavailable(disabled, readOnly);
  const inputs = useRef<Partial<Record<DatePart, HTMLInputElement>>>({});
  const controlled = value !== undefined;
  const initialControlled = useRef(controlled);
  if (controlled !== initialControlled.current) throw new Error('OwlA11y: DateInput must not switch value ownership after mount.');
  if (controlled && defaultValue !== undefined) throw new Error('OwlA11y: value and defaultValue are mutually exclusive.');
  if (controlled && !readOnly && !onValueChange) throw new Error('OwlA11y: a controlled DateInput requires onValueChange or readOnly.');
  checkValue(value ?? defaultValue ?? empty);
  text(legend, 'DateInput legend'); text(name, 'DateInput name');
  if (!required) text(optionalLabel, 'optionalLabel');
  oneOf(purpose, ['date', 'date-of-birth'], 'purpose');
  oneOf(errorAssociation, ['group', 'children'], 'errorAssociation');
  rejectProps(props, ['children', 'onChange', 'onInput', 'onReset', 'role', 'tabIndex', 'aria-invalid', 'aria-label', 'aria-labelledby'], 'DateInput');
  if (error) text(error.message, 'DateInput error message');
  if (errorAssociation === 'children') {
    if (!error || !invalidParts?.length) throw new Error('OwlA11y: children errors require an error and at least one invalid part.');
    for (const part of invalidParts) oneOf(part, parts, 'invalidParts');
  } else if (invalidParts !== undefined) throw new Error('OwlA11y: invalidParts belongs only to children-associated errors.');
  const names = partNames ?? { day: `${name}-day`, month: `${name}-month`, year: `${name}-year` };
  for (const part of parts) { text(names[part], 'DateInput part name'); text(labels?.[part] ?? part[0].toUpperCase() + part.slice(1), 'DateInput part label'); }
  if (new Set(Object.values(names)).size !== 3) throw new Error('OwlA11y: date part names must be distinct.');
  const helperId = helperText?.trim() ? `${ids.group}-helper` : undefined;
  const errorId = error ? error.id ?? `${ids.group}-error` : undefined;
  if (errorId) text(errorId, 'DateInput error id');
  if (errorAssociation === 'children' && externalDescription?.split(/\s+/).includes(errorId!)) {
    throw new Error('OwlA11y: a child error must not also describe the DateInput group.');
  }
  return <fieldset {...props} id={ids.group} disabled={disabled}
    className={classes('owla11y-fieldset', 'owla11y-date-input', className)}
    aria-describedby={describedBy(externalDescription, helperId, !unavailable && errorAssociation === 'group' ? errorId : undefined)}>
    <legend className="owla11y-legend" data-style="default">{legend}{!required && ` ${optionalLabel}`}</legend>
    {helperId && <div className="owla11y-helper" id={helperId}>{helperText}</div>}
    {error && !unavailable && <div className="owla11y-error" id={errorId}>{error.message}</div>}
    <div className="owla11y-date-fields">
      {parts.map(part => <div key={part} className="owla11y-field owla11y-date-part">
        <label className="owla11y-label" htmlFor={ids[part]}>{labels?.[part] ?? part[0].toUpperCase() + part.slice(1)}</label>
        <input id={ids[part]} name={names[part]} form={props.form} type="text" inputMode="numeric"
          autoComplete={purpose === 'date-of-birth' ? `bday-${part}` : undefined}
          required={required} readOnly={readOnly} className="owla11y-input" data-width={part === 'year' ? '4ch' : '2ch'}
          value={controlled ? value[part] : undefined} defaultValue={controlled ? undefined : (defaultValue ?? empty)[part]}
          aria-invalid={!unavailable && errorAssociation === 'children' && invalidParts?.includes(part) ? true : undefined}
          aria-describedby={!unavailable && errorAssociation === 'children' && invalidParts?.includes(part) ? errorId : undefined}
          ref={node => {
            if (node) inputs.current[part] = node; else delete inputs.current[part];
            if (part === 'day') { if (typeof ref === 'function') ref(node); else if (ref) ref.current = node; }
          }}
          onChange={() => onValueChange?.({ day: inputs.current.day!.value, month: inputs.current.month!.value, year: inputs.current.year!.value }, { part })} />
      </div>)}
    </div>
  </fieldset>;
});
