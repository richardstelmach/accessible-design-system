# Token Structure

## Overview

This design system uses a layered token architecture.

The goal is to keep raw values, semantic meaning, and component-specific implementation separate.

```text
Primitive Tokens
↓
Semantic Tokens
↓
Component Tokens
↓
Components

---

## Primitive Tokens

Primitive tokens define raw reusable values only.

Examples:

- color.primary.500
- spacing.4
- typography.size.lg

Primitive tokens contain no semantic meaning.

---

## Semantic Tokens

Semantic tokens define approved usage contexts.

Examples:

- text.primary
- surface.default
- border.subtle

Semantic tokens will enforce:
- accessibility rules
- approved color pairings
- UI consistency

---

---

## Component Tokens

Component tokens define decisions that belong to a specific component.

Use component tokens when a value is too specific for a broad semantic token, but still needs to be named, documented, reused and available to Figma or implementation.

Examples:

- component.link.targetPaddingBlock
- component.link.targetPaddingInline
- component.link.gap

Component tokens should:
- reference primitive or semantic tokens where possible
- describe a component-specific purpose
- avoid duplicating broad semantic tokens
- avoid turning one-off implementation details into global semantics

Component tokens are useful when a component needs a value for a specific reason that would not make sense across the whole system.

For example, the Link component uses transparent target padding to support pointer target size and focus breathing room without making a standalone text link look like a button. This is specific to Link, so it belongs in `component.link.*` rather than `spacing.inline.*`, `spacing.control.*` or a broad semantic spacing token.

Component tokens live in:

tokens/components/

They compile into the same token output as primitive and semantic tokens, and may be used by Figma, documentation, implementation and AI tooling.

Do not create component tokens for every value by default. Start with semantic tokens where the meaning is shared across components. Create component tokens when the decision is component-specific.

---

## Naming Conventions

Color scales use:

- 100
- 300
- 500
- 700
- 900
- 950

The `500` value represents the canonical base tone.

Spacing and typography use semantic scale naming for readability and interoperability.

---

## DTCG Compatibility

Tokens follow DTCG-compatible JSON structure using:

- `$value`
- `$type`

This supports interoperability with:
- Tokens Studio
- Style Dictionary
- frontend frameworks
- AI tooling

## Status Colour Pairing

Status colours use light background tones with dark same-family foreground tones.

This keeps success, warning, and error messaging visually related while preserving accessible contrast.

Examples:

- `status.success.background` → `color.success.100`
- `status.success.foreground` → `color.success.950`
- `status.warning.background` → `color.warning.100`
- `status.warning.foreground` → `color.warning.950`
- `status.error.background` → `color.error.100`
- `status.error.foreground` → `color.error.950`

Primary and featured backgrounds currently use black foreground text because their same-family darkest tones do not provide sufficient contrast against the 500 background colours for normal text.