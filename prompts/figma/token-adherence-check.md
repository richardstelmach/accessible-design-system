# Figma token adherence check

Use this prompt with an AI agent that can inspect a Figma frame and read the design system source files.

## Required inputs

- Figma frame URL or exported Figma frame data
- GitHub repository URL or local repository access
- Access to the relevant source files listed below

## Source files to check against

- `tokens/primitives/`
- `tokens/semantic/`
- `tokens/compiled/tokens.raw.json`
- `patterns/page-layout.yaml`
- `patterns/card-grid.yaml`
- `patterns/content-block.yaml`

## Prompt

Inspect this Figma frame:

`[PASTE FIGMA FRAME URL OR FRAME DATA]`

Compare it against the design system source files.

Check:

1. Whether fills use semantic colour variables rather than raw colours.
2. Whether text uses approved typography styles.
3. Whether spacing, padding and gaps follow documented spacing and layout tokens.
4. Whether border colours and border widths use token values.
5. Whether radii use token values.
6. Whether the frame follows the documented page layout pattern.
7. Whether card grids follow the documented card grid pattern.
8. Whether any raw values appear where token values should be used.
9. Whether there are accessibility concerns, including obvious contrast issues.

Do not make changes.

Report findings under:

- Passes
- Issues
- Token mismatches
- Pattern mismatches
- Accessibility concerns
- Approval verdict