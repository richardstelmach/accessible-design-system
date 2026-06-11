# Form tokens

This page documents the shared semantic form tokens.

The actual token source file is:

```text
tokens/semantic/forms.semantic.json
```

These tokens support the shared form patterns documented in:

```text
patterns/forms/
```

## Token naming

Use semantic token paths as the canonical source of truth.

For example:

```text
form.label.typography
form.label.color
form.control.border.color
```

Do not treat CSS custom property names as the source token names unless they are generated as an output format.

## Label tokens

Use label tokens for individual form control labels.

```text
form.label.typography
form.label.color
```

## Legend tokens

Use legend tokens for grouped controls inside a fieldset.

Legends are separate from labels because a legend identifies a group of related controls, while a label identifies an individual control.

```text
form.legend.typography.default
form.legend.typography.section
form.legend.typography.subsection
form.legend.typography.compact
form.legend.color
```

## Legend typography variants

Legend typography supports variants because a legend may appear in different structural contexts.

The legend always identifies a grouped form control inside a fieldset. The typography variant only changes its visual emphasis.

Use:

```text
form.legend.typography.default
```

For standard grouped form controls.

Use:

```text
form.legend.typography.section
```

For a grouped question inside a larger H2-level section.

Use:

```text
form.legend.typography.subsection
```

For a grouped question inside a larger H3-level subsection.

Use:

```text
form.legend.typography.compact
```

For dense grouped controls, filters, cards or settings panels.

Do not choose a legend size only to make something look more important.

Use the variant that matches the fieldset’s context in the page structure.

## Helper text tokens

Use helper tokens for optional helper text.

```text
form.helper.typography
form.helper.color
```

## Error text tokens

Use error tokens for inline field and group error messages.

```text
form.error.typography
form.error.color
form.error.background
```

## Field spacing tokens

Use field spacing tokens for vertical spacing inside and between form fields.

```text
form.field.gap.labelToHelper
form.field.gap.helperToError
form.field.gap.errorToControl
form.field.gap.controlToNextField
```

## Group spacing tokens

Use group spacing tokens for grouped controls such as radios, checkboxes and multi-part questions.

```text
form.group.gap.betweenOptions
form.group.gap.betweenFields
```

## Control shell tokens

Use control shell tokens for components such as text input, textarea and select.

```text
form.control.background
form.control.foreground
form.control.border.color
form.control.border.width
form.control.border.radius
form.control.padding.block
form.control.padding.inline
```

## Control state tokens

Use state tokens for shared form control states.

```text
form.state.focus.ring
form.state.focus.separator
form.state.error.border
form.state.disabled.background
form.state.disabled.foreground
form.state.disabled.border
form.state.readonly.background
form.state.readonly.foreground
form.state.readonly.border
```
Hover is not currently documented as a shared form control state. If a future form component needs a visibly distinct hover treatment, add it deliberately as part of that component’s specification.

## Error summary tokens

Use error summary tokens for the error summary component or shell.

```text
form.errorSummary.background
form.errorSummary.foreground
form.errorSummary.border.color
form.errorSummary.border.width
form.errorSummary.padding
```

## Disabled colour warning

Avoid relying on a generic opacity token for disabled fields because it can reduce contrast too far.

Prefer explicit disabled colour tokens.

## Future token candidates

Only add these if a component proves they are needed:

```text
form.control.height.sm
form.control.height.md
form.control.height.lg
form.group.error.border.color
form.group.error.border.width
form.group.error.padding.block
form.group.error.padding.inline
form.errorSummary.marginBlock
form.errorSummary.title.typography
form.errorSummary.link.color
form.disabled.label.color
form.disabled.helper.color
form.readonly.label.color
form.readonly.helper.color
```

Do not document future token candidates as available tokens until they exist in `tokens/semantic/forms.semantic.json`.

## Component-specific tokens

Component-specific tokens should live with the component token file when needed.

For example, text input may later need tokens for:

```text
textInput.width.xs
textInput.width.sm
textInput.width.md
textInput.width.lg
textInput.width.full
```

Only create component-specific tokens when the shared form tokens are not enough.
