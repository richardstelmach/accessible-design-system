# Validation and errors

When a field has an error, show an inline error message and associate it programmatically with the field.

## Core rules

The error must be written in text.

The error should explain what went wrong.

Where possible, the error should explain how to fix it.

The error must be associated with the relevant control or group using `aria-describedby`.

Invalid controls should use `aria-invalid="true"`.

For Fieldset group-level errors, associate the error with the Fieldset using `aria-describedby`. Do not apply `aria-invalid` to the Fieldset by default.

Do not rely on colour alone.

The inline error still appears even when there is an error summary.

## Recommended order

Use this order for a single control:

```text
Label
Helper text, optional
Error message
Control
```

Use this order for a grouped control:

```text
Group header
├── Legend
├── Helper text, optional
└── Group error message
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
- the error summary link should usually target the first relevant interactive control
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

An error summary supplements inline errors. Inline field and group errors remain visible.

Summary wording should match or clearly correspond to the inline error.

For group-level Fieldset errors, the summary link normally targets the first relevant interactive child or a documented grouped-control target.

For child-field errors, the summary link targets the invalid child.

Do not add `tabindex` to Fieldset merely to make it an error-summary target.
