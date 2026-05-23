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