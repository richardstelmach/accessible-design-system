# Modal backdrop

**Machine-readable specification:** [`modal-backdrop.yaml`](./modal-backdrop.yaml)

**Shared colour token:** [`../../tokens/semantic/colors.semantic.json`](../../tokens/semantic/colors.semantic.json)

Modal backdrop is the common visual layer behind modal content. It uses `color.overlay.modal` to separate the active surface from the inert interface beneath it.

The component standardises composition; it does not own modal behaviour. Dialog, drawer or sheet patterns remain responsible for semantics, accessible naming, focus containment, focus restoration, page-scroll locking and dismissal rules.

## Figma usage

Use the **Modal backdrop** component when a product screen or documentation example needs to show a modal surface in context.

- Resize the instance to the viewport or product frame.
- Insert one approved modal component into the native **Modal content** slot; Dialog is the preferred component.
- Keep the modal surface as a component instance.
- Keep the underlying product design below the backdrop layer.
- Do not replace the variable-bound fill with a raw colour.

The slot is optional so the backdrop can also be inspected as a foundation component.

## Production usage

Use the platform backdrop mechanism whenever one exists. For a native web Dialog:

```css
dialog::backdrop {
  background: var(--color-overlay-modal);
}
```

Do not add an extra backdrop element solely to match Figma. A custom fixed layer is appropriate only when the owning modal pattern cannot use a native backdrop. If one is needed, it is presentation-only, covers the viewport, sits below the modal surface and is excluded from the accessibility tree.

## Interaction ownership

The owning modal pattern determines whether outside pointer interaction dismisses it. For example, Dialog permits light dismissal in its default mode and ignores it in forced-decision mode. The Modal backdrop component does not encode that distinction.

## Accessibility

- The backdrop has no accessible name or role.
- It is not an independent focus target or control.
- Background content must be inert while the modal is open.
- The colour change is supplementary; modal semantics and focus movement communicate the context change programmatically.

## Acceptance criteria

- Figma and production use `color.overlay.modal`.
- Figma compositions use the shared Modal backdrop component rather than one-off frames.
- The component exposes a native **Modal content** slot.
- Native Dialog implementations style `dialog::backdrop` without adding redundant DOM.
