'use client';

import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import type { TabsProps } from '../types.js';
import { Link } from './Link.js';
import { classes, oneOf, text } from '../internal/validation.js';
import { rejectProps } from '../internal/forms.js';

type View = { enhanced: boolean; selected: string };

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs({
  items, label, labelledBy, selectedId, defaultSelectedId, onSelectedChange,
  activation = 'automatic', headingLevel = 3, id, className, ...props
}, ref) {
  if (!Array.isArray(items) || items.length < 2) throw new Error('OwlA11y: Tabs requires at least two items; render ordinary content for one section.');
  const keys = new Set<string>();
  const labels = new Set<string>();
  for (const item of items) {
    text(item.id, 'Tabs item id'); text(item.label, 'Tabs item label'); text(item.heading, 'Tabs panel heading');
    if (keys.has(item.id) || labels.has(item.label.trim())) throw new Error('OwlA11y: Tabs item IDs and labels must be unique.');
    if (!('content' in item) || item.content == null || typeof item.content === 'boolean') throw new Error('OwlA11y: Tabs items require panel content.');
    keys.add(item.id); labels.add(item.label.trim());
  }
  if (labelledBy !== undefined) { text(labelledBy, 'Tabs labelledBy'); if (label !== undefined) throw new Error('OwlA11y: provide Tabs label or labelledBy, not both.'); }
  else text(label, 'Tabs label');
  oneOf(activation, ['automatic', 'manual'], 'Tabs activation');
  if (![2, 3, 4, 5, 6].includes(headingLevel)) throw new Error('OwlA11y: Tabs headingLevel must be 2 through 6.');
  const controlled = selectedId !== undefined;
  const owner = useRef(controlled);
  if (owner.current !== controlled) throw new Error('OwlA11y: Tabs must not switch between controlled and uncontrolled selection.');
  if (controlled && (defaultSelectedId !== undefined || typeof onSelectedChange !== 'function')) throw new Error('OwlA11y: controlled Tabs requires onSelectedChange and forbids defaultSelectedId.');
  for (const value of [selectedId, defaultSelectedId]) if (value !== undefined && !keys.has(value)) throw new Error('OwlA11y: Tabs selection must identify an existing item.');
  rejectProps(props, ['children', 'dangerouslySetInnerHTML', 'role', 'tabIndex', 'aria-label', 'aria-labelledby', 'disabled', 'orientation', 'closable', 'onChange'], 'Tabs');
  const generated = useId();
  const prefix = id ?? `owl-tabs-${generated}`;
  text(prefix, 'Tabs id');
  if (/\s/.test(prefix)) throw new Error('OwlA11y: Tabs id must not contain whitespace.');
  const [uncontrolled, setUncontrolled] = useState(defaultSelectedId ?? items[0].id);
  const desired = selectedId ?? (keys.has(uncontrolled) ? uncontrolled : items[0].id);
  const [view, setView] = useState<View>({ enhanced: false, selected: desired });
  const viewRef = useRef(view);
  const [roving, setRoving] = useState<string | null>(null);
  const [pressed, setPressed] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const measure = useRef<HTMLDivElement>(null);
  const links = useRef(new Map<string, HTMLAnchorElement>());
  const panels = useRef(new Map<string, HTMLElement>());
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pendingContinuity = useRef<string | null>(null);
  const pointerFocus = useRef<{ key: string; requested: boolean } | null>(null);
  const latest = useRef({ items, desired, controlled, onSelectedChange, labelledBy });
  latest.current = { items, desired, controlled, onSelectedChange, labelledBy };
  useImperativeHandle(ref, () => root.current!, []);
  const commit = (next: View) => {
    viewRef.current = next;
    setView(previous => previous.enhanced === next.enhanced && previous.selected === next.selected ? previous : next);
  };
  const choose = (key: string) => {
    const current = latest.current;
    if (key === current.desired) return;
    if (!current.controlled) {
      current.desired = key;
      setUncontrolled(key);
      if (viewRef.current.enhanced) commit({ enhanced: true, selected: key });
    }
    current.onSelectedChange?.(key);
  };
  const update = useRef<() => void>(() => {});

  useEffect(() => {
    const element = root.current!;
    const document = element.ownerDocument;
    const window = document.defaultView!;
    // Unknown layout/observer support keeps the complete linked-section baseline.
    if (!window.matchMedia || !window.ResizeObserver) return;
    const wide = window.matchMedia('(min-width: 48rem)');
    const print = window.matchMedia('print');
    const check = () => {
      const current = latest.current;
      const width = element.getBoundingClientRect().width;
      if (width > 0 && current.labelledBy) for (const name of current.labelledBy.trim().split(/\s+/)) {
        const heading = document.getElementById(name);
        if (!heading?.textContent?.trim() || !heading.getClientRects().length) throw new Error('OwlA11y: Tabs labelledBy must reference visible meaningful text.');
      }
      const rowWidth = measure.current!.getBoundingClientRect().width;
      const fits = wide.matches && !print.matches && width > 0 && rowWidth > 0 && rowWidth <= width;
      let selection = current.desired;
      if (!fits) {
        pendingContinuity.current = null;
        commit({ enhanced: false, selected: selection });
        return;
      }
      const active = document.activeElement;
      const focusedPanel = current.items.find(item => panels.current.get(item.id)?.contains(active))?.id;
      const focusedLink = current.items.find(item => links.current.get(item.id) === active)?.id;
      // Never hide a section holding focus. During fallback, a focused contents
      // link also determines the selection on re-enhancement. Manual-mode focus
      // remains independent while the widget is already enhanced.
      const focusSelection = focusedPanel ?? (!viewRef.current.enhanced ? focusedLink : undefined);
      if (focusSelection && focusSelection !== selection) {
        if (current.controlled) {
          commit({ enhanced: false, selected: selection });
          if (pendingContinuity.current !== focusSelection) {
            pendingContinuity.current = focusSelection;
            current.onSelectedChange?.(focusSelection);
          }
          return;
        }
        selection = focusSelection;
        setUncontrolled(selection);
        current.desired = selection;
        current.onSelectedChange?.(selection);
      }
      pendingContinuity.current = null;
      commit({ enhanced: true, selected: selection });
    };
    update.current = check;
    const resize = new window.ResizeObserver(check);
    resize.observe(element); resize.observe(measure.current!);
    wide.addEventListener('change', check); print.addEventListener('change', check);
    const focusIn = () => {
      if (!list.current!.contains(document.activeElement)) {
        clearTimeout(leaveTimer.current);
        // The browser has chosen the destination. Restore the entry attributes
        // now, including before another input task can overtake React's render.
        if (viewRef.current.enhanced) for (const [key, link] of links.current) link.tabIndex = key === viewRef.current.selected ? 0 : -1;
        setRoving(null); setPressed(null);
      }
      check();
    };
    document.addEventListener('focusin', focusIn);
    document.fonts?.addEventListener('loadingdone', check);
    check();
    return () => {
      update.current = () => {};
      resize.disconnect(); wide.removeEventListener('change', check); print.removeEventListener('change', check);
      document.removeEventListener('focusin', focusIn); document.fonts?.removeEventListener('loadingdone', check);
      clearTimeout(leaveTimer.current);
    };
  }, []);
  // Prop/content changes also require a fresh width and focus-continuity check.
  useEffect(() => { update.current(); });

  const enhanced = view.enhanced && keys.has(view.selected);
  const selection = keys.has(view.selected) ? view.selected : desired;
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const ids = (key: string) => ({ tab: `${prefix}-tab-${encodeURIComponent(key)}`, panel: `${prefix}-panel-${encodeURIComponent(key)}`, heading: `${prefix}-heading-${encodeURIComponent(key)}` });
  return <div {...props} id={prefix} ref={root} className={classes('owla11y-tabs', className)} data-enhanced={enhanced}>
    <div className="owla11y-tabs__measure-clip" aria-hidden="true"><div className="owla11y-tabs__measure" ref={measure}>
      {items.map(item => <span className="owla11y-tabs__target" key={item.id}>{item.label}</span>)}
    </div></div>
    <ul ref={list} className="owla11y-tabs__list" role={enhanced ? 'tablist' : undefined}
      aria-label={label} aria-labelledby={labelledBy} aria-orientation={enhanced ? 'horizontal' : undefined}
      onBlur={event => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        // Let native Tab navigation finish before restoring selected re-entry.
        clearTimeout(leaveTimer.current);
        leaveTimer.current = setTimeout(() => { setRoving(null); setPressed(null); }, 0);
      }}>
      {items.map((item, index) => <li key={item.id} role={enhanced ? 'presentation' : undefined}>
        <Link ref={node => { if (node) links.current.set(item.id, node); else links.current.delete(item.id); }}
          className="owla11y-tabs__target" id={ids(item.id).tab} href={`#${encodeURIComponent(ids(item.id).panel)}`}
          role={enhanced ? 'tab' : undefined} aria-controls={enhanced ? ids(item.id).panel : undefined}
          aria-selected={enhanced ? item.id === selection : undefined}
          tabIndex={enhanced ? (item.id === (roving && keys.has(roving) ? roving : selection) ? 0 : -1) : undefined}
          data-pressed={enhanced && pressed === item.id ? true : undefined}
          onFocus={() => {
            clearTimeout(leaveTimer.current);
            if (!enhanced) return;
            setRoving(item.id);
            if (activation === 'automatic') {
              const pointer = pointerFocus.current;
              if (pointer && pointer.key === item.id) pointer.requested = true;
              choose(item.id);
            }
          }}
          onPointerDown={event => { pointerFocus.current = event.button === 0 ? { key: item.id, requested: false } : null; }}
          onPointerCancel={() => { pointerFocus.current = null; }}
          onClick={event => {
            const pointer = pointerFocus.current;
            const focusRequested = pointer && pointer.key === item.id && pointer.requested;
            pointerFocus.current = null;
            if (!enhanced || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
            event.preventDefault();
            const alreadyFocused = event.currentTarget.ownerDocument.activeElement === event.currentTarget;
            event.currentTarget.focus();
            if (activation === 'manual' || (alreadyFocused && !focusRequested)) choose(item.id);
          }}
          onKeyUp={event => { if (event.key === ' ' || event.key === 'Enter') setPressed(null); }}
          onKeyDown={event => {
            if (!enhanced || event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
            let next: number | undefined;
            if (event.key === 'ArrowRight') next = (index + 1) % items.length;
            else if (event.key === 'ArrowLeft') next = (index + items.length - 1) % items.length;
            else if (event.key === 'Home') next = 0;
            else if (event.key === 'End') next = items.length - 1;
            else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setPressed(item.id); choose(item.id); return; }
            if (next !== undefined) { event.preventDefault(); links.current.get(items[next].id)?.focus(); }
          }}>{item.label}</Link>
      </li>)}
    </ul>
    {items.map(item => <section key={item.id} id={ids(item.id).panel}
      ref={node => { if (node) panels.current.set(item.id, node); else panels.current.delete(item.id); }}
      className="owla11y-tabs__panel" role={enhanced ? 'tabpanel' : undefined}
      aria-labelledby={enhanced ? ids(item.id).tab : ids(item.id).heading}
      hidden={enhanced && item.id !== selection} tabIndex={enhanced && item.id === selection ? 0 : undefined}>
      <Heading id={ids(item.id).heading} className="owla11y-tabs__heading">{item.heading}</Heading>
      <div className="owla11y-tabs__content">{item.content}</div>
    </section>)}
  </div>;
});
