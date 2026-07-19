# Required and optional fields

The design system should use one consistent pattern for showing whether fields are required or optional.

## Recommended decision

Fields are treated as required unless marked optional.

Use “(optional)” in the visible label or legend when a field or group of fields is optional.

Do not add “(required)” to required fields by default.

This keeps forms simpler and reduces visual noise, while still making optional fields clear.

## Example labels

```text
Email address
Middle name (optional)
Phone number (optional)
```

For grouped controls:

```text
What is your previous address? (optional)
```

## Supporting form guidance

Where a form contains several fields, include guidance near the start of the form.

```text
All fields are required unless marked optional.
```

This helps users understand the pattern before they start completing the form.

## Rules

Do not rely on an asterisk alone.

Do not rely on colour alone.

Do not hide required or optional status from assistive technology.

Keep the wording consistent across all field types.

Use “(optional)” exactly, including the brackets, unless the product has a tested reason to use different wording.

Do not mix “required unless marked optional” with another pattern in the same form.

## Required fields

Required fields do not need extra visible text if the form pattern states that fields are required unless marked optional.

Use the native `required` attribute where the field must be completed before submission.

Example:

```html
<label for="email">Email address</label>
<input id="email" name="email" type="email" required>
```

## Optional fields

Optional fields should include “(optional)” in the visible label.

Example:

```html
<label for="middle-name">Middle name (optional)</label>
<input id="middle-name" name="middle-name">
```

## Standalone checkboxes

For a standalone checkbox, native `required` means the checkbox must be checked before the form is valid. Use it only when a positive checked answer is genuinely mandatory, such as accepting a required term.

A mandatory standalone checkbox does not need “(required)” by default. An optional standalone checkbox may include “(optional)” in the visible label, and that wording is part of the accessible name.

Optional preference and consent checkboxes normally have no validation error merely because they remain unchecked. Native unchecked checkboxes are not submitted with the form, so applications must handle the absent name and value.

## Grouped optional fields

For a grouped control, include “(optional)” in the legend.

Do not repeat “(optional)” on every field inside the group unless each individual field has its own separate optional status.

Example:

```html
<fieldset>
  <legend>What is your previous address? (optional)</legend>

  <label for="previous-address-line-1">Address line 1</label>
  <input id="previous-address-line-1" name="previous-address-line-1">

  <label for="previous-town">Town or city</label>
  <input id="previous-town" name="previous-town">
</fieldset>
```

For checkbox groups, Fieldset owns the group-level required, optional or mixed wording. Do not repeat “(optional)” on every checkbox when the whole group is optional.

## Required grouped fields

For required grouped controls, the legend does not need “(required)” if the form pattern states that fields are required unless marked optional.

Fieldset itself has no native `required` attribute. Required implementation remains with the child controls or grouped child component.

Example:

```html
<fieldset>
  <legend>What is your preferred contact method?</legend>

  <input id="contact-email" name="contact-method" type="radio" value="email" required>
  <label for="contact-email">Email</label>

  <input id="contact-phone" name="contact-method" type="radio" value="phone">
  <label for="contact-phone">Phone</label>
</fieldset>
```

For checkbox groups, do not apply `required` to one arbitrary checkbox as a shortcut for “select at least one”. Applying `required` to every checkbox means every checkbox is individually mandatory. Minimum, maximum and exact selection-count rules need group-level validation owned by Fieldset.

## Mixed-requirement groups

Use a mixed-requirement group when child controls inside one Fieldset have different requirement statuses.

Do not add “(required)” or “(optional)” to the group legend, because that would describe the whole group inaccurately.

Each child label communicates its own status.

Example:

```html
<fieldset>
  <legend>What is your delivery address?</legend>

  <label for="delivery-address-line-1">Address line 1</label>
  <input id="delivery-address-line-1" name="delivery-address-line-1" required>

  <label for="delivery-address-line-2">Address line 2 (optional)</label>
  <input id="delivery-address-line-2" name="delivery-address-line-2">
</fieldset>
```

Do not use mixed status when the whole group is clearly required or clearly optional.

## Validation

Required fields should be validated when the user submits the form.

Do not rely only on the browser’s default validation messages. Provide clear, specific error messages.

Example:

```text
Enter your email address
```

For optional fields, only validate the field if the user has entered something.

For example, an optional phone number field can be left blank. But if the user enters a phone number, it should be checked that the value is in an acceptable format.

## Error messages

When a required field is empty, the error message should explain what the user needs to do.

Example:

```html
<label for="email">Email address</label>
<p id="email-error">Enter your email address</p>
<input
  id="email"
  name="email"
  type="email"
  required
  aria-describedby="email-error"
  aria-invalid="true"
>
```

For grouped controls, associate the error with the group.

Example:

```html
<fieldset aria-describedby="contact-method-error">
  <legend>What is your preferred contact method?</legend>

  <p id="contact-method-error">Select your preferred contact method</p>

  <input id="contact-email" name="contact-method" type="radio" value="email" required>
  <label for="contact-email">Email</label>

  <input id="contact-phone" name="contact-method" type="radio" value="phone">
  <label for="contact-phone">Phone</label>
</fieldset>
```

## Accessibility requirements

The required or optional status must be visible to users.

The required or optional status must be available to assistive technology.

For individual fields, include optional status in the `label`.

For grouped controls, include optional status in the `legend`.

Use the native `required` attribute for required form controls where appropriate.

Do not use `required` on a Fieldset.

Use `aria-required="true"` only when the native `required` attribute is not suitable or not supported by the control pattern.

Do not use placeholder text to communicate required or optional status.

Do not use an asterisk as the only way to show that a field is required.

If an asterisk is used for visual emphasis, it must be explained in text and hidden or announced appropriately for assistive technology.

## Exception: explicitly marking both required and optional fields

In some contexts, it may be clearer to explicitly mark both required and optional fields.

This may be useful for:

* ecommerce checkout forms
* dense multi-field forms
* forms where required and optional fields are mixed unpredictably
* forms where user research shows people are unsure what is required

If using this pattern, mark required fields with “(required)” and optional fields with “(optional)” consistently.

Example:

```text
Email address (required)
Middle name (optional)
Phone number (optional)
```

Do not mix this pattern with the default “required unless marked optional” pattern in the same form.

## Design system decision

The default design system pattern is:

```text
All fields are required unless marked optional.
```

Required fields:

```text
Email address
```

Optional fields:

```text
Middle name (optional)
```

Optional groups:

```text
What is your previous address? (optional)
```

Use explicit “(required)” labels only as an exception where research or context shows that marking both required and optional fields would make the form clearer.
