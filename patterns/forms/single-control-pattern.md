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

For Text Input, Textarea, Select and similar single controls, use this anatomy:

```text
Single form control
├── Label
├── Helper text, optional
├── Error message, optional
└── Control
```

## Recommended order

For those controls, use this order:

```text
Label
Helper text, optional
Error message, optional
Control
```

For those controls, the error message appears before the control so users encounter the issue before correcting the field.

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
