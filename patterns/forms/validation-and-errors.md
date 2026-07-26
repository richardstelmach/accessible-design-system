# Validation and errors

When a field has an error, show an inline error message and associate it programmatically with the field.

## Core rules

The error must be written in text.

The error should explain what went wrong.

Where possible, the error should explain how to fix it.

The error must be associated with the relevant control or group using `aria-describedby`.

Invalid controls should use `aria-invalid="true"`.

For a Fieldset group error, associate the error with the Fieldset using `aria-describedby`. Do not apply `aria-invalid` to the Fieldset by default.

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

This exception does not change the normal error ordering for Text Input, Textarea, Select or similar controls. A Fieldset group error remains owned by Fieldset and is not an individual Checkbox error.

Use this order for a grouped control:

```text
Group header
├── Legend
├── Helper text, optional
└── Fieldset group error
Related controls
```

Group header is an internal layout wrapper, not additional public HTML anatomy. The DOM and semantic order remains legend, helper text, group error and related controls.

Use `form.group.gap.headerToContent` between the Group header and related controls in both default and error states. Do not use `form.field.gap.errorToControl` for Fieldset header-to-content spacing.

When helper and error text are both present, put the helper ID before the error ID in `aria-describedby`.

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

Grouped controls can have different types of errors.

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
- associate it with the Fieldset using `aria-describedby`;
- do not make the Fieldset focusable;
- do not apply `aria-invalid` to the Fieldset by default;
- preserve the user's existing selections and values.

For checkbox groups, minimum, maximum and exact selection errors are whole-group errors. Fieldset owns the visible group error and its `aria-describedby` relationship. Individual Checkbox instances keep their normal visual states; do not turn every checkbox boundary red, repeat `aria-invalid="true"` on every child checkbox or repeat the Fieldset error ID on every child checkbox.

An individual standalone Checkbox can own an error only when that checkbox itself is independently validated, such as a mandatory acceptance checkbox. In that case, show visible inline error text, set `aria-invalid="true"` on the native checkbox and associate the error with that checkbox using `aria-describedby`.

### One child field is invalid

Example:

```text
Question: What is your date of birth?
Error: Date of birth must include a year.
```

Pattern:

- the group has a legend
- the specific invalid child field has the error association
- the invalid child field uses `aria-invalid="true"`
- do not create a second vague Fieldset error merely because one child is invalid

Example:

```html
<fieldset>
  <legend>What is your date of birth?</legend>

  <label for="dob-day">Day</label>
  <input id="dob-day" name="dob-day" inputmode="numeric">

  <label for="dob-month">Month</label>
  <input id="dob-month" name="dob-month" inputmode="numeric">

  <label for="dob-year">Year</label>

  <p id="dob-year-error">
    <span class="visually-hidden">Error:</span>
    Date of birth must include a year.
  </p>

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

- treat this as a group-level error
- associate the error with the Fieldset using `aria-describedby`
- the error summary link targets the first relevant visible, enabled interactive control, scrolls the legend into view and focuses that control
- the child component contract determines whether relevant child controls also receive invalid styling or `aria-invalid`

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

When a grouped control has both helper text and a group error, keep the helper visible when it still helps users correct the answer.

The group error remains inside the Group header. Use `form.field.gap.helperToError` between helper text and group error, then `form.group.gap.headerToContent` between the complete Group header and related controls.

List the helper ID first and the error ID second:

```html
<fieldset aria-describedby="contact-hint contact-error">
  <legend>How would you like to be contacted?</legend>
  ...
</fieldset>
```

## Error summary targets

An error summary is required after a failed submit with one or more user-correctable validation errors. It supplements inline errors; every inline field and group error remains visible and programmatically associated.

Summary wording should match or clearly correspond to the inline error.

Every summary link targets a unique, visible, enabled control. Preserve the target control's or owning Fieldset's established `aria-describedby` access to the inline error and any useful hint.

For group-level Fieldset errors, scroll the legend into view and focus the first relevant visible, enabled interactive child.

For child-field errors, scroll the associated label into view and focus the visible, enabled invalid child.

For a standalone Checkbox error, scroll its associated label into view and focus the visible, enabled native Checkbox input.

For a whole multi-part answer error, scroll the legend into view and focus the first relevant visible, enabled child. For a specific-part error, scroll that field's label into view and focus that field.

Do not add `tabindex` to Fieldset merely to make it an error-summary target.

Do not repeat a Fieldset-owned group error ID on every child merely to implement summary-link focus.
