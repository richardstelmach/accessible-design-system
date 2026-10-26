'use client';

import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import type { CodeBlockProps } from '../types.js';
import { IconButton } from './Button.js';
import { classes, text } from '../internal/validation.js';
import { feedbackAttributes } from '../internal/feedback.js';

const defaultLabels = {
  copy: (label: string) => `Copy ${label} code`,
  scroll: (label: string) => `${label} code, horizontally scrollable`,
  ready: 'Ready to copy.',
  pending: 'Copying…',
  success: (attempt: number) => attempt === 1 ? 'Copied.' : `Copied. Copy ${attempt} complete.`,
  failure: (attempt: number) => `Copy unavailable. Select and copy the code below.${attempt > 1 ? ` Attempt ${attempt}.` : ''}`,
};

/** Selectable plain text with an optional progressively enhanced copy action. */
export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock({
  code, label, copyable = true, labels: overrides, onCopy, className, ...props
}, ref) {
  feedbackAttributes(props, 'CodeBlock');
  if (typeof code !== 'string') throw new Error('OwlA11y: CodeBlock code must be plain text.');
  text(label, 'CodeBlock label');
  if (typeof copyable !== 'boolean') throw new Error('OwlA11y: CodeBlock copyable must be Boolean.');
  const labels = { ...defaultLabels, ...overrides };
  for (const key of ['ready', 'pending'] as const) text(labels[key], `CodeBlock labels.${key}`);
  for (const key of ['copy', 'scroll', 'success', 'failure'] as const) {
    if (typeof labels[key] !== 'function') throw new Error(`OwlA11y: CodeBlock labels.${key} must be a formatter.`);
  }
  const copyName = labels.copy(label), scrollName = labels.scroll(label);
  text(copyName, 'CodeBlock copy name'); text(scrollName, 'CodeBlock scroll name');
  const labelId = useId(), statusId = useId();
  const preRef = useRef<HTMLPreElement>(null);
  const session = useRef({ active: false, pending: false, attempts: 0 });
  const [enhanced, setEnhanced] = useState(false);
  const [scrollable, setScrollable] = useState(false);
  const [focused, setFocused] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const current = { active: true, pending: false, attempts: 0 };
    session.current = current;
    setStatus(null);
    setEnhanced(true);
    return () => { current.active = false; };
  }, [code, copyable]);

  useEffect(() => {
    const pre = preRef.current!;
    let active = true;
    const measure = () => { if (active) setScrollable(pre.scrollWidth > pre.clientWidth + 1); };
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    observer?.observe(pre);
    observer?.observe(pre.firstElementChild!);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    measure();
    return () => { active = false; observer?.disconnect(); window.removeEventListener('resize', measure); };
  }, [code, enhanced]);

  async function copy() {
    const current = session.current;
    if (!current.active || current.pending) return;
    const attempt = ++current.attempts;
    const success = labels.success(attempt), failure = labels.failure(attempt);
    text(success, 'CodeBlock success feedback'); text(failure, 'CodeBlock failure feedback');
    current.pending = true;
    setStatus(labels.pending);
    let copied = false;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(code);
      copied = true;
    } catch { /* Keep the exact selectable text and expose manual-copy guidance. */ }
    current.pending = false;
    if (!current.active) return;
    setStatus(copied ? success : failure);
    if (copied) onCopy?.(code);
  }

  return <div {...props} ref={ref} className={classes('owla11y-code-block', className)} data-enhanced={enhanced || undefined}>
    <div className="owla11y-code-block__bar">
      <span id={labelId}>{label}</span>
      {copyable && enhanced && <div className="owla11y-code-block__copy">
        <span id={statusId} className="owla11y-code-block__status" aria-live="polite" aria-atomic="true">{status ?? labels.ready}</span>
        <IconButton size="compact" aria-label={copyName} aria-describedby={statusId} onClick={copy}
          icon={<svg viewBox="0 0 256 256" focusable="false" aria-hidden="true"><path fill="currentColor" d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"/></svg>} />
      </div>}
    </div>
    <pre ref={preRef} className="owla11y-code-block__pre" tabIndex={scrollable || focused ? 0 : -1}
      role={scrollable || focused ? 'region' : undefined} aria-label={scrollable || focused ? scrollName : undefined}
      aria-labelledby={scrollable || focused ? undefined : labelId}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}><code>{code}</code></pre>
  </div>;
});
