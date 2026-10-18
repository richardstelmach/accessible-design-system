'use client';

import { forwardRef, useId } from 'react';
import type { FieldsetProps } from '../types.js';
import { classes, describedBy, oneOf, text } from '../internal/validation.js';
import { DisabledFieldset, rejectProps, useUnavailable } from '../internal/forms.js';

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset({
  legend, legendStyle = 'default', headingLevel = 'none', helperText, error,
  errorAssociation = 'group', children, id, disabled, className,
  'aria-describedby': externalDescription, ...props
}, ref) {
  const generated = useId();
  const groupId = id ?? `owla11y-${generated}`;
  const unavailable = useUnavailable(disabled);
  text(groupId, 'Fieldset id'); text(legend, 'Fieldset legend');
  oneOf(legendStyle, ['page', 'default', 'section', 'subsection', 'compact'], 'legendStyle');
  oneOf(headingLevel, ['none', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'], 'headingLevel');
  oneOf(errorAssociation, ['group', 'children'], 'errorAssociation');
  rejectProps(props, ['aria-invalid', 'aria-label', 'aria-labelledby', 'role', 'tabIndex', 'required', 'readOnly'], 'Fieldset');
  if (error) text(error.message, 'Fieldset error message');
  if (error && errorAssociation === 'children') text(error.id, 'Children-associated error id');
  const helperId = helperText?.trim() ? `${groupId}-helper` : undefined;
  const errorId = error ? error.id ?? `${groupId}-error` : undefined;
  if (errorId) text(errorId, 'Fieldset error id');
  if (errorId && errorAssociation === 'children' && externalDescription?.split(/\s+/).includes(errorId)) {
    throw new Error('OwlA11y: a children-associated error must not also describe its Fieldset.');
  }
  const Heading = headingLevel === 'none' ? null : headingLevel;
  return <fieldset {...props} ref={ref} id={groupId} disabled={disabled}
    className={classes('owla11y-fieldset', className)}
    aria-describedby={describedBy(externalDescription, helperId,
      !unavailable && errorAssociation === 'group' ? errorId : undefined)}>
    <legend className="owla11y-legend" data-style={legendStyle}>
      {Heading ? <Heading>{legend}</Heading> : legend}
    </legend>
    {helperId && <div className="owla11y-helper" id={helperId}>{helperText}</div>}
    {error && !unavailable && <div className="owla11y-error" id={errorId}>{error.message}</div>}
    <DisabledFieldset.Provider value={unavailable}>{children}</DisabledFieldset.Provider>
  </fieldset>;
});
