# Token Structure

## Token Layering

The system uses layered token architecture:

1. Primitive Tokens
2. Semantic Tokens
3. Component Tokens (future)

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