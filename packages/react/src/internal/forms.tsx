'use client';

import { createContext, useContext, useId } from 'react';
import type { AriaAttributes } from 'react';
import type { FieldError } from '../types.js';
import { describedBy, oneOf, text } from './validation.js';

// Context carries presentation policy only. Native fieldset still owns disabling.
export const DisabledFieldset = createContext(false);
export const useUnavailable = (disabled?: boolean, readOnly?: boolean) =>
  useContext(DisabledFieldset) || Boolean(disabled || readOnly);

export function rejectProps(props: object, names: string[], component: string) {
  for (const key of names) {
    if (key in props) throw new Error(`OwlA11y: ${component} does not support ${key}.`);
  }
}

export function valueOwnership(props: { value?: unknown; defaultValue?: unknown; onChange?: unknown; readOnly?: boolean }) {
  if (props.value !== undefined && props.defaultValue !== undefined) {
    throw new Error('OwlA11y: value and defaultValue are mutually exclusive.');
  }
  if (props.value !== undefined && !props.onChange && !props.readOnly) {
    throw new Error('OwlA11y: a controlled field requires onChange or readOnly.');
  }
}

export function useField({ id, label, name, helperText, error, errorDescribedBy,
  requirement, optionalLabel, disabled, readOnly, externalDescription, externalInvalid }: {
  id?: string; label: string; name: string; helperText?: string; error?: FieldError;
  errorDescribedBy?: string; requirement: string; optionalLabel: string;
  disabled?: boolean; readOnly?: boolean; externalDescription?: string;
  externalInvalid?: AriaAttributes['aria-invalid'];
}) {
  const generated = useId();
  const unavailable = useUnavailable(disabled, readOnly);
  const controlId = id ?? `owla11y-${generated}`;
  text(controlId, 'Field id'); text(label, 'Field label'); text(name, 'Field name');
  oneOf(requirement, ['required', 'optional'], 'requirement');
  if (requirement === 'optional') text(optionalLabel, 'optionalLabel');
  if (error) text(error.message, 'Field error message');
  if (error && errorDescribedBy) throw new Error('OwlA11y: use an individual error or a shared error, not both.');
  if (errorDescribedBy !== undefined) text(errorDescribedBy, 'Shared error id');
  const helperId = helperText?.trim() ? `${controlId}-helper` : undefined;
  const errorId = error ? error.id ?? `${controlId}-error` : undefined;
  if (errorId) text(errorId, 'Field error id');
  return {
    controlId, helperId, errorId, showError: Boolean(error && !unavailable),
    invalid: unavailable ? undefined : error || errorDescribedBy ? true : externalInvalid,
    description: describedBy(externalDescription, helperId,
      unavailable ? undefined : errorId, unavailable ? undefined : errorDescribedBy),
  };
}

export function FieldHeader({ field, label, helperText, error, optional, optionalLabel, smallMarker = true }: {
  field: ReturnType<typeof useField>; label: string; helperText?: string; error?: FieldError;
  optional: boolean; optionalLabel: string; smallMarker?: boolean;
}) {
  return <>
    <label className="owla11y-label" htmlFor={field.controlId}>
      {label}{optional && <>{' '}<span className={smallMarker ? 'owla11y-optional' : undefined}>{optionalLabel}</span></>}
    </label>
    {field.helperId && <div className="owla11y-helper" id={field.helperId}>{helperText}</div>}
    {field.showError && <div className="owla11y-error" id={field.errorId}>{error!.message}</div>}
  </>;
}
