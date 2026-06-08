# Labels

Use a visible label for individual form controls by default.

A label identifies an individual form control.

## Core rules

Every form control must have an accessible name.

A visible label is the preferred pattern.

Placeholder text must not be used as a label.

If visible label text exists, the accessible name should include the visible text.

Use visually hidden labels only when visual repetition would be harmful.

Use `aria-labelledby` when visible text elsewhere labels the control.

Use `aria-label` only when there is no practical visible label or suitable visible text to reference.

A label should have colour contrast with its background even if the control is disabled.

## Label visibility options

Use label approaches in this order of preference:

1. Visible label
2. Visually hidden label
3. `aria-labelledby`
4. `aria-label`

## Visible label

Visible labels are the default.

```html
<label for="first-name">First name</label>
<input id="first-name" name="first-name">
```

## Visually hidden label

Use a visually hidden label when the visible context already makes the purpose clear and showing a label would create unnecessary repetition.

```html
<label class="visually-hidden" for="site-search">Search this site</label>
<input id="site-search" name="search" type="search">
```

## aria-labelledby

Use `aria-labelledby` when visible text elsewhere labels the control.

```html
<h2 id="billing-heading">Billing address</h2>

<span id="billing-postcode-label">Postcode</span>

<input
  id="billing-postcode"
  name="billing-postcode"
  aria-labelledby="billing-heading billing-postcode-label"
/>
```

## aria-label

Use `aria-label` as a last resort.

Use it only when:

- there is no visible label
- there is no suitable visible text to reference
- a visible label would genuinely not work in the interface

```html
<input type="search" aria-label="Search products">
```

## Placeholder text

Placeholder text must not be used as a label.

Avoid placeholder text unless there is a specific, tested reason to use it.

Use labels and helper text instead.