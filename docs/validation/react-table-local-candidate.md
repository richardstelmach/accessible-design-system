# Table — local candidate evidence

Date: 29 October 2026. Source base: `d04ab1e2cdcd9ff3309a197cb42bcd1a8e0299f1`; local branch `feat/table-local-candidate`. Local candidate accepted; preparing a focused GitHub review and unpublished Figma construction. No library publication or consuming-site change has occurred.

## Candidate

[Contract](../../components/table/table.yaml) · [Usage and accessibility](../../components/table/table.md) · [Planning](../plans/basic-table.md) · [Local preview](http://127.0.0.1:4181/?table)

Native Table with required caption, visible or explicitly visually hidden; author-owned row/column headers; native cell contents; ordinary links and Badge instances; measured bounded horizontal scrolling. Ref targets HTMLTableElement. No data-grid roles, sorting, row selection or new tokens. Uses existing responsive body typography, strong header emphasis, neutral surfaces, decorative outer border and row/column separators, spacing and focus roles.

The current SSR/no-JavaScript/no-ResizeObserver baseline retains a native table tab stop and scroll description. Measurement removes that extra table stop/scroll description for fitting content. Earlier wrapper approaches are recorded chronologically below. A native table focused while scrolling retains its tab stop until blur after resizing. Authors can localise its scroll description through scrollLabel(caption). The native caption separately names the table.

## Completed validation

- Library build, TypeScript source/preview and public API fixtures, and production preview build passed.
- All **135 unit tests across 13 files passed**, including five Table checks.
- All **108 browser tests passed**, including eight Table checks using installed Chrome. These cover native caption/scope/ref semantics; keyboard entry, actual arrow scrolling, cell-link Tab order and exit; focus retention on resize; long content/captions at 320 CSS pixels; doubled root text and WCAG text-spacing overrides; inherited RTL; print; forced-colour keyboard focus; no ResizeObserver; and no-JavaScript scrolling.
- Axe scans of the default and overflowing Table preview passed with no violations, including rendered text contrast checks. This is automated evidence, not a declaration of complete WCAG conformance.
- Packed consumers passed with **React 18.3.1 and 19.3.1**: DOM-free SSR, hydration, native Table ref, caption/scope and public declaration fixtures. Package contents: **74 files**. No package publication.
- Contract YAML and API JSON parse; whitespace checks passed. Token rebuild produced **no token diff**. No dependency changes.
- Local desktop appearance inspected; preview includes reference and comparison examples, caption visibility, long content, wide geometry and direction controls. Existing colour-preview work was preserved.

Two initial browser assertions were corrected: RTL is inherited from the example section, and forced-colour focus must be entered using the keyboard to exercise :focus-visible. Product behaviour did not require changes for these assertions. The complete passing run includes both corrected checks.

## Acceptance still open

Richard's local visual/API review, especially caption treatment, cell spacing and mobile scroll discoverability. Manual VoiceOver/Safari and NVDA with Firefox or Chrome must check table discovery, caption and row/column header announcements, wrapper verbosity, native link navigation and scroll entry/exit. Actual browser zoom, touch/device scrolling, and Windows high contrast also remain unverified; automated simulations do not substitute for these checks.

After local acceptance, prepare a reviewable GitHub delivery, reinspect live Figma, construct the Table and its documentation with existing variables/styles/components, and audit parity. Figma publication and site adoption remain subsequent steps. No Tokens Studio pull/export is needed unless canonical token sources change.

## Border design revision — 29 October

Updated the local candidate at Richard's request: contained outer border with radius.lg corners, existing thin/default border roles, and logical vertical cell dividers alongside the row separators. Caption remains outside the bordered data area. Native markup/API and tokens remain unchanged. Avoid doubled edges at the last column and final row; forced colours include the outer boundary.

Library build and all eight Table browser checks passed again, including new outer-border/radius/column-divider assertions plus existing scrolling, focus, 320px/text-spacing/RTL, axe, forced-colour, print and no-JavaScript checks. The earlier full-suite results above describe the initial candidate; this CSS-only revision was checked with the focused Table suite. No external delivery.

## Automatic overflow revision — 29 October

The border review exposed letter-stack wrapping in ordinary content before the viewport overflowed. Added a 12ch content-space minimum to native cells, capped to the available container width less cell insets/borders. Summed column minima now trigger local horizontal scrolling without an author minimum width or the preview's Wide content switch. Arbitrary long tokens still wrap; print resets the minimum. This is an initial readable-column sizing choice for visual acceptance, not a WCAG-prescribed value. Existing tokens and native semantics remain unchanged.

Library build and all nine Table browser checks passed after this revision. The new regression checks ordinary content without the Wide content toggle: automatic overflow at 390px, an unbroken Property header, real keyboard scrolling, no page overflow, and individual cell widths bounded by the container at 320px with doubled root text. Existing axe, focus, fallback and print checks also passed. Manual accessibility acceptance remains open.

## Initial VoiceOver/Chrome report and diagnostic history

Richard reports reaching the scroll region but being unable to enter the table with Control-Option-Shift-Down. This initially blocked accessibility acceptance and external delivery; see Richard's subsequent diagnostic result below. Inspection of Chrome's native macOS accessibility tree exposes the region's native table, row/column headers, cells and link. That structural observation does not reproduce or disprove the spoken interaction failure. No product fix is claimed.

Added local ?table-at diagnostic cases with identical native table content: plain wrapper, focusable unnamed wrapper, and the current measured named-region component. These separate role/naming/focus effects while retaining native semantics and styles; the first two are diagnostic controls, not proposed API or accessibility replacements. These were the diagnostic cases presented before Richard's follow-up below. Keep the scroll viewport keyboard accessible in any eventual fix.

Relevant primary guidance: W3C design-system responsive tables uses a named focusable region (https://design-system.w3.org/styles/tables.html); Apple documents nested interaction and table grouping (https://support.apple.com/en-ie/guide/voiceover/cpvokys07/mac and https://support.apple.com/guide/voiceover/webpage-tables-vo27958/mac). Do not treat conformity with the recommended markup as proof of successful VoiceOver interaction.

## Landmark ownership revision — 29 October

Richard reports that comparison cases 1 (plain wrapper) and 3 (original named region) worked with keyboard and VoiceOver in Chrome. This is positive manual evidence for those diagnostic cases, not proof of a root cause or a complete browser/AT matrix. Case 2 was not reported as passing.

At Richard's direction, Table no longer creates region landmarks. Its scroll viewport uses a named non-landmark group only while overflow is measured/unknown or focus is retained. This retains a supported accessible name for a keyboard scroll target without adding each table to landmark navigation. Fitting measured tables have no group/name/tab stop. Page headings, native captions and deliberately chosen host-level landmarks own page navigation; no automatic named section or Table landmark option is introduced. No token or visual change.

The diagnostic page preserves the originally tested region as case 3 and adds the revised actual component as case 4, so old manual results are not silently reassigned to new markup. The revised group needs a fresh VoiceOver interaction check. Other manual AT/device checks remain pending.

After the landmark revision: library build, type checks, production preview build, all 136 unit tests across 13 files, and all 10 Table browser tests passed. New checks cover multiple Tables creating no region landmarks, named scroll-group fallback, preserved native row/column headers and keyboard access. YAML/JSON parsing and diff whitespace checks passed. GitHub and Figma remain unchanged.

## Revised group: recurrent VoiceOver report — release gate remains open

Richard reports the interaction failure recurring on the actual ?table preview after the non-landmark group change. The earlier successful diagnostic cases must not be treated as acceptance of this version.

Attempted direct macOS UI testing: inspected the current Chrome native accessibility tree (table, headers and cells present), inspected System Settings confirming VoiceOver on, and VoiceOver Utility confirming Control-Option or Caps Lock modifiers and caption panel enabled. Sent native interaction/navigation commands plus Apple's copy-last-spoken-phrase command. The clipboard retained a deliberately set probe marker rather than receiving a new VoiceOver phrase; no observable screen-reader cursor/phrase result established that automation successfully drove VoiceOver. Raising Chrome and an explicit left-modifier attempt did not establish successful delivery either. Therefore this was an inconclusive automation attempt, not a reproduced failure or a passing manual test. Clipboard restored afterward. No product markup changes made from this inconclusive evidence.

The current group version remains unaccepted and must stay local. Next manual investigation must compare actual preview and control cases with VoiceOver feedback observable, including whether entering the scroll wrapper changes its measured role/name/focus state. Preserve keyboard scrolling and native table semantics in any eventual correction; do not add region landmarks.

## User recording review — 29 October, 11:02 recording

Reviewed the supplied 42.65-second recording locally, extracting frames and reading its visible VoiceOver caption panel. Direct audio playback was unavailable to the agent; Richard identifies the repeated pings as his interaction attempts. At sampled frames 8–20 seconds the panel reports Chrome's Tab search menu pop-up button. At 22–38 seconds it reports After the table, button, with the VoiceOver outline around that button. At 40 seconds it reports VoiceOver off. No sampled caption identifies the native table or scroll group as the current VoiceOver item during these attempts.

This recording therefore does not establish failure to enter the table from a confirmed table/group cursor position. It also does not establish a successful component test. The next joint test should use VoiceOver's table navigation/rotor to reach the named native table directly, verify the announcement, then test cell navigation. Keyboard focus, pointer location and VoiceOver cursor position must be distinguished. No component markup change is justified by this recording alone; manual acceptance remains open.

## Second recording: confirmed wrapper-path problem and native-focus candidate

Richard supplied a 56.02-second recording starting 11:09:51. Visible captions at 28 seconds report entry into the table at Property, row 1/column 1. Subsequent captions identify Reference/Usage guidance, children and disabled header/cell content; native table navigation succeeds. At 48–52 seconds the panel reports the horizontally scrollable group while Richard reports interaction pings. This distinguishes the failing wrapper path from the successful native table path. It does not establish whether role, tabindex, dynamic state or a browser/AT interaction is the underlying cause.

Removed the extra focusable group layer. The overflow wrapper now has no role, name or tabindex. The native table takes the measured keyboard tab stop instead, keeps its caption/name and native semantics, and joins a visually hidden scroll description to author aria-describedby IDs. Its focus indicator is shown on the viewport; browsers without :has retain a native-table focus fallback. No custom arrow-key handling was added. A preliminary real-Chrome check showed focusing a native table inside a plain overflow wrapper and pressing ArrowRight scrolls the wrapper (40px).

Updated the existing automated regressions for native focus, and added protection against creating a synthetic scroll state by programmatically focusing a fitting table. This is a candidate correction supported by the recorded distinction; the revised normal-entry path still needs Richard's VoiceOver confirmation. No new tokens, GitHub delivery or Figma changes.

Native-focus revision checks passed: library build, type checks, 137 unit tests, all 10 Table browser checks (including real Arrow scrolling, fitting/wide Tab order, resize retention, descriptions, RTL, axe, forced colours, print and no-JavaScript), and packed React 18.3.1/19.3.1 import/type/SSR/hydration/ref checks. Preview build, YAML/JSON parse and whitespace checks passed. Scroll descriptions use hidden referenced text so they do not create another browse item. Manual retest from normal navigation remains pending; no independent spoken pass is claimed.

## Local acceptance and delivery checkpoint — 29 October

Richard confirms that the revised native-table focus behaviour now works and accepts the local candidate. This records a successful manual VoiceOver/Chrome check of the revised path, not a complete assistive-technology/device matrix or WCAG certification. Safari/VoiceOver, NVDA, actual zoom, touch devices and Windows high contrast remain separate acceptance checks.

Richard authorizes GitHub review and unpublished Figma construction. Library publication and consuming-site adoption remain for final review. The selected-colour experiments and VoiceOver diagnostic comparison stay local; delivery includes the ordinary ?table candidate and regressions that exercise it directly. No recordings, private desktop files or speech extraction artifacts are included.

Source review, 29 October: Standards found no hard documented violations. Spec review caught an orphan test fragment introduced while excluding the local diagnostic route; corrected before external delivery and rerun in an isolated delivery checkout. No runtime spec mismatch was found. Current evidence introduction aligned with native focus/description semantics; historical wrapper results remain chronological.

Current delivery: [PR 54](https://github.com/richardstelmach/accessible-design-system/pull/54) is open, and [Figma page 28](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk?node-id=1618-6) is constructed but unpublished. See [current source/Figma parity evidence](react-table-parity.md) for the final state; earlier dated entries are historical local review steps.
