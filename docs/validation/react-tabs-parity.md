# React Tabs comparison and validation

19 October 2026. Base: GitHub main `8821faa75cfdb5add818b250360ffeedf84c4882`, after PR #41 was merged and local main matched origin/main. GitHub contracts and canonical tokens are authoritative.

## Scope and API

Tabs is the thirteenth React component. It implements the existing horizontal, plain-text-label contract: automatic/manual activation, one selection, linked-section baseline, responsive fallback, mounted panel state and print. It introduces no dependency or token changes. Publication remains disabled.

`items` requires at least two unique nonempty IDs and distinct nonempty plain-text labels, plus nonempty `heading` and present `content`. The React adapter renders each contextual heading itself; content supplies the body, without repeating that heading. `headingLevel` is 2–6, default 3, with the canonical responsive H3 visual style. Prefer labelledBy referencing visible meaningful text; otherwise supply label. One naming method only. The ref targets the root div. Supplied root IDs prefix encoded item keys; otherwise useId provides an instance prefix stable through hydration. Native section-fragment hrefs encode the complete generated panel ID.

Uncontrolled selection uses defaultSelectedId (first item by default), with optional onSelectedChange(id). Controlled selection requires selectedId plus onSelectedChange and forbids defaultSelectedId; the owner may decline requests. Unknown explicit keys and switching ownership throw actionable errors. Updating defaultSelectedId does not reset an existing selection; removing the remembered uncontrolled item chooses the first remaining item without moving focus. Applications own focus when they remove focused content. Keys should remain stable.

The server renders a named ordinary list of OwlA11y Link anchors and every section in source order, without widget roles, selection attributes, tabindex or hidden panels. The same anchors, sections and content nodes are enhanced after handlers are mounted and usable layout/ResizeObserver/matchMedia support is available. Missing measurement support keeps that baseline. A client-only preview still requires JavaScript to render; the separate server/no-JavaScript tests establish the package baseline, not Vite's empty HTML shell.

## Selection, focus and responsive behaviour

- Automatic focus selects immediately available content. Manual arrows/Home/End only move focus; Enter, Space or click commits selection. No network/readiness inference, disabled tabs, vertical mode, URL/history integration, lazy-loading framework or whole-panel live region is provided. Use manual activation if a consumer cannot display content immediately. Keep essential instructions and cross-panel required validation outside this version.
- Enhanced Tab enters at the selected item, travels to its panel, then its normal content and onward. Roving focus moves the single list tab stop during manual arrow navigation. The first real-browser pass caught a fast leave/re-entry race: a deferred React render could leave the old focused tab as entry. The adapter restores entry attributes only after the browser establishes the external focus destination, then reconciles React state; a deferred blur fallback handles departure without a document destination. Forward and reverse Tab are tested from tabs on either side of a non-first selection.
- Hidden sections remain mounted with native hidden; normal component CSS never overrides it. Input values and local React state survive switches. The visible enhanced panel is a keyboard stop with the shared double focus ring. Arrow/activation handlers are scoped to these tabs; panel inputs, Up/Down and modified shortcuts are left alone. Pointer/keyboard enhancement cancels ordinary fragment navigation, while baseline and modified navigation retain real links.
- Below 48rem or when the whole natural row exceeds the actual container, roles/selection/controls/widget tabindex are removed and all named sections are visible. A clipped, hidden, noninteractive measurement row contains only text spans, so measurement does not create duplicate accessible links or page overflow. It follows the same typography, padding, minimums and gaps. Container/measurement observers and font-load events catch size, label, typography and token changes.
- Resize never calls focus. A focused contents link keeps its node. Focus inside a section stays there; on re-enhancement that section is selected before any other section hides. In controlled mode, a conflicting focus-containing selection is requested once while pending; enhancement is deferred if the owner declines. If the owner changes selection while focus remains in another panel, the safe all-sections presentation also remains available. Once focus leaves the conflict or the owner accepts, normal enhancement resumes.
- Print exposes every section in order and ordinary-looking links. A print media listener removes enhancement semantics where print events are available, with print CSS also revealing hidden sections as a defensive presentation fallback.

## Source and Figma comparison

Canonical sources: `components/tabs/tabs.yaml`, `components/tabs/tabs.md`, `tokens/components/tabs.json`, shared typography, interactive colour/focus/sizing tokens, responsive-mode and heading patterns. Existing API drafts are reconciled with the typed React adapter in this PR. The existing repeat-export checkpoint remains open.

Figma file `dVFI0q1cXMtmjUAkdvSWkk`, page `1164:6`; tab set `1164:13`, six variants `1164:7` through `1164:12`; panel `1164:32` and native Content slot `1164:34`; composition `1164:36`; review frame `1165:43`.

No production Figma repair was needed. Inspection confirms the six selected/pointer variants, independent Focus Boolean, native panel/composition slots, shared body/H3 styles, five canonical aliases, GAP/STROKE_FLOAT scopes and exact Web references. The selected INSIDE bottom stroke overlays the padding without changing frame height. CSS uses an actual 4px bottom border with padding compensation on selection, preserving the same text position and dimensions without transparent unselected borders.

| Property | Base / md | lg |
| --- | --- | --- |
| Tab label | 16px / 24px line | 18px / 27px line |
| Tab block size | 48px | 51px |
| Panel heading | 20px base / 24px md | 30px |
| Tab inline/block padding | 16px / 12px | 16px / 12px |
| Between tabs / before panel | 8px / 16px | 8px / 16px |
| Selected underline | 4px | 4px |

All pixel equivalents assume default 16px root/browser settings. Base tab masters are verified in Figma; the browser intentionally uses linked-section fallback below md. Temporary selected/unselected History probes confirm equal dimensions in every Breakpoint mode, retaining the shared style and font bindings. Focus geometry extends 2px for the separator and 4px for the outer ring, with stretch constraints and no clipping. The existing review frame was visually inspected for default, non-first selection and independent manual focus. All three temporary probe frames and their instances were removed. The variable inventory stays 329 global and 30 Breakpoint with base/md/lg; no token migration or Figma publication occurred. See [machine-readable receipts](react-tabs-figma-evidence.json).

## Automated evidence

- Build and package/example type checks pass. Positive/negative declarations cover names, selection ownership, headings, refs and unsupported axes.
- **57 unit/integration tests**, including ten Tabs cases: configuration errors, server baseline/encoded fragments, stable hydration/ref/IDs, automatic/manual requests, controlled refusal/acceptance, preserved input DOM, focused-panel protection, resize continuity, observer-free baseline and independent instance IDs. Measurement is stubbed in jsdom; it does not prove real layout.
- **37 Chromium checks**, including ten Tabs cases: one entry point; automatic wrapping/Home/End; manual selection and rapid forward/reverse exit/re-entry; Enter/Space; preserved values and component state; untouched panel/modified keys; focus-aware breakpoint/container/label transitions; controlled refusal; 48/51px geometry and stable selection boxes; independent sets; DOM-order RTL arrows; forced colours; 320px reflow; doubled root text and spacing overrides; print; server HTML with JavaScript disabled; and axe including contrast in both enhanced and fallback previews. The previous 27 checks pass unchanged. The preview uses OwlA11y Select, Checkbox, Button, Link and TextInput rather than native substitute settings.
- Independent **React 18.3.1 and React 19.3.1** packed consumers compile declarations and verify all thirteen components. Tabs adds DOM-free server output, linked-section hydration/IDs/ref, simulated manual activation, mounted inputs, narrow fallback and focus-containing re-enhancement. Simulated geometry is explicit; real geometry/focus navigation is established by Chromium. The archive contains **42 intended files**; no publication.
- Production client example builds. Existing Vite use-client warnings apply to the client-only example bundle; the package's unbundled directives are preserved.
- Source contrast recalculation passes: default/hover/pressed text 7.00/7.47/5.30:1; selected indicator 7.00/4.82/3.42:1 against those surfaces; focus ring 4.52:1 against separator and surrounding default surface. These unchanged canonical pairings meet the documented thresholds.
- Token build remains 407 raw / 335 Studio, 24 mapped groups, zero unmapped groups and zero broken retained aliases. Canonical values, metadata and both compiled outputs are unchanged. Contract YAML and whitespace checks pass.

Reproduce: npm ci; npm run build; npm run typecheck; npm test; npm run build:example; npm run test:browser; npm run verify:package. Install Playwright Chromium or select OWLA11Y_BROWSER_EXECUTABLE. Packed consumers need registry access. The runnable preview is `?tabs`.

## Remaining release checks

Manual NVDA/VoiceOver/TalkBack announcements, mobile touch, native Safari/Firefox, real Windows high contrast, full browser zoom and assistive-technology shortcut combinations remain open. Automated RTL order does not establish translated-content usability. Focus visibility near consuming sticky/overlay layouts needs application checks. No asynchronous or cross-panel required-field validation integration is supplied; no complete Next.js RSC acceptance is claimed. Caller palettes and content require their own contrast/accessibility validation.

A05's repeat Tokens Studio pull/export after the earlier STROKE_FLOAT correction remains a human checkpoint. This batch verifies live/source agreement without claiming that provider round-trip has occurred. No new Tabs token export or Figma library publication was performed.

References checked for interaction guidance: [W3C APG Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/). The repository's established 48rem/overflow fallback policy remains authoritative; it is not a W3C breakpoint rule.
