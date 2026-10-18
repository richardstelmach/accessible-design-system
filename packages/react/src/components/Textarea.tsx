'use client';

import { forwardRef } from 'react';
import type { TextareaProps } from '../types.js';
import { classes } from '../internal/validation.js';
import { FieldHeader, rejectProps, useField, valueOwnership } from '../internal/forms.js';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({
  label, name, id, helperText, error, errorDescribedBy, requirement = 'required',
  optionalLabel = '(optional)', rows = 5, wrap = 'soft', className,
  'aria-describedby': externalDescription, 'aria-invalid': externalInvalid, ...props
}, ref) {
  const field = useField({ id, label, name, helperText, error, errorDescribedBy,
    requirement, optionalLabel, disabled: props.disabled, readOnly: props.readOnly,
    externalDescription, externalInvalid });
  rejectProps(props, ['placeholder', 'aria-label', 'aria-labelledby', 'children', 'required', 'role'], 'Textarea');
  valueOwnership(props);
  if (!Number.isSafeInteger(rows) || rows < 1) throw new Error('OwlA11y: rows must be a positive integer.');
  return <div className={classes('owla11y-field', className)}>
    <FieldHeader field={field} label={label} helperText={helperText} error={error}
      optional={requirement === 'optional'} optionalLabel={optionalLabel} />
    <textarea {...props} ref={ref} id={field.controlId} name={name} rows={rows} wrap={wrap}
      required={requirement === 'required'} aria-describedby={field.description}
      aria-invalid={field.invalid} className="owla11y-input owla11y-textarea" />
  </div>;
});
