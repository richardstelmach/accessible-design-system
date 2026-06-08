# Input types and keyboard behaviour

Field components should use appropriate HTML attributes to help users enter information accurately.

This guidance is mostly for development, but it belongs in the shared form patterns because it affects usability and accessibility.

## Attributes to consider

Document relevant guidance for:

- `type`
- `inputmode`
- `autocomplete`
- `autocapitalize`
- `enterkeyhint`

## Common mappings

### Email

```html
<input type="email" autocomplete="email">
```

### Telephone

```html
<input type="tel" autocomplete="tel">
```

### Search

```html
<input type="search">
```

### URL

```html
<input type="url" inputmode="url">
```

### Postcode

```html
<input type="text" autocomplete="postal-code">
```

### Date of birth day, month and year

```html
<input type="text" inputmode="numeric">
```

### One-time code

```html
<input type="text" inputmode="numeric" autocomplete="one-time-code">
```

### Money

```html
<input type="text" inputmode="decimal">
```

## Avoid type="number" for identifiers

Do not use `type="number"` for identifiers or structured values that are not mathematical numbers.

Usually avoid `type="number"` for:

- date of birth
- phone number
- card number
- account number
- sort code
- National Insurance number
- one-time code
- reference number
- postcode
- values that may include leading zeros

## Why this matters

Some values look numeric but are not numbers.

For example, a phone number, sort code or one-time code is an identifier.

Users do not need number input behaviours such as incrementing, decrementing or mathematical validation.

These values may also need leading zeros, spaces or fixed formatting.

## Component documentation

Text-like field components should document their recommended attributes.

For example, the text input component should include guidance for:

- email input
- telephone input
- postcode input
- numeric-looking identifiers
- one-time codes
- search
- URLs