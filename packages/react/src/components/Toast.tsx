'use client';

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { isFocusable } from 'tabbable';
import type { ToastAPI, ToastMessage, ToastProviderProps, ToastRegionProps, ToastNotificationsButtonProps, ToastState } from '../types.js';
import { Button, IconButton } from './Button.js';
import { classes, oneOf, text } from '../internal/validation.js';
import { rejectProps } from '../internal/forms.js';
import { toastPaths, toastClosePath } from '../internal/toast-icons.js';

const states: ToastState[] = ['success', 'info', 'warning', 'error'];
const defaultLabels = { success: 'Success:', info: 'Information:', warning: 'Warning:', error: 'Error:' };
const defaultCount = (count: number) => `Notifications (${count})`;
type Host = ToastAPI & {
  messages: readonly ToastMessage[]; regionId: string; regionLabel: string; emptyText: string;
  labels: Record<ToastState, string>; countLabel: string;
  region: { current: HTMLElement | null }; entry: { current: HTMLButtonElement | null };
  origin: { current: HTMLElement | null };
  register: (part: 'region' | 'entry', node: HTMLElement) => () => void;
};
const Context = createContext<Host | null>(null);
const owners = new WeakMap<Document, object>();
function useHost() {
  const host = useContext(Context);
  if (!host) throw new Error('OwlA11y: Toast requires ToastProvider.');
  return host;
}
function modalOpen(document: Document) {
  // Older selectors conservatively defer for any open dialog.
  try { return Boolean(document.querySelector('dialog:modal')); }
  catch { return Boolean(document.querySelector('dialog[open]')); }
}
function focus(node: HTMLElement | null) {
  if (!node?.isConnected || node.closest('[hidden],[inert],[aria-disabled="true"]') || !isFocusable(node) || modalOpen(node.ownerDocument)) return false;
  node.focus({ preventScroll: true });
  node.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  return node.ownerDocument.activeElement === node;
}

/** One persistent app-shell host. Events must be added after mount, never during render. */
export function ToastProvider({ children, regionLabel = 'Notifications', emptyText = 'No notifications.',
  stateLabels = defaultLabels, formatCountLabel = defaultCount, formatAnnouncement, onDismiss, ...unsupported
}: ToastProviderProps) {
  if (useContext(Context)) throw new Error('OwlA11y: do not nest ToastProvider.');
  rejectProps(unsupported, Object.keys(unsupported), 'ToastProvider');
  text(regionLabel, 'Toast regionLabel'); text(emptyText, 'Toast emptyText');
  for (const state of states) text(stateLabels[state], `Toast stateLabels.${state}`);
  const generated = useId(); const regionId = `owl-notifications-${generated}`;
  const [messages, setMessages] = useState<readonly ToastMessage[]>([]);
  const [speech, setSpeech] = useState({ polite: '', assertive: '' });
  const active = useRef<ToastMessage[]>([]); const pending = useRef<ToastMessage[]>([]);
  const region = useRef<HTMLElement | null>(null); const entry = useRef<HTMLButtonElement | null>(null);
  const origin = useRef<HTMLElement | null>(null); const announcers = useRef<HTMLDivElement>(null);
  const mounted = useRef(false); const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const parts = useRef(new Map<string, HTMLElement>()); const identity = useRef({});
  const latest = useRef({ stateLabels, formatAnnouncement, onDismiss });
  latest.current = { stateLabels, formatAnnouncement, onDismiss };
  const available = useCallback(() => {
    const document = region.current?.ownerDocument;
    return Boolean(mounted.current && document && entry.current && isFocusable(region.current!) &&
      isFocusable(entry.current) && !modalOpen(document));
  }, []);
  const schedule = useCallback(() => {
    if (timer.current !== undefined || !pending.current.length || !available()) return;
    // Clear committed live text before a later event with identical wording. This
    // delay batches announcement delivery only; it never removes a notification.
    setSpeech({ polite: '', assertive: '' });
    timer.current = setTimeout(() => {
      timer.current = undefined;
      if (!available()) return;
      const batch = pending.current; pending.current = [];
      const next = { polite: '', assertive: '' };
      for (const channel of ['polite', 'assertive'] as const) {
        const events = batch.filter(message => (message.announcement ?? 'polite') === channel);
        if (!events.length) continue;
        const output = latest.current.formatAnnouncement?.(events) ??
          `${events.length > 1 ? `${events.length} notifications. ` : ''}${[...new Set(events.map(message =>
            `${latest.current.stateLabels[message.state ?? 'info']} ${message.titleText}${message.descriptionText?.trim() ? `. ${message.descriptionText}` : ''}`))].join('. ')}`;
        text(output, 'Toast formatAnnouncement result'); next[channel] = output;
      }
      setSpeech(next);
    }, 50);
  }, [available]);
  const register = useCallback((part: 'region' | 'entry', node: HTMLElement) => {
    if (parts.current.has(part)) throw new Error(`OwlA11y: mount exactly one Toast ${part}.`);
    if (node.closest('dialog')) throw new Error('OwlA11y: Toast host parts belong outside dialogs.');
    parts.current.set(part, node);
    return () => { parts.current.delete(part); };
  }, []);
  useEffect(() => {
    const document = announcers.current!.ownerDocument;
    if (owners.has(document)) throw new Error('OwlA11y: mount one ToastProvider per document.');
    owners.set(document, identity.current); mounted.current = true;
    const observer = new document.defaultView!.MutationObserver(schedule);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['open', 'inert', 'hidden', 'class', 'style'] });
    document.addEventListener('close', schedule, true); schedule();
    return () => {
      mounted.current = false; observer.disconnect(); document.removeEventListener('close', schedule, true);
      if (timer.current !== undefined) clearTimeout(timer.current); timer.current = undefined;
      if (owners.get(document) === identity.current) owners.delete(document);
    };
  }, [schedule]);
  const add = useCallback((input: ToastMessage) => {
    if (!mounted.current || parts.current.size !== 2) throw new Error('OwlA11y: mount ToastProvider, ToastRegion and ToastNotificationsButton before adding events.');
    rejectProps(input, Object.keys(input).filter(key => !['id','state','titleText','descriptionText','announcement','dismissLabel'].includes(key)), 'Toast message');
    text(input.id, 'Toast id'); text(input.titleText, 'Toast titleText'); text(input.dismissLabel, 'Toast dismissLabel');
    oneOf(input.state ?? 'info', states, 'Toast state'); oneOf(input.announcement ?? 'polite', ['polite','assertive'], 'Toast announcement');
    if (input.descriptionText !== undefined && typeof input.descriptionText !== 'string') throw new Error('OwlA11y: Toast descriptionText must be plain text.');
    if (active.current.some(message => message.id === input.id)) throw new Error('OwlA11y: Toast active IDs must be unique.');
    const message = { ...input }; active.current = [...active.current, message];
    // Queued messages remain in chronological order but are not delivered while
    // a native modal owns the document. Delivery reveals the same active IDs.
    pending.current = [...pending.current, message]; setMessages([...active.current]); schedule();
    return message.id;
  }, [schedule]);
  const dismiss = useCallback((id: string) => {
    const index = active.current.findIndex(message => message.id === id);
    if (index < 0) return;
    const list = region.current?.querySelectorAll<HTMLElement>('[data-toast-id]');
    const removed = list && [...list].find(node => node.dataset.toastId === id);
    if (removed?.contains(removed.ownerDocument.activeElement)) {
      const nodes = [...list!]; const position = nodes.indexOf(removed);
      const next = nodes[position + 1] ?? nodes[position - 1];
      if (!focus(next?.querySelector('button') ?? null) && !focus(origin.current) && !focus(entry.current)) focus(region.current);
    }
    active.current = active.current.filter(message => message.id !== id);
    pending.current = pending.current.filter(message => message.id !== id);
    setMessages([...active.current]); latest.current.onDismiss?.(id);
  }, []);
  const countLabel = formatCountLabel(messages.length); text(countLabel, 'Toast formatCountLabel result');
  const host = { messages, regionId, regionLabel, emptyText, labels: stateLabels, countLabel,
    region, entry, origin, add, dismiss, register };
  return <Context.Provider value={host}>{children}<div ref={announcers} className="owla11y-toast-announcers">
    <div role="status">{speech.polite}</div><div role="alert">{speech.assertive}</div>
  </div></Context.Provider>;
}

export function useToast(): ToastAPI {
  const { add, dismiss } = useHost();
  return useMemo(() => ({ add, dismiss }), [add, dismiss]);
}
export function ToastNotificationsButton({ className, ...unsupported }: ToastNotificationsButtonProps) {
  rejectProps(unsupported, Object.keys(unsupported), 'ToastNotificationsButton');
  const host = useHost();
  useEffect(() => host.register('entry', host.entry.current!), [host.register]);
  return <Button ref={host.entry} className={className} aria-controls={host.regionId} onClick={() => {
    host.origin.current = host.entry.current; focus(host.region.current);
  }}>{host.countLabel}</Button>;
}
export function ToastRegion({ className, ...unsupported }: ToastRegionProps) {
  rejectProps(unsupported, Object.keys(unsupported), 'ToastRegion');
  const host = useHost();
  useEffect(() => host.register('region', host.region.current!), [host.register]);
  return <section ref={host.region} id={host.regionId} aria-label={host.regionLabel} tabIndex={-1}
    className={classes('owla11y-toast-region', className)} onFocusCapture={event => {
      const from = event.relatedTarget;
      if (from instanceof HTMLElement && !event.currentTarget.contains(from)) host.origin.current = from;
    }}>
    {host.messages.length ? <ol role="list" className="owla11y-toast-list">{host.messages.map(message => {
      const state = message.state ?? 'info';
      return <li key={message.id} data-toast-id={message.id} data-state={state} className="owla11y-toast" onKeyDown={event => {
        if (event.key === 'Escape' && event.currentTarget.contains(event.currentTarget.ownerDocument.activeElement) && !event.defaultPrevented && !event.altKey && !event.ctrlKey && !event.metaKey && !modalOpen(event.currentTarget.ownerDocument)) {
          event.preventDefault(); event.stopPropagation(); host.dismiss(message.id);
        }
      }}>
        <svg className="owla11y-toast__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" transform="translate(2.25 2.25)" d={toastPaths[state]}/></svg>
        <div className="owla11y-toast__message"><p className="owla11y-toast__title"><span className="owla11y-toast-sr">{host.labels[state]} </span>{message.titleText}</p>
          {message.descriptionText?.trim() && <p>{message.descriptionText}</p>}</div>
        <IconButton size="compact" aria-label={message.dismissLabel} onClick={() => host.dismiss(message.id)} icon={<svg viewBox="0 0 20 20" focusable="false"><path fill="currentColor" transform="translate(3.74965 3.74965)" d={toastClosePath}/></svg>}/>
      </li>;
    })}</ol> : <p className="owla11y-toast-empty">{host.emptyText}</p>}
  </section>;
}
