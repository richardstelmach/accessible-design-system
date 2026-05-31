# Figma component first-pass generation

Use this prompt with an AI agent that can create or update Figma content and read the design system source files.

## Required inputs

- Figma target page or frame URL
- GitHub repository URL or local repository access
- Component contract file
- Relevant token, pattern, accessibility and registry files

## Prompt

Use the design system source files to create a first-pass Figma component setup.

Figma target:

`[PASTE FIGMA PAGE OR FRAME URL]`

GitHub source:

`[PASTE GITHUB REPOSITORY URL]`

Use these source files:

- `components/[component-name]/[component-name].yaml`
- `tokens/primitives/`
- `tokens/semantic/`
- `patterns/page-layout.yaml`
- `patterns/content-block.yaml`
- `accessibility/headings.yaml`
- `accessibility/focus-indicators.yaml`
- `icons/registry.json`
- `patterns/iconography.yaml`

Create:

1. Component masters.
2. Relevant component variants.
3. Relevant states.
4. Documentation examples.
5. QA or playground examples.

Rules:

- Use the component contract as the source of truth.
- Use semantic tokens, not raw values.
- Use approved icon components only.
- Do not detach icon instances.
- Do not invent variants, states or sizes that are not documented.
- If something is unclear, add a visible note or report the gap rather than inventing rules.
- Use heading hierarchy from `accessibility/headings.yaml`.
- Choose heading visual styles based on semantic level and current frame breakpoint.
- Use flex-style layout for normal grouped examples.
- Use grid-style layout only for true matrices or tables.
- Use the documented double-ring focus treatment where focus states are shown.
- Use `layout.container.maxWidth.text` for prose, section descriptions, documentation notes and accessibility guidance text.
- Do not stretch explanatory body text across the full page container on desktop frames.
- Wider layout containers may be used for component examples, state matrices, playgrounds and visual samples.

After creating the first pass, report:

- What was created.
- What assumptions were made.
- Any tokens or rules that were missing.
- Any areas that need human review.