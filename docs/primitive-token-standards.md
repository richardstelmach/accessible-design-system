# Primitive Token Standards

## Overview

The design system uses a primitive token architecture as the foundational layer for all future semantic tokens, component tokens, AI-generated concepts, and frontend implementations.

Primitive tokens define raw reusable values only. They do not contain semantic meaning or component-specific usage.

The system is designed to support:

- Accessibility-first design
- WCAG 2.2 AA compliance
- AI-readable structured design systems
- Figma token synchronization
- Frontend interoperability
- Future semantic token abstraction
- Responsive and scalable UI systems

GitHub remains the source of truth for all machine-readable token definitions.

---

# Primitive Layer Philosophy

Primitive tokens define available values, not approved usage combinations.

Example:

- `color.primary.500`
- `spacing.4`
- `typography.size.lg`

Primitive tokens intentionally avoid semantic naming such as:

- `buttonBlue`
- `accessibleText`
- `cardPadding`

Semantic meaning will be introduced later through semantic token layers.

---

# REM-Based Sizing Strategy

Typography, spacing, radius, and breakpoints primarily use REM-based sizing.

## Why REM Units Are Used

REM units support:

- Browser accessibility scaling
- User font-size preferences
- Responsive behavior
- Zoom compatibility
- Improved accessibility compliance

The system assumes the browser default root font size of:

- `1rem = 16px`

unless overridden by user accessibility settings.

The system intentionally avoids overriding browser root sizing behavior.

---

# Typography Standards

## Typography Philosophy

Typography primitives define reusable scale values only.

Semantic typography roles such as:

- Heading styles
- Body styles
- Labels
- Captions

will be defined later through semantic tokens.

## Font Family

The system currently uses:

- `Inter`

as the primary UI typeface due to:

- Excellent readability
- Accessibility performance
- Modern UI suitability
- Variable font support
- Cross-platform consistency

## Font Scale

The typography scale uses semantic sizing tokens:

- xs
- sm
- md
- lg
- xl
- 2xl
- 3xl
- 4xl
- 5xl
- 6xl

Example mappings:

| Token | REM | Approx PX |
|---|---|---|
| xs | 0.75rem | 12px |
| sm | 0.875rem | 14px |
| md | 1rem | 16px |
| lg | 1.125rem | 18px |
| xl | 1.25rem | 20px |
| 2xl | 1.5rem | 24px |
| 3xl | 1.875rem | 30px |
| 4xl | 2.25rem | 36px |
| 5xl | 3rem | 48px |
| 6xl | 3.75rem | 60px |

## Font Weights

The primitive typography system currently supports:

- 400 — Regular
- 500 — Medium
- 600 — Semibold
- 700 — Bold

## Line Heights

Line heights prioritize readability and accessibility.

| Token | Value |
|---|---|
| tight | 1.2 |
| normal | 1.5 |
| relaxed | 1.7 |

---

# Spacing Standards

## Spacing Philosophy

The spacing system uses a 4px-based rhythm system expressed in REM units.

The system is designed to support:

- Consistent layout rhythm
- Scalable responsive spacing
- Predictable AI-generated layouts
- Frontend interoperability

## Spacing Scale

| Token | REM | Approx PX |
|---|---|---|
| 1 | 0.25rem | 4px |
| 2 | 0.5rem | 8px |
| 3 | 0.75rem | 12px |
| 4 | 1rem | 16px |
| 5 | 1.25rem | 20px |
| 6 | 1.5rem | 24px |
| 8 | 2rem | 32px |
| 10 | 2.5rem | 40px |
| 12 | 3rem | 48px |
| 16 | 4rem | 64px |
| 20 | 5rem | 80px |
| 24 | 6rem | 96px |

---

# Radius Standards

## Radius Philosophy

Radius tokens define reusable shape values only.

The system intentionally uses a restrained radius scale to maintain visual consistency and reduce unnecessary variation.

## Radius Scale

| Token | REM | Approx PX |
|---|---|---|
| none | 0 | 0px |
| sm | 0.125rem | 2px |
| md | 0.25rem | 4px |
| lg | 0.5rem | 8px |
| xl | 0.75rem | 12px |
| 2xl | 1rem | 16px |
| full | 9999px | Fully rounded |

---

# Border Standards

## Border Philosophy

Border primitives currently define:

- Width
- Style

Border colors will be introduced later through semantic token layers.

## Border Width Scale

| Token | Value |
|---|---|
| none | 0 |
| thin | 1px |
| medium | 2px |
| thick | 4px |

## Border Styles

- solid
- dashed

---

# Breakpoint Standards

## Breakpoint Philosophy

Breakpoints are content-driven rather than device-specific.

The responsive system prioritizes:

- Readability
- Layout integrity
- Content scaling
- Accessibility

Breakpoints use REM units to support browser zoom scaling and accessibility resizing.

## Breakpoint Scale

| Token | REM | Approx PX |
|---|---|---|
| sm | 40rem | 640px |
| md | 48rem | 768px |
| lg | 64rem | 1024px |
| xl | 80rem | 1280px |
| 2xl | 96rem | 1536px |

---

# Color Standards

## Primitive Color Philosophy

Primitive colors define tonal scales only.

Accessibility-safe combinations will be defined later through semantic token mappings.

The primitive system currently includes:

- Neutral scale
- Primary scale
- Secondary scale
- Success scale
- Warning scale
- Error scale
- White
- Black

## Color Scale Philosophy

The color scales use standardized tonal naming conventions:

- 100
- 300
- 500
- 700
- 900
- 950

The `500` value represents the canonical base brand color for each scale.

Lower values represent lighter tones.

Higher values represent darker tones.

---

# Source of Truth

All primitive tokens are source-controlled in GitHub using JSON token files following DTCG-compatible structure conventions.

Figma and AI tooling act as consumers of the token system rather than sources of truth.