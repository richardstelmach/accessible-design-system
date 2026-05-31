# Figma iconography adherence check

Use this prompt with an AI agent that can inspect a Figma frame and read the design system source files.

## Required inputs

- Figma frame URL or exported Figma frame data
- GitHub repository URL or local repository access
- Access to the relevant source files listed below

## Source files to check against

- `icons/registry.json`
- `patterns/iconography.yaml`
- `tokens/semantic/colors.semantic.json`
- `tokens/semantic/sizing.semantic.json`

## Prompt

Inspect this Figma frame:

`[PASTE FIGMA FRAME URL OR FRAME DATA]`

Compare it against the design system source files.

Check:

1. Whether all displayed icons are listed in `icons/registry.json`.
2. Whether Figma icon component names match the registry names.
3. Whether icon components use the format `Icon / icon-name`.
4. Whether icon masters use a 24px by 24px frame.
5. Whether icon masters use the documented default icon weight.
6. Whether default icon colour uses `color.icon.default`.
7. Whether documentation examples use semantic icon colour tokens.
8. Whether icon sizes follow `size.icon.*` rules.
9. Whether the documentation reflects accessibility guidance for decorative and meaningful icons.
10. Whether there are detached icons, raw fills, raw sizes or unregistered icon choices.

Do not make changes.

Report findings under:

- Passes
- Issues
- Recommendations
- Approval verdict