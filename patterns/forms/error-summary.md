# Error summary

Use an error summary when there is more than one error.

The error summary helps users understand all errors before correcting them.

## Rules

Place the error summary at the top of the page or form.

Move focus to the error summary after failed submit.

Use a clear heading, such as “There is a problem”.

List each error.

Each error should link to the relevant field or group.

For grouped controls, the link normally targets a relevant interactive child or a documented grouped-control target rather than the non-focusable Fieldset.

Each field or group should still show its own inline error.

The error summary does not replace inline errors.

## Example

```html
<div class="error-summary" role="alert" tabindex="-1">
  <h2>There is a problem</h2>
  <ul>
    <li><a href="#full-name">Enter your full name</a></li>
    <li><a href="#dob-year">Date of birth must include a year</a></li>
  </ul>
</div>
```

## Link target rules

Use these rules for error summary links:

```text
Single input error → link to the input
Textarea error → link to the textarea
Select error → link to the select
Radio group error → link to the first radio option or group target
Checkbox group error → link to the first checkbox option or group target
Date of birth specific error → link to the specific field
Date of birth whole-date error → link to the first field in the group
Combination error → link to the first relevant child
Address specific error → link to the specific field
Address whole-group error → link to the first relevant field in the group
```

Do not add `tabindex` to a Fieldset merely to make it an error-summary target.

## Focus behaviour

Do not move focus while the user is typing.

After failed submit, move focus to the error summary when there are multiple errors.

If there is only one error and no error summary is used, focus may move to the invalid field.

When focus lands on an invalid field, the associated error should be available to assistive technology through `aria-describedby`.

## Inline errors

The error summary does not replace inline errors.

Each invalid field or group must still show its own inline error message.

For a Fieldset group-level error, keep the inline group error associated with the Fieldset using `aria-describedby`.

## Error wording

Error summary links should normally use the same wording as the inline error.

Where possible, error messages should explain how to fix the issue.
