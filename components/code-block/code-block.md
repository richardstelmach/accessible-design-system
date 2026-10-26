# CodeBlock

**Status:** Draft — implementation under review; manual release checks pending.

**Version:** 0.1.0

**Machine-readable specification:** [code-block.yaml](./code-block.yaml)

## Overview

CodeBlock presents selectable plain text using native `pre` and `code`. It has a required visible context label and an optional copy action built from IconButton and the registered `copy` icon. Use it for installation commands, configuration and short code examples.

## When to use

Use CodeBlock when whitespace matters and users may need to copy an example. Keep prose explanations outside the code. Use inline `code` in running text. This component does not edit, highlight, number, expand or switch between files.

## Anatomy

A wrapping header contains the label and optional copy group. The group contains visible feedback and a compact default IconButton. The code viewport fills the available width below the header. No fixed height clips the code or feedback.

## React API

```tsx
import { CodeBlock } from '@owla11y/react';

<CodeBlock label="Terminal" code="npm install @owla11y/react" />
<CodeBlock label="CSS" code={stylesheet} copyable={false} />
```

`code` is a required string, including an allowed empty string. The component renders and copies it exactly, preserving initial and final newlines, indentation and tabs. `label` is required nonempty visible context, not a syntax-highlighting language identifier. The wrapper ref targets the ordinary `div`.

`copyable` defaults to true. `labels` partially overrides ready/pending text and copy-name, scroll-name, success and failure formatters. Every result must be nonempty plain text. A failure message must explain how to select and manually copy the code. Localise the visible label and feedback together. `onCopy(code)` runs only after a successful, still-current clipboard write; website analytics belong in that callback. It is not React's native DOM copy event.

The wrapper accepts id, className, style, lang, dir and data attributes. Semantics, tab order, live-region ownership and content are component-owned. Arbitrary HTML/JSX code, event handlers, ARIA overrides and action slots are unsupported.

## States and feedback

The copy action is added after enhancement. Its populated polite live region starts with “Ready to copy.” A request shows “Copying…”, then “Copied.” or visible manual-copy guidance. Repeated outcomes include an attempt count. Feedback persists without timers. The action keeps focus and ignores additional activations during an outstanding write. Replacing code, changing copyable or unmounting invalidates outstanding feedback and callbacks; an already-started operating-system clipboard write cannot be cancelled.

Denied clipboard permissions and unavailable clipboard APIs use the same manual-selection guidance. The component does not steal focus, select text automatically or fall back to deprecated clipboard commands. A user can select the retained code with the pointer or platform assistive-technology selection commands and use the normal copy shortcut.

## Keyboard and screen readers

Copy uses ordinary native Enter/Space activation. Only a horizontally overflowing enhanced code viewport becomes a tab stop and named region, for example “CSS code, horizontally scrollable”. Native Arrow keys scroll it. If resizing removes overflow while that viewport holds focus, it stays focusable until blur.

There is no empty `role=status` and no live region when copy is omitted. Polite DOM updates alone do not establish audible announcement reliability. Before release, manually verify initial reading, successful/repeated/failed copy, delayed writes, meaningful tab stops and focus visibility with VoiceOver or NVDA. Include multiple blocks and reading while other polite speech is active.

## Responsive behaviour

Header text and feedback wrap without a fixed block height. At 320 CSS pixels, horizontal overflow is contained inside the code viewport. The inset code focus ring and unclipped copy ring remain visible. Verify doubled text, WCAG text-spacing overrides, RTL and actual 400% browser zoom.

Before JavaScript runs, all code remains visible and long lines wrap; there is no inactive copy button. Print also wraps all code and omits copy controls. Display wrapping never changes the underlying string.

## Tokens and typography

Reuse `color.surface.default`, `color.text.default`, `color.border.default`, `border.width.thin`, `radius.xl`, `spacing.inset.md`, `spacing.stack.sm`, `spacing.inline.sm` and the existing focus roles. Label/feedback use `typography.body.small`; code uses the new fixed 16px, 150% `typography.code` role and the `typography.family.mono` system stack. The role reuses existing size, weight, line-height and letter-spacing primitives. No extra component aliases are needed for this first anatomy.

The system stack preserves the existing website policy without fetching fonts. Platform glyph widths can differ. Figma uses Roboto Mono Regular as an explicit illustrative reference, so string widths are not a pixel-parity acceptance criterion. The source-backed mapping in `tokens/figma/font-family-mapping.json` projects only the Tokens Studio family value to Roboto Mono, preserving the raw/browser system stack and semantic aliases. Verify the exported foundation after the provider pull.

## Figma and documentation

The intended CodeBlock page follows the existing numbered component pages and standard four-area documentation template. Two Copy variants model composition; label, code and feedback are text properties. Reuse the existing Icon Button and registered Icon/copy. Outcomes and stress examples are instances rather than new production variant axes. Production construction awaits source review, merge and the Tokens Studio foundation checkpoint.

## Validation and release

See [CodeBlock validation](../../docs/validation/react-code-block-parity.md) for measured results and remaining checks. Automated tests do not certify accessibility or complete screen-reader acceptance. npm publication, Figma library publication and website migration remain separate human checkpoints. Basic Table, SideNavigation and the Accordion boundary review remain later work.
