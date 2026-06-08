# Form tokens

This page documents the shared form token requirements.

The actual token source files should live in the `tokens/` folder.

This page explains which form tokens are needed and why.

## Token location

Use this split:

```text
patterns/forms/tokens.md = explains which form tokens are needed and why
tokens/ = actual token source files
```

## Label tokens

```text
--form-label-font-size
--form-label-font-weight
--form-label-line-height
--form-label-color
```

## Legend tokens

Keep legend tokens separate from label tokens.

```text
--form-legend-font-size
--form-legend-font-weight
--form-legend-line-height
--form-legend-color
```

Labels and legends may share values at first, but they are different concepts.

Legends may need to behave like question text or headings in some patterns.

## Helper text tokens

```text
--form-helper-font-size
--form-helper-line-height
--form-helper-color
```

## Error text tokens

```text
--form-error-font-size
--form-error-font-weight
--form-error-line-height
--form-error-color
```

## Field spacing tokens

```text
--form-field-gap-label-to-helper
--form-field-gap-helper-to-error
--form-field-gap-error-to-control
--form-field-gap-control-to-next-field
--form-group-gap-between-options
--form-group-gap-between-fields
```

## Control shell tokens

Use these for components such as text input, textarea and select.

```text
--form-control-border-width
--form-control-border-radius
--form-control-padding-inline
--form-control-padding-block
--form-control-height-sm
--form-control-height-md
--form-control-height-lg
--form-control-background-color
--form-control-text-color
--form-control-border-color
```

## Control state tokens

```text
--form-control-border-color-hover
--form-control-border-color-focus
--form-control-border-color-error
--form-control-border-color-disabled
--form-control-background-color-disabled
--form-control-text-color-disabled
```

## Focus tokens

Focus tokens may be global rather than form-only.

```text
--focus-ring-color
--focus-ring-width
--focus-ring-offset
--focus-ring-style
```

## Group error tokens

Use these for fieldsets and grouped questions.

```text
--form-group-error-border-color
--form-group-error-border-width
--form-group-error-padding-inline
--form-group-error-padding-block
```

## Error summary tokens

```text
--form-error-summary-border-color
--form-error-summary-border-width
--form-error-summary-background-color
--form-error-summary-padding
--form-error-summary-margin-block
--form-error-summary-title-font-size
--form-error-summary-title-font-weight
--form-error-summary-link-color
```

## Disabled tokens

```text
--form-disabled-label-color
--form-disabled-helper-color
--form-disabled-control-text-color
--form-disabled-control-background-color
--form-disabled-control-border-color
```

## Read-only tokens

```text
--form-readonly-label-color
--form-readonly-control-text-color
--form-readonly-control-background-color
--form-readonly-control-border-color
```

## Disabled colour warning

Avoid relying on a generic opacity token for disabled fields because it can reduce contrast too far.

Prefer explicit disabled colour tokens.

## Component-specific tokens

Component-specific tokens should live with the component.

For example, text input may later need tokens for:

```text
--text-input-width-xs
--text-input-width-sm
--text-input-width-md
--text-input-width-lg
--text-input-width-full
```

Only create component-specific tokens when the shared form tokens are not enough.