'use client';

import { Children, Fragment, forwardRef, isValidElement, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { TableProps } from '../types.js';
import { classes, describedBy, oneOf, text } from '../internal/validation.js';

/** Validate only the public composition boundary; authors own row/cell semantics. */
function tableSections(children: ReactNode) {
  let bodies = 0, heads = 0, feet = 0;
  const visit = (nodes: ReactNode) => Children.forEach(nodes, node => {
    if (node == null || typeof node === 'boolean' || (typeof node === 'string' && !node.trim())) return;
    if (isValidElement<{children?: ReactNode}>(node) && node.type === Fragment) return visit(node.props.children);
    if (!isValidElement(node) || typeof node.type !== 'string' || !['thead','tbody','tfoot','colgroup'].includes(node.type)) {
      throw new Error('OwlA11y: Table children must be native thead/tbody/tfoot/colgroup sections; caption is supplied by Table.');
    }
    if (node.type === 'tbody') bodies++;
    if (node.type === 'thead') heads++;
    if (node.type === 'tfoot') feet++;
  });
  visit(children);
  if (!bodies || heads > 1 || feet > 1) throw new Error('OwlA11y: Table requires tbody and at most one thead/tfoot.');
}

/** A native data table with a progressively measured keyboard scroll viewport. */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table({
  caption, captionVisibility = 'visible', scrollLabel, children, className, ...props
}, ref) {
  text(caption, 'Table caption');
  oneOf(captionVisibility, ['visible','visually-hidden'], 'Table captionVisibility');
  if (scrollLabel !== undefined && typeof scrollLabel !== 'function') throw new Error('OwlA11y: Table scrollLabel must be a formatter.');
  const name = scrollLabel ? scrollLabel(caption) : `${caption}, horizontally scrollable`;
  text(name, 'Table scroll label');
  for (const key of Object.keys(props)) {
    if (!['id','style','lang','dir','aria-describedby'].includes(key) && !/^data-[\w-]+$/.test(key)) {
      throw new Error(`OwlA11y: Table does not support ${key}.`);
    }
  }
  tableSections(children);
  const captionId = useId();
  const scrollDescriptionId = `${captionId}-scroll`;
  const viewport = useRef<HTMLDivElement>(null);
  // Unknown measurement keeps the SSR/no-observer baseline keyboard accessible.
  const [overflow, setOverflow] = useState<boolean | null>(null);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    const root = viewport.current!, table = root.querySelector('table')!;
    if (typeof ResizeObserver === 'undefined') return;
    let active = true;
    const measure = () => { if (active) setOverflow(root.scrollWidth > root.clientWidth + 1); };
    const observer = new ResizeObserver(measure);
    observer.observe(root); observer.observe(table);
    const changes = typeof MutationObserver === 'undefined' ? undefined : new MutationObserver(measure);
    changes?.observe(table, {subtree:true, childList:true, characterData:true, attributes:true});
    window.addEventListener('resize', measure);
    const fonts = document.fonts;
    fonts?.addEventListener('loadingdone', measure);
    void fonts?.ready.then(measure);
    measure();
    return () => { active = false; observer.disconnect(); changes?.disconnect(); window.removeEventListener('resize', measure); fonts?.removeEventListener('loadingdone', measure); };
  }, [children]);
  const scrollable = overflow !== false || focused;
  return <div ref={viewport} className="owla11y-table-viewport" dir={props.dir} lang={props.lang}>
    <table {...props} ref={ref} className={classes('owla11y-table', className)}
      tabIndex={scrollable ? 0 : undefined}
      aria-describedby={describedBy(props['aria-describedby'], scrollable ? scrollDescriptionId : undefined)}
      onFocus={event => { if (event.target === event.currentTarget && overflow !== false) setFocused(true); }}
      onBlur={event => { if (event.target === event.currentTarget) setFocused(false); }}>
      <caption id={captionId} className={captionVisibility === 'visually-hidden' ? 'owla11y-table__caption--hidden' : undefined}>{caption}</caption>
      {children}
    </table>
    {scrollable && <span id={scrollDescriptionId} hidden>{name}</span>}
  </div>;
});
