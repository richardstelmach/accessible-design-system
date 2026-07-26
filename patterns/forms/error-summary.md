# Error summary

After a failed submit with one or more user-correctable validation errors, show an error summary and keep every inline error.

The error summary helps users understand all errors before correcting them. One error and several errors use the same structure and behaviour.

## Component contract

The product-level component contract is documented in:

- [`components/error-summary/error-summary.yaml`](../../components/error-summary/error-summary.yaml)
- [`components/error-summary/error-summary.md`](../../components/error-summary/error-summary.md)

The Figma component uses a required native `errorList` slot containing repeatable `Error Summary / Item` instances. This keeps every error independently editable, reorderable and targetable without creating error-count variants or one combined multiline text property.

The Figma slot maps to `<ul>`, each supporting item maps to `<li>`, and its `errorText` maps to the nested `<a>`. Production semantics remain `ul > li > a`.

## Rules

Place the error summary near the top of the page or form.

After the error summary and inline errors render, move focus to the error summary exactly once for that failed submission.

Use an `h2` heading, such as “There is a problem”, with the responsive H2 visual style.

List each error.

Order errors by the document order of their related form questions and controls, regardless of the order in which validators return them.

Include one summary item for each distinct current user-correctable error. Do not duplicate an item because the same validator result was emitted more than once.

Each error must link to a visible, enabled control that the user can focus and correct.

Each field or group must still show its own inline error.

The error summary does not replace inline errors.

## Example

```html
<div class="error-summary" tabindex="-1">
  <h2>There is a problem</h2>
  <ul>
    <li><a href="#full-name">Enter your full name</a></li>
    <li><a href="#dob-year">Date of birth must include a year</a></li>
  </ul>
</div>
```

This example uses the default focus-only announcement strategy. Add `role="alert"` only when testing confirms that combining the alert with required programmatic focus does not duplicate the announcement.

## Link target rules

Use these rules for error summary links:

```text
Single input error → link to the visible, enabled input
Textarea error → link to the visible, enabled textarea
Select error → link to the visible, enabled select
Standalone Checkbox error → link to the visible, enabled native checkbox
Radio group error → link to the first relevant visible, enabled radio
Checkbox group error → link to the first relevant visible, enabled checkbox
Date of birth specific error → link to the visible, enabled specific field
Date of birth whole-date error → link to the first relevant visible, enabled field in the group
Combination error → link to the first relevant visible, enabled child
Address specific error → link to the visible, enabled specific field
Address whole-group error → link to the first relevant visible, enabled field in the group
```

Do not add `tabindex` to a Fieldset merely to make it an error-summary target.

When a link is activated:

1. Keep its real `href` fragment as a progressive-enhancement fallback.
2. Scroll the associated label into view for a single control, standalone Checkbox or specific multi-part field.
3. Scroll the associated legend into view for a grouped-control or whole multi-part error.
4. Move focus to the link's visible, enabled control target, using an activation handler where native fragment behaviour cannot provide both the required scroll context and focus.
5. Keep the control's or owning Fieldset's existing `aria-describedby` access to the inline error and any useful hint.

Never move focus to Fieldset. Do not repeat a Fieldset-owned group error ID on every child merely to implement summary-link focus.

## Focus behaviour

Do not move focus while the user is typing.

Move focus to the error summary exactly once per failed-submission event, after the summary and every inline error have rendered.

Do not refocus the summary because validation state rerenders while the user is correcting errors. A later explicit submit that fails is a new event and moves focus to the summary once again.

Give the root `tabindex="-1"` before calling `focus()` so it can receive programmatic focus without entering the normal Tab order. The attribute may remain on the root. If an implementation injects it temporarily, keep it while the root has focus and remove it only after focus leaves; never use `tabindex="0"` and never remove it synchronously after calling `focus()`.

Focus moves to an invalid control only after the user activates its summary link. Its inline error must remain available to assistive technology through the control's or owning Fieldset's established `aria-describedby` relationship.

Repeated renders from the same failed submission must not steal focus.

## Page title and announcements

Before moving focus, prefix the existing document title once with `Error: `. Do not accumulate prefixes after repeated failed submissions. Restore or replace the original title when the error state is resolved or navigation succeeds.

Use focus-only announcement by default. If the summary uses optional `role="alert"` as well as programmatic focus, create or update it once per failed submission and prevent the same messages from being announced again through separate assertive inline live regions. Test that the summary title and list are announced once, not once for the alert and again for focus.

## Inline errors

The error summary does not replace inline errors.

Each invalid field or group must still show its own inline error message.

For a Fieldset group-level error, keep the inline group error associated with the Fieldset using `aria-describedby`.

Preserve every entered value and selection when errors render, when validation rerenders and when a summary link is activated.

## Error wording

Error summary links should normally use the same wording as the inline error.

Where possible, error messages should explain how to fix the issue.
