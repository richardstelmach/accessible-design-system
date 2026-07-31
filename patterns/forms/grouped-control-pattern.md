# Grouped control pattern

Use the grouped control pattern when several controls answer one shared question.

Fieldset is the semantic grouping primitive for this pattern. It uses a native `<fieldset>` and `<legend>`.

## Use this pattern for

- radio groups
- checkbox groups
- date of birth
- address groups
- multi-part questions
- genuine parent-child grouped questions

## Core rule

A grouped control uses a native `<fieldset>` and `<legend>`.

The legend gives the group its accessible question or purpose.

Each child control may still need its own label.

Do not use Fieldset as a generic layout wrapper.

## Anatomy

```text
Grouped form control
├── Fieldset
│   ├── Group header, visual layout region
│   │   ├── Legend
│   │   ├── Group helper text, optional
│   │   └── Error message, error state only
│   └── Content slot
```

Required order:

1. Legend
2. Group helper text, when present
3. Error message, when present
4. Content slot

The content slot contains the related controls or grouped child component that answers the legend question.

Group header is a visual layout region, not extra public HTML anatomy. The native order remains Legend, group helper text, Error message and related controls.

Omitted optional elements must not leave empty markup or empty spacing.

For new compound fieldset-based Figma components, `_Fieldset/Header` is the canonical internal primitive for Legend, Helper and Error. Place that Header and the consumer's content wrapper as siblings; Header must not own the consumer's Content slot. The existing public Fieldset keeps its current internal layers and generic Content slot for compatibility, so do not nest or detach it merely to claim literal reuse. `errorAssociation` is semantic metadata, not a visual variant axis. This Figma composition does not add a required runtime wrapper: `legend` remains the first direct child of `fieldset`, followed by helper text, error text and consumer controls.

## Layout spacing

Use `form.group.gap.headerToContent` between the Group header and the content slot.

Inside the Group header, use `form.field.gap.labelToHelper` between Legend and helper text, and `form.field.gap.helperToError` between helper text and the Error message.

When helper text or Error is hidden, do not reserve empty spacing for it. Do not apply one 24px gap across Legend, helper text, Error and the content slot.

The Error message stays inside the Group header. The header-to-content gap is the same in the default and error states.

Use `form.group.gap.betweenOptions` and `form.group.gap.betweenFields` only for spacing inside the content slot. Use `form.field.gap.controlToNextField` after the complete Fieldset when the next form field begins.

## Label and legend distinction

A legend identifies the shared question for the group.

A label identifies an individual control.

They are not interchangeable.

The legend does not replace child labels. Child labels remain present where the child component requires them.

## Heading semantics

Plain legend text is the default.

A heading may be nested inside the legend when the grouped question genuinely participates in the page heading structure.

Do not add a heading to every legend automatically.

Do not choose a heading level only for visual size.

Do not duplicate identical text in a heading before the Fieldset and in the legend.

Visual legend style and semantic heading level are separate decisions.

## Required, optional and mixed groups

Fields are required unless marked optional.

Required grouped controls do not need `(required)` in the legend by default.

Optional grouped controls include `(optional)` in the visible legend.

Mixed groups are used when child controls have different requirement states. Do not add `(required)` or `(optional)` to the group legend in a mixed group; child labels communicate their own statuses.

Fieldset itself does not support the native `required` attribute. Required implementation belongs to child controls or to the grouped child component.

## Group helper text

Group helper text is optional.

Place it after the legend and before any Error message.

Give it a stable ID and reference it from the Fieldset using `aria-describedby`.

Do not automatically repeat group helper text on every child control. Child-specific help stays with the relevant child.

## Group errors

Render exactly one shared visible error after helper text, when present, and before the related controls. Its visual position does not determine its accessible owner.

Use the source option `errorAssociation: "group" | "children"`. The default is `group`. See the authoritative [Fieldset error-association contract](../../components/fieldset/fieldset.md#error-association) for the complete rules.

- In `group` mode, the Fieldset references the helper first and then the shared error. Children do not reference that error and do not receive `aria-invalid` solely because the group is invalid.
- In `children` mode, the Fieldset continues to reference the helper but excludes the shared error. Only affected visible, enabled children reference the shared error and receive `aria-invalid="true"`; unaffected children remain neutral.

Never associate the same shared error with both the Fieldset and child controls. Fieldset never receives `aria-invalid`.

### Whole-group error

Use a group-level error when the whole grouped answer is missing or invalid.

Examples:

- no required Radio selected;
- no required Checkbox selected;
- no part of a required group answered.

Use `errorAssociation: group`. A missing answer for a required group is always a whole-group error.

Do not make the Fieldset focusable and never apply `aria-invalid` to it.

### Child-field error

Use `errorAssociation: children` for one shared error only when the consuming composite can identify at least one affected visible, enabled child.

Examples:

- Date of birth year is missing;
- one address field contains an invalid value.

Only the affected child controls reference the shared error and receive `aria-invalid="true"`. If a child component instead renders and owns its own separate error, follow that child's contract; do not also create a vague Fieldset error.

The consuming composite must define a deterministic target when more than one child is affected.

### Combination error

Use `group` when the error concerns the complete combined answer. Use `children` only when the consuming composite can deterministically identify affected visible, enabled children.

Examples:

- the entered date is not real;
- a start date is later than an end date;
- two answers conflict.

In `group` mode, put the helper ID before the error ID in the Fieldset's `aria-describedby`:

```html
<fieldset aria-describedby="dob-hint dob-error">
  <legend>What is your date of birth?</legend>
  ...
</fieldset>
```

In `children` mode, the Fieldset references only the helper. Affected children add the shared error ID to their own descriptions without repeating the group helper ID.

## Error summary targeting

An error summary supplements inline errors. It does not replace them.

Error-summary links target a visible, enabled interactive child, not the non-focusable Fieldset. The consuming component defines a deterministic relevant child in `group` mode and a deterministic affected child in `children` mode. On activation, scroll the associated legend or label into view and focus that target while preserving the established association: the Fieldset retains the error in `group` mode, while affected children retain it in `children` mode.

Do not add `tabindex` to Fieldset merely to make it a summary target.

## Disabled Fieldset

Use native `disabled` only when the whole group is unavailable.

Native descendant controls become disabled and are not submitted.

Disabled is not read-only.

Child components own disabled visual presentation.

Do not rely on opacity alone.

## Nested Fieldsets

Nested Fieldsets are allowed only for a genuine parent-child question structure.

Every nested Fieldset needs its own legend.

Avoid nesting where separate sibling Fieldsets would be clearer.

Do not nest Fieldsets merely to create spacing or borders.

Test nested groups with screen readers because repeated group announcements can become verbose.

## Example: Radio group

```text
Legend: How would you like to be contacted?
Radio label: Email
Radio label: Phone
Radio label: Post
```

## Example: Date of birth

```text
Legend: What is your date of birth?
Label: Day
Label: Month
Label: Year
```

## Example HTML

```html
<fieldset aria-describedby="dob-hint">
  <legend>What is your date of birth?</legend>

  <div id="dob-hint">
    For example, 31 3 1980.
  </div>

  <p id="dob-error">
    <span class="visually-hidden">Error:</span>
    Date of birth must include a year.
  </p>

  <label for="dob-day">Day</label>
  <input id="dob-day" name="dob-day" inputmode="numeric">

  <label for="dob-month">Month</label>
  <input id="dob-month" name="dob-month" inputmode="numeric">

  <label for="dob-year">Year</label>
  <input
    id="dob-year"
    name="dob-year"
    inputmode="numeric"
    aria-describedby="dob-error"
    aria-invalid="true"
  >
</fieldset>
```
