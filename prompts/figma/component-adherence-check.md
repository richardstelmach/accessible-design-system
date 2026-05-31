# Figma component adherence check

Use this prompt with an AI agent that can inspect a Figma frame and read the design system source files.

## Required inputs

- Figma frame URL or exported Figma frame data
- GitHub repository URL or local repository access
- Access to the relevant source files listed below

## Source files to check against

- `components/[component-name]/[component-name].yaml`
- `tokens/primitives/`
- `tokens/semantic/`
- `patterns/page-layout.yaml`
- `patterns/content-block.yaml`
- `accessibility/headings.yaml`
- `accessibility/focus-indicators.yaml`
- `icons/registry.json`
- `patterns/iconography.yaml`

## Prompt

Inspect this Figma component documentation frame:

`[PASTE FIGMA FRAME URL OR FRAME DATA]`

Compare it against the design system source files.

Check:

1. Whether the component variants match the component contract.
2. Whether states match the component contract.
3. Whether sizes match the component contract.
4. Whether spacing, padding, radius, typography and colour use token variables.
5. Whether icons are registered in `icons/registry.json`.
6. Whether icon instances are not detached.
7. Whether focus states follow `accessibility/focus-indicators.yaml`.
8. Whether heading hierarchy follows `accessibility/headings.yaml`.
9. Whether heading styles match the semantic level and current frame breakpoint.
10. Whether layout follows the relevant page and content block patterns.
11. Whether flex-style layout or grid-style layout has been chosen appropriately.
12. Whether any raw fills, raw spacing, raw typography, raw radius or unbound values are used.
13. Whether accessibility guidance is visible where the component needs it.
14. Check whether prose, section descriptions and guidance text use `layout.container.maxWidth.text`.
15. Flag long-form text layers that stretch to the full page/container width without a documented reason.
16. Do not make changes unless explicitly asked.

Report findings under:

- Passes
- Issues
- Token mismatches
- Pattern mismatches
- Accessibility concerns
- Suggested source documentation improvements
- Approval verdict