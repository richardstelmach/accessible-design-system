'use client';
import { forwardRef } from 'react';
import type { LinkProps } from '../types.js';
import { classes,text,oneOf } from '../internal/validation.js';
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({href,children,presentation='inline',trailingIcon,className,...props},ref) {
 text(href,'Link href'); oneOf(presentation,['inline','standalone'],'presentation');
 if (children == null || typeof children === 'boolean' || (typeof children === 'string' && !children.trim())) throw new Error('OwlA11y: Link requires visible content.');
 return <a {...props} ref={ref} href={href} className={classes('owla11y-link',className)} data-presentation={presentation}>{children}{trailingIcon != null && <span className="owla11y-icon" aria-hidden="true">{trailingIcon}</span>}</a>;
});
