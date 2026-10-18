'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { ErrorSummaryItem, ErrorSummaryProps } from '../types.js';
import { classes, text } from '../internal/validation.js';
import { rejectProps } from '../internal/forms.js';
import { acquireErrorTitle, availableTarget, scrollAndFocus, summaryContext, uniqueElement } from '../internal/error-summary.js';

function distinctErrors(errors: readonly ErrorSummaryItem[]) {
  if (!Array.isArray(errors) || !errors.length) throw new Error('OwlA11y: ErrorSummary requires at least one error.');
  const byId = new Map<string, ErrorSummaryItem>();
  const issues = new Set<string>();
  const result: ErrorSummaryItem[] = [];
  for (const item of errors) {
    text(item.id, 'Summary error id'); text(item.text, 'Summary error text'); text(item.targetId, 'Summary target id');
    if (/^[\s]*[•●▪]/.test(item.text)) throw new Error('OwlA11y: summary link text must not contain a list marker.');
    if (item.contextId !== undefined) text(item.contextId, 'Summary context id');
    const previous = byId.get(item.id);
    if (previous && (previous.text !== item.text || previous.targetId !== item.targetId || previous.contextId !== item.contextId)) {
      throw new Error('OwlA11y: a summary error id must identify one stable issue.');
    }
    byId.set(item.id, item);
    const issue = JSON.stringify([item.targetId, item.text]);
    if (!issues.has(issue)) { issues.add(issue); result.push(item); }
  }
  return result;
}

export const ErrorSummary = forwardRef<HTMLDivElement, ErrorSummaryProps>(function ErrorSummary({
  title = 'There is a problem', description, errors, focusRequestKey, className, ...props
}, ref) {
  const root = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<{ key: string | number } | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  useImperativeHandle(ref, () => root.current!, []);
  text(title, 'ErrorSummary title');
  rejectProps(props, ['children', 'role', 'tabIndex', 'aria-live', 'aria-label', 'aria-labelledby'], 'ErrorSummary');
  if (focusRequestKey !== undefined && !((typeof focusRequestKey === 'string' && focusRequestKey.trim()) ||
    (typeof focusRequestKey === 'number' && Number.isFinite(focusRequestKey)))) throw new Error('OwlA11y: focusRequestKey must be nonempty text or a finite number.');
  const items = distinctErrors(errors);
  const rank = new Map(order.map((id, index) => [id, index]));
  const displayed = [...items].sort((a, b) => (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity));

  useEffect(() => acquireErrorTitle(root.current!.ownerDocument), []);
  // Resolve and sort only after all sibling controls commit. SSR keeps caller order.
  useEffect(() => {
    const document = root.current!.ownerDocument;
    const targets = new Map(items.map(item => {
      const target = uniqueElement(document, item.targetId);
      if (!availableTarget(target)) throw new Error(`OwlA11y: summary target "${item.targetId}" must be a visible enabled native control in the tab order.`);
      summaryContext(target, item.contextId);
      return [item.id, target];
    }));
    const sorted = [...items].sort((a, b) => {
      const position = targets.get(a.id)!.compareDocumentPosition(targets.get(b.id)!);
      return position & 4 ? -1 : position & 2 ? 1 : 0;
    });
    if (displayed.some((item, index) => item.id !== sorted[index].id)) {
      setOrder(sorted.map(item => item.id)); return;
    }
    if (focusRequestKey !== undefined && lastFocus.current?.key !== focusRequestKey) {
      lastFocus.current = { key: focusRequestKey };
      scrollAndFocus(root.current!, root.current!);
    }
  });

  return <div {...props} ref={root} tabIndex={-1} className={classes('owla11y-error-summary', className)}>
    <h2>{title}</h2>
    {description?.trim() && <p>{description}</p>}
    <ul>{displayed.map(item => <li key={item.id}>
      <a href={`#${encodeURIComponent(item.targetId)}`} onClick={event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const target = uniqueElement(event.currentTarget.ownerDocument, item.targetId);
        if (availableTarget(target)) scrollAndFocus(target, summaryContext(target, item.contextId));
      }}>{item.text}</a>
    </li>)}</ul>
  </div>;
});
