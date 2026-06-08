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