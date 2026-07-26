# Focus management

Focus behaviour should help users find and fix errors without disorienting them.

## Rules

Do not move focus while the user is typing.

After a failed submit with one or more user-correctable validation errors, render the error summary and every inline error, then move focus to the error summary exactly once.

Focus moves to an invalid field only when the user activates its error-summary link. Its associated inline error must remain available to assistive technology through the control's or owning Fieldset's established `aria-describedby` relationship.

Focus must be visible.

Focus style must not rely on colour alone.

## Failed submit with one or more errors

When there is at least one user-correctable validation error:

1. Preserve every entered value and selection.
2. Render an error summary and every inline error.
3. Prefix the existing document title once with `Error: `.
4. Move focus to the error summary exactly once after it has rendered.
5. Let users follow summary links to visible, enabled controls.
6. Keep inline errors visible and programmatically associated.

Use identical summary structure and focus behaviour for one error and several errors.

Do not move focus again because the same validation result rerenders while the user is correcting errors. A later explicit submit that fails is a new failed-submission event and moves focus to the summary once again.

Give the error-summary root `tabindex="-1"` before calling `focus()`. It may remain on the root without entering the normal Tab order. If it is injected temporarily, remove it only after focus leaves; never use `tabindex="0"` and never remove `tabindex="-1"` synchronously after calling `focus()`.

Use focus-only announcement by default. If optional `role="alert"` and programmatic focus are used together, ensure the title and list are announced once. Do not independently assert the same inline messages through another live region.

## Error-summary link activation

When a user activates a summary link:

1. Scroll the associated label or legend into view.
2. Move focus to the visible, enabled target control.
3. Keep the relevant inline error available through `aria-describedby`.

Do not focus Fieldset. For grouped controls and whole multi-part answers, scroll the legend and focus the first relevant visible, enabled child control. For a specific multi-part error, scroll its label and focus that specific control.

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
