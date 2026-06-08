# Grouped control pattern

Use the grouped control pattern when several controls answer one shared question.

## Use this pattern for

- radio group
- checkbox group
- date of birth
- address group
- multi-part questions

## Core rule

A grouped control uses a `fieldset` and `legend`.

The legend gives the group its accessible question or purpose.

Each child control may still need its own label.

## Anatomy

```text
Grouped form control
├── Fieldset
│   ├── Legend
│   ├── Group helper text, optional
│   ├── Group error message, optional
│   └── Related controls
```

## Label and legend distinction

A legend identifies the shared question for the group.

A label identifies an individual control.

They are not interchangeable.

## Example: radio group

```text
Legend: How would you like to be contacted?
Radio label: Email
Radio label: Phone
Radio label: Post
```

## Example: date of birth

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

## Rules

Use `fieldset` and `legend` when several controls answer one shared question.

Do not use a legend for a single standalone control.

Do not use a label as a substitute for a group legend.

Do not use a legend as a substitute for every child label.

Associate group helper text with the group.

Associate group-level errors with the group.

Associate child-field errors with the specific invalid child field.