'use client';
import { forwardRef, useId } from 'react';
import type { TextInputProps } from '../types.js';
import { classes,describedBy,text,oneOf } from '../internal/validation.js';
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput({label,name,id,helperText,error,errorDescribedBy,requirement='required',optionalLabel='(optional)',width='full',type='text',className,'aria-describedby':externalDescription,'aria-invalid':externalInvalid,...props},ref) {
 const generatedId=useId(); const controlId=id ?? `owla11y-${generatedId}`;
 for (const key of ['placeholder','aria-label','aria-labelledby']) if (key in props) throw new Error(`OwlA11y: TextInput does not support ${key}; use its visible label and helper text.`);
 oneOf(width,['full','2ch','3ch','4ch','5ch','10ch','20ch'],'width');
 text(label,'TextInput label'); text(name,'TextInput name'); text(controlId,'TextInput id');
 oneOf(requirement,['required','optional'],'requirement'); oneOf(type,['text','email','tel','url','password','search'],'input type');
 if (error) text(error.message,'TextInput error message');
 if (error && errorDescribedBy) throw new Error('OwlA11y: use an individual error or a shared error, not both.');
 if (props.value !== undefined && props.defaultValue !== undefined) throw new Error('OwlA11y: value and defaultValue are mutually exclusive.');
 if (props.value !== undefined && !props.readOnly && !props.onChange) throw new Error('OwlA11y: a controlled input requires onChange or readOnly.');
 if (requirement==='optional') text(optionalLabel,'optionalLabel');
 const helperId=helperText?.trim() ? `${controlId}-helper` : undefined;
 const errorId=error ? error.id ?? `${controlId}-error` : undefined;
 if(errorId) text(errorId,'TextInput error id');
 const inactive=props.disabled || props.readOnly;
 const invalid=inactive ? undefined : error || errorDescribedBy ? true : externalInvalid;
 return <div className={classes('owla11y-field',className)}>
  <label className="owla11y-label" htmlFor={controlId}>{label}{requirement==='optional' && <>{' '}<span className="owla11y-optional">{optionalLabel}</span></>}</label>
  {helperId && <div className="owla11y-helper" id={helperId}>{helperText}</div>}
  {error && !inactive && <div className="owla11y-error" id={errorId}>{error.message}</div>}
  <input {...props} id={controlId} name={name} type={type} ref={ref} required={requirement==='required'} aria-invalid={invalid} aria-describedby={describedBy(externalDescription,helperId,inactive ? undefined : errorId,inactive ? undefined : errorDescribedBy)} className="owla11y-input" data-width={width} />
 </div>;
});
