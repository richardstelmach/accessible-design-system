# Side menu — delivery and validation evidence

Date: 27 October 2026. Source base: `d87d53f12597e573ea90769b38a6442b4478b3cb`.
Branch: `component/side-menu-local`. Local design/API review is accepted. GitHub delivery and Figma construction are now authorized and in progress.

## Current result

Final local review fixes: removed uncontrolled groups now discard stored expansion in both exports; an open in-flow Menu returns to desktop placement above lg after focus safely leaves; the enabled empty presentation prompt resolves to the default drawer. Regression coverage includes retained peer expansion, focused descendants in both resize directions and the empty preview choice.

Navigation now accepts optional native `aria-label`, omitted by default. Different navigation purposes on a page need distinct names, such as Main navigation and Account navigation. Core `SideMenu` no longer requires `label`; responsive `label` remains the required visible drawer title and does not implicitly name the inner nav. The preview supplies both explicitly. Unit, declaration and packed-consumer checks cover named/unnamed nav and independent drawer naming.

The core `SideMenu` now has **zero outer padding and no sidebar divider**. Existing Link targets, static captions and neutral Accordion triggers keep their internal padding. The host page owns column insets, focus clearance and any vertical separator between sidebar and main content. The preview draws its divider only on the persistent desktop sidebar wrapper; it is not a menu option and does not follow navigation into a drawer.

The default documentation-primary and B2B-primary preview contexts render the existing mobile drawer Menu Button in the page header near identity. The Account settings context keeps its explicitly labelled Account navigation control local. The in-flow Accordion stays local even for a primary hierarchy, adjacent to its own panel.

`ResponsiveSideMenu` accepts an optional `drawerTriggerContainer`: a mounted same-document HTMLElement supplied by the host. The component renders its existing Button in that slot while retaining ownership of accessible relationships, open requests and actual trigger ref. It does not create a duplicate trigger or second state owner. Omit the slot for local section controls. Inline presentation ignores it. The host must keep the target stable and mounted while focused/open. Direction/language metadata travels with the Button, and its print rule hides it even when rendered outside the navigation wrapper.

The existing navigation design is preserved: static groups, actual neutral Accordion instances for expandable sections and the outer in-flow Menu, shared filled selected current-page states, no bespoke blue bar, no Direction selector, and existing Dialog for the drawer. No primitive, semantic or component tokens were added. Dialog and Accordion runtime implementations remain unchanged.

Preview: `http://127.0.0.1:4181/?side-menu` while the local server runs. The generic comparison demonstrates documentation-primary, B2B-primary and section contexts, mobile drawer/in-flow choices, long labels and routing failure. It is not a production website, search, account or permissions implementation.

## Responsibilities and state

- `SideMenu` owns native nav/list/link semantics with optional aria-label and independent existing Accordion groups. Expandable groups require explicit heading levels 2–6; static-only navigation may omit headings. Group visual title style remains H6.
- `ResponsiveSideMenu` owns controlled compact presentation and existing Dialog/Accordion composition. In-flow mode requires explicit outer heading level 2–5, with deeper group headings. One mounted tree and its group state are preserved through responsive placement; native descendant nodes may remount when they do not hold focus.
- The bounded nesting exception remains documented in the Accordion contract: one outer Menu Accordion and one level of inner navigation-group Accordions, with independent owners. This does not grant general recursive Accordion support or a new visual variant.
- Application owns primary/section context, host layout, header slot, separator, valid destinations, routing/current identity, skip-to-main, title and destination focus. Successful routing may use `returnFocusRef` to reach the new main/heading; ordinary dismissal returns to the actual trigger, including one in the header. Failed/cancelled routing leaves navigation available.
- Breakpoints do not hide focused links, remove a focused header/local trigger, or dismiss an open modal. Focus listeners operate across the document, so the externally placed trigger retains the same safeguards. An open drawer remains stable during resizing until dismissal.
- Before enhancement, or without scripts/CSS/required browser support, all destinations remain visible in flow and no inactive Menu control is exposed. Print reveals destinations and hides shell controls, including the externally placed Button.

## Validation

- Library/token build and package/preview type checks: **passed**, including the mounted-element slot API and rejection of selector strings in declaration fixtures.
- Unit suite: **130 tests across 12 files passed**. Navigation coverage includes actual Accordion composition, static/expandable state, controlled decline/external-collapse focus, route branch updates, explicit heading hierarchy and complete SSR relationships.
- Full browser regression run after these fixes: **98/98 passed**, including all nineteen SideMenu checks and existing component regressions. The previous run's Breadcrumb/Pagination timeout did not recur.
- New regression checks cover removed/reinserted uncontrolled groups in both exports while preserving peer choices; open inline resize with focus inside and outside navigation; safe empty presentation selection; optional unnamed landmarks and distinct explicit labels; and drawer title independence. Public type fixtures and React 18/19 packed consumers verify the optional landmark API.
- New placement checks verify zero core nav padding/border; page-owned desktop divider; exactly one primary Menu control in the header; no local duplicate; local section control and focus return; header trigger retained during open-drawer resize and until blur; local in-flow Accordion despite a supplied header slot; and independent print hiding outside the wrapper.
- Retained browser checks cover neutral Accordion controls, shared selected default/hover/pressed palette, no blue bar/RTL selector, modal focus/inertness/Tab boundary, Close/Escape/backdrop/scroll restoration, route success/failure/modifiers, group/outer state preservation, same-destination focus, 320px RTL long labels, doubled text/spacing, print, no JavaScript, forced colours, axe/contrast and drawer geometry.
- Drawer captions and current-link text align with title within 1px; title-to-first-caption text gap remains bounded at 36px (32px in the fixture). Target padding and focus treatment remain intact after removing nav-level inset.
- Packed library: **72 files**, verified in independent **React 18.3.1 and 19.3.1** consumers, including public slot declarations, both navigation refs, SSR/hydration and stable relationships. No publication occurred.
- Preview production build: **passed**, with the existing Vite client-only bundle notices about ignoring `use client` directives.
- YAML/JSON parsed, `git diff --check` passed and generated tokens have no diff. The canonical build still yields 409 raw / 337 Studio tokens, 24 mapped responsive groups, zero unmapped groups and zero broken retained aliases.
- In-app visual review confirmed the primary Menu Button next to identity in the mobile header, no duplicate local trigger row and no Direction selector. Screenshot: `/private/tmp/owla11y-side-menu-header-v4.png`. Earlier drawer/in-flow visual receipts remain at `/private/tmp/owla11y-side-menu-drawer-v3.png` and `/private/tmp/owla11y-side-menu-inline-v3.png`; their internal state and geometry are unchanged.

The earlier print regression queried a hidden Button by accessible role; its corrected computed-style check remains in the passing full suite. Earlier targeted rechecks and the historical responsive timeout are superseded by the complete 98-test passing run. No existing regression was weakened.

## Reuse, contrast and sync state

Current page continues to use shared selected white-on-blue states: default 4.52:1, hover 7.00:1, pressed 10.87:1, matching Pagination's semantic family. Neutral controls retain existing Accordion roles; focus retains the ring/separator, and forced colours use a complete system-colour border. Header placement reuses the same existing Button and controlled Dialog lifecycle. React DOM is already a peer dependency; no dependency or lock-file changes were needed.

**Figma objects changed: none.** Earlier read-only discovery is preserved in [the receipt](react-side-menu-figma-evidence.json). It establishes existing Accordion inventory and foundations, not a new parity/post-export audit. After local acceptance, proposed page `27 - Components - Side menu` should use standard documentation areas, existing component instances and usage examples for primary header versus section-local placement, zero core inset, page-owned divider and bounded Accordion nesting.

No push, PR, merge, provider pull/export, remote write or library publication occurred. Synced project references are untouched. No token sync is needed for unchanged token sources.

## Exact source inventory

- `components/side-menu/side-menu.yaml`, `side-menu.md`: component/API/accessibility/composition guidance, including optional native landmark label, independent drawer title, header/local placement and no core inset/divider.
- `patterns/side-navigation.yaml`: consumer-neutral scope, choice over top navigation, host-owned separator/insets and primary/section/in-flow trigger rules.
- `components/accordion/accordion.yaml`, `accordion.md`: previously requested bounded navigation-nesting exception; no Accordion runtime or Figma changes.
- `packages/react/src/components/SideMenu.tsx`, `ResponsiveSideMenu.tsx`: existing navigation/Accordion/Drawer composition, optional landmark naming, discarded removed-group state, safe inline resize and host-slot rendering of the owned Button.
- `packages/react/src/types.ts`, `index.ts`, `styles/components.css`: API/exports, zero core nav padding, selected-state reuse, scoped spacing and location-independent print hiding.
- `scripts/assemble-react.mjs`: canonical lg projection into CSS.
- `examples/client-consumer/side-menu.tsx`, `main.tsx`, `preview.css`: generic contexts, mounted header slot, local section controls, page-only divider and host clearance.
- `packages/react/tests/side-menu.test.tsx`, `tests/browser/side-menu.spec.ts`, `tests/types.tsx`, `tests/packed-consumer.mjs`: unit/browser/type/packed-consumer evidence.
- `packages/react/api-contract.json`, `packages/react/README.md`, `docs/react-api.md`, `docs/react-package-structure.md`: local candidate inventory and host integration guidance.
- This report and `docs/validation/react-side-menu-figma-evidence.json`: current local validation and qualified earlier read-only Figma evidence.

## Remaining acceptance

Richard reports that local screen-reader and keyboard testing worked well. This is recorded as user acceptance evidence; browser, operating system and assistive-technology versions were not specified. Richard accepted the latest fixes for GitHub and Figma delivery. Before release, complete authorized GitHub delivery, Figma construction and any remaining targeted screen-reader/device acceptance: VoiceOver/Safari, NVDA with Firefox/Chrome, real touch, OS new-tab behaviour, actual 400% browser zoom and Windows high contrast. In particular, assess the two Accordion levels and primary-header versus section-local trigger announcements. Automated results do not establish spoken delivery or WCAG certification.

The wrapper is viewport-based, not automatic container-fit logic. Hosts own adequate desktop content width, external trigger lifetime and focus when destinations/permissions change. Narrow embedded hosts can compose the core themselves. Source merge, Figma reconciliation, token round-trip and publication remain separate checkpoints.
