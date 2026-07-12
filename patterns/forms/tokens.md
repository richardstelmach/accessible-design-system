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

## Responsive form typography

Some form typography tokens have `base`, `md` and `lg` branches.

In GitHub, use the full responsive token path:

```text
form.label.typography.base
form.label.typography.md
form.label.typography.lg
```

In Figma, apply the semantic text style:

form/label/typography

Then use the parent frame’s Breakpoint mode to preview base, md or lg.

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
form.label.typography.base
form.label.typography.md
form.label.typography.lg
form.label.color
```

## Legend tokens

Use legend tokens for grouped controls inside a fieldset.

Legends are separate from labels because a legend identifies a group of related controls, while a label identifies an individual control.

```text
form.legend.typography.page.base
form.legend.typography.page.md
form.legend.typography.page.lg
form.legend.typography.default.base
form.legend.typography.default.md
form.legend.typography.default.lg
form.legend.typography.section.base
form.legend.typography.section.md
form.legend.typography.section.lg
form.legend.typography.subsection.base
form.legend.typography.subsection.md
form.legend.typography.subsection.lg
form.legend.typography.compact.base
form.legend.typography.compact.md
form.legend.typography.compact.lg
form.legend.color
```

## Legend typography variants

Legend typography supports variants because a legend may appear in different structural contexts.

The legend always identifies a grouped form control inside a fieldset. The typography variant only changes its visual emphasis.

Use:

```text
form.legend.typography.page.base
form.legend.typography.page.md
form.legend.typography.page.lg
form.legend.typography.default.base
form.legend.typography.default.md
form.legend.typography.default.lg
form.legend.typography.section.base
form.legend.typography.section.md
form.legend.typography.section.lg
form.legend.typography.subsection.base
form.legend.typography.subsection.md
form.legend.typography.subsection.lg
form.legend.typography.compact.base
form.legend.typography.compact.md
form.legend.typography.compact.lg
```

Semantic mappings:

```text
page       -> H1-aligned responsive typography
default    -> H2-aligned responsive typography
section    -> H3-aligned responsive typography
subsection -> H4-aligned responsive typography
compact    -> responsive form-label typography
```

Semantic heading level remains separate from the selected visual token. A plain legend can use H2-aligned visual styling without becoming an H2.

Do not choose a legend size only to make something look more important.

Use the variant that matches the fieldset’s context in the page structure.

## Helper text tokens

Use helper tokens for optional helper text.

```text
form.helper.typography.base
form.helper.typography.md
form.helper.typography.lg
form.helper.color
```

## Error text tokens

Use error tokens for inline field and group error messages.

```text
form.error.typography.base
form.error.typography.md
form.error.typography.lg
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

`form.field.gap.errorToControl` is for a single field inline error and that field's own control.

`form.field.gap.controlToNextField` is for the gap after one complete field or grouped Fieldset before the next field begins.

## Group spacing tokens

Use group spacing tokens for grouped controls such as radios, checkboxes and multi-part questions.

```text
form.group.gap.headerToContent
form.group.gap.betweenOptions
form.group.gap.betweenFields
```

Use `form.group.gap.headerToContent` between a grouped control's Group header and its content slot. The Group header contains the legend, optional helper text and optional group error.

Use `form.group.gap.betweenOptions` and `form.group.gap.betweenFields` for spacing inside the content slot.

## Control shell tokens

Use control shell tokens for components such as text input, textarea and select.

```text
form.control.background
form.control.foreground
form.control.typography.base
form.control.typography.md
form.control.typography.lg
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
form.state.selected.border
form.state.disabled.background
form.state.disabled.foreground
form.state.disabled.border
form.state.readonly.background
form.state.readonly.foreground
form.state.readonly.border
```
Hover is not currently documented as a shared form control state. If a future form component needs a visibly distinct hover treatment, add it deliberately as part of that component’s specification.

Use `form.state.selected.border` for the selected boundary of selection controls such as Radio and Checkbox.

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

Radio uses component-specific geometry for its circular control and selected indicator:

```text
component.radio.control.size
component.radio.indicator.size
component.radio.indicator.color
```

## Form typography

Form labels, control values, helper text and error text should follow the responsive typography system.

- `form.label.typography` uses body-sized text with medium weight because labels are primary task content.
- `form.control.typography` uses the default body scale so entered values align with surrounding content.
- `form.helper.typography` uses the responsive small body scale because helper text is supporting content.
- `form.error.typography` uses the default body scale because validation feedback is critical task content.
- `form.legend.typography` uses responsive legend styles for grouped controls and keeps semantic heading level separate from visual scale.

Do not lock form text to base-only typography tokens unless the component has a documented compact mode.
