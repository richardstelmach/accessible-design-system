import { isFocusable, tabbable } from 'tabbable';

export const dialogTabbables = (dialog: HTMLDialogElement) => tabbable(dialog, { getShadowRoot: node => node.shadowRoot ?? undefined });
const owners = new WeakMap<Document, HTMLDialogElement>();

/** One modal owner, with exact restoration of the host's inline scroll styles. */
export function acquireModal(dialog: HTMLDialogElement) {
  const document = dialog.ownerDocument;
  const owner = owners.get(document);
  if (owner && owner !== dialog) throw new Error('OwlA11y: close the current Dialog before opening another.');
  if (document.querySelector('dialog:modal') && !dialog.matches(':modal')) throw new Error('OwlA11y: another native modal is already open.');
  const elements = [document.documentElement, document.body];
  const previous = elements.map(element => ({ value: element.style.getPropertyValue('overflow'), priority: element.style.getPropertyPriority('overflow') }));
  elements.forEach(element => element.style.setProperty('overflow', 'hidden'));
  owners.set(document, dialog);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    elements.forEach((element, index) => {
      const saved = previous[index];
      if (saved.value) element.style.setProperty('overflow', saved.value, saved.priority);
      else element.style.removeProperty('overflow');
    });
    if (owners.get(document) === dialog) owners.delete(document);
  };
}

export function restoreDialogFocus(trigger: Element | null, fallback?: HTMLElement | null) {
  const target = fallback ?? trigger;
  if (target instanceof HTMLElement && target.isConnected && isFocusable(target)) target.focus({ preventScroll: true });
}

export function validateDialogContent(dialog: HTMLDialogElement, forced: boolean) {
  const candidates = dialogTabbables(dialog);
  if (candidates.some(node => node.tabIndex > 0)) throw new Error('OwlA11y: Dialog content must not use positive tabIndex.');
  if (dialog.querySelector('[autofocus]')) throw new Error('OwlA11y: Dialog owns initial focus; remove descendant autoFocus.');
  if (forced && !candidates.some(node => node.matches('.owla11y-dialog__actions button'))) {
    throw new Error('OwlA11y: forced-decision Dialog requires an enabled resolving button in actions.');
  }
}
