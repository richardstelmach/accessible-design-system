# AI-assisted design system checks

This folder contains reusable prompts for AI-assisted design system review.

The prompts are intended for AI tools that can inspect Figma designs and compare them against the GitHub source of truth.

The prompts are tool-agnostic. They may be used with Codex, Claude, Cursor, Copilot, Gemini, custom MCP agents, Figma plugins or other tools with suitable access.

These prompts are not the source of truth.

The source of truth remains:

- `tokens/`
- `patterns/`
- `components/`
- `accessibility/`
- `icons/registry.json`

Use these prompts to help check whether design work follows the documented system.

AI findings should be treated as review support, not automatic approval.

## Prompt types

### Adherence checks

Used to inspect existing Figma work against the GitHub source of truth.

### First-pass generation

Used to create an initial Figma implementation from documented tokens, patterns and component contracts.

AI-generated output must still be reviewed by a human before being treated as approved system work.

## Important principle

Prompts should encourage the AI agent to report missing rules rather than invent undocumented design decisions.