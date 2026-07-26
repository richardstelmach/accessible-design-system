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
│   ├── Group header, internal layout wrapper
│   │   ├── Legend
│   │   ├── Group helper text, optional
│   │   └── Group error message, error state only
│   └── Content slot
```

Required order:

1. Legend
2. Group helper text, when present
3. Group error message, when present
4. Content slot

The content slot contains the related controls or grouped child component that answers the legend question.

Group header is an internal layout wrapper, not extra public HTML anatomy. The native order remains Legend, group helper text, group error message and related controls.

Omitted optional elements must not leave empty markup or empty spacing.

## Layout spacing

Use `form.group.gap.headerToContent` between the Group header and the content slot.

Inside the Group header, use `form.field.gap.labelToHelper` between Legend and helper text, and `form.field.gap.helperToError` between helper text and group error.

When helper text or group error is hidden, do not reserve empty spacing for it. Do not apply one 24px gap across Legend, helper text, group error and the content slot.

The group error stays inside the Group header. The header-to-content gap is the same in the default and error states.

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

Place it after the legend and before any group error.

Give it a stable ID and reference it from the Fieldset using `aria-describedby`.

Do not automatically repeat group helper text on every child control. Child-specific help stays with the relevant child.

## Group errors

Grouped controls can have different error ownership.

### Whole-group error

Use a group-level error when the whole grouped answer is missing or invalid.

Examples:

- no required Radio selected;
- no required Checkbox selected;
- no part of a required group answered.

Associate the group error with the Fieldset using `aria-describedby`.

Do not make the Fieldset focusable. Do not apply `aria-invalid` to the Fieldset by default.

### Child-field error

Use a child-field error when one child control is invalid.

Examples:

- Date of birth year is missing;
- one address field contains an invalid value.

The affected child component owns the error, error association and `aria-invalid` behaviour.

Do not create a vague group error just because one child is invalid.

### Combination error

Use a group-level error when the combined answer is invalid.

Examples:

- the entered date is not real;
- a start date is later than an end date;
- two answers conflict.

Associate the message with the Fieldset. The child component contract determines whether any individual children also receive invalid treatment.

## Helper and error association

When helper text and a group error are both present, include both IDs in `aria-describedby`.

Put the helper ID before the error ID:

```html
<fieldset aria-describedby="dob-hint dob-error">
  <legend>What is your date of birth?</legend>
  ...
</fieldset>
```

## Error summary targeting

An error summary supplements inline errors. It does not replace them.

Error-summary links target the first relevant visible, enabled interactive child, not the non-focusable Fieldset. On activation, scroll the legend into view and focus that child while preserving the Fieldset's established `aria-describedby` access to the inline group error.

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
<fieldset aria-describedby="dob-hint dob-error">
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
