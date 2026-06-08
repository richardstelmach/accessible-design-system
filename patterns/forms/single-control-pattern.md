# Single control pattern

Use the single control pattern when one form control answers one question.

## Use this pattern for

- text input
- textarea
- select
- password input
- search input
- currency input
- stepper
- single checkbox

## Anatomy

```text
Single form control
├── Label
├── Helper text, optional
├── Error message, optional
└── Control
```

## Recommended order

Use this order:

```text
Label
Helper text, optional
Error message, optional
Control
```

The error message appears before the control so users encounter the issue before correcting the field.

## Rules

The control must have an accessible name.

The label should be visible by default.

The label should be associated with the control.

Helper text should be associated with the control using `aria-describedby`.

Error text should be associated with the control using `aria-describedby`.

Invalid controls should use `aria-invalid="true"`.

Disabled and read-only states should be distinct.

Placeholder text must not be used as a label.

## Example: label, helper text, error and control

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

## Component contract

Single control components should support:

- `id`
- `name`
- `label`
- `labelVisibility`
- `helperText`
- `errorMessage`
- `required`
- `optional`
- `disabled`
- `readonly`
- `aria-describedby`
- `aria-invalid`

Text-like controls may also support:

- `type`
- `inputmode`
- `autocomplete`
- `autocapitalize`
- `enterkeyhint`