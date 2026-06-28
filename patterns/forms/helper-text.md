# Helper text

Helper text is optional.

Use helper text only when it helps users answer correctly.

## Rules

Helper text should sit between the label or legend and the control.

Helper text should be short.

Helper text should be associated with the control or group using `aria-describedby`.

Helper text should not repeat the label.

Helper text should not replace the label.

Placeholder text should not be used instead of helper text.

## Group helper text

For Fieldset and other grouped controls, group helper text supports the shared legend question.

Place group helper text directly after the legend and before any group error message.

Legend, group helper text and group error form the grouped control's internal Group header. Use `form.field.gap.labelToHelper` between legend and helper text, and `form.field.gap.helperToError` between helper text and group error.

Use `form.group.gap.headerToContent` between the complete Group header and the related controls. Hidden helper or error content must not leave empty spacing.

Give group helper text a stable ID.

Associate it with the Fieldset using `aria-describedby`.

When group helper text and a group error message are both present, list the helper ID before the error ID in `aria-describedby`.

Do not automatically repeat group helper text on every child control.

Child-specific help remains associated with the relevant child control.

## Use helper text for

- format guidance
- where to find information
- how the answer will be used
- clarifying a confusing label
- constraints the user should know before answering

## Avoid helper text for

- repeating the label
- replacing the label
- long instructions
- critical validation that only appears after error
- content that should be part of the main page or form guidance

## Good example

```text
National Insurance number
It’s on your National Insurance card, benefit letter, payslip or P60.
```

## Avoid

```text
Email address
Enter your email address.
```

This repeats the label and does not add useful information.

## Example HTML

```html
<label for="national-insurance-number">
  National Insurance number
</label>

<div id="national-insurance-number-hint">
  It’s on your National Insurance card, benefit letter, payslip or P60.
</div>

<input
  id="national-insurance-number"
  name="national-insurance-number"
  aria-describedby="national-insurance-number-hint"
/>
```

## Group helper example

```html
<fieldset aria-describedby="dob-hint">
  <legend>What is your date of birth?</legend>

  <div id="dob-hint">
    For example, 31 3 1980.
  </div>

  ...
</fieldset>
```
