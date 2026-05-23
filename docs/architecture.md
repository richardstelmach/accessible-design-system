# Architecture

## Overview

This project uses a GitHub-first architecture for an accessibility-first, AI-compatible design system.

GitHub acts as the canonical source of truth for:

* design tokens
* component specifications
* accessibility rules
* prompt templates
* technical documentation

The system is designed so that consumer tools ingest structured system data rather than becoming independent sources of truth.

---

## Core Principles

* Accessibility by default
* Semantic token architecture
* Single source of truth
* Machine-readable component definitions
* AI-assisted generation within defined constraints
* Reusable across multiple projects

---

## System Flow

```text
GitHub
├── Tokens
├── Components
├── Accessibility Rules
├── Prompt Templates
└── Documentation

↓
Consumers

├── Tokens Studio
│   └── Figma
│
└── Claude Design
```

### Flow Summary

* Tokens are stored and versioned in GitHub
* Tokens Studio syncs token data into Figma
* Figma consumes the system for visual composition and refinement
* Claude Design consumes structured files to generate interface concepts aligned to the system

---

## Repository Structure

```text
design-system/
├── tokens/
├── components/
├── patterns/
├── accessibility/
├── prompts/
├── docs/
```

---

## Folder Responsibilities

### `/tokens`

Stores design tokens including:

* primitives
* semantic tokens
* spacing
* typography
* radii
* shadows

These should be machine-readable and version controlled.

---

### `/components`

Stores machine-readable component definitions.

Each component should define:

* variants
* states
* token usage
* accessibility requirements
* usage constraints
* composition rules

Example:

```text
/components/button.yaml
```

---

### `/patterns`

Stores higher-level multi-component patterns and flows.

Examples:

* dashboards
* authentication flows
* navigation structures
* form patterns

These support scalable AI-assisted generation.

---

### `/accessibility`

Stores global accessibility requirements and standards.

Includes:

* WCAG targets
* keyboard interaction rules
* contrast requirements
* focus behaviour standards
* touch target minimums

---

### `/prompts`

Stores reusable AI prompt templates and generation instructions.

Examples:

* screen generation
* accessibility auditing
* layout generation
* component usage guidance

---

### `/docs`

Stores technical system documentation and architecture guidance.

Examples:

* architecture.md
* principles.md
* overview.md

---

## Source of Truth Model

GitHub is the authoritative system source.

Consumers should ingest structured data from GitHub rather than maintaining independent definitions.

### Source of truth

* GitHub

### Consumers

* Tokens Studio
* Figma
* Claude Design

---

## Accessibility Strategy

Accessibility requirements exist at two levels:

### Global rules

System-wide accessibility standards stored in `/accessibility`.

### Component rules

Per-component accessibility requirements embedded directly into component YAML definitions.

This ensures accessibility remains tightly coupled to implementation.

---

## AI Integration Strategy

AI tools should consume:

* tokens
* component schemas
* accessibility constraints
* prompt templates

AI-generated concepts should remain constrained by the design system rather than inventing arbitrary styles or behaviours.

AI is treated as a design acceleration layer, not a replacement for design judgement.

---

## Future Considerations

Potential future areas:

* automated token pipelines
* component validation tooling
* schema validation
* multi-theme support
* automated accessibility auditing
* code generation pipelines
