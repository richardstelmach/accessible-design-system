'use client';

import { Children, Fragment, forwardRef, isValidElement } from 'react';
import type { ReactNode } from 'react';
import type { SelectProps } from '../types.js';
import { classes, text } from '../internal/validation.js';
import { FieldHeader, rejectProps, useField, valueOwnership } from '../internal/forms.js';

// Keep the public slot native: React controls selected state, never option.selected.
function validateOptions(children: ReactNode) {
  const options: { value: unknown; disabled?: boolean; hidden?: boolean; direct: boolean }[] = [];
  function visit(nodes: ReactNode, inGroup = false) {
    Children.forEach(nodes, child => {
      if (child == null || typeof child === 'boolean') return;
      if (!isValidElement<{ children?: ReactNode; value?: unknown; selected?: boolean; disabled?: boolean; hidden?: boolean }>(child)) {
        throw new Error('OwlA11y: Select children must be option or optgroup elements.');
      }
      if (child.type === Fragment) return visit(child.props.children, inGroup);
      if (child.type === 'optgroup' && !inGroup) {
        text((child.props as { label?: string }).label, 'Select option group label');
        return visit(child.props.children, true);
      }
      if (child.type !== 'option') throw new Error('OwlA11y: Select children must be option or optgroup elements.');
      if ('selected' in child.props) throw new Error('OwlA11y: use Select value/defaultValue instead of option selected.');
      if (typeof child.props.value !== 'string') throw new Error('OwlA11y: every option needs an explicit string value.');
      if (child.props.value !== '') text(child.props.value, 'Select option value');
      const parts = Children.toArray(child.props.children);
      if (!parts.length || parts.some(part => typeof part !== 'string' && typeof part !== 'number')) {
        throw new Error('OwlA11y: option labels must contain plain text.');
      }
      text(parts.join(''), 'Select option text');
      if (options.length && child.props.value === '') throw new Error('OwlA11y: only the first prompt option may have an empty value.');
      options.push({ ...child.props, value: child.props.value, direct: !inGroup });
    });
  }
  visit(children);
  const prompt = options[0];
  if (!prompt?.direct || prompt.value !== '' || prompt.disabled || prompt.hidden) {
    throw new Error('OwlA11y: Select requires a first, enabled, visible option with value="" so users can return to no selection.');
  }
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({
  label, name, id, helperText, error, errorDescribedBy, requirement = 'required',
  optionalLabel = '(optional)', children, className,
  'aria-describedby': externalDescription, 'aria-invalid': externalInvalid, ...props
}, ref) {
  const field = useField({ id, label, name, helperText, error, errorDescribedBy,
    requirement, optionalLabel, disabled: props.disabled, externalDescription, externalInvalid });
  rejectProps(props, ['multiple', 'readOnly', 'placeholder', 'aria-label', 'aria-labelledby', 'required', 'role'], 'Select');
  if (props.size !== undefined && props.size !== 1) throw new Error('OwlA11y: Select supports only size=1.');
  valueOwnership(props);
  if (props.tabIndex !== undefined && props.tabIndex !== 0) throw new Error('OwlA11y: enabled Selects retain their native keyboard tab order.');
  validateOptions(children);
  return <div className={classes('owla11y-field', className)}>
    <FieldHeader field={field} label={label} helperText={helperText} error={error}
      optional={requirement === 'optional'} optionalLabel={optionalLabel} smallMarker={false} />
    <div className="owla11y-select-wrap">
      <select {...props} ref={ref} id={field.controlId} name={name}
        defaultValue={props.value === undefined ? props.defaultValue ?? '' : undefined}
        required={requirement === 'required'} aria-describedby={field.description}
        aria-invalid={field.invalid} className="owla11y-input owla11y-select">{children}</select>
      <svg className="owla11y-select-indicator" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path transform="translate(3.125 6.25)" d="M 13.568 1.068 L 7.318 7.318 C 7.259 7.376 7.191 7.422 7.115 7.453 C 7.039 7.485 6.957 7.501 6.875 7.501 C 6.793 7.501 6.712 7.485 6.636 7.453 C 6.56 7.422 6.491 7.376 6.433 7.318 L 0.183 1.068 C 0.066 0.95 0 0.791 0 0.625 C 0 0.459 0.066 0.3 0.183 0.183 C 0.3 0.066 0.459 0 0.625 0 C 0.791 0 0.95 0.066 1.068 0.183 L 6.875 5.992 L 12.683 0.183 C 12.741 0.125 12.81 0.079 12.886 0.048 C 12.962 0.016 13.043 0 13.125 0 C 13.207 0 13.289 0.016 13.365 0.048 C 13.441 0.079 13.509 0.125 13.568 0.183 C 13.626 0.241 13.672 0.31 13.703 0.386 C 13.735 0.462 13.751 0.543 13.751 0.625 C 13.751 0.707 13.735 0.789 13.703 0.865 C 13.672 0.941 13.626 1.009 13.568 1.068 Z" fill="currentColor" />
      </svg>
    </div>
  </div>;
});
