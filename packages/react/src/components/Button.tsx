'use client';
import { forwardRef } from 'react';
import type { ButtonProps, IconButtonProps } from '../types.js';
import { classes, text, oneOf } from '../internal/validation.js';
const sizes = ['compact','default','comfortable'];
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({children,variant='default',size='default',type='button',leadingIcon,trailingIcon,className,...props},ref) {
  text(children,'Button children'); oneOf(variant,['primary','default','destructive','text'],'variant'); oneOf(size,sizes,'size');
  if (leadingIcon != null && trailingIcon != null) throw new Error('OwlA11y: provide only one button icon.');
  return <button {...props} ref={ref} type={type} className={classes('owla11y-button',className)} data-variant={variant} data-size={size}>
    {leadingIcon != null && <span className="owla11y-icon" aria-hidden="true">{leadingIcon}</span>}<span>{children}</span>
    {trailingIcon != null && <span className="owla11y-icon" aria-hidden="true">{trailingIcon}</span>}
  </button>;
});
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({icon,variant='default',size='default',type='button',className,...props},ref) {
  oneOf(variant,['primary','default','destructive'],'variant'); oneOf(size,sizes,'size');
  text(props['aria-label'] ?? props['aria-labelledby'],'IconButton accessible name');
  if (icon == null || typeof icon === 'boolean') throw new Error('OwlA11y: IconButton requires an icon.');
  return <button {...props} ref={ref} type={type} className={classes('owla11y-button','owla11y-icon-button',className)} data-variant={variant} data-size={size}><span className="owla11y-icon" aria-hidden="true">{icon}</span></button>;
});
