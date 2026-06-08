# Legends and fieldsets

Use a `fieldset` and `legend` when a group of controls answers one shared question.

## Core rules

A legend identifies the purpose of a group.

A legend is not a replacement for every child label.

Labels and legends are not interchangeable.

Use a label for an individual control.

Use a legend for a group of related controls.

## When to use a fieldset and legend

Use a fieldset and legend for:

- radio groups
- checkbox groups
- date of birth fields
- address groups
- multi-part questions
- groups of fields that need one shared question

## Radio group example

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

In this example:

```text
Legend = shared question
Radio labels = answer options
```

## Date of birth example

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

In this example:

```text
Legend = shared question
Labels = individual fields within the answer
```

## Helper text and errors

Group helper text should be associated with the fieldset or group.

Group-level errors should be associated with the fieldset or group.

Child-field errors should be associated with the specific child field.

## Important distinction

Do not document grouped controls as having a “label or legend”.

Use:

```text
Label = individual control
Legend = grouped controls inside a fieldset
```