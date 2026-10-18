'use client';

import { forwardRef, useCallback, useEffect, useId, useRef } from 'react';
import type { CheckboxProps, RadioProps } from '../types.js';
import { classes, describedBy, text } from '../internal/validation.js';
import { rejectProps, useUnavailable } from '../internal/forms.js';

function checkOwnership(props: { checked?: boolean; defaultChecked?: boolean; onChange?: unknown }) {
  if (props.checked !== undefined && props.defaultChecked !== undefined) throw new Error('OwlA11y: checked and defaultChecked are mutually exclusive.');
  if (props.checked !== undefined && !props.onChange) throw new Error('OwlA11y: a controlled choice requires onChange.');
}

type ChoiceProps = CheckboxProps & { kind: 'checkbox' | 'radio' };
const Choice = forwardRef<HTMLInputElement, ChoiceProps>(function Choice({ kind, label, name, value, id, description, error, indeterminate = false,
  className, 'aria-describedby': externalDescription, 'aria-invalid': externalInvalid, ...props
}, ref) {
  const generated = useId();
  const unavailable = useUnavailable(props.disabled);
  const controlId = id ?? `owla11y-${generated}`;
  const input = useRef<HTMLInputElement | null>(null);
  const setRef = useCallback((node: HTMLInputElement | null) => {
    input.current = node;
    if (node) node.indeterminate = indeterminate;
    if (typeof ref === 'function') ref(node); else if (ref) ref.current = node;
  }, [ref, indeterminate]);
  useEffect(() => { if (input.current) input.current.indeterminate = indeterminate; }, [indeterminate]);
  text(controlId, 'Choice id'); text(label, 'Choice label'); text(name, 'Choice name'); text(value, 'Choice value');
  rejectProps(props, ['readOnly', 'role', 'aria-checked', 'aria-label', 'aria-labelledby', 'type', 'children'], kind);
  checkOwnership(props);
  if (error) text(error.message, 'Checkbox error message');
  const descriptionId = description?.trim() ? `${controlId}-description` : undefined;
  const errorId = error ? error.id ?? `${controlId}-error` : undefined;
  if (errorId) text(errorId, 'Checkbox error id');
  return <div className={classes('owla11y-choice', className)}>
    <div className="owla11y-choice-row">
      <input {...props} ref={setRef} id={controlId} type={kind} name={name} value={value}
        className={`owla11y-choice-control owla11y-${kind}`}
        aria-invalid={kind === 'checkbox' && !unavailable ? error ? true : externalInvalid : undefined}
        aria-describedby={describedBy(externalDescription, descriptionId, unavailable ? undefined : errorId)} />
      <div className="owla11y-choice-content">
        <label className="owla11y-label" htmlFor={controlId}>{label}</label>
        {descriptionId && <div className="owla11y-helper" id={descriptionId}>{description}</div>}
      </div>
    </div>
    {error && !unavailable && <div className="owla11y-error" id={errorId}>{error.message}</div>}
  </div>;
});

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  return <Choice {...props} kind="checkbox" ref={ref} />;
});
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(props, ref) {
  rejectProps(props, ['error', 'indeterminate', 'aria-invalid'], 'Radio');
  return <Choice {...props} kind="radio" ref={ref} />;
});
