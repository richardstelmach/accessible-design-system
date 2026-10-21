'use client';

import { forwardRef } from 'react';
import type { BadgeProps } from '../types.js';
import { classes, oneOf, text } from '../internal/validation.js';
import { feedbackAttributes } from '../internal/feedback.js';

/** Visible status text supplies all meaning; tone adds no hidden semantics. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ label, tone = 'neutral', className, ...props }, ref) {
  feedbackAttributes(props, 'Badge');
  text(label, 'Badge label'); oneOf(tone, ['neutral','info','success','warning','error'], 'Badge tone');
  return <span {...props} ref={ref} className={classes('owla11y-badge', className)} data-tone={tone}>{label}</span>;
});
