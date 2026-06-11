# Responsive typography pattern

This pattern defines how responsive typography variants are interpreted across the design system.

## Purpose

Typography should scale consistently across layouts so text remains readable and visually balanced at different viewport widths.

Use this pattern for semantic typography tokens that include breakpoint variants such as:

```text
base
md
lg
```

Examples include:

```text
typography.heading.h1.base
typography.heading.h1.md
typography.heading.h1.lg

typography.body.default.base
typography.body.default.md
typography.body.default.lg
```

## Breakpoint mapping

The design system uses content-driven breakpoints, not device-specific breakpoints.

Typography breakpoint variants map to the primitive breakpoint tokens as follows:

| Typography variant | Applies when               | Breakpoint token | Value                            |
| ------------------ | -------------------------- | ---------------- | -------------------------------- |
| `base`             | Default, below `md`        | none             | below `48rem`                    |
| `md`               | Medium viewports and above | `breakpoint.md`  | `48rem` / approximately `768px`  |
| `lg`               | Large viewports and above  | `breakpoint.lg`  | `64rem` / approximately `1024px` |

`base` is not a primitive breakpoint token. It is the default typography value used before the `md` breakpoint applies.

## Rules

Use responsive semantic typography tokens for text that should scale with the page.

Do not lock scalable typography to a `.base` token unless the component has a documented compact mode.

Do not use raw primitive font-size tokens directly in components when a semantic typography token exists.

Do not make component text visually smaller than surrounding body text unless the text is genuinely supporting content.

Labels, input values, body copy and validation messages should usually follow responsive body-sized typography.

Helper text may use a smaller responsive body style because it supports the main task.

## Code interpretation

A semantic typography token with `base`, `md` and `lg` values should be implemented like this:

```css
.component {
  /* base typography */
}

@media (min-width: 48rem) {
  .component {
    /* md typography */
  }
}

@media (min-width: 64rem) {
  .component {
    /* lg typography */
  }
}
```

Use the primitive breakpoint tokens as the source of truth for media query values:

```text
breakpoint.md = 48rem
breakpoint.lg = 64rem
```

## Figma interpretation

Figma may represent responsive typography as separate styles, modes, examples or documentation frames.

Figma does not automatically switch typography based on viewport size unless the file has been set up to do that.

When documenting components in Figma, show or describe which typography variant applies at each breakpoint.

## Form control typography

Form controls should follow this pattern.

Recommended mapping:

| Text part   | Typography token          | Behaviour                             |
| ----------- | ------------------------- | ------------------------------------- |
| Label       | `form.label.typography`   | Responsive, body-sized, medium weight |
| Input value | `form.control.typography` | Responsive, body default              |
| Helper text | `form.helper.typography`  | Responsive, body small                |
| Error text  | `form.error.typography`   | Responsive, body default              |

This prevents form labels, helper text, error text and input values from appearing too small when surrounding body and heading text scales up.
