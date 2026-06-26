# Accessible Design System

Accessibility-first, token-driven design system built for AI-assisted interface generation and reusable design workflows.

This project explores how structured design systems can act as machine-readable foundations for:
- AI-generated interface concepts
- consistent visual systems
- accessible component design
- reusable system for personal projects

The project can be copied for commercial use, to help enable the creation of accessible solutions.

---

## Philosophy

This project is built around several core principles:

- Accessibility by default
- GitHub as the single source of truth
- Semantic design tokens over hardcoded values
- Machine-readable component specifications
- AI as a design accelerator, not a replacement for design judgement

---

## Architecture

GitHub acts as the canonical source of truth for:
- design tokens
- component specifications
- accessibility rules
- AI prompt templates
- system documentation

Consumer tools:
- Tokens Studio → token sync into Figma
- Figma → visual refinement and composition
- Claude Design → AI-assisted concept generation

## Responsive modes

Responsive design tokens are authored in GitHub using `base`, `md` and `lg` branches.

Figma represents these branches through a manual `Breakpoint` variable collection with `base`, `md` and `lg` modes. Designers apply semantic styles and switch the parent frame’s breakpoint mode to preview responsive values.

Code should consume the same GitHub tokens as default values plus media query overrides.

While using the free version of Tokens Studio, the Figma `Breakpoint` collection is maintained manually from the GitHub token mapping. GitHub remains the source of truth.

### Compiled responsive-token outputs

The token build produces two outputs with different purposes:

- `tokens/compiled/tokens.raw.json` contains the complete canonical token tree, including responsive `base`, `md` and `lg` branches.
- `tokens/compiled/tokens.studio.json` contains one `global` token set and excludes responsive nodes represented by the Figma `Breakpoint` collection.

Responsive exclusions are derived from:

`tokens/figma/breakpoint-mapping.json`

This prevents Tokens Studio from recreating separate `/base`, `/md` and `/lg` Figma variables and styles while preserving the explicit responsive structure in GitHub.

See [`docs/token-sync-workflow.md`](docs/token-sync-workflow.md) for the complete build, sync, export and validation workflow.

---
