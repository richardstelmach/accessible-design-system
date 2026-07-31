# Validation and errors

When a field has an error, show an inline error message and associate it programmatically with the field.

## Core rules

The error must be written in text.

The error should explain what went wrong.

Where possible, the error should explain how to fix it.

The error must be associated with the relevant control or group using `aria-describedby`.

Invalid controls should use `aria-invalid="true"`.

For one shared Fieldset error, use `errorAssociation: "group" | "children"`; `group` is the default. The Fieldset always retains its helper association and never receives `aria-invalid`. See the authoritative [Fieldset error-association contract](../../components/fieldset/fieldset.md#error-association).

Do not rely on colour alone.

The inline error still appears even when there is an error summary.

After a failed submit with one or more user-correctable validation errors, render an error summary and every inline error before moving focus to the summary once.

## Recommended order

For Text Input, Textarea, Select and similar single controls, use this order:

```text
Label
Helper text, optional
Error message
Control
```

### Standalone Checkbox exception

For a standalone Checkbox, the native input and visible associated label form one option row. Use this order:

```text
Checkbox root
|-- option row
|   |-- Native Checkbox input
|   `-- Visible associated label and optional description content
`-- individual error
```

Keep the native Checkbox input and label together in the option row. An optional Checkbox-specific description belongs with the option content but remains outside the HTML `<label>`. The individual error follows the complete option row and remains outside the associated label.

This exception does not change the normal error ordering for Text Input, Textarea, Select or similar controls. A whole-group Checkbox error uses `errorAssociation: group`; it is not an individual Checkbox error.

Use this order for a grouped control:

```text
Group header
├── Legend
├── Helper text, optional
└── One shared error
Related controls
```

Group header is a visual layout region, not additional public HTML anatomy. The DOM and semantic order remains legend, helper text, the shared error and related controls.

Use `form.group.gap.headerToContent` between the Group header and related controls in both default and error states. Do not use `form.field.gap.errorToControl` for Fieldset header-to-content spacing.

When helper and shared error are both owned by the Fieldset in `group` mode, put the helper ID before the error ID in `aria-describedby`. In `children` mode, the Fieldset references only the group helper; affected children add the shared error ID after any child-owned helper ID while preserving their other description IDs and do not repeat the group helper ID.

## Single field error example

```html
<label for="postcode">Postcode</label>

<p id="postcode-error">
  <span class="visually-hidden">Error:</span>
  Enter a real postcode.
</p>

<input
  id="postcode"
  name="postcode"
  aria-describedby="postcode-error"
  aria-invalid="true"
/>
```

## Field with helper text and error

```html
<label for="email">Email address</label>

<div id="email-hint">
  We’ll only use this to contact you about your application.
</div>

<p id="email-error">
  <span class="visually-hidden">Error:</span>
  Enter an email address in the correct format.
</p>

<input
  id="email"
  name="email"
  type="email"
  aria-describedby="email-hint email-error"
  aria-invalid="true"
/>
```

## Group errors

When a grouped control presents a shared Fieldset error, keep one visible error after Helper and before the related controls. Accessible ownership is selected independently through `errorAssociation`, and the same shared error must never be associated with both Fieldset and children.

### Whole group is invalid

Example:

```text
Question: How would you like to be contacted?
Error: Select how you would like to be contacted.
```

Pattern:

```html
<fieldset aria-describedby="contact-error">
  <legend>How would you like to be contacted?</legend>

  <p id="contact-error">
    <span class="visually-hidden">Error:</span>
    Select how you would like to be contacted.
  </p>

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

Rules:

- show one group-level error;
- use `errorAssociation: group`;
- associate it with the Fieldset using `aria-describedby`;
- do not make the Fieldset focusable;
- never apply `aria-invalid` to the Fieldset;
- do not associate the shared error with any child control;
- preserve the user's existing selections and values.

For checkbox groups, minimum, maximum and exact selection errors are whole-group errors and use `errorAssociation: group`. Fieldset owns the visible group error and its `aria-describedby` relationship. Individual Checkbox instances keep their normal visual states; do not turn every checkbox boundary red, repeat `aria-invalid="true"` on every child checkbox or repeat the Fieldset error ID on every child checkbox.

An individual standalone Checkbox can own an error only when that checkbox itself is independently validated, such as a mandatory acceptance checkbox. In that case, show visible inline error text, set `aria-invalid="true"` on the native checkbox and associate the error with that checkbox using `aria-describedby`.

### One child field is invalid

Example:

```text
Question: What is your date of birth?
Error: Date of birth must include a year.
```

A child component may render and own its own individual inline error. In that case, associate that error with the specific invalid child and follow the child's error contract; do not create a second vague Fieldset error.

If the consuming composite instead renders one shared error in the Fieldset header, it may use this `children` pattern when it can identify the affected visible, enabled children:

- the group has a legend
- use `errorAssociation: children`
- only affected visible, enabled child fields have the shared error association
- only affected child fields use `aria-invalid="true"`
- unaffected children remain neutral
- the Fieldset excludes the shared error ID but retains any helper ID
- do not create a second vague Fieldset error merely because one child is invalid

Example:

```html
<fieldset>
  <legend>What is your date of birth?</legend>

  <p id="dob-year-error">
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
    aria-describedby="dob-year-error"
    aria-invalid="true"
  >
</fieldset>
```

### The combination is invalid

Example:

```text
Question: What is your date of birth?
Error: Date of birth must be in the past.
```

Pattern:

- use `group` when the error concerns the complete combined answer
- associate the error with the Fieldset using `aria-describedby` and do not repeat it on children
- use `children` instead only when the consuming composite can deterministically identify at least one affected visible, enabled child
- the consuming composite defines the error-summary target: a relevant visible, enabled child in `group` mode or an affected visible, enabled child in `children` mode; activation scrolls the associated legend or label into view and focuses that target
- never use both association modes for the same shared error

Example:

```html
<fieldset aria-describedby="dob-error">
  <legend>What is your date of birth?</legend>

  <p id="dob-error">
    <span class="visually-hidden">Error:</span>
    Date of birth must be in the past.
  </p>

  <label for="dob-day">Day</label>
  <input id="dob-day" name="dob-day" inputmode="numeric">

  <label for="dob-month">Month</label>
  <input id="dob-month" name="dob-month" inputmode="numeric">

  <label for="dob-year">Year</label>
  <input id="dob-year" name="dob-year" inputmode="numeric">
</fieldset>
```

## Group helper text with errors

When a grouped control has both helper text and a shared error, keep the helper visible when it still helps users correct the answer.

The shared error remains inside the visual Group header. Use `form.field.gap.helperToError` between helper text and the error, then `form.group.gap.headerToContent` between the complete Group header and related controls.

In `group` mode, list the helper ID first and the error ID second on the Fieldset:

```html
<fieldset aria-describedby="contact-hint contact-error">
  <legend>How would you like to be contacted?</legend>
  ...
</fieldset>
```

In `children` mode, the Fieldset references only `contact-hint`. Only affected visible, enabled children reference `contact-error` and receive `aria-invalid="true"`. Do not put `contact-error` on the Fieldset as well.

## Error summary targets

An error summary is required after a failed submit with one or more user-correctable validation errors. It supplements inline errors; every inline field and group error remains visible and programmatically associated.

Summary wording should match or clearly correspond to the inline error.

Every summary link targets a unique, visible, enabled control. Preserve the established `aria-describedby` ownership: Fieldset in `group` mode, or affected children in `children` mode.

For group-level Fieldset errors, scroll the legend into view and focus the first relevant visible, enabled interactive child.

For child-field errors, scroll the associated label into view and focus the visible, enabled invalid child. When several children are affected, the consuming component defines one deterministic summary target.

For a standalone Checkbox error, scroll its associated label into view and focus the visible, enabled native Checkbox input.

For a whole multi-part answer error in `group` mode, scroll the legend into view and focus the consumer-defined relevant visible, enabled child. In `children` mode, target a deterministic affected visible, enabled child. For a specific individually owned part error, scroll that field's label into view and focus that field.

Do not add `tabindex` to Fieldset merely to make it an error-summary target.

Do not change or duplicate the shared error association merely to implement summary-link focus.
