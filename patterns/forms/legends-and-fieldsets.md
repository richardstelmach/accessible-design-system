# Legends and fieldsets

Use a `<fieldset>` and `<legend>` when a group of controls answers one shared question.

Fieldset is the design-system component for this grouped-control foundation. Legend is required anatomy inside Fieldset, not a standalone published component.

## Core rules

A legend identifies the purpose of a group.

A legend is not a replacement for every child label.

Labels and legends are not interchangeable.

Use a label for an individual control.

Use a legend for a group of related controls.

The legend must be the first direct child of the `<fieldset>`.

Do not make the Fieldset focusable.

Do not add `role="group"` to a native `<fieldset>`.

## When a Fieldset is required

Use a Fieldset and legend for:

- radio groups;
- checkbox groups;
- date of birth fields;
- address groups;
- multi-part questions;
- groups of fields that need one shared question;
- genuine parent-child grouped questions.

## When not to use Fieldset

Do not use Fieldset:

- for one standalone control;
- as a generic layout container;
- only to add spacing, a border or visual grouping;
- around unrelated fields;
- around arbitrary page content.

## Legend versus label

In a radio group:

```text
Legend = shared question
Radio labels = answer options
```

In a date of birth group:

```text
Legend = shared question
Labels = individual fields within the answer
```

Do not document grouped controls as having a "label or legend".

Use:

```text
Label = individual control
Legend = grouped controls inside a fieldset
```

## Heading inside legend

Plain legend text is the default semantic configuration.

```html
<fieldset>
  <legend>What is your address?</legend>
  ...
</fieldset>
```

A heading may be nested inside the legend when the grouped question genuinely participates in the document heading structure.

```html
<fieldset>
  <legend>
    <h2>What is your address?</h2>
  </legend>
  ...
</fieldset>
```

Do not add a heading to every legend automatically.

Do not duplicate identical text in a heading before the Fieldset and in the legend.

Choose the heading level from the document structure, not visual appearance.

H1 through H6 are allowed when structurally correct.

## Visual legend style

Visual legend style and semantic heading level are separate decisions.

The responsive legend styles are:

| Legend style | Visual mapping | Typical semantic heading |
| ------------ | -------------- | ------------------------ |
| Page | H1-aligned typography | H1 |
| Default | H2-aligned typography | H2 or no heading |
| Section | H3-aligned typography | H3 |
| Subsection | H4-aligned typography | H4 |
| Compact | Responsive form-label typography | No heading |

A plain legend can use the default H2-aligned visual style without becoming an H2.

H5 and H6 are supported as semantic heading levels when the document structure requires them, but there are no dedicated H5 or H6 Fieldset visual tokens.

## Helper text and errors

Group helper text appears after the legend and before any Error message.

Group helper text should have a stable ID and be associated with the Fieldset using `aria-describedby`.

Show exactly one shared visible error after helper text, when present, and before the related controls. Its accessible owner is selected with `errorAssociation: "group" | "children"`; `group` is the default. See the authoritative [Fieldset error-association contract](../../components/fieldset/fieldset.md#error-association).

- In `group` mode, the Fieldset references the helper first and then the shared error. Whole-group required errors use this mode.
- In `children` mode, the Fieldset references only the helper. Only affected visible, enabled children reference the shared error and receive `aria-invalid="true"`; unaffected children remain neutral.

Never associate the same shared error with both Fieldset and children. Fieldset never receives `aria-invalid`.

## Group header spacing

For layout, treat the legend, optional group helper text and optional Error message as the Fieldset Group header.

Group header is a visual layout region, not a public HTML part. The native order remains legend, helper text, Error message and related controls.

Use `form.group.gap.headerToContent` between the Group header and the content slot. Use `form.field.gap.labelToHelper` between legend and helper text, and `form.field.gap.helperToError` between helper text and the Error message.

If helper text or Error is not present, collapse it without leaving empty spacing. Do not use one 24px gap across legend, helper text, Error and content.

## Native disabled behaviour

Use the native `disabled` attribute only when the whole group is unavailable.

Descendant controls are disabled according to native HTML behaviour and are not submitted.

Disabled is not read-only.

Child components own disabled visual presentation. Do not rely on opacity alone.

## Nested Fieldsets

Nested Fieldsets are allowed only for a real parent-child question structure.

Every nested Fieldset must have its own legend.

Do not nest Fieldsets merely for layout, spacing or borders.

Sibling Fieldsets are often clearer.

Test nested groups with screen readers because repeated group announcements can become verbose.

## Content slot relationship

The Fieldset content slot contains the related controls or grouped component that answers the legend's shared question.

All slotted content must relate to the legend.

Child controls keep their own labels, names, roles, values, states and validation.

Do not place arbitrary prose, navigation, actions or unrelated content in the slot.

For new compound fieldset-based Figma components, compose the internal `_Fieldset/Header` and the consumer's content wrapper as siblings. `_Fieldset/Header` contains Legend, Helper and Error but does not own consumer content. Do not nest or detach the public Fieldset merely to claim reuse; its current layers, public properties and generic Content slot remain unchanged for compatibility.

The Figma Header boundary is not a runtime DOM wrapper. Any code implementation must render a fragment or direct children so `legend` remains the first direct child of `fieldset`, followed by helper text, error text and consumer controls.

## Examples

```html
<fieldset>
  <legend>How would you like to be contacted?</legend>

  <label>
    <input type="radio" name="contact-method" value="email">
    Email
  </label>

  <label>
    <input type="radio" name="contact-method" value="phone">
    Phone
  </label>
</fieldset>
```

```html
<fieldset>
  <legend>What is your date of birth?</legend>

  <label for="dob-day">Day</label>
  <input id="dob-day" name="dob-day">

  <label for="dob-month">Month</label>
  <input id="dob-month" name="dob-month">

  <label for="dob-year">Year</label>
  <input id="dob-year" name="dob-year">
</fieldset>
```
