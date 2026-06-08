# Focus management

Focus behaviour should help users find and fix errors without disorienting them.

## Rules

Do not move focus while the user is typing.

After failed submit, move focus to the error summary when there are multiple errors.

If there is only one error and no error summary is used, focus may move to the invalid field.

When focus lands on an invalid field, its associated error should be available to assistive technology through `aria-describedby`.

Focus must be visible.

Focus style must not rely on colour alone.

## Failed submit with multiple errors

When there is more than one error:

1. Show an error summary.
2. Move focus to the error summary.
3. Let users follow summary links to each field.
4. Keep inline errors visible beside each invalid field or group.

## Failed submit with one error

When there is one error, either of these patterns may be used:

1. Show an error summary and move focus to it.
2. Move focus directly to the invalid field.

Use one approach consistently for the product or form pattern.

## While typing

Do not unexpectedly move focus while the user is typing.

Do not move focus to the next field automatically unless there is a strong, tested reason.

## Focus appearance

Focus must be visible for keyboard users.

Focus indicators should have enough contrast against adjacent colours.

Focus indicators should remain visible on error states and disabled-adjacent content.

## Error and focus together

When a field is both focused and in error, both states should be clear.

The focus indicator must not be hidden by the error border.

The error styling must not remove the visible focus indicator.