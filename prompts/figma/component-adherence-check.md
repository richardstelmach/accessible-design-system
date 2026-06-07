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
- `tokens/components/`
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
5. Whether component-specific tokens from `tokens/components/` are used where the component contract requires them.
6. Whether primitive tokens are only used as raw source values.
7. Whether semantic tokens are used for reusable system-level roles.
8. Whether component tokens are used for component-specific decisions.
9. Whether a generic semantic token is being used where the component contract specifies a component token.
10. Whether icons are registered in `icons/registry.json`.
11. Whether icon instances are not detached.
12. Whether focus states follow `accessibility/focus-indicators.yaml`.
13. Whether heading hierarchy follows `accessibility/headings.yaml`.
14. Whether heading styles match the semantic level and current frame breakpoint.
15. Whether layout follows the relevant page and content block patterns.
16. Whether flex-style layout or grid-style layout has been chosen appropriately.
17. Whether any raw fills, raw spacing, raw typography, raw radius or unbound values are used.
18. Whether the rendered result visually matches the resolved token value, not only the displayed variable name.
19. Whether any stale or broken Figma variable bindings appear to need removing and re-applying.
20. Whether accessibility guidance is visible where the component needs it.
21. Check whether prose, section descriptions and guidance text use `layout.container.maxWidth.text`.
22. Flag long-form text layers that stretch to the full page/container width without a documented reason.
23. Do not make changes unless explicitly asked.
24. Check whether repeated documentation cards use the shared `_Documentation/Card` component.
25. Check whether documentation cards use Title, Description and Sample structure.
26. Check whether the Sample area is implemented as a native Figma slot where supported.
27. If the Sample area is not a native slot, check whether this is documented as a temporary fallback.
28. Check whether sample slot content uses reusable documentation sample components where possible.
29. Check whether card groups follow `components/internal/documentation-card.yaml` and `patterns/content-block.yaml`.
30. Flag full-width panel lists where short documentation cards should use a wrapping card group.
31. Check that card titles are meaningful.
32. Check that card title semantics are determined by page structure, not visual style name alone.
33. Check that grid-style layout is only used for true matrices, tables or comparisons.
34. Check that internal documentation components are not confused with public product components.

## Documentation page template checks

For component documentation frames, check:

- Eyebrow text exists above the H1.
- Eyebrow text is `Components`.
- H1 uses `color.text.headingAccent`.
- H1 uses the correct heading style for the frame breakpoint.
- Intro text uses the correct body large style for the frame breakpoint.
- Intro text is constrained to `layout.container.maxWidth.text`.
- The frame follows `patterns/documentation-page.yaml`.
- `_Documentation/Page Header` is used where available.
- No ad hoc documentation header has been created.

Report findings under:

- Passes
- Issues
- Token mismatches
- Pattern mismatches
- Accessibility concerns
- Suggested source documentation improvements
- Approval verdict