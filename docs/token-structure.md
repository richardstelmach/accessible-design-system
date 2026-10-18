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

Primary action backgrounds use `color.primary.700` with white foreground text, progressing to 900 on hover and 950 while pressed. Featured backgrounds use `color.secondary.500` with black foreground text. These are separate semantic pairings.

## Persistent selection and current location

`color.interactive.selected` defines the shared **filled** treatment for a persistent
selected choice or current navigation item. It is separate from primary action
priority even though both families currently reference the same blue primitives.
Do not alias selection to primary actions: either family can evolve independently.

| Interaction | Background / border | Foreground |
| --- | --- | --- |
| Rest | `color.interactive.selected.background` / `.border` → primary 700 | `.foreground` → white |
| Hover | `color.interactive.selected.hover.background` / `.border` → primary 900 | `.hover.foreground` → white |
| Pressed | `color.interactive.selected.active.background` / `.border` → primary 950 | `.active.foreground` → white |

Selection/current identity persists through every interaction. `active` means a
transient press, never the persistent selected state. Keyboard focus independently
overlays the shared `color.interactive.focus` ring and separator. Noninteractive
selected items use the rest treatment; disabled controls must not acquire hover or
pressed behaviour. A future selected-and-disabled treatment needs an explicit
component contract that preserves its selection indicator.

Components opt into this filled treatment through their own aliases. Pagination
uses `component.pagination.current.{default,hover,active}.{background,foreground}`.
For example, `component.pagination.current.hover.background` references
`color.interactive.selected.hover.background`. A future calendar can use
`component.calendar.day.selected.*` aliases when its contract is defined; no
calendar tokens are introduced prematurely. `form.state.selected.*` retains its
existing public names and references this shared family for filled form selection.

Sharing colours does not share HTML/ARIA semantics. Pagination retains
`aria-current="page"`; selected calendar dates use the semantics appropriate to
the calendar pattern, and toggle buttons retain their pressed-state semantics.
In a calendar, **today**, **selected date**, keyboard focus and temporary pointer
press are distinct states and may coexist. A current-day marker must not imply
that today is the chosen date. Range interiors require their own treatment.

Use the filled family only where the component calls for it. Tabs may retain an
underline indicator and their documented neutral interaction colours. Selection
must also have a non-colour cue and the correct programmatic state; colour tokens
alone do not supply either. Choose background and foreground as a pair, validate
contrast in every state, and retain visible indicators in forced-colour modes.

## Toast geometry

`tokens/components/toast.json` adds six non-responsive aliases under `component.toast`: `spacing.inset`, `spacing.iconToContent`, `spacing.titleToDescription`, `spacing.stack`, `icon.size` and `surface.radius`. All reference existing primitives or semantic roles and include durable Figma scopes and Web syntax. Toast shares Alert's status colour pairings, body typography and the neutral Icon Button treatment; it adds no colour, typography, duration or responsive token family.
