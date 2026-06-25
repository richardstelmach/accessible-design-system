# Figma component first-pass generation

Use this prompt with an AI agent that can create or update Figma content and read the design system source files.

## Required inputs

- Figma target page or frame URL
- GitHub repository URL or local repository access
- Component contract file
- Optional component Markdown documentation file
- Relevant token, pattern, accessibility and registry files

## Prompt

Use the design system source files to create a first-pass Figma component setup and component documentation page.

Figma target:

`[PASTE FIGMA PAGE OR FRAME URL]`

GitHub source:

`[PASTE GITHUB REPOSITORY URL]`

Component contract:

`components/[component-name]/[component-name].yaml`

Optional component documentation:

`components/[component-name]/[component-name].md`

Use these source files:

- `components/[component-name]/[component-name].yaml`
- `components/[component-name]/[component-name].md`, if present
- `tokens/primitives/`
- `tokens/semantic/`
- `tokens/components/`
- `patterns/component-documentation-page.yaml`
- `patterns/page-layout.yaml`
- `patterns/documentation-page.yaml`
- `patterns/card-grid.yaml`
- `patterns/content-block.yaml`
- `components/internal/documentation-page-header.yaml`
- `components/internal/documentation-card.yaml`
- `accessibility/headings.yaml`
- `accessibility/focus-indicators.yaml`
- `icons/registry.json`
- `patterns/iconography.yaml`

## Mandatory preflight

Before changing Figma:

1. Read the latest source from GitHub.
2. Read the component contract YAML.
3. Read the component Markdown documentation, if present.
4. Read `patterns/component-documentation-page.yaml`.
5. Read the shared page, documentation page, card grid, page header and documentation card pattern files.
6. Inspect the Figma file.
7. Inspect the shared Figma documentation template on the `00 Templates` page, if present.
8. Inspect the nearest completed component documentation page as a reference.

Do not rely on cached files, previous conversation context or stale local working-tree files as the source of truth.

If required GitHub files or Figma access are unavailable, stop before making changes and report the access problem.

## Source precedence

When sources conflict, use this order:

1. Component contract YAML
2. Shared machine-readable token, pattern, accessibility and registry files
3. Component Markdown documentation, if present
4. Existing Figma implementation references
5. This prompt

The component contract defines the component API, anatomy, states, variants, examples and accessibility requirements.

The component documentation page pattern defines how the Figma page should be assembled.

## Create

Create or update:

1. Component masters.
2. Relevant component variants.
3. Relevant states.
4. Documentation examples.
5. QA or playground examples.
6. Accessibility notes.

## Component documentation page structure

When creating or updating a component documentation page, follow:

`patterns/component-documentation-page.yaml`

Create or reuse a numbered component page named:

`[PAGE NUMBER] - Components - [COMPONENT NAME]`

The page should contain these top-level areas:

1. `01 - Component set`
2. `02 - Documentation examples`
3. `03 - QA and responsive tests`
4. `04 - Accessibility notes`

Rules:

- Keep production component masters separate from documentation examples and QA.
- Build or update the production component set first.
- Documentation examples must be component instances, not additional variants.
- QA examples must be component instances outside the production component set.
- Use contract-defined examples and QA cases where available.
- Use `_Documentation/Page Header` for each documentation area.
- Use `_Documentation/Card` instances for repeated short documentation summaries.
- Use the established wrapping documentation-card grid for card groups.
- Use prose sections for longer guidance instead of forcing long text into cards.

## Token and variable rules

- Use the component contract as the source of truth.
- Use semantic tokens, not raw values.
- Use primitive tokens for raw values.
- Use semantic tokens for reusable system roles.
- Use component tokens for component-specific decisions.
- When documented component tokens exist for a component, prefer them over generic semantic tokens.
- Do not use generic spacing, sizing, colour or typography tokens for component-specific purposes when a component-level token exists.
- Do not invent token values.
- Do not use raw colours, arbitrary spacing, detached icons or unbound text styles where variables or styles exist.
- Check the rendered result, not only the displayed variable name.
- If a layer appears to have the correct variable but renders incorrectly, remove and re-apply the variable binding.
- If a documented variable is missing or cannot be bound, report the gap rather than silently substituting a raw value.

## Component rules

- Use Auto Layout.
- Use approved icon components only.
- Do not detach icon instances.
- Do not invent variants, states, sizes or properties that are not documented.
- Do not create documentation-only variants in the production component set.
- Use component properties where they keep the component maintainable.
- Avoid multiplying variants for content conditions unless the contract explicitly requires it.
- If something is unclear, add a visible note or report the gap rather than inventing rules.
- Use the documented focus treatment where focus states are shown.
- Ensure component instances can be configured through documented properties without forcing unrelated settings to change.

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
- Use heading hierarchy from `accessibility/headings.yaml`.
- Choose heading visual styles based on semantic level and current frame breakpoint.
- Use `layout.container.maxWidth.text` for prose, section descriptions, documentation notes and accessibility guidance text.
- Do not stretch explanatory body text across the full page container on desktop frames.
- Wider layout containers may be used for component examples, state matrices, playgrounds and visual samples.

## Documentation card rules

When creating repeated short documentation summaries:

- Use `components/internal/documentation-card.yaml`.
- Create or reuse `_Documentation/Card` instances rather than one-off frames.
- Use the native Figma `Sample` slot for visual examples where slots are available.
- If native slots are unavailable through the current AI/Figma MCP workflow, report the limitation and use the documented fallback temporarily.
- Use the card Sample slot for visual examples such as icons, colour pairings, spacing, padding, radius, borders, swatches and component examples.
- Do not create a new card variant or card style for every sample type.
- Use wrapping documentation card groups for short documentation summaries on desktop frames.
- Do not convert short documentation card groups into a single full-width vertical panel list.
- Use grid-style layout only for true matrices, tables or row/column comparisons.
- Card title semantic level is determined by page structure; do not infer semantic level from visual text style alone.
- Documentation / Card is an internal documentation component, not a public product component.

## Layout rules

- Use `patterns/page-layout.yaml`.
- Use `patterns/card-grid.yaml` for repeated card groups.
- Use flex-style layout for normal grouped examples.
- Use grid-style layout only for true matrices or tables.
- Centre the page container, not the body text.
- Keep body copy left aligned by default.
- Use readable text width for long-form content.
- Ensure frames hug or expand to fit content.
- Ensure visible content does not overflow clipped frames.
- Use standard responsive or QA frame widths where the contract requires responsive checks.

## QA and playground rules

- Use QA examples defined by the component contract.
- Keep QA examples outside the production component set.
- Use component instances for QA examples.
- Include long-content, wrapping, narrow-container, focus, error, disabled and responsive checks where relevant to the component contract.
- Do not create extra master variants just to support QA examples.
- Report missing contract-defined QA cases rather than inventing undocumented behaviour.

## Accessibility rules

- Use accessibility guidance from the component contract and shared accessibility files.
- Use heading hierarchy from `accessibility/headings.yaml`.
- Use `accessibility/focus-indicators.yaml` for focus behaviour where relevant.
- Represent visible focus where focus states are documented.
- Ensure error states do not rely on colour alone where relevant.
- Include component-specific accessibility notes in the accessibility area.
- Use `_Documentation/Card` instances for repeated short accessibility notes.
- Do not place accessibility notes inside production component masters.

## Verification

Before finishing, verify:

- The correct GitHub source files were read.
- The component contract was used as the canonical source.
- `patterns/component-documentation-page.yaml` was followed.
- The component page has the correct numbered name.
- The four required top-level areas exist.
- Component masters, documentation examples, QA and accessibility notes are separated.
- The production component set is separate from documentation and QA examples.
- `_Documentation/Page Header` is used instead of ad hoc headers.
- `_Documentation/Card` instances are used for repeated short notes.
- Card groups wrap correctly and are not full-width panel lists.
- Documentation and QA examples remain instances.
- Component variants and properties match the contract.
- No undocumented variants, states, properties or token values were introduced.
- No raw visual values were used where variables or styles exist.
- No detached icon instances were introduced.
- No visible content overflows clipped frames.
- Documentation text uses readable max width.
- Accessibility guidance matches the contract.

## Completion report

After creating the first pass, report:

- What was created.
- Which GitHub source files were read.
- Which Figma page was created or updated.
- Component set name.
- Final variants and component properties.
- Documentation areas created.
- Documentation card usage.
- QA examples included.
- Accessibility notes included.
- Variables, styles, icons and existing components reused.
- What assumptions were made.
- Any tokens, variables, styles, icons or rules that were missing.
- Any differences between the contract and what Figma could represent.
- Any areas that need human review.

Do not modify GitHub files unless explicitly asked.
```