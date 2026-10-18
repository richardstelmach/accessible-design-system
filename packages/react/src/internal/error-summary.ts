// Title ownership survives Strict Mode setup/cleanup and multiple summaries.
const titles = new WeakMap<Document, { base: string; applied: string; owners: Set<symbol> }>();

export function acquireErrorTitle(document: Document) {
  let state = titles.get(document);
  if (!state) {
    const base = document.title.replace(/^(?:Error: )+/, '');
    state = { base, applied: `Error: ${base}`, owners: new Set() };
    titles.set(document, state);
    document.title = state.applied;
  }
  const owner = Symbol(); state.owners.add(owner);
  return () => {
    state!.owners.delete(owner);
    if (!state!.owners.size) {
      if (document.title === state!.applied) document.title = state!.base;
      titles.delete(document);
    }
  };
}

export function uniqueElement(document: Document, id: string) {
  const nodes = [...document.querySelectorAll<HTMLElement>('[id]')].filter(node => node.id === id);
  if (nodes.length !== 1) throw new Error(`OwlA11y: summary target/context "${id}" must resolve to exactly one element.`);
  return nodes[0];
}

export function availableTarget(target: HTMLElement) {
  if (!['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName) ||
    target.matches(':disabled, [type=hidden], [aria-disabled=true]') || target.tabIndex < 0 || !target.getClientRects().length) return false;
  for (let node: HTMLElement | null = target; node; node = node.parentElement) {
    const style = node.ownerDocument.defaultView!.getComputedStyle(node);
    if (node.hidden || node.hasAttribute('inert') || style.display === 'none' ||
      style.visibility === 'hidden' || style.visibility === 'collapse' || style.opacity === '0') return false;
  }
  return true;
}

export function summaryContext(target: HTMLElement, contextId?: string) {
  if (contextId) {
    const context = uniqueElement(target.ownerDocument, contextId);
    if (context.tagName === 'FIELDSET') return context.querySelector(':scope > legend') ?? context;
    if (!['LABEL', 'LEGEND'].includes(context.tagName)) throw new Error('OwlA11y: summary context must be a label, legend or fieldset.');
    return context;
  }
  if (target.matches('[type=radio], [type=checkbox]:not([aria-invalid=true])')) {
    const legend = target.closest('fieldset')?.querySelector(':scope > legend');
    if (legend) return legend;
  }
  return (target as HTMLInputElement).labels?.[0] ?? target;
}

export function scrollAndFocus(target: HTMLElement, context: Element) {
  context.scrollIntoView({ block: 'start' });
  const rect = target.getBoundingClientRect();
  if (target !== context && (rect.top < 0 || rect.bottom > target.ownerDocument.defaultView!.innerHeight)) target.scrollIntoView({ block: 'nearest' });
  target.focus({ preventScroll: true });
}
