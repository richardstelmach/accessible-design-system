# Form accessibility

This document defines the system-wide accessibility principles for forms and form controls.

It is an accessibility overview, not a replacement for the component and pattern contracts.

## Purpose

Forms must be accessible to people using:

* keyboards
* screen readers
* screen magnification
* speech recognition
* browser zoom
* custom text sizing
* touch input
* mobile keyboards
* autofill
* cognitive support tools

Form components should help users understand what is being asked, enter information correctly, recover from errors, and complete tasks without unnecessary barriers.

## Scope

This guidance applies to all form-related components, including:

* text input
* textarea
* select
* radio group
* checkbox group
* single checkbox
* date of birth
* stepper
* search input
* password input
* currency input
* fieldset
* error summary

## Source of truth

Do not duplicate detailed component rules in this file.

The source of truth for form accessibility requirements is:

* `patterns/forms/form-field-patterns.yaml`
* `patterns/forms/*.md`
* `components/<component>/<component>.yaml`

For Text Input specifically, use:

* `components/text-input/text-input.yaml`
* `patterns/forms/form-field-patterns.yaml`
* `patterns/forms/single-control-pattern.md`
* `patterns/forms/labels.md`
* `patterns/forms/helper-text.md`
* `patterns/forms/required-and-optional.md`
* `patterns/forms/validation-and-errors.md`
* `patterns/forms/focus-management.md`
* `patterns/forms/disabled-and-readonly.md`
* `patterns/forms/input-types-and-keyboards.md`

This file should point to those rules rather than repeat them in full.

## Core principles

All form controls must:

* have an accessible name
* use a visible label by default
* make the question or required action clear
* use helper text only when it helps users answer correctly
* associate helper text with the control when present
* show validation errors in text
* associate validation errors with the relevant control
* expose invalid state programmatically
* preserve visible keyboard focus
* not rely on colour alone
* not use placeholder text as a label
* support browser zoom and text resizing
* use appropriate input attributes for mobile keyboards and autofill
* distinguish disabled and read-only states visually and programmatically

## Labels and accessible names

Every form control must have an accessible name.

Visible labels are the default and preferred pattern.

Labels should:

* clearly describe the information being requested
* be programmatically associated with the control
* remain visible when the control has a value
* match or be included in the accessible name
* include “(optional)” when the field is optional

Labels must not:

* be replaced by placeholder text
* rely on colour alone to communicate meaning
* use `aria-label` when a visible label can be used
* move into the input as the only label

## Required and optional fields

The design system treats fields as required unless marked optional.

Optional fields must include “(optional)” in the visible label or legend.

Required fields do not need “(required)” in the label when the surrounding form pattern states that fields are required unless marked optional.

Do not rely on:

* an asterisk alone
* colour alone
* hidden text alone
* visual styling alone

The required or optional status must be clear and consistent across field types.

## Helper text

Helper text is optional.

Use helper text when it helps users:

* understand what information is needed
* choose the right format
* avoid predictable errors
* understand why information is being asked for

Helper text must:

* sit close to the related control
* be associated with the control using `aria-describedby`
* be available before the user enters a value
* be short, specific and useful

Helper text must not:

* replace the label
* repeat the label
* be placed in placeholder text
* contain essential information that disappears on focus

## Validation and errors

Validation errors must help users understand what went wrong and how to fix it.

Inline error messages must:

* be shown in text
* be close to the relevant field
* be associated with the control using `aria-describedby`
* be shown when an error summary is present
* not rely on colour alone
* use `aria-invalid="true"` on invalid controls

Error messages should:

* be specific
* use plain language
* explain how to fix the problem where possible
* avoid blaming the user

Use an “Error:” prefix or equivalent accessible cue where it improves clarity.

## Error summary

After a failed submit with one or more user-correctable validation errors, render an error summary and every inline error. One error and several errors use the same summary structure and behaviour.

An error summary must:

* appear near the top of the page or form
* receive focus exactly once after the summary and inline errors render
* include a clear `h2` heading
* list each distinct current error once, in the document order of the related form controls
* link each error to a visible, enabled control
* scroll the associated label or legend into view before focusing the target control
* never focus Fieldset
* preserve the target's existing access to its inline error through `aria-describedby`
* not replace inline field errors

Inline errors must remain visible next to the fields they relate to.

Preserve entered values and selections when errors render and when summary links are activated. Prefix the existing document title once with `Error: ` while the submitted page has errors.

## Focus management

All interactive form controls must have a visible focus state.

Focus states must:

* be visible against adjacent colours
* not rely on colour alone
* not be removed
* follow the shape of the control where practical
* be consistent across form components

For form controls with a focus ring and separator:

* the input control radius should use `form.control.border.radius`
* the separator radius should be derived from the input radius and separator thickness
* the outer focus ring radius should be derived from the input radius, separator thickness and ring thickness
* the focus ring should not look like a detached pill-shaped container

When validation fails after form submission with one or more user-correctable errors, move focus to the required error summary once after it and the inline errors render. Validation rerenders must not refocus it; a later explicit failed submit moves focus once again. Do not move focus while the user is typing.

Give the error-summary root `tabindex="-1"` before programmatic focus so it stays out of the normal Tab order. If the attribute is injected temporarily, keep it while the summary has focus and remove it only after focus leaves.

Use focus-only announcement by default. If optional `role="alert"` is combined with programmatic focus, use a tested strategy so the summary title, list and repeated inline messages are not announced twice.

## Disabled and read-only states

Disabled and read-only states are different and must not be treated as the same thing.

Disabled controls:

* cannot be edited
* cannot usually receive focus
* are often skipped by assistive technology depending on implementation
* should only be used when the user cannot interact with the control

Read-only controls:

* cannot be edited
* can usually receive focus
* should expose their value
* should be used when users need to read or copy the value but not change it

Do not use disabled controls to show information that users still need to access.

## Input types, keyboards and autocomplete

Use input attributes to support accurate data entry.

Choose attributes based on the data being collected, including:

* `type`
* `inputmode`
* `autocomplete`
* `spellcheck`
* `autocapitalize`
* `required`
* `readonly`
* `disabled`

Do not use `type="number"` for text-like values that may contain:

* leading zeros
* spaces
* punctuation
* letters
* formatting characters

Examples where `type="number"` should usually be avoided include:

* date of birth parts
* phone numbers
* card numbers
* account numbers
* sort codes
* National Insurance numbers
* one-time codes
* reference numbers
* postcodes

Use `inputmode` where a numeric keyboard is useful but the value is not truly a number.

## Placeholder text

Placeholder text must not be used as a label.

Avoid placeholder text for form controls.

Placeholder text can create accessibility and usability issues because it:

* disappears when users type
* may be mistaken for a completed answer
* often has insufficient contrast
* is not always announced consistently
* can make error recovery harder

Use visible labels and helper text instead.

## Responsive typography

Form text should follow the shared responsive typography system.

Labels, input values, helper text and error text should not remain visually small while surrounding body and heading text scales up.

Recommended form typography mapping:

* labels use `form.label.typography`
* input values use `form.control.typography`
* helper text uses `form.helper.typography`
* error text uses `form.error.typography`

Typography breakpoint variants should follow the shared responsive typography pattern:

* `base` applies below `breakpoint.md`
* `md` applies at `48rem` and above
* `lg` applies at `64rem` and above

## Testing checklist

When testing form accessibility, check that:

* every control has an accessible name
* every visible label is programmatically associated with its control
* required and optional fields are communicated consistently
* helper text is associated using `aria-describedby`
* error text is associated using `aria-describedby`
* invalid controls use `aria-invalid="true"`
* errors are visible in text
* errors do not rely on colour alone
* keyboard focus is visible
* focus order follows the visual and logical order
* the form can be completed using only a keyboard
* the form works with browser zoom
* the form works with text resizing
* mobile keyboards match the expected input where possible
* autocomplete attributes are used where appropriate
* disabled and read-only states are distinct
* placeholder text is not used as the label

## AI generation rules

When generating form components, AI tools must:

* use the shared form field patterns
* use visible labels by default
* avoid placeholder text
* include helper text only when useful
* associate helper and error text programmatically
* expose invalid state programmatically
* preserve visible focus
* use semantic form tokens
* respect required and optional field conventions
* avoid creating component-specific accessibility rules that conflict with shared form patterns

When a component has its own YAML contract, use that contract as the source of truth for component-specific behaviour.

## Maintenance rule

Do not duplicate detailed accessibility requirements from component YAML files in this document.

If a rule applies to all or most form controls, document it in the shared form patterns.

If a rule applies to one component, document it in that component’s YAML contract.

If a rule is mainly explanatory or educational, document it in the relevant Markdown pattern file.

This file should remain a high-level accessibility overview and index for forms.
