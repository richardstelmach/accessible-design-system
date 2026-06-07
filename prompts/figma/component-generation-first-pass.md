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
- `tokens/components/`
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
- Use primitive tokens for raw values, semantic tokens for reusable system roles, and component tokens for component-specific decisions.
- When documented component tokens exist for a component, prefer them over generic semantic tokens.
- Do not use generic spacing, sizing, colour or typography tokens for component-specific purposes when a component-level token exists.
- Check the rendered result, not only the displayed variable name. If a layer appears to have the correct variable but renders incorrectly, remove and re-apply the variable binding.
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

## Documentation page template rules

When creating component documentation frames:

- Use `patterns/documentation-page.yaml`.
- Use or create `_Documentation/Page Header`.
- Do not create ad hoc page headers.
- Include eyebrow text above the H1.
- For component documentation pages, eyebrow text must be `Components`.
- Use `color.text.headingAccent` for the documentation H1.
- Use `typography.heading.h1.[breakpoint]` for the H1.
- Use `typography.body.large.[breakpoint]` for intro text.
- Constrain intro text to `layout.container.maxWidth.text`.
- Use the shared Figma documentation template from the `00 Templates` page where available.

Figma presentation of component:

- Use `components/internal/documentation-card.yaml` when creating repeated documentation summary cards.
- Create or reuse `_Documentation/Card` instances rather than one-off frames.
- Use the native Figma `Sample` slot for visual examples where slots are available.
- If native slots are unavailable through the current AI/Figma MCP workflow, report the limitation and use the documented fallback temporarily.
- Use the card Sample slot for visual examples such as icons, colour pairings, spacing, padding, radius, borders and swatches.
- Do not create a new card variant or card style for every sample type.
- Use wrapping documentation card groups for short documentation summaries on desktop frames.
- Do not convert short documentation card groups into a single full-width vertical panel list.
- Use grid-style layout only for true matrices, tables or row/column comparisons.
- Card title semantic level is determined by page structure; do not infer semantic level from visual text style alone.
- Documentation / Card is an internal documentation component, not a public product component.

After creating the first pass, report:

- What was created.
- What assumptions were made.
- Any tokens or rules that were missing.
- Any areas that need human review.