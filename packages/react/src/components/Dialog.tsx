'use client';

import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import type { DialogCloseReason, DialogProps } from '../types.js';
import { IconButton } from './Button.js';
import { classes, oneOf, text } from '../internal/validation.js';
import { rejectProps } from '../internal/forms.js';
import { acquireModal, dialogTabbables, restoreDialogFocus, validateDialogContent } from '../internal/dialog.js';

// Phosphor Regular x, matching the registered Figma icon (MIT).
const closeIcon = <svg viewBox="0 0 256 256" focusable="false"><path fill="currentColor" d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31l-66.34,66.35a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>;

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(function Dialog({
  open, onOpenChange, title, accessibleLabel, showTitle = title !== undefined, dismissal = 'dismissible',
  showClose = dismissal === 'dismissible', closeLabel = 'Close dialog', size = 'medium', presentation = 'inset',
  headingLevel = 2, children, actions, returnFocusRef, className, id, ...props
}, ref) {
  const generated = useId();
  const dialogId = id ?? `owl-dialog-${generated}`;
  const root = useRef<HTMLDialogElement>(null);
  const lifecycle = useRef<{ trigger: Element | null; release: () => void } | null>(null);
  const latest = useRef({ onOpenChange, returnFocusRef });
  latest.current = { onOpenChange, returnFocusRef };
  const pointer = useRef<number | null>(null);
  const [scrollable, setScrollable] = useState(false);
  useImperativeHandle(ref, () => root.current!, []);
  oneOf(size, ['small', 'medium', 'large'], 'Dialog size');
  oneOf(presentation, ['inset', 'fullscreen'], 'Dialog presentation');
  oneOf(dismissal, ['dismissible', 'forced-decision'], 'Dialog dismissal');
  if (![2, 3, 4, 5, 6].includes(headingLevel)) throw new Error('OwlA11y: Dialog headingLevel must be 2 through 6.');
  if (typeof open !== 'boolean' || typeof onOpenChange !== 'function') throw new Error('OwlA11y: Dialog requires controlled open and onOpenChange.');
  if (showTitle) { text(title, 'Dialog title'); if (accessibleLabel !== undefined) throw new Error('OwlA11y: visible Dialog title supplies its accessible name; omit accessibleLabel.'); }
  else text(accessibleLabel, 'Dialog accessibleLabel');
  if (showClose) text(closeLabel, 'Dialog closeLabel');
  if (dismissal === 'forced-decision' && (showClose || actions == null)) throw new Error('OwlA11y: forced-decision Dialog forbids showClose and requires resolving actions.');
  rejectProps(props, ['role', 'tabIndex', 'autoFocus', 'aria-modal', 'aria-label', 'aria-labelledby', 'closedby', 'onCancel', 'onClose', 'onKeyDown', 'onPointerDown', 'onPointerUp', 'onPointerCancel', 'onSubmit', 'onSubmitCapture'], 'Dialog');

  const finish = (dialog: HTMLDialogElement) => {
    const state = lifecycle.current;
    if (!state) return;
    lifecycle.current = null;
    pointer.current = null;
    if (dialog.open) dialog.close();
    state.release();
    restoreDialogFocus(state.trigger, latest.current.returnFocusRef?.current);
  };
  const request = (reason: DialogCloseReason) => latest.current.onOpenChange(false, { reason });
  useEffect(() => {
    const dialog = root.current!;
    if (!open) { finish(dialog); return; }
    // React handles autoFocus specially and does not reflect it on dialog in the client.
    // Set the native attribute before showModal so its focusing steps choose the container.
    dialog.autofocus = true;
    validateDialogContentBeforeOpen(dialog);
    if (!lifecycle.current) {
      if (typeof dialog.showModal !== 'function') throw new Error('OwlA11y: Dialog requires native showModal support.');
      const trigger = dialog.ownerDocument.activeElement;
      const release = acquireModal(dialog);
      lifecycle.current = { trigger, release };
      try {
        dialog.showModal();
        // Some engines still choose the first descendant despite native autofocus.
        if (dialog.ownerDocument.activeElement !== dialog) dialog.focus({ preventScroll: true });
      } catch (error) { lifecycle.current = null; release(); throw error; }
    }
    try { validateDialogContent(dialog, dismissal === 'forced-decision'); }
    catch (error) { finish(dialog); throw error; }
  });
  useEffect(() => {
    const dialog = root.current!;
    // Strict Mode effect replay keeps the existing native modal and its focus.
    // A genuine unmount disconnects it; release its page lock after that commit.
    return () => { queueMicrotask(() => { if (!dialog.isConnected) finish(dialog); }); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const content = root.current!.querySelector<HTMLElement>('.owla11y-dialog__content')!;
    const check = () => setScrollable(content.scrollHeight > content.clientHeight);
    check();
    const view = content.ownerDocument.defaultView!;
    const resize = typeof view.ResizeObserver === 'undefined' ? undefined : new view.ResizeObserver(check);
    resize?.observe(content);
    const changes = new view.MutationObserver(check);
    changes.observe(content, { childList: true, subtree: true, characterData: true, attributes: true });
    return () => { resize?.disconnect(); changes.disconnect(); };
  }, [open]);

  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const outside = (x: number, y: number) => {
    const rect = root.current!.getBoundingClientRect();
    return x < rect.left || x > rect.right || y < rect.top || y > rect.bottom;
  };
  return <dialog {...props} id={dialogId} ref={root} autoFocus
    className={classes('owla11y-dialog', className)} data-size={size} data-presentation={presentation}
    aria-labelledby={showTitle ? `${dialogId}-title` : undefined} aria-label={showTitle ? undefined : accessibleLabel}
    // Own light dismissal so only an accepted controlled request closes the modal.
    // Unknown attributes are harmless on browsers without closedby support.
    {...{ closedby: dismissal === 'forced-decision' ? 'none' : 'closerequest' }}
    onCancel={event => { event.preventDefault(); if (dismissal === 'dismissible') request('escape'); }}
    onClose={event => {
      if (event.currentTarget.open || !lifecycle.current) return;
      finish(event.currentTarget); request('action');
    }}
    onSubmit={event => {
      if (event.defaultPrevented) return;
      const form = event.target as HTMLFormElement;
      const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
      if ((submitter?.getAttribute('formmethod') ?? form.getAttribute('method'))?.toLowerCase() === 'dialog') {
        event.preventDefault(); request('action');
      }
    }}
    onKeyDown={event => {
      if (event.key === 'Escape' && dismissal === 'forced-decision') { event.preventDefault(); return; }
      if (event.key !== 'Tab' || event.defaultPrevented) return;
      const dialog = event.currentTarget;
      validateDialogContent(dialog, dismissal === 'forced-decision');
      const nodes = dialogTabbables(dialog);
      const first = nodes[0], last = nodes[nodes.length - 1];
      const active = event.nativeEvent.composedPath()[0];
      if (!first) { event.preventDefault(); dialog.focus(); }
      else if (event.shiftKey && (active === first || active === dialog)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (active === last || active === dialog)) { event.preventDefault(); first.focus(); }
    }}
    onPointerDown={event => { pointer.current = event.button === 0 && outside(event.clientX, event.clientY) ? event.pointerId : null; }}
    onPointerCancel={() => { pointer.current = null; }}
    onPointerUp={event => {
      const dismiss = event.pointerId === pointer.current && outside(event.clientX, event.clientY);
      pointer.current = null;
      if (dismiss && dismissal === 'dismissible') request('backdrop');
    }}>
    {(showTitle || showClose) && <header className="owla11y-dialog__header">
      {showTitle && <Heading id={`${dialogId}-title`} className="owla11y-dialog__title">{title}</Heading>}
      {showClose && <IconButton className="owla11y-dialog__close" aria-label={closeLabel} icon={closeIcon} onClick={() => request('close-button')}/>}
    </header>}
    <div className="owla11y-dialog__content" tabIndex={scrollable ? 0 : undefined}
      role={scrollable ? 'region' : undefined} aria-labelledby={scrollable && showTitle ? `${dialogId}-title` : undefined}
      aria-label={scrollable && !showTitle ? accessibleLabel : undefined}>{children}</div>
    {actions != null && <footer className="owla11y-dialog__actions">{actions}</footer>}
  </dialog>;
});

function validateDialogContentBeforeOpen(dialog: HTMLDialogElement) {
  if (dialog.querySelector('[autofocus]')) throw new Error('OwlA11y: Dialog owns initial focus; remove descendant autoFocus.');
}
