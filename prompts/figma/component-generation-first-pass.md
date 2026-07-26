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
- `tokens/figma/sync-contract.yaml`
- `docs/token-sync-workflow.md`
- `icons/registry.json`
- `patterns/iconography.yaml`

## Mandatory non-destructive preflight

Before changing Figma:

1. Read the latest source files from the default GitHub branch, or from the explicitly supplied source branch if one is provided.
2. Read the component contract YAML and confirm it exists.
3. Read the component Markdown documentation, if present, and confirm whether it exists.
4. Read the shared machine-readable pattern, token-sync, accessibility and internal documentation component files listed above.
5. Inspect the current Figma page structure.
6. Inspect the shared Figma documentation template on the `00 Templates` page, if present.
7. Inspect the nearest completed component documentation page as a reference.
8. Inspect existing component masters, internal documentation components, variables, styles, modes, icons and reusable sample components.
9. Confirm whether the intended component page already exists.
10. Confirm the correct next page number from the existing component page order instead of guessing.
11. Identify the intended production component-set name from the component contract.
12. List the contract-defined properties, variants, states, defaults, anatomy, token usage and QA requirements.
13. Identify any missing variables, styles, components, slots, instance-swap support or Figma/MCP capabilities before making changes.

When the agent or workflow supports staged reporting, provide a short preflight report before mutation. Include the source branch, GitHub files read, Figma pages inspected, existing assets found, intended page name, intended component-set name, property list and any gaps or conflicts.

Do not rely on cached files, previous conversation context or stale local working-tree files as the source of truth.

Do not modify GitHub files, token files, component contracts or documentation unless the user explicitly requests repository edits.

Do not create duplicate pages, component sets, documentation headers, documentation cards, variables or styles when suitable existing assets already exist.

If required GitHub files or Figma access are unavailable, stop before making changes and report the access problem.

## Source precedence

When sources conflict, use this order:

1. Component contract YAML.
2. Shared machine-readable token, pattern, accessibility, registry and token-sync files.
3. Component Markdown documentation, if present.
4. Existing Figma implementation references.
5. This prompt.
6. Conversation instructions.

Rules:

- The component YAML contract defines the public component API, anatomy, defaults, properties, variants, states, token usage, examples, QA requirements and accessibility requirements.
- Shared machine-readable patterns define composition, page structure, layout, internal documentation components, cross-component rules and token-sync rules.
- Markdown explains intended human usage, but it must not override the YAML contract.
- Existing Figma content is a reference and validation source, not authority when it conflicts with GitHub.
- This prompt guides the workflow but does not override repository source files.
- A conversation prompt must not silently override repository source files.
- When sources conflict, report the conflict rather than choosing a convenient interpretation.

## Create or update

Create or update only the Figma artefacts that the contract and page pattern require:

1. Production component masters and component set.
2. Contract-defined component variants, states and properties.
3. Documentation examples.
4. QA or playground examples.
5. Accessibility notes.

Keep the production component set separate from documentation examples, QA examples and accessibility notes.

## Components, compositions and patterns

- Do not create a public Figma component merely because several component instances are shown together.
- Grouped examples, stacks, matrices, playgrounds and layout compositions are not automatically public components.
- Use existing parent components and slots where contracts define composition.
- Do not duplicate parent-component responsibilities in a child component.
- Do not create content-type variants on generic slot-based parents unless the contract explicitly requires them.
- Documentation examples may use ordinary Auto Layout compositions without publishing those compositions as components.
- Report uncertainty where the contract does not clearly establish whether something is a component, pattern or composition.

## Visual anatomy and implementation semantics

- Figma layer nesting expresses visual structure and maintainability; it does not automatically define HTML nesting.
- Follow semantic implementation guidance from the component contract.
- Do not infer that visually grouped text belongs inside an HTML label, legend, button or link.
- Preserve documented accessible-name and accessible-description separation.
- Preserve ownership of labels, legends, helper text, errors and descriptions.
- Add handoff notes where a Figma visual structure could otherwise be implemented with incorrect semantics.
- Illustrative class names in HTML examples are not public API unless the contract explicitly says they are.

## Component property rules

- Match property names, types, values and defaults exactly to the contract.
- Distinguish variant properties, Boolean properties, text properties, instance swaps and slots.
- Do not turn optional content into a variant when the contract specifies a Boolean property.
- Do not create variants for semantic metadata that has no visual effect.
- Do not combine independent properties merely to reduce variant count if doing so makes the API inaccurate.
- Do not create undocumented convenience properties.
- Confirm hidden optional content collapses without empty space.
- Confirm every documented default is represented correctly in the default component instance.
- Verify property changes do not unintentionally change unrelated properties.
- Ensure component instances can be configured through documented properties without forcing unrelated settings to change.

## Token and variable rules

- Read `tokens/figma/sync-contract.yaml` and `docs/token-sync-workflow.md` before binding variables.
- GitHub is the source of truth for tokens. Figma is the visual implementation and validation layer.
- Use semantic tokens, not raw values, for reusable system roles.
- Use primitive tokens only where the contract calls for raw reusable values.
- Use component tokens for component-specific decisions.
- Bind the most specific documented component token when one exists.
- Use shared semantic tokens where the contract explicitly assigns a shared role.
- When documented component tokens exist for a component, prefer them over generic semantic tokens.
- Do not use generic spacing, sizing, colour or typography tokens for component-specific purposes when a component-level token exists.
- Do not invent token values.
- Do not use raw colours, arbitrary spacing, detached icons or unbound text styles where variables or styles exist.
- Respect variables managed through Figma modes.
- Do not recreate responsive mode-managed variables as separate fixed variables.
- Do not import excluded breakpoint branches into the wrong collection.
- Never substitute a visually similar variable merely because the required variable is unavailable.
- Report missing variables rather than using raw fallback values.
- Verify actual rendered values and variable IDs, not only displayed variable names.
- Check for stale or orphaned variable bindings.
- Reapply a binding when the variable name appears correct but the rendered value or variable ID is stale.
- Do not perform destructive variable imports or collection replacement as part of component generation.
- Do not modify variable architecture unless the task explicitly includes approved token work.

## Slot and instance rules

- Preserve native Figma slots and instance-swap properties where contracts require them.
- Do not detach instances to work around a slot limitation.
- Do not replace reusable instances with visually copied frames.
- Use approved icon components only.
- Do not detach icon instances.
- If the current Figma or MCP capability cannot populate a native slot accurately, report the limitation.
- Use a documented temporary fallback only in documentation or QA examples, not inside the production component master, unless explicitly approved.
- Record any difference between the intended contract and what Figma could represent.

## Focus and state rules

- Apply focus styling to the exact focus target defined by the contract. The target may be a nested interactive control or a programmatically focusable, non-interactive component root such as Error Summary.
- Use the shared focus-indicator standard where focus states are shown.
- Preserve combined states only when the contract defines them.
- Do not invent hover, active, error, selected, read-only, disabled or indeterminate states.
- Do not apply a parent-owned validation state to every child control.
- Do not create documentation-only variants in the production component set.
- Ensure disabled selected values remain understandable where required.
- Ensure focus examples are component instances, not alternative undocumented masters.
- If something is unclear, add a visible note or report the gap rather than inventing rules.

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

- Reuse the existing documentation page template where available.
- Reuse `_Documentation/Page Header` and `_Documentation/Card`; do not create local substitutes.
- Do not modify internal documentation component masters as part of a product-component task.
- Keep production component masters separate from examples, accessibility notes and QA.
- Build or update the production component set first.
- Documentation examples must be component instances, not additional variants.
- QA examples must be component instances outside the production component set.
- Use contract-defined examples and QA cases where available.
- Use `_Documentation/Page Header` for each documentation area.
- Use `_Documentation/Card` instances only for concise repeated summaries.
- Use prose sections for longer or nuanced guidance.
- Do not force large or complex components into card grids that clip or constrain them.
- Use a single-column or suitable flexible layout when component content needs more width or height.
- Use the established wrapping documentation-card grid for short card groups.
- Use grid-style layout only for true matrices, tables or row/column comparisons.
- Ensure Auto Layout containers use Hug or Fill appropriately rather than fixed heights that clip content.
- Do not clip visible content.
- Keep long explanatory text within the documented readable maximum width.
- Verify all page and section headings follow `accessibility/headings.yaml`.

## Documentation page template rules

When creating component documentation frames:

- Use `patterns/documentation-page.yaml`.
- Use `patterns/page-layout.yaml`.
- Use `patterns/content-block.yaml` for heading, prose and action relationships.
- Use `patterns/card-grid.yaml` for repeated card groups.
- Include eyebrow text above the H1.
- For component documentation pages, eyebrow text must be `Components`.
- Use `color.text.headingAccent` for the documentation H1.
- Use the production Figma text style `typography/heading/h1` for the H1.
- Use the production Figma text style `typography/body/large` for intro text.
- Constrain intro text to `layout.container.maxWidth.text`.
- Let responsive text-style values inherit from the parent frame's `Breakpoint` mode.
- Preview `base`, `md` and `lg` by changing the parent frame mode; do not swap to breakpoint-suffixed styles or create responsive component variants.
- Choose heading visual styles based on semantic level, then let Breakpoint mode supply the responsive value.
- Centre the page container, not the body text.
- Keep body copy left aligned by default.
- Wider layout containers may be used for component examples, state matrices, playgrounds and visual samples.
- Use standard responsive or QA frame widths only where the contract requires responsive checks.

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
- Card title semantic level is determined by page structure; do not infer semantic level from visual text style alone.
- Documentation / Card is an internal documentation component, not a public product component.

## QA and playground rules

- Use QA examples defined by the component contract.
- Keep QA examples outside the production component set.
- Use component instances for QA examples.
- Include long-content, wrapping, narrow-container, focus, error, disabled and responsive checks only where relevant to the component contract.
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
- Ensure accessibility notes accurately reflect the contract rather than broad claims.

## Formal post-generation audit

After generation, inspect the completed result. Do not merely assume it is correct.

Verify:

- Correct page and component-set names.
- Correct number of production variants.
- Exact contract-defined property names, types, values and defaults.
- No undocumented variants or properties.
- Production masters are separate from examples and QA.
- Documentation and QA use component instances.
- No detached instances.
- No duplicated internal documentation components.
- Correct variables and styles are bound.
- No raw values where variables exist.
- No stale variable IDs or rendered-value mismatches.
- No fixed-height clipping or hidden overflow.
- Long labels, descriptions and content wrap correctly.
- Optional elements collapse cleanly.
- Focus, disabled, selected and validation examples match contract ownership.
- Slot or instance-swap behaviour works.
- Responsive or narrow-container checks are included only when relevant.
- Accessibility notes accurately reflect the contract.
- Visual Figma anatomy has not been misrepresented as implementation semantics.

Correct issues that can be safely corrected without changing the contract. Report unresolved issues, source conflicts, unsupported Figma or MCP capabilities and human-review items.

## Completion report

After creating the first pass, report:

- Preflight findings.
- Which GitHub source files were read.
- Which Figma pages and reference components were inspected.
- Which page was created or updated.
- Production component-set name.
- Variants and properties created, including defaults.
- Existing assets reused.
- Variables and styles bound.
- Documentation sections created.
- Documentation card usage.
- QA examples included.
- Accessibility examples included.
- Slot or instance-swap handling.
- Any unsupported Figma or MCP capabilities.
- Any source conflicts.
- Any raw-value or missing-variable risks.
- Any assumptions.
- Results of the post-generation audit.
- Exact remaining human-review items.

Do not modify GitHub files unless explicitly asked.
