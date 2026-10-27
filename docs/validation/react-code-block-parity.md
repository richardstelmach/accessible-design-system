# CodeBlock source and validation review

Updated: 27 October 2026 (implementation validation: 26 October). Source base: `1790de9d656698dda8af0a9cd9729def67f12c9a` (current GitHub main at discovery). Branch: `feat/code-block`.

## Outcome and limits

The public package previously had no CodeBlock export. A site-local `Code` helper now has a reusable main-system counterpart, with a canonical YAML/Markdown contract, API inventory, types, styled implementation and runnable comparison route. No website migration or package publication is included.

Source PR #47 is merged at `16559f8c85d960d98d7e48c0da5859e7dded467a`. Richard completed the Tokens Studio export and reported one variable created. The live exported foundation and completed CodeBlock page were audited on 27 October. The web keeps its confirmed system monospace stack; Figma uses the source-declared illustrative Roboto Mono face. Manual release acceptance remains pending; Figma presentation is not a runtime accessibility certification.

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

## Live Figma implementation and export audit

[26 - Components - CodeBlock](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk?node-id=1550-46) contains the completed production masters, usage documentation, QA/responsive examples and accessibility guidance.

| Object | ID / result |
| --- | --- |
| CodeBlock public set | `1550:49`; exactly Copy=True / Copy=False |
| Public text properties | Label, Code, Feedback |
| Internal copy control | `_CodeBlock/Copy` `1550:65`; Default/Hover/Pressed with independent Boolean Focus |
| Component area | `1550:96`; 1440 × 1263 |
| Documentation examples | `1550:102`; 1440 × 4015 |
| QA and responsive tests | `1550:108`; 1440 × 4654 |
| Accessibility notes | `1550:114`; 1440 × 1698 |
| Exported mono variable | `VariableID:1547:7`; STRING Roboto Mono in global; FONT_FAMILY scope; `var(--typography-family-mono)` WEB syntax |
| Exported code style | `S:7ac5fa5232dea106cfe500a99a07df1de8e3ad11,`; Roboto Mono Regular, 16px, 150%, zero tracking |

Reused existing Icon Button masters (default/hover/active), registered `Icon/copy` `62:795`, `_Documentation/Page Header` `212:464` and `_Documentation/Card` `146:1996`. Existing masters and foundations were not modified. No variables were created by the agent. The two CodeBlock masters are 536 × 119 with copy and 536 × 99 without copy at lg; outer strokes are inside and participate in layout. Only the code viewport clips and scrolls; the root/header retain the copy focus ring.

The four standard areas each have one shared page header. There are **21 CodeBlock instances, 15 documentation-card instances and 165 styled text nodes**. Audit found no unstyled text, unbound text fill, duplicate variable names, duplicate CodeBlock page or horizontally overflowing visible header labels/feedback/controls in the supplied fixtures. Global and Breakpoint collection IDs and base/md/lg modes remain intact. Text/default on surface/default is **7.00:1**; focus ring on separator is **4.52:1**.

Examples cover optional copy, installation/CSS/React, whitespace/tabs/empty/literal markup, ready/pending/success/repeated/failure feedback, 320px viewport fixtures, independent pointer/focus states, inherited typography, doubled text, text spacing and wrapping no-JavaScript/print illustrations. Four named `_reference/CodeBlock/…` styles are QA-only text-stress styles; production code continues to use the exported semantic style.

**Authoring limitation:** Figma uses constrained label/feedback columns so resized instances remain contained. Browser CSS wraps according to intrinsic content widths; long-feedback line breaks and resulting header heights can differ. The QA page states this explicitly. Roboto Mono glyph widths also differ from platform system fonts. Browser results remain authoritative for actual keyboard, reflow, clipboard and live-region behaviour. Figma no-JavaScript/print examples illustrate wrapping; they do not execute those modes.

Visual review inspected all four areas after relevant corrections. Full object/style IDs and final measurements are in [the Figma evidence file](react-code-block-figma-evidence.json). The agent did not perform a second Tokens Studio export; the user's export and post-export audit are the recorded round-trip evidence. No Figma library publication was performed.

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

Richard authorised source merge and branch cleanup. [PR #47](https://github.com/richardstelmach/accessible-design-system/pull/47) is merged; its head `457ffc45460419794253db2637b393ad49636e2d` passed both GitHub workflows. The feature branch was removed from GitHub and locally, and the three inspected main checkouts were synchronised to merge `16559f8`. This Figma completion receipt is a separate documentation-only follow-up; production package code and compiled tokens are unchanged by it.

## Remaining acceptance

- Richard's visual review of the completed Figma component and documentation.
- Manual VoiceOver or NVDA: initial reading, populated ready feedback, successful/repeated/denied/unavailable clipboard announcements, multiple blocks and meaningful tab stops. DOM mutations and axe cannot establish spoken delivery.
- Actual Safari/Firefox, 400% browser zoom and Windows high contrast acceptance. Chrome viewport and forced-colour emulation are the recorded automated evidence.
- Human Figma library and npm publication; neither was performed.
- After acceptance, update the private site's pinned package/provenance, replace its local helper and rerun its checks. Basic Table, SideNavigation and Accordion boundary review remain subsequent work.
