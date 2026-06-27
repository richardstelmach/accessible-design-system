# Token Sync Workflow

This document explains how design tokens move from source files in this repository into Figma.

The standard workflow is:

```text
Source token JSON files
↓
Build script
↓
Compiled token outputs
↓
GitHub
↓
Tokens Studio pull
↓
Figma global variables and text styles
```

Responsive tokens use a related but deliberately different Figma implementation:

```text
Responsive source tokens in GitHub
↓
Breakpoint mapping
↓
Manual Figma Breakpoint collection
↓
Semantic variables and styles responding to parent-frame modes
```

GitHub is the source of truth.

Figma is a visual implementation and validation layer.

---

## Source of Truth

Editable token source files live in:

```text
tokens/primitives/
tokens/semantic/
tokens/components/
tokens/themes/
```

These are the canonical token files.

Responsive mappings between GitHub and Figma live in:

```text
tokens/figma/breakpoint-mapping.json
```

Machine-readable token sync rules live in:

```text
tokens/figma/sync-contract.yaml
```

Do not manually edit compiled token files.

Do not treat Figma variables as the canonical source of token decisions.

When a token value, name, alias or responsive decision changes:

1. Update the source JSON.
2. Update the Figma breakpoint mapping when applicable.
3. Run the token build.
4. Review the compiled output.
5. Commit and push the changes.
6. Update or sync Figma using the appropriate workflow.

---

## Token Layers

The system uses a layered token architecture:

```text
Primitive tokens
↓
Semantic tokens
↓
Component tokens
↓
Components
```

### Primitive tokens

Primitive tokens define raw reusable values.

Examples:

```text
color.primary.500
color.neutral.500
spacing.4
typography.size.md
radius.lg
```

Primitive tokens do not define usage.

### Semantic tokens

Semantic tokens define approved usage roles.

Examples:

```text
color.surface.default
color.text.default
spacing.content.headingToBody
typography.heading.h1.base
layout.container.maxWidth.text
```

Semantic tokens should normally reference primitive tokens.

### Component tokens

Component tokens define decisions specific to a component or component family.

Examples:

```text
component.button.typography.default.base
component.link.targetPaddingBlock
component.textInput.width.full
component.textarea.blockSize.default
```

Component tokens should normally reference semantic or primitive tokens rather than duplicate raw values.

---

## Token Descriptions

Token descriptions should live in source token JSON using `$description`.

Descriptions should explain the purpose and intended usage of a token, rather than merely repeating its value.

Example:

```json
{
  "default": {
    "$value": "{color.text.default}",
    "$type": "color",
    "$description": "Default text colour used for readable body content and standard interface text."
  }
}
```

A group-level `$description` may be used to explain the relationship between child tokens.

Example:

```json
{
  "success": {
    "$description": "Status colour pairing for positive feedback, successful actions or confirmation messages.",
    "background": {},
    "foreground": {}
  }
}
```

Figma documentation may display these descriptions, but GitHub remains canonical.

Do not treat manually written Figma descriptions as canonical when the source token contains a `$description`.

---

## Current Folder Structure

```text
tokens/
├── primitives/
│   ├── colors.json
│   ├── typography.json
│   ├── spacing.json
│   ├── radius.json
│   ├── borders.json
│   └── breakpoints.json
│
├── semantic/
│   ├── colors.semantic.json
│   ├── typography.semantic.json
│   ├── forms.semantic.json
│   ├── spacing.semantic.json
│   ├── layout.semantic.json
│   └── sizing.semantic.json
│
├── components/
│   ├── button.json
│   ├── link.json
│   ├── text-input.json
│   └── textarea.json
│
├── themes/
│
├── figma/
│   └── breakpoint-mapping.json
│
└── compiled/
    ├── tokens.raw.json
    └── tokens.studio.json
```

The contents of these folders will grow as the design system develops.

---

## Compiled Token Files

Compiled files are generated into:

```text
tokens/compiled/
```

Current outputs:

```text
tokens.raw.json
tokens.studio.json
```

### `tokens.raw.json`

`tokens.raw.json` is the complete canonical compiled token tree.

It:

- merges primitive, semantic, component and theme token sources;
- retains all responsive `base`, `md` and `lg` branches;
- retains the complete GitHub token architecture;
- is intended for code, documentation, validation tools and AI consumption.

Responsive tokens remain explicit in this file.

Example:

```text
typography.heading.h1.base
typography.heading.h1.md
typography.heading.h1.lg
```

### `tokens.studio.json`

`tokens.studio.json` is the Tokens Studio-facing compiled output.

It:

- contains one top-level token set named `global`;
- retains ordinary non-responsive tokens;
- excludes responsive token nodes represented by Figma's `Breakpoint` collection;
- derives responsive exclusions from `tokens/figma/breakpoint-mapping.json`;
- validates that every complete responsive group is declared for Figma handling;
- validates that retained aliases do not point to removed token nodes;
- does not modify or flatten the canonical source structure.

The relationship is:

```text
Source tokens and tokens.raw.json
→ responsive branches retained

tokens.studio.json
→ mapped responsive branches excluded

Figma
→ responsive decisions represented as Breakpoint modes
```

Tokens Studio must point to:

```text
tokens/compiled/tokens.studio.json
```

Tokens Studio must not point to:

```text
tokens/compiled/tokens.raw.json
```

Do not manually edit either compiled file during normal work.

Update the source token files and regenerate the compiled outputs.

---

## Responsive Token Architecture

Responsive design decisions are represented differently in GitHub and Figma. This difference is intentional.

### GitHub representation

GitHub uses explicit branches:

```text
typography.heading.h1.base
typography.heading.h1.md
typography.heading.h1.lg
```

The same pattern is used for responsive layout tokens:

```text
layout.page.padding.base
layout.page.padding.md
layout.page.padding.lg
```

This structure is explicit, platform-agnostic and suitable for code generation.

### Figma representation

Figma represents the same decision as one variable in the `Breakpoint` collection:

```text
typography/heading/h1/fontSize
```

with modes:

```text
base
md
lg
```

For layout:

```text
layout/page/padding
```

with values controlled by the active mode.

### Breakpoint definitions

The current breakpoint policy is:

```text
base = below 48rem
md = 48rem and above
lg = 64rem and above
```

Equivalent pixel reference values are:

```text
md = 768px
lg = 1024px
```

### Figma Breakpoint collection

The Figma collection is named:

```text
Breakpoint
```

It contains these modes:

```text
base
md
lg
```

The collection is maintained manually while the design system uses the free Tokens Studio workflow.

GitHub remains the source of truth for the values.

### Breakpoint mapping

The mapping between GitHub source tokens and Figma variables is documented in:

```text
tokens/figma/breakpoint-mapping.json
```

A mapping entry identifies:

- the Figma variable;
- its type;
- the source token for each mode;
- aliases or resolved values where useful;
- any intentional Figma implementation detail.

The compiler uses each mode's `source` field to determine which token node is excluded from `tokens.studio.json`.

Fields such as `resolvedSource` and `semanticSource` are explanatory metadata and are not used as deletion instructions.

The compiler also scans the complete canonical token tree for objects with direct `base`, `md` and `lg` DTCG token children.

Every detected responsive group must be declared in one of two ways:

- mapped to a Figma `Breakpoint` variable through the mapping's mode `source` fields;
- listed in `nonFigmaResponsiveGroups` when it intentionally exists only in GitHub and is not represented through the Figma `Breakpoint` collection.

Do not use `nonFigmaResponsiveGroups` to hide missing Figma work.

### Production text styles

Production semantic text styles must not use breakpoint suffixes.

Correct:

```text
typography/heading/h1
typography/body/default
form/label/typography
form/control/typography
component/button/default/typography
component/link/standalone/typography
```

Incorrect for production use:

```text
typography/heading/h1/base
typography/heading/h1/md
typography/heading/h1/lg
```

The production style should bind responsive properties to variables in the `Breakpoint` collection.

The parent frame's active mode controls the resulting value.

### Component variants

Do not create `base`, `md` or `lg` component variants merely to represent responsive token values.

Components should use semantic variables and styles and inherit the responsive mode from their surrounding frame.

### Resolved Figma values

Some GitHub values may need a resolved Figma implementation.

For example, a percentage line height may be represented as a pixel value in Figma.

This is acceptable when:

- the GitHub percentage remains canonical;
- the resolved Figma value is documented in the mapping;
- the relationship remains deterministic.

A value such as `28.8` may be displayed as `29` in parts of the Figma interface because of rounding.

---

## Why Tokens Studio Needs a Specific File

Tokens Studio treats the outermost keys in a single synced JSON file as token-set names.

A raw compiled file such as:

```json
{
  "border": {},
  "color": {},
  "spacing": {}
}
```

may be interpreted as separate token sets:

```text
border
color
spacing
```

The Tokens Studio-specific file uses one `global` wrapper:

```json
{
  "global": {
    "border": {},
    "breakpoint": {},
    "color": {},
    "radius": {},
    "spacing": {},
    "typography": {},
    "layout": {},
    "size": {},
    "form": {},
    "component": {}
  }
}
```

Once pulled into Tokens Studio, the left panel should show one token set:

```text
global
```

Responsive nodes represented by Figma modes are intentionally absent from that set.

---

## Build Tokens

After editing source token files, run the following command from the repository root:

```bash
node scripts/build-tokens.mjs
```

The build script:

1. Reads token JSON from:
   - `tokens/primitives`
   - `tokens/semantic`
   - `tokens/components`
   - `tokens/themes`
2. Merges the complete token tree.
3. Reads `tokens/figma/breakpoint-mapping.json`.
4. Derives the responsive token nodes represented by Figma modes.
5. Scans the complete canonical tree for full `base`, `md` and `lg` responsive groups.
6. Validates that every detected group is mapped or explicitly listed in `nonFigmaResponsiveGroups`.
7. Removes mapped responsive nodes only from the Tokens Studio-facing copy.
8. Prunes empty metadata-only groups.
9. Checks retained aliases.
10. Writes the complete tree to `tokens.raw.json`.
11. Writes the filtered tree inside the `global` set in `tokens.studio.json`.

A successful build reports:

- raw token count;
- Tokens Studio token count;
- number of mode-managed nodes excluded;
- number of responsive groups detected;
- number of responsive groups mapped to the Figma `Breakpoint` collection;
- number of responsive groups explicitly excluded from Figma;
- zero unmapped responsive groups;
- number of retained aliases checked;
- zero broken retained aliases;
- the paths excluded from the Tokens Studio output.

The exact token counts will change as the system develops.

Do not use fixed token counts as permanent success criteria.

The important invariants are:

- the raw output remains complete;
- the Studio output contains one `global` set;
- mapped responsive nodes are absent from the Studio output;
- mapped responsive nodes remain in the raw output;
- detected responsive groups are either mapped or intentionally listed as non-Figma;
- retained aliases resolve;
- unrelated tokens remain unchanged.

---

## Reviewing Compiled Output

After running the compiler, review:

```bash
git diff -- tokens/compiled/tokens.raw.json
git diff -- tokens/compiled/tokens.studio.json
```

When only the compiler filtering logic changes:

- `tokens.raw.json` should remain unchanged;
- `tokens.studio.json` should show only the intended responsive exclusions.

When source tokens change:

- both outputs may change;
- responsive source decisions must still remain in `tokens.raw.json`;
- mapped responsive branches must remain absent from `tokens.studio.json`.

Do not continue to Figma when the compiler reports:

- a missing mapping source;
- an unexpected token boundary;
- a responsive group missing a required mode;
- a responsive group that is not declared for Figma handling;
- a retained alias pointing to a removed token.

---

## Commit and Push Changes

After rebuilding tokens, commit both source and compiled changes.

Example:

```bash
git add .
git commit -m "Update design tokens"
git push
```

Tokens Studio pulls from GitHub, so changes must be pushed before they can be pulled into Figma.

Commit together:

- changed source tokens;
- mapping changes;
- compiler changes when applicable;
- regenerated compiled files;
- related documentation changes.

---

## Tokens Studio GitHub Sync Settings

Tokens Studio should use the GitHub sync provider.

Recommended settings:

```text
Repository:
richardstelmach/accessible-design-system

Branch:
main

Token storage location:
tokens/compiled/tokens.studio.json

Base URL:
blank
```

Do not use a leading slash in the token storage location.

Correct:

```text
tokens/compiled/tokens.studio.json
```

Incorrect:

```text
/tokens/compiled/tokens.studio.json
```

---

## Sync Direction

Use:

```text
Pull from provider
```

Do not push from Tokens Studio back to GitHub.

The workflow must remain:

```text
GitHub → Tokens Studio → Figma
```

not:

```text
Figma → Tokens Studio → GitHub
```

Tokens Studio may transform token type names internally. For example, `fontFamily` may appear as `fontFamilies`.

This is acceptable inside Tokens Studio, but it is another reason not to push from Tokens Studio back into the repository.

---

## Figma Export Settings

In Tokens Studio, go to:

```text
Styles & Variables
→ Export styles & variables
```

Two export workflows are supported:

1. Routine non-destructive export.
2. Exceptional destructive reconciliation.

---

## Routine Non-Destructive Export

Use this for normal token additions and value updates.

### Variables

```text
Color: on
String: on
Number: on
Boolean: on
```

### Styles

```text
Color: off
Typography: on
Effects: on
Gradients: on
```

### Options

```text
Ignore first part of token name for styles: off
Prefix styles with active theme name: off
Create styles with variable references: off
Update existing style and variable names: on
Remove styles and variables without connection to a token: off
```

Select only the `global` token set.

Do not include or recreate the `Breakpoint` collection through Tokens Studio.

The most important routine setting is:

```text
Remove styles and variables without connection to a token: off
```

Routine syncing must not delete existing Figma resources.

---

## Exceptional Destructive Reconciliation

A destructive export is used only when intentionally deleting or renaming tokens or reconciling previously generated Figma artefacts.

It is not part of the standard token-sync workflow.

For a destructive export, this setting is enabled:

```text
Remove styles and variables without connection to a token: on
```

A destructive export may be performed only after all of the following:

1. Create a duplicate or backup of the Figma file.
2. Test the exact compiled JSON in the duplicate.
3. Identify every active binding to the variables or styles being removed.
4. Migrate active bindings before deletion.
5. Confirm zero stale or orphaned references.
6. Create a named Figma version.
7. Perform the destructive export.
8. Confirm the Breakpoint collection remains unchanged.
9. Run a post-export audit.
10. Restore the pre-export version immediately if active content is damaged.

Never assume that removing a token from JSON safely removes it from Figma.

Active Figma consumers must be migrated first.

---

## Why Colours Are Exported as Variables

Colours are exported as Figma variables rather than legacy colour styles.

This:

- supports semantic binding;
- works well with modern Figma variable workflows;
- supports future themes or modes;
- avoids maintaining duplicate colour styles and variables.

---

## Why Typography Uses Semantic Styles

Typography tokens are composite decisions that may include:

```text
font family
font weight
font size
line height
letter spacing
```

In Figma, these are represented through semantic text styles.

Production examples include:

```text
typography/heading/h1
typography/heading/h2
typography/heading/h3
typography/body/small
typography/body/default
typography/body/large

form/label/typography
form/control/typography
form/helper/typography
form/error/typography

form/legend/default/typography
form/legend/section/typography
form/legend/subsection/typography
form/legend/compact/typography

component/button/compact/typography
component/button/default/typography
component/button/comfortable/typography
component/link/standalone/typography
```

Responsive properties within these styles bind to the `Breakpoint` collection.

Do not use separate production styles for `base`, `md` and `lg`.

Responsive composite typography tokens are excluded from `tokens.studio.json` so Tokens Studio does not recreate breakpoint-suffixed styles.

Fixed, non-responsive typography tokens may still be exported through the ordinary Studio workflow.

---

## Expected Figma Result

A successful implementation contains two Figma Variable Collections:

```text
global
Breakpoint
```

### `global`

The `global` collection:

- is managed through Tokens Studio;
- contains ordinary non-responsive variables;
- may change in size as tokens are added or removed;
- must not contain duplicate responsive `base`, `md` and `lg` variables already represented by Breakpoint modes.

### `Breakpoint`

The `Breakpoint` collection:

- is maintained manually;
- contains modes `base`, `md` and `lg`;
- contains responsive typography and layout variables;
- is mapped to GitHub through `tokens/figma/breakpoint-mapping.json`;
- must not be removed, renamed or recreated by Tokens Studio.

Variable counts are diagnostic rather than contractual.

Do not document a specific variable count as a permanent requirement.

---

## Figma Validation

Use the Figma file to visually validate token behaviour.

Suggested page:

```text
01 Token Sync Test
```

The test page is a smoke test rather than a polished documentation page.

It should confirm that:

- Tokens Studio pulled the expected `global` token set;
- ordinary variables exist and resolve;
- production semantic text styles still exist;
- the `Breakpoint` collection still exists;
- responsive values change with the parent frame mode;
- no unexpected `/base`, `/md` or `/lg` production artefacts were created;
- no active variable or style bindings are broken.

---

## Colour Validation Checklist

Check representative colour tokens:

```text
color.surface.canvas
color.surface.default
color.surface.raised

color.text.default

color.border.light
color.border.default
color.border.interactive

color.interactive.default.foreground
color.interactive.default.border

color.interactive.primary.background
color.interactive.primary.foreground

color.interactive.focus.ring

color.featured.background
color.featured.foreground

color.status.success.background
color.status.success.foreground

color.status.warning.background
color.status.warning.foreground

color.status.error.background
color.status.error.foreground
```

Validate foreground and background pairs together rather than only as isolated swatches.

---

## Typography Validation Checklist

Validate production semantic styles rather than separate breakpoint-suffixed styles.

Check:

```text
typography/heading/h1
typography/heading/h2
typography/heading/h3
typography/heading/h4
typography/heading/h5
typography/heading/h6

typography/body/small
typography/body/default
typography/body/large

form/label/typography
form/control/typography
form/helper/typography
form/error/typography

form/legend/default/typography
form/legend/section/typography
form/legend/subsection/typography
form/legend/compact/typography

component/button/compact/typography
component/button/default/typography
component/button/comfortable/typography
component/link/standalone/typography
```

Validate representative styles inside parent frames using:

```text
Breakpoint = base
Breakpoint = md
Breakpoint = lg
```

Check:

- font family;
- font weight;
- font size;
- line height;
- letter spacing;
- variable bindings;
- text wrapping;
- clipping.

Use real sample text.

---

## Spacing and Layout Validation Checklist

### Fixed semantic spacing

Check:

```text
spacing.inset.sm
spacing.inset.md
spacing.inset.lg
spacing.inset.xl

spacing.stack.xs
spacing.stack.sm
spacing.stack.md
spacing.stack.lg
spacing.stack.xl

spacing.inline.xs
spacing.inline.sm
spacing.inline.md
spacing.inline.lg

spacing.content.headingToBody
spacing.content.bodyToAction
spacing.content.paragraph

spacing.control.paddingBlock.compact
spacing.control.paddingBlock.default
spacing.control.paddingBlock.comfortable

spacing.control.paddingInline.compact
spacing.control.paddingInline.default
spacing.control.paddingInline.comfortable

spacing.control.gap
```

These remain ordinary non-responsive variables in `global`.

### Responsive layout variables

Validate these variables in the `Breakpoint` collection:

```text
spacing/section
layout/page/padding
layout/grid/gutter
```

Expected values:

| Variable | base | md | lg |
|---|---:|---:|---:|
| `layout/page/padding` | 16 | 24 | 32 |
| `layout/grid/gutter` | 16 | 24 | 32 |
| `spacing/section` | 48 | 64 | 80 |

Do not expect these fixed responsive branches in the Figma `global` collection:

```text
spacing/section/base
spacing/section/md
spacing/section/lg

layout/page/padding/base
layout/page/padding/md
layout/page/padding/lg

layout/grid/gutter/base
layout/grid/gutter/md
layout/grid/gutter/lg
```

These branches remain in GitHub and `tokens.raw.json`, but are represented through modes in Figma.

### Container widths

Also validate:

```text
layout.container.maxWidth.text
layout.container.maxWidth.narrow
layout.container.maxWidth.default
layout.container.maxWidth.wide
```

---

## Choosing Responsive or Fixed Spacing

Use responsive layout tokens only when a value genuinely changes with viewport or breakpoint context.

Appropriate responsive uses include:

- page padding;
- page-grid gutter;
- spacing between major page sections;
- typography that scales by breakpoint.

Use fixed semantic spacing for:

- component internals;
- icon-to-label gaps;
- documentation matrices;
- card internals;
- fixed horizontal gaps;
- fixed vertical gaps;
- layouts requiring different horizontal and vertical values at the same time.

Example:

```text
Correct:
itemSpacing → spacing/inline/lg
counterAxisSpacing → spacing/stack/xl
```

Avoid using responsive grid-gutter tokens merely because their numeric values happen to match the desired fixed spacing.

A responsive page-grid token communicates a different purpose from fixed component or documentation spacing.

---

## Sizing Validation Checklist

Check:

```text
size.target.minimum
size.target.comfortable

size.control.minBlockSize.compact
size.control.minBlockSize.default
size.control.minBlockSize.comfortable

component.textarea.blockSize.minimum
component.textarea.blockSize.default
```

---

## Radius and Border Validation Checklist

Check radius tokens:

```text
radius.none
radius.sm
radius.md
radius.lg
radius.xl
radius.2xl
radius.full
```

Check border tokens:

```text
border.width.none
border.width.thin
border.width.medium
border.width.thick

border.style.solid
border.style.dashed
```

Border-style tokens may be more useful for code and documentation than as Figma variables.

---

## Standard Workflow for Non-Responsive Token Changes

Use this workflow for colours, radii, borders, fixed spacing, sizes, states and non-responsive component tokens.

```text
Edit source JSON
↓
Run node scripts/build-tokens.mjs
↓
Review tokens.raw.json
↓
Review tokens.studio.json
↓
Commit and push
↓
Pull from GitHub in Tokens Studio
↓
Run a non-destructive Figma export
↓
Validate visually
```

Keep:

```text
Remove styles and variables without connection to a token: off
```

---

## Standard Workflow for Responsive Token Changes

Use this workflow when editing or adding a responsive token.

```text
Edit base, md and lg source branches
↓
Update tokens/figma/breakpoint-mapping.json
↓
Run node scripts/build-tokens.mjs
↓
Confirm the responsive branches remain in tokens.raw.json
↓
Confirm the mapped branches are absent from tokens.studio.json
↓
Commit and push
↓
Manually update the matching Figma Breakpoint variable
↓
Validate base, md and lg modes
```

A responsive token represented in Figma is not complete until:

- all required source branches exist;
- the mapping exists;
- the raw output retains the branches;
- the Studio output excludes the branches;
- the Figma Breakpoint variable exists;
- all modes have been validated.

The compiler fails when a complete responsive group is neither mapped nor listed in `nonFigmaResponsiveGroups`.

Prefer adding the correct Breakpoint mapping. Use `nonFigmaResponsiveGroups` only when the group should intentionally remain GitHub-only.

Do not use Tokens Studio to recreate responsive variable branches in `global`.

---

## Workflow for Token Deletion or Renaming

Token deletion and renaming require additional care because Figma objects may still reference old variable or style IDs.

Use:

```text
Identify affected Figma consumers
↓
Migrate active bindings
↓
Confirm zero stale references
↓
Create a duplicate Figma test file
↓
Test the destructive export
↓
Create a named production version
↓
Run the production destructive export
↓
Run a post-export audit
```

Do not delete or rename a token in production Figma before its consumers have been migrated.

---

## Native Figma Token Import

Figma can import design tokens directly from JSON into variables.

This is not the primary workflow for this system.

Reasons include:

- native Figma import is a manual file-import process;
- it does not provide the current GitHub pull workflow;
- it is stricter about token format;
- it may require a separate Figma-specific compiled output;
- Tokens Studio currently provides the practical GitHub-to-Figma bridge.

A future compiled output structure could include:

```text
tokens.raw.json
tokens.studio.json
tokens.figma.json
```

For now, Tokens Studio remains the practical bridge for the `global` collection, while the `Breakpoint` collection is maintained manually.

---

## Troubleshooting

### Tokens Studio only shows border tokens

Tokens Studio is probably pointed at the raw compiled file without a token-set wrapper.

Point it at:

```text
tokens/compiled/tokens.studio.json
```

The file should contain one top-level `global` set.

### Tokens Studio does not show the latest changes

Likely causes:

- the build was not run;
- compiled files were not committed or pushed;
- Tokens Studio has not pulled from GitHub;
- Tokens Studio is connected to the wrong branch.

Run:

```bash
node scripts/build-tokens.mjs
git add .
git commit -m "Update compiled tokens"
git push
```

Then pull again in Tokens Studio.

### Separate `/base`, `/md` and `/lg` variables or styles reappear

Check that:

- the responsive branches remain in `tokens.raw.json`;
- they are absent from `tokens.studio.json`;
- `breakpoint-mapping.json` contains all three modes;
- Tokens Studio points to the latest `tokens.studio.json`.

### Build fails because a responsive group is not declared

The compiler scans the canonical token tree for complete responsive groups with direct `base`, `md` and `lg` DTCG token children.

Every detected group must be declared for Figma handling.

Valid fixes are:

1. Add the appropriate Breakpoint mapping in `tokens/figma/breakpoint-mapping.json`.
2. List the group under `nonFigmaResponsiveGroups` only when it is intentionally GitHub-only and should not be represented through the Figma `Breakpoint` collection.

Do not use the allowlist to hide missing Figma work.

### Build fails because a breakpoint mapping source does not exist

The source path may point inside an alias token rather than at its owning token node.

Use the owning token as `source`, and use `resolvedSource` only as explanatory metadata where useful.

Do not weaken the build validation merely to accept an invalid path.

### Build reports broken retained aliases

A token retained in `tokens.studio.json` points to a token that has been excluded.

Do not bypass the error. Resolve the underlying mapping or alias decision.

### Removed variables still appear in Figma

Possible causes:

- destructive removal was disabled;
- the variables already existed and were intentionally retained;
- an active object still references the old variable ID;
- Figma contains an orphaned or stale binding.

Audit active consumers before deleting the variable.

### Destructive export breaks active content

1. Restore the named pre-export Figma version.
2. Identify active bindings to removed variables or styles.
3. Migrate those consumers.
4. Test again in a duplicate file.
5. Confirm zero stale references.
6. Repeat the production export only after the duplicate passes.

### Tokens Studio changes token type names

Tokens Studio may convert token type names internally, such as `fontFamily` to `fontFamilies`.

This is acceptable inside Tokens Studio.

Do not push from Tokens Studio back to GitHub.

### Figma shows `rem` values as numbers

Tokens Studio converts `rem` values into Figma-compatible numbers.

For example, `1.5rem` may appear as `24`. This is expected.

### Figma rounds a resolved value

A resolved value such as `28.8` may appear as `29` in parts of the Figma interface.

Check `breakpoint-mapping.json` to confirm whether the value is intentionally documented as a resolved-pixel implementation.

### Figma values look wrong

For ordinary Tokens Studio-managed values:

```text
Edit source JSON
↓
Run node scripts/build-tokens.mjs
↓
Review compiled output
↓
Commit and push
↓
Pull from GitHub
↓
Export non-destructively
↓
Validate again
```

For responsive values:

```text
Edit source JSON
↓
Update breakpoint-mapping.json
↓
Run node scripts/build-tokens.mjs
↓
Review compiled output
↓
Commit and push
↓
Manually update the Figma Breakpoint variable
↓
Validate all modes
```

Do not invent a replacement value directly in Figma.

---

## Core Rules

1. GitHub is the source of truth.
2. Do not manually edit compiled token files.
3. Do not push from Tokens Studio into GitHub.
4. Routine Figma exports must be non-destructive.
5. Responsive branches remain explicit in GitHub.
6. Responsive Figma values use the `Breakpoint` collection.
7. Production text styles do not use breakpoint suffixes.
8. Components do not use breakpoint variants merely to represent responsive tokens.
9. Fixed semantic spacing must not be replaced with responsive layout tokens solely because the current values match.
10. Token deletion or renaming requires binding migration and duplicate-file validation.

Because the free Tokens Studio workflow cannot maintain the Figma `Breakpoint` collection, responsive values are manually mirrored into Figma after being updated in GitHub.

This does not make Figma the source of truth.

The source decision must exist in GitHub and the mapping before the Figma value is changed.

---

## Future Improvements

This workflow may later evolve to include:

- automated token validation;
- Style Dictionary transforms;
- CSS variable output;
- Tailwind configuration output;
- React theme output;
- automatic contrast checks;
- GitHub Actions token builds;
- automated Figma Breakpoint variable creation;
- custom Figma plugin integration;
- native Figma import output.

For now:

- `tokens.raw.json` provides the complete canonical token tree;
- `tokens.studio.json` provides the filtered Tokens Studio input;
- `breakpoint-mapping.json` defines the GitHub-to-Figma responsive bridge;
- Tokens Studio manages the `global` collection;
- the `Breakpoint` collection is maintained manually from GitHub.
