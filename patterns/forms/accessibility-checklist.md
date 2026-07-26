# Form accessibility checklist

Use this checklist for every form component.

## Accessible name

- The control has an accessible name.
- A visible label is used unless there is a documented reason not to.
- If visible label text exists, the accessible name includes the visible text.
- Placeholder text is not used as the label.

## Labels and legends

- Individual controls use labels.
- Groups of related controls use `fieldset` and `legend`.
- Labels and legends are not treated as interchangeable.
- Child controls inside fieldsets still have labels where needed.

## Helper text

- Helper text is optional.
- Helper text is associated using `aria-describedby`.
- Helper text does not repeat the label.
- Helper text does not replace the label.
- Placeholder text is not used instead of helper text.

## Required and optional fields

- Required and optional status is clear.
- Optional fields use “(optional)” in the label or legend.
- Required or optional status does not rely on colour alone.
- Required or optional status does not rely on an asterisk alone.

## Errors

- Inline errors are shown next to the relevant field or group.
- Error text explains what went wrong.
- Error text explains how to fix the problem where possible.
- Error text is associated using `aria-describedby`.
- Invalid controls use `aria-invalid="true"`.
- Error state does not rely on colour alone.
- Inline errors are still shown when an error summary is used.

## Error summary

- A failed submit with one or more user-correctable validation errors uses an error summary.
- Error summary appears at the top of the page or form.
- One error and several errors use the same summary structure.
- Focus moves to the error summary exactly once after the summary and inline errors render.
- Validation rerenders do not refocus the summary; a later failed submit focuses it once again.
- The root uses `tabindex="-1"` and is absent from the normal Tab order.
- Every summary item links to a visible, enabled control.
- Link activation scrolls the associated label or legend into view and focuses the control, never Fieldset.
- Link activation preserves the established `aria-describedby` access to the inline error.
- Errors follow the document order of the form and duplicate summary items are removed.
- Inline errors are still shown beside each invalid field or group.
- Entered values and selections are preserved.
- The document title receives one `Error: ` prefix while errors are present.
- Alert, live-region and focus behaviour does not announce the same summary twice.

## Keyboard and focus

- The control can be reached and operated by keyboard.
- Focus is visible.
- Focus is not moved while the user is typing.
- When focus lands on an invalid field, the associated error is available to assistive technology.
- Focus styling remains visible when the field is in error.
- Error Summary focus remains distinct from its error border and is not obscured by other content.
- Error Summary works with 200% text resize, 400% zoom/reflow, text-spacing overrides and forced colours.

## Disabled and read-only

- Disabled fields have an accessible name.
- Disabled fields communicate their disabled state.
- Disabled and read-only states are visually and behaviourally distinct.
- Disabled fields are not used when the value needs to be submitted.
- Read-only fields are used when the value should be submitted but not edited.

## Input behaviour

- Relevant fields document `type`, `inputmode` and `autocomplete`.
- `type="number"` is not used for identifiers or structured text values.
- Mobile keyboard behaviour has been considered.
