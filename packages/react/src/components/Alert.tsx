'use client';

import { forwardRef } from 'react';
import type { AlertProps } from '../types.js';
import { classes, oneOf, text } from '../internal/validation.js';
import { feedbackAttributes } from '../internal/feedback.js';
import { statusPaths } from '../internal/feedback-icons.js';

const labels = { success:'Success:', info:'Information:', warning:'Warning:', error:'Error:' };
/** Contextual plain-text feedback; urgency is independent of visual state. */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert({
  state = 'info', titleText, descriptionText, headingLevel = 'none', announcement = 'none',
  stateLabels = labels, className, ...props
}, ref) {
  feedbackAttributes(props, 'Alert');
  oneOf(state, ['success','info','warning','error'], 'Alert state');
  oneOf(announcement, ['none','polite','assertive'], 'Alert announcement');
  if (!['none',2,3,4,5,6].includes(headingLevel)) throw new Error('OwlA11y: Alert headingLevel must be none or 2 through 6.');
  text(titleText, 'Alert titleText');
  if (descriptionText !== undefined && typeof descriptionText !== 'string') throw new Error('OwlA11y: Alert descriptionText must be plain text.');
  for (const state of ['success','info','warning','error'] as const) text(stateLabels[state], `Alert stateLabels.${state}`);
  const Title = headingLevel === 'none' ? 'p' : `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  return <div {...props} ref={ref} className={classes('owla11y-alert', className)} data-state={state}
    role={announcement === 'none' ? undefined : announcement === 'polite' ? 'status' : 'alert'}>
    <svg className="owla11y-alert__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" transform="translate(2.25 2.25)" d={statusPaths[state]}/></svg>
    <div className="owla11y-alert__content">
      <Title className="owla11y-alert__title"><span className="owla11y-feedback-sr">{stateLabels[state]} </span>{titleText}</Title>
      {descriptionText?.trim() && <p className="owla11y-alert__description">{descriptionText}</p>}
    </div>
  </div>;
});
