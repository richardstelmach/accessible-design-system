# CodeBlock source and validation review

Date: 26 October 2026. Source base: `1790de9d656698dda8af0a9cd9729def67f12c9a` (current GitHub main at discovery). Branch: `feat/code-block`.

## Outcome and limits

The public package previously had no CodeBlock export. A site-local `Code` helper now has a reusable main-system counterpart, with a canonical YAML/Markdown contract, API inventory, types, styled implementation and runnable comparison route. No website migration or package publication is included.

This is a draft source implementation, not final Figma parity or release acceptance. The font choice was confirmed by Richard: system monospace stack on the web, with an explicitly documented illustrative Figma face. Source review, source merge, Tokens Studio pull/export verification, production Figma construction and manual screen-reader acceptance remain pending.

## Source discovery

Reviewed token sync contract/workflow, component documentation page pattern, Alert/Badge contracts, existing IconButton implementation, React package/CI conventions and the live Figma inventory. The isolated checkout has no applicable repository AGENTS.md. A separate Conductor checkout contains unrelated uncommitted governance work; it was not used or modified.

The site's clean `feat/documentation-example` checkout was at `e37c968`. Read `src/doc-ui.tsx`, Getting started/Button/Foundations consumers, code styles and `tests/review-corrections.spec.ts`. Those sources establish required label, exact string content, registered copy artwork, populated ready feedback, repeated-copy updates, measured overflow and inset focus. Analytics remain in the consumer. Historical website tests are not counted as package evidence.

## Public adapter

`CodeBlock({code, label, copyable=true, labels?, onCopy?})` forwards the ordinary wrapper div ref. It accepts container metadata but owns semantics, focus, content and announcements. Code is plain text only; empty strings are allowed. Label is required. Localisation covers copy and scrolling names, ready/pending text and success/failure formatters.

Copy uses the existing compact default IconButton and registry-approved Phosphor Regular Copy path. `onCopy(code)` is a successful-write notification for consumer analytics. Pending writes ignore reentrant activation; changed code, changed copyability or unmount discards stale completion. Already-started operating-system writes cannot be cancelled. Failure retains selectable text and persistent manual-copy guidance; no focus movement or deprecated clipboard fallback is introduced.

The enhanced viewport uses native pre/code and horizontal scrolling. A tab stop and named region exist only on measured overflow, retained until blur if a focused viewport becomes nonoverflowing. ResizeObserver watches viewport and content; resize and font-readiness checks supplement it. SSR wraps lines and omits copy controls/live feedback; print wraps all code and hides copy UI.

## Typography and token review

Added only `typography.family.mono` and `typography.code`: fixed 16px/24px normal-weight code using existing size/weight/line-height/letter-spacing primitives. The system family list matches website policy and adds no downloaded font or dependency. The CSS generator now preserves a family list instead of quoting the entire list as one family; a regression assertion covers this. Existing single-family output is unchanged.

No new component colour, geometry or responsive token groups. Existing surface/default, text/default, border/default, radius, spacing and focus roles cover the anatomy. Code-family metadata includes FONT_FAMILY scope and exact Web custom-property syntax.

Token build: **409 raw tokens, 337 Tokens Studio tokens, 72 mode-managed nodes excluded, 24 detected/mapped responsive groups, zero unmapped groups and zero broken retained aliases (220 checked)**. Generated outputs were built from canonical source. Repeat generation produced identical compiled files.

A CSS system-family stack is not a literal installed Figma font name. Roboto Mono Regular was verified available and is the intended illustrative face. Official Tokens Studio documentation confirms it exports only the first comma-separated family, so the raw stack would incorrectly request ui-monospace in Figma. `tokens/figma/font-family-mapping.json` now explicitly projects the Studio-only value to Roboto Mono. The compiler validates source/expected web value, duplicate/missing mappings, one Figma family and a reason before writing outputs. Raw/browser values, aliases and metadata stay unchanged. Two regression cases verify projection and rejection without partial mutation. Verify the exported family/style after pull; no Figma-only repair is needed.

## Live Figma evidence

File: `dVFI0q1cXMtmjUAkdvSWkk`. Existing Icon Button `95:943`; registered `Icon/copy` `62:795`. Read the live pages, body styles, collection modes and recent Toast documentation layout. No CodeBlock or code typography role exists. `global` and `Breakpoint` (base/md/lg) remain intact. Exact receipts are in [the Figma evidence file](react-code-block-figma-evidence.json).

**Created objects: none. Changed objects: none.** Planned page: `26 - Components - CodeBlock`, two Copy composition variants, Label/Code/Feedback text properties and reused IconButton. Clipboard outcomes are documentation instances/text, not a production state matrix. Standard component, documentation, QA and accessibility areas remain required after the foundation checkpoint.

## Executed validation

| Check | Result |
| --- | --- |
| Token/package build | Passed |
| Package and preview typecheck | Passed, including positive/prohibited public API examples |
| Unit suite | 119 passed across 11 files, including 9 CodeBlock cases, font-stack generation and validated Studio projection |
| Example production build | Passed |
| Full browser regression suite | 79 passed in installed Google Chrome |
| CodeBlock browser checks | 6 passed: clipboard outcomes/focus; actual keyboard scrolling; responsive/text/RTL/forced-colour/scoped-token checks; axe with contrast; print; package SSR without JavaScript |
| Packed independent consumers | React 18.3.1 and React 19.3.1 passed declarations, DOM-free import/SSR, hydration, exact CodeBlock text and wrapper ref alongside existing package fixtures; archive 68 files |
| YAML / JSON | New component contract parsed with Ruby YAML; API/token JSON parsed and built |
| Diff whitespace / deterministic outputs | Passed |

At 320px viewport, the example code viewport measured **270px client width / 2729px scroll width**, with native Arrow scrolling and **−4px outline offset**. Computed code typography: system monospace stack, 16px font / 24px line height. Header/feedback wrap and document width stays within the viewport. Browser checks also cover 768px/1024px, doubled root text, spacing overrides, RTL, forced colours and scoped colour overrides.

The first browser attempt needed the normal local-server permission. Two initial new test-harness failures were corrected: focus-visible must be exercised through keyboard modality, and the no-JavaScript test must serve actual package CSS rather than Vite's JavaScript CSS wrapper. All six tests subsequently passed in the complete suite.

Visual review: [desktop](code-block/desktop.png), [320px keyboard focus](code-block/narrow-focus.png). Both screenshots were inspected. The package preview uses an actual Select, Checkbox and Button; it includes short/long/multiline/empty code and a separate noncopyable example.

## GitHub delivery state

Richard explicitly authorised pushing the branch and creating a draft PR. The branch is published as [PR #47](https://github.com/richardstelmach/accessible-design-system/pull/47). It remains a draft and is not merged. Check its current head for CI results. The initial push was blocked before this explicit authorisation; no workaround was used.

## Remaining acceptance

- Human contract/API review and source merge; no merge or publication was performed.
- After source review and merge, verify the explicit Studio-only font projection and perform the established global-only Tokens Studio pull/export.
- Build production CodeBlock with token-bound foundations, existing controls/icons and standard documentation; audit IDs, properties, bindings, layout and appearance after export.
- Manual VoiceOver or NVDA: initial reading, populated ready feedback, successful/repeated/denied/unavailable clipboard announcements, multiple blocks and meaningful tab stops. DOM mutations and axe cannot establish spoken delivery.
- Actual Safari/Firefox, 400% browser zoom and Windows high contrast acceptance. Chrome viewport and forced-colour emulation are the recorded automated evidence.
- After acceptance, update the private site's pinned package/provenance, replace its local helper and rerun its checks. Basic Table, SideNavigation and Accordion boundary review remain subsequent work.
