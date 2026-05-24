# Token Sync Workflow

This document explains how design tokens move from source files in this repository into Figma.

The intended workflow is:

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
    Figma variables and text styles

GitHub is the source of truth. Figma is a consumer.

---

## Source of Truth

Editable token source files live in:

    tokens/primitives/
    tokens/semantic/
    tokens/themes/

These are the canonical token files.

Do not manually edit Figma variables as the source of truth. If a token value, name or reference needs to change, update the source JSON files and rebuild.

---

## Token Layers

The system uses a layered token architecture:

    Primitive tokens
    ↓
    Semantic tokens
    ↓
    Component tokens
    ↓
    Components

Primitive tokens define raw reusable values.

Examples:

    color.primary.500
    color.neutral.500
    spacing.4
    typography.size.md
    radius.lg

Primitive tokens do not define usage.

Semantic tokens define approved usage roles.

Examples:

    color.surface.default
    color.text.default
    spacing.content.headingToBody
    typography.heading.h1.base
    layout.container.maxWidth.text

Semantic tokens should reference primitive tokens.

Component tokens will be introduced later.

Examples:

    button.primary.background
    button.primary.foreground
    input.border.default

Component tokens should reference semantic tokens rather than primitive values directly.

---

## Token Descriptions

Token descriptions should live in the source token JSON files using `$description`.

Descriptions should explain the purpose and intended usage of a token, not just repeat the value.

Example:

    "default": {
      "$value": "{color.text.default}",
      "$type": "color",
      "$description": "Default text colour used for readable body content and standard interface text."
    }

For semantic token groups, a group-level `$description` may be used to describe the relationship between child tokens.

Example:

    "success": {
      "$description": "Status colour pairing for positive feedback, successful actions or confirmation messages.",
      "background": {},
      "foreground": {}
    }

Figma documentation should display these descriptions, but GitHub remains the source of truth.

Do not treat manually written Figma card descriptions as canonical if the token source contains a `$description`.

## Current Folder Structure

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
    │   ├── spacing.semantic.json
    │   ├── layout.semantic.json
    │   └── sizing.semantic.json
    │
    ├── themes/
    │
    └── compiled/
        ├── tokens.raw.json
        └── tokens.studio.json

---

## Compiled Token Files

Compiled files are generated into:

    tokens/compiled/

Current generated files:

    tokens.raw.json
    tokens.studio.json

### tokens.raw.json

`tokens.raw.json` is the clean compiled token output.

It is intended for future developer use, AI consumption, documentation, validation scripts or build tools.

### tokens.studio.json

`tokens.studio.json` is the Tokens Studio-specific compiled output.

This file wraps the compiled tokens in a `global` token set so Tokens Studio can read the file correctly when syncing from GitHub.

Tokens Studio should point to:

    tokens/compiled/tokens.studio.json

Tokens Studio should not point to:

    tokens/compiled/tokens.raw.json

Do not manually edit compiled token files during normal work. Update the source token files, then regenerate the compiled files.

---

## Why Tokens Studio Needs a Specific File

Tokens Studio treats the outermost keys in a single synced JSON file as token set names.

A raw compiled file like this:

    {
      "border": {},
      "color": {},
      "spacing": {}
    }

may be interpreted as separate token sets:

    border
    color
    spacing

This caused Tokens Studio to appear as though it only pulled in border tokens when the `border` set was selected.

The fix is to generate a Tokens Studio-specific file with a `global` wrapper:

    {
      "global": {
        "border": {},
        "breakpoint": {},
        "color": {},
        "radius": {},
        "spacing": {},
        "typography": {},
        "layout": {},
        "size": {}
      }
    }

Once pulled into Tokens Studio, the left panel should show one token set:

    global

Inside the `global` token set, the JSON view should show:

    border
    breakpoint
    color
    radius
    spacing
    typography
    layout
    size

---

## Build Tokens

After editing source token files, run this command from the repository root:

    node scripts/build-tokens.mjs

This regenerates:

    tokens/compiled/tokens.raw.json
    tokens/compiled/tokens.studio.json

The build script merges primitive, semantic and theme token files into compiled outputs.

---

## Commit and Push Changes

After rebuilding tokens, commit both source and compiled changes.

Example:

    git add .
    git commit -m "Update design tokens"
    git push

Tokens Studio pulls from GitHub, so changes must be pushed before they can be pulled into Figma.

---

## Tokens Studio GitHub Sync Settings

Tokens Studio should use the GitHub sync provider.

Recommended settings:

    Repository:
    richardstelmach/accessible-design-system

    Branch:
    main

    Token storage location:
    tokens/compiled/tokens.studio.json

    Base URL:
    blank

Do not use a leading slash in the token storage location.

Correct:

    tokens/compiled/tokens.studio.json

Incorrect:

    /tokens/compiled/tokens.studio.json

---

## Sync Direction

Use:

    Pull from provider

Do not push from Tokens Studio back to GitHub.

The workflow should remain:

    GitHub → Tokens Studio → Figma

not:

    Figma → Tokens Studio → GitHub

Tokens Studio may transform token type names internally. For example:

    fontFamily

may appear as:

    fontFamilies

This is acceptable inside Tokens Studio, but it is another reason not to push from Tokens Studio back to the repository.

---

## Figma Export Settings

In Tokens Studio, go to:

    Styles & Variables
    → Export styles & variables

Recommended export settings:

### Variables

    Color: on
    Number: on
    String: off
    Boolean: off

### Styles

    Color: off
    Typography: on
    Effects: off
    Gradients: off

### Options

    Ignore first part of token name for styles: off
    Prefix styles with active theme name: off
    Create styles with variable references: on
    Update existing style and variable names: off
    Remove styles and variables without connection to token: off

---

## Why Colours Are Exported as Variables

Colours should be exported as Figma variables rather than legacy colour styles.

This keeps colour usage more flexible and better aligned with modern Figma variable workflows.

---

## Why Typography Is Exported as Styles

Typography tokens are composite tokens.

They include:

    font family
    font weight
    font size
    line height
    letter spacing

These are better represented in Figma as text styles.

Expected style examples:

    typography/heading/h1/base
    typography/heading/h1/md
    typography/heading/h1/lg
    typography/body/default/base
    typography/body/default/md
    typography/body/default/lg
    typography/label/default

---

## Expected Figma Result

A successful export should create one Figma variable collection called:

    global

The first successful setup created:

    1 collection
    149 variables

This number may change as tokens are added or removed.

---

## Figma Validation

Use the Figma file to visually validate tokens.

Suggested page:

    01 Token Sync Test

The test page is a smoke test. It is not intended to be a polished design system page.

It should confirm that tokens import, resolve and behave correctly in Figma.

---

## Colour Validation Checklist

Check the following colour tokens:

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

Validate foreground and background pairs together, not just as isolated swatches.

---

## Typography Validation Checklist

Check the following typography styles:

    typography.heading.h1.base
    typography.heading.h1.md
    typography.heading.h1.lg

    typography.heading.h2.base
    typography.heading.h2.md
    typography.heading.h2.lg

    typography.heading.h3.base
    typography.heading.h3.md
    typography.heading.h3.lg

    typography.heading.h4.base
    typography.heading.h4.md
    typography.heading.h4.lg

    typography.heading.h5.base
    typography.heading.h5.md
    typography.heading.h5.lg

    typography.heading.h6.base
    typography.heading.h6.md
    typography.heading.h6.lg

    typography.body.small.base
    typography.body.small.md
    typography.body.small.lg

    typography.body.default.base
    typography.body.default.md
    typography.body.default.lg

    typography.body.large.base
    typography.body.large.md
    typography.body.large.lg

    typography.label.default

Use real sample text when validating typography.

Example:

    Design systems should support readable, accessible interfaces.

---

## Spacing and Layout Validation Checklist

Check the following spacing and layout tokens:

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

    spacing.section.base
    spacing.section.md
    spacing.section.lg

    layout.page.padding.base
    layout.page.padding.md
    layout.page.padding.lg

    layout.container.maxWidth.text
    layout.container.maxWidth.narrow
    layout.container.maxWidth.default
    layout.container.maxWidth.wide

    layout.grid.gutter.base
    layout.grid.gutter.md
    layout.grid.gutter.lg

---

## Sizing Validation Checklist

Check the following sizing tokens:

    size.target.minimum
    size.target.comfortable

    size.control.minBlockSize.compact
    size.control.minBlockSize.default
    size.control.minBlockSize.comfortable

---

## Radius and Border Validation Checklist

Check the following radius tokens:

    radius.none
    radius.sm
    radius.md
    radius.lg
    radius.xl
    radius.2xl
    radius.full

Check the following border tokens:

    border.width.none
    border.width.thin
    border.width.medium
    border.width.thick

    border.style.solid
    border.style.dashed

Note: border style tokens may be more useful for code and documentation than for Figma variables.

---

## Native Figma Token Import

Figma can import design tokens directly from JSON into variables.

This is not the main workflow for this system at the moment.

Reasons:

    Native Figma import is a manual file import process.
    It does not provide the GitHub pull workflow currently used here.
    It is stricter about token format.
    It may require a separate Figma-specific compiled file.
    Tokens Studio already provides GitHub sync and exports variables/styles into Figma.

Native Figma import may become useful later as an additional export target.

A future compiled output structure could be:

    tokens.raw.json
    tokens.studio.json
    tokens.figma.json

For now, Tokens Studio remains the practical bridge between GitHub and Figma.

---

## Troubleshooting

### Tokens Studio Only Shows Border Tokens

Likely cause:

    Tokens Studio is pointed at a raw compiled file without a token set wrapper.

Fix:

    Point Tokens Studio at:

    tokens/compiled/tokens.studio.json

The file should contain a top-level `global` wrapper.

---

### Tokens Studio Does Not Show the Latest Changes

Likely causes:

    The source files were changed but the build script was not run.
    The compiled files were rebuilt but not committed.
    The changes were committed but not pushed.
    Tokens Studio has not pulled from GitHub.

Fix:

    node scripts/build-tokens.mjs
    git add .
    git commit -m "Update compiled tokens"
    git push

Then pull again in Tokens Studio.

---

### Tokens Studio Changes Token Type Names

Tokens Studio may convert some token type names internally.

For example:

    fontFamily

may appear as:

    fontFamilies

This is acceptable inside Tokens Studio.

Do not push from Tokens Studio back to GitHub.

---

### Figma Shows rem Values as Numbers

Tokens Studio converts rem-based values into Figma-friendly numbers.

For example:

    1.5rem

may appear in Figma as:

    24

This is expected.

---

### Figma Values Look Wrong

Do not manually fix the values in Figma.

Fix the problem at source:

    Edit source JSON files
    ↓
    Run node scripts/build-tokens.mjs
    ↓
    Review compiled output
    ↓
    Commit and push
    ↓
    Pull from provider in Tokens Studio
    ↓
    Export variables and styles to Figma
    ↓
    Validate again

---

## Standard Workflow for Changing Tokens

When changing tokens:

    Edit source JSON files
    ↓
    Run node scripts/build-tokens.mjs
    ↓
    Review compiled output
    ↓
    Commit and push
    ↓
    Pull from provider in Tokens Studio
    ↓
    Export variables and styles to Figma
    ↓
    Validate visually
    ↓
    Fix issues at source

---

## Core Rule

Do not fix token problems directly in Figma.

Fix token problems in the source JSON files, rebuild, commit, push, pull into Tokens Studio, and export again.

---

## Future Improvements

This workflow may later evolve to include:

    Automated token validation
    Style Dictionary transforms
    CSS variable output
    Tailwind config output
    React theme output
    Automatic contrast checks
    Automated Figma variable creation
    GitHub Actions token builds
    Custom Figma plugin integration
    Native Figma import output

For now, the compiled Tokens Studio file provides a practical bridge between the multi-file source structure and Figma consumption.