# Validation and errors

When a field has an error, show an inline error message and associate it programmatically with the field.

## Core rules

The error must be written in text.

The error should explain what went wrong.

Where possible, the error should explain how to fix it.

The error must be associated with the control using `aria-describedby`.

Invalid controls should use `aria-invalid="true"`.

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
- associate the error with the group
- the error summary link should usually target the first field in the group

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