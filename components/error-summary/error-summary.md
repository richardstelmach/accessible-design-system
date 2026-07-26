# Error Summary

**Status:** Draft
**Version:** 0.1.0
**Machine-readable specification:** [`error-summary.yaml`](./error-summary.yaml)

## Overview

Error Summary presents a page- or form-level list of validation errors and links each error to the control that needs attention.

It is placed near the start of the page or form. After a failed submit with one or more user-correctable validation errors, render Error Summary and every inline error, then move focus to Error Summary exactly once.

The error list uses structured composition in Figma. It is not one multiline text property and it is not modelled with item-count variants.

## When to use

Use Error Summary after every failed submit with one or more user-correctable validation errors, including when:

- one field or group has an error;
- several fields or groups have errors;
- a page reloads with user-correctable validation errors.

One error and several errors use identical component structure and focus behaviour. Do not replace a one-error summary with direct-to-field focus.

Do not move focus to Error Summary while the user is typing.

## Anatomy

```text
Error Summary
├── Title
├── Description - optional
└── Error list - required native Figma slot
    └── Error Summary / Item - one default instance
        ├── Bullet marker - fixed and presentational
        └── Link text - errorText
```

Error Summary is the public product component.

`Error Summary / Item` is a published supporting Figma subcomponent. Its description must be:

> Use only inside the Error Summary errorList slot

It is grouped with Error Summary in the asset hierarchy so the slot can offer it as a preferred instance. It is not another product-level Error Summary component and is not intended for standalone insertion.

## Public Figma API

Error Summary exposes exactly these properties:

| Property | Type | Default or values |
| --- | --- | --- |
| `state` | Variant | `default`, `focus` |
| `description` | Boolean | `false` |
| `titleText` | Text | `There is a problem` |
| `descriptionText` | Text | `Review the errors below and try again.` |
| `errorList` | Required native Figma Slot | One default `Error Summary / Item` |

`Error Summary / Item` exposes exactly one public property:

| Property | Type | Default |
| --- | --- | --- |
| `errorText` | Text | `Enter your full name` |

Do not add:

- `errorCount` or `itemCount`;
- one-, two- or three-item variants;
- a combined multiline `errorsText` property;
- editable bullet or marker text;
- list-style, width or heading-level properties;
- duplicate Error Summary shells for different list lengths.

The production `h2` semantic and link targets are handoff metadata, not extra Figma properties or variants.

## The `errorList` slot

`errorList` is a required native Figma Slot property. It maps conceptually to the production `<ul>`.

The slot:

- uses vertical Auto Layout;
- fills the available width and hugs its contents vertically;
- contains one `Error Summary / Item` by default;
- has minimum child guidance of one;
- has no maximum child count;
- makes inserted children fill the available width;
- supports adding, duplicating, removing and reordering items without detaching Error Summary;
- preserves every item and `errorText` override when `state` changes;
- preserves every item and `errorText` override when `description` is toggled.

An empty list is invalid. If Figma can only provide advisory minimum guidance, a zero-item instance still fails component QA.

Configure `Error Summary / Item` as the only preferred instance. Enable preferred-instance enforcement when the current Figma implementation supports it. If enforcement is unavailable, document the restriction and treat arbitrary slot content as invalid; do not replace the native slot with a text property.

## Adding and editing errors

Use the `errorList` slot control to add an approved item, or duplicate an existing item inside the slot.

Edit `errorText` independently on each `Error Summary / Item`. Items can then be removed or reordered to match the document order of the corresponding form questions and controls.

Routine authoring must not require detaching either component.

Do not remove the final required item. If the platform cannot block that action, restore an approved item and treat the empty state as invalid.

## Error Summary / Item

The supporting item uses one horizontal Auto Layout row:

```text
Error Summary / Item
├── Bullet marker
└── Link text
```

Construction requirements:

- the item fills the available width and hugs its contents vertically;
- the bullet-marker layer is fixed, presentational and not editable;
- the marker hugs its content and aligns with the first line of the link;
- the Link text layer fills the remaining width;
- the Link text layer has automatic height;
- long links wrap naturally;
- the item has no fixed height;
- the item has no arbitrary width;
- no content is clipped.

`errorText` contains only the actionable link wording. Do not include a bullet character in it.

The marker represents the browser's list marker. It must not be repeated in production link text, `aria-label` or the accessible name.

## State and description

`state=default` shows the Error Summary error surface.

`state=focus` represents programmatic focus on the Error Summary shell after failed submission. It keeps the error surface and adds the documented focus ring and separator.

Switching between those variants must not replace the `errorList` slot, reset its children, reorder items or remove `errorText` overrides.

The `description` Boolean shows or hides the same Description layer. Hiding it leaves no empty layer or gap. Toggling it must not swap the shell or change slot content.

## Figma layout and token use

Use semantic tokens and responsive text styles throughout.

| Part | Token or style |
| --- | --- |
| Shell background | `form.errorSummary.background` |
| Shell foreground | `form.errorSummary.foreground` |
| Shell border | `form.errorSummary.border.color`, `form.errorSummary.border.width` |
| Shell padding | `form.errorSummary.padding` |
| Shell content gap | `spacing.content.headingToBody` |
| Title | `typography.heading.h2.base`, `.md`, `.lg` |
| Description and item text | `typography.body.default.base`, `.md`, `.lg` |
| Error-list item gap | `spacing.stack.sm` |
| Marker-to-link gap | `spacing.inline.sm` |
| Focus | `form.state.focus.ring`, `form.state.focus.separator`, `border.width.medium` |
| Error-link interaction | Shared Link behaviour with `form.state.focus.*` and `border.width.medium`; error-surface foreground override |

Use `form.errorSummary.foreground` for title, description, marker and underlined link text on the error surface.

Reuse the keyboard, focus and forced-colours behaviour from [`components/link/link.yaml`](../link/link.yaml). Keep Error Summary links underlined by default and use the shared focus tokens. Do not substitute the ordinary blue link foreground on the error surface or create nested-link interaction variants on Error Summary.

In Figma, use `typography/heading/h2` for the title and `typography/body/default` for the description, marker and error links. Each is one semantic text style whose responsive values inherit from the parent frame's `Breakpoint` mode. Verify `base`, `md` and `lg` by switching that mode; do not create breakpoint-suffixed styles or responsive component variants.

Do not use raw colours, spacing, typography, borders or dimensions. Report a missing token need instead of inventing a value.

## Production semantics

The slot is a Figma authoring model. Production remains a native list:

```html
<div class="error-summary" tabindex="-1">
  <h2>There is a problem</h2>
  <ul>
    <li><a href="#full-name">Enter your full name</a></li>
  </ul>
</div>
```

This example uses the default focus-only announcement strategy. Add `role="alert"` only when testing confirms that combining the alert with required programmatic focus does not duplicate the announcement.

The required semantic mapping is:

```text
errorList                 → ul
Error Summary / Item      → li
errorText / Link text     → a
```

The final structure remains `ul > li > a`.

The title is always an `h2` in production. One error and several errors use the same `div > h2 + ul > li > a` structure; item count never changes the semantic model.

Do not render Figma slot wrappers or component wrappers as extra production elements. Let the browser provide native list semantics and the production marker.

## Focus behaviour

After a failed submission with one or more user-correctable validation errors:

1. Preserve all entered values and selections.
2. Render every inline error and Error Summary.
3. Prefix the existing document title once with `Error: `.
4. Move focus to Error Summary exactly once for that failed-submission event.
5. Show the visible `focus` treatment without hiding the error border.
6. Let users follow each link to the relevant control.

Use `tabindex="-1"` so the shell can receive programmatic focus without becoming a normal Tab stop.

The attribute may remain on the root. If an implementation injects `tabindex="-1"` temporarily, add it before calling `focus()`, keep it while the root has focus and remove it only after focus leaves. Never use `tabindex="0"` and never remove `tabindex="-1"` synchronously after calling `focus()`.

Do not refocus because validation state rerenders while users correct errors, and do not move focus while they are typing. A later explicit submit that fails is a new event and moves focus to Error Summary once again.

Do not accumulate document-title prefixes on repeated failed submissions. Restore or replace the original title when errors are resolved or navigation succeeds.

Use focus-only announcement as the default strategy. If optional `role="alert"` and programmatic focus are combined, create or update the summary once per failed submission and do not independently assert the same messages through inline live regions. Test that the title and list are announced once. If a supported browser and screen-reader combination announces both the alert insertion and focus twice, omit the alert role and retain the focus-only strategy.

## Link targets

Use these targets:

```text
Single input error → visible, enabled input
Textarea error → visible, enabled textarea
Select error → visible, enabled select
Standalone Checkbox error → visible, enabled native checkbox
Radio group error → first relevant visible, enabled radio
Checkbox group error → first relevant visible, enabled checkbox
Date-of-birth specific error → visible, enabled specific field
Date-of-birth whole-date error → first relevant visible, enabled field in the group
Combination error → first relevant visible, enabled interactive child
Address specific error → visible, enabled specific field
Address whole-group error → first relevant visible, enabled field in the group
```

Every fragment must resolve to a unique relevant target.

On activation, retain the real `href` fragment as a progressive-enhancement fallback. Scroll the associated label into view for a single control, standalone Checkbox or specific multi-part field. Scroll the associated legend into view for grouped controls and whole multi-part answers. Then move focus to the target control, using an activation handler where native fragment behaviour cannot provide both the required context and focus.

Preserve the control's or owning Fieldset's established `aria-describedby` access to the inline error and useful hint. Do not repeat a Fieldset-owned group error ID on every child merely to implement link focus.

Never focus Fieldset or add `tabindex` to it for Error Summary targeting.

## Content guidance

Keep the default title `There is a problem` unless product language requires a tested alternative.

Error links should:

- use the same or clearly corresponding wording as inline errors;
- explain how to correct the problem where possible;
- make sense when encountered in a list of links;
- follow the document order of the corresponding form questions and controls.

Sort validator output into form document order before rendering. Include every distinct current user-correctable issue once; do not duplicate an item because a validator or rerender emitted the same issue more than once.

Do not put bullets, numbering, target IDs or implementation detail inside `errorText`.

Use the optional description only when short guidance helps. It should not repeat the title or the complete list.

## Figma acceptance cases

All of these cases are required:

- [ ] One item: the default item is present and the component remains attached.
- [ ] Two items: both `errorText` values are independently editable.
- [ ] Five items: children fill the width and no count variant is used.
- [ ] Ten items: the shell hugs content with no clipping or maximum-count failure.
- [ ] Add through slot control: the approved item is inserted without detachment.
- [ ] Duplicate default item: each duplicate keeps an independent `errorText`.
- [ ] Delete an item: remaining content and spacing are preserved.
- [ ] Reorder items: item content and overrides move with each item.
- [ ] Edit every `errorText`: all values remain independent and no bullet enters the text.
- [ ] Attempt to remove the final item: zero items is rejected or clearly flagged as invalid.
- [ ] Switch `state=default` to `state=focus`: slot content, order and overrides survive.
- [ ] Toggle `description`: slot content, order and overrides survive, with no hidden gap.
- [ ] Long wrapped errors: link text wraps with automatic height and no overlap or clipping.
- [ ] 320px container: title, description and links reflow without horizontal overflow.
- [ ] Multiline bullet alignment: the marker stays aligned with the first link line.
- [ ] No detachment: shell and items remain component instances through all supported operations.
- [ ] Text-property edits preserve list styling: marker and structure survive property-panel edits.
- [ ] No raw styling: all colour, spacing, typography, border and focus values use documented tokens or styles.
- [ ] Breakpoint typography: one semantic style is used per role and `base`, `md` and `lg` respond to the parent frame's `Breakpoint` mode without responsive variants.
- [ ] Semantic handoff: production remains `ul > li > a` with no bullet in the link's accessible name.
- [ ] Preferred instance only: the slot recommends only `Error Summary / Item`, enables enforcement when supported and treats arbitrary content as invalid.

## Production behaviour acceptance cases

- [ ] One error: a failed submit renders Error Summary and the inline error, then focuses the summary once.
- [ ] Several errors: identical structure is used, every distinct error is listed and the summary receives focus once.
- [ ] Repeated render: validation rerenders from the same submit do not steal focus or rebuild an unchanged alert.
- [ ] Repeated submit: a later failed submit moves focus once again without accumulating the document-title prefix.
- [ ] Focus target: the root has `tabindex="-1"` and is absent from normal Tab order; temporary `tabindex` is removed only after focus leaves.
- [ ] Link activation: every fragment resolves, the associated label or legend scrolls into view and the visible, enabled control receives focus.
- [ ] Radio group: the legend scrolls into view and the first relevant visible, enabled Radio receives focus.
- [ ] Checkbox group: the legend scrolls into view and the first relevant visible, enabled Checkbox receives focus.
- [ ] Standalone Checkbox: its label scrolls into view and the native Checkbox receives focus.
- [ ] Specific multi-part error: the part label scrolls into view and the specific field receives focus.
- [ ] Whole multi-part error: the legend scrolls into view and the first relevant visible, enabled child receives focus.
- [ ] Fieldset: no summary link focuses Fieldset or adds `tabindex` to it.
- [ ] Inline association: link activation preserves the target control's or owning Fieldset's `aria-describedby` access to the inline error.
- [ ] Values and selections: failed rendering, rerenders and link activation preserve all input, Textarea, Select, Radio, Checkbox and multi-part values.
- [ ] Ordering and deduplication: out-of-order validator results are sorted by form document order and repeated results create no duplicate item.
- [ ] Page title: the original title receives one `Error: ` prefix before focus and can be restored.
- [ ] Screen-reader announcement: the `h2`, list and links are announced once without duplicate alert, focus or inline live-region output.
- [ ] Long text and 320px: all content wraps and reflows without clipping or two-dimensional scrolling.
- [ ] 200% text resize: no content is lost, clipped or overlapped.
- [ ] 400% zoom/reflow: content works at the equivalent 320px CSS viewport without two-dimensional scrolling.
- [ ] Text spacing: WCAG text-spacing overrides cause no clipping, overlap or content loss.
- [ ] Forced colours: title, links, error boundary and root/link focus remain visible without colour alone.
- [ ] Focus not obscured: sticky or overlapping author-created content does not entirely hide summary or target focus.

## Accessibility testing

Test that:

- programmatic focus lands on Error Summary exactly once after every failed submission with one or more user-correctable errors;
- focus is visible and does not hide the error boundary;
- the root is not a normal Tab stop and any temporary `tabindex="-1"` remains until focus leaves;
- a screen reader exposes the `h2`, list, item count and links;
- the marker is not repeated in link accessible names;
- every link resolves to a visible, enabled target, scrolls its label or legend into view and focuses the control;
- Fieldset is never focused;
- inline errors remain visible and programmatically associated;
- focus is not moved while the user is typing;
- corrective rerenders do not refocus the summary;
- all values and selections are preserved;
- messages are ordered by form document order and are not duplicated;
- the page title has one error prefix;
- alert and focus behaviour does not duplicate announcements;
- content works at 200% text resize and 400% browser zoom;
- content reflows in a 320px CSS viewport;
- text-spacing overrides do not create clipping or overlap;
- forced-colours mode preserves the error boundary and focus;
- focused content is not entirely obscured;
- error and focus state do not rely on colour alone.

Relevant WCAG 2.2 considerations include 1.3.1, 1.3.2, 1.4.1, 1.4.3, 1.4.10, 1.4.11, 1.4.12, 2.4.3, 2.4.4, 2.4.6, 2.4.7, 2.4.11, 3.3.1 and 3.3.3.

## Related documentation

- [Error summary pattern](../../patterns/forms/error-summary.md)
- [Validation and errors](../../patterns/forms/validation-and-errors.md)
- [Focus management](../../patterns/forms/focus-management.md)
- [Form tokens](../../patterns/forms/tokens.md)
- [Form accessibility](../../accessibility/forms.md)
