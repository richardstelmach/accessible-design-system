# React Alert and Badge comparison and validation

19 October 2026. Base: GitHub main `3af47a18778972dd8ff25caa2f449f270820ef34`, after PR #43 merged and local main matched origin/main. Canonical repository contracts and tokens are authoritative.

## Scope and API

Alert and Badge add two contextual feedback components to the thirteen standalone components and Toast host already implemented. The package now has fifteen standalone components plus ToastProvider, ToastRegion, ToastNotificationsButton and useToast. There are no dependency, token-value, compiled-token or publication changes.

Alert requires escaped nonempty titleText, supports optional descriptionText and defaults to state=info, headingLevel=none and announcement=none. Blank descriptions are omitted. The React adapter derives description presence from text rather than exposing the redundant Figma Description Boolean. One hidden state prefix precedes the title; fixed decorative Phosphor icons carry no separate accessible name or focus target. The complete optional stateLabels map localises the canonical prefixes including punctuation.

By default the title is a paragraph in responsive body/default plus typography.emphasis.strong. Explicit headingLevel 2–6 uses the matching semantic element and corresponding responsive heading tokens; description presence never chooses heading semantics. H1 and invalid levels are rejected. The div ref targets the nonfocusable root. No actions, children, links, icon swaps, dismissal, lifetime management or focus movement are introduced.

Badge requires escaped nonempty label and defaults to neutral, with info/success/warning/error tones. The ordinary span ref targets visible phrasing content. Every tone with the same label has the same accessible text; no hidden prefix is derived from tone. Small-body text hugs content and wraps within min(parent width, component.badge.sizing.maxWidth), currently 15rem. There are no interactions, icon slots, timers, focus or built-in live regions.

Both components accept id/className/style/lang/dir/data metadata. They reject handlers, ARIA/role/focus overrides, editable/draggable content, arbitrary HTML/children and unsupported axes at runtime as well as through the public declarations where TypeScript supports excess-property checking. Container customisation must preserve accessibility. Public refs follow the existing React 18-compatible forwardRef/use-client convention; SSR is tested, complete Next.js/RSC integration is not claimed.

## Announcement ownership

Alert's explicit announcement=polite selects role=status; assertive selects role=alert. Visual state never chooses urgency. Those roles supply implicit live/atomic semantics, without redundant aria-live/aria-atomic. Static content uses none by default, and updates never call focus.

A populated polite region mounted after an event is not a guarantee of spoken delivery. The runnable example keeps two empty application announcement containers mounted before events and publishes the new Alert into exactly one, with Alert announcement=none. Changing the priority setting clears the example rather than republishing an old outcome. Explicit Alert live-role props remain available for applications using an appropriate established live-container lifecycle; do not combine the strategies, announce historical/static notices as new events, or duplicate Toast/validation announcements. Badge's announcement strategy always belongs to the application.

Automated roles/DOM publication establish markup and update ownership, not audible speech. Supported assistive technology must verify actual output before release.

## Source and Figma reconciliation

Sources: components/alert/alert.yaml and alert.md, components/badge/badge.yaml and badge.md, their component-token files, shared status/icon colours, semantic typography and emphasis. Existing Alert/Badge tokens are reused exactly; source and compiled tokens remain unchanged.

Figma file `dVFI0q1cXMtmjUAkdvSWkk`:

- Alert page `1132:53`, Alert set `1132:155`, eight masters `1132:99`–`1132:148`; private title set `1132:69`, six masters `1132:57`–`1132:67`; documentation `1137:82`, QA `1137:105`.
- Badge page `1139:11`, set `1139:22`, five masters `1139:12`–`1139:20`; documentation `1139:29`.

Library discovery and scoped searches identified the actual existing families. All variants, fixed icons, exposed nested title properties, shared text styles and nine geometry aliases were inspected. Shared state colour bindings match the source. Global retains 329 variables and Breakpoint retains 30 with base/md/lg. The registered status artwork is shared privately with Toast through feedback-icons.ts; no public icon API or new dependency is introduced.

Two Figma discrepancies were repaired in place:

1. Alert's top-left/default master was Success while the canonical default is Info without description. Swap the existing Success/Info row positions: `1132:113` becomes default; `1132:99`, `1132:106` and `1132:120` are repositioned with it. All IDs, content, properties and bindings remain intact.
2. Shared text style `S:d2816c9479601ead49c6156b62aaec9dc9a7daf6,` (`typography/heading/h6`) used 120% line height while every canonical H6 mode specifies 150%. The style is now 150%, preserving its ID, font, weight and variable bindings. This is a shared foundation repair and can affect other H6 consumers; it restores their source-defined spacing rather than introducing a component override. Existing Alert H6 instances inherit it.

The YAML's private title property label is also reconciled from Style to Title style, matching its already-required public exposed label; this resolves the internal naming inconsistency without changing the public Figma property or multiplying variants.

| Property | base | md | lg |
| --- | --- | --- | --- |
| Alert default title/body | 16px / 24px line | 16px / 24px | 18px / 27px |
| Alert H2 | 24px / 28.8px | 30px / 36px | 36px / 43.2px |
| Alert H3 | 20px / 24px | 24px / 28.8px | 30px / 36px |
| Alert H4 | 18px / 27px | 20px / 24px | 24px / 28.8px |
| Alert H5 | 16px / 24px | 18px / 27px | 20px / 24px |
| Alert H6, repaired | 16px / 24px | 16px / 24px | 18px / 27px |
| Badge small body | 14px / 21px | 14px / 21px | 16px / 24px |
| Badge short-label height | 29px | 29px | 32px |

Pixel equivalents assume a 16px root. Figma may round fractional text boxes to whole pixels; browser line heights follow the exact source values. Temporary instances verify all six Alert title styles and all modes. Title wrappers hug actual text height; the complete visible description gap is exactly 4px throughout. The H6 recheck confirms corrected 24/24/27px boxes. Alert inset=16px, icon/content gap=12px, icon=24px and radius=8px. Reference paragraph-title-only height is 56px base/md and 59px lg; a one-line description makes it 84px/90px. Badge padding=4px/8px, radius=9999px, maximum=240px; long-label probes wrap and grow at every mode. Production Badge nodes needed no changes.

Three temporary probe frames (`1366:130`, `1367:300`, `1369:130`) and all descendants were removed using their recorded IDs. Alert documentation/QA, Badge documentation and browser desktop/text-stress screenshots were visually inspected. See [machine-readable evidence](react-feedback-figma-evidence.json). No library publication or Tokens Studio operation occurred. Confirm H6's shared style through the next routine non-destructive Tokens Studio typography export; no new variables or canonical values are required.

## Automated evidence

- **78 unit/integration tests**, including eight feedback cases: static defaults, escaped/required content, descriptions, all headings, state-independent urgency and unchanged focus, Badge text parity/ref/metadata, prohibited behavioural props, all-state SSR and Strict Mode hydration/ref/content.
- **51 Chromium checks**, including six feedback cases: all states/tones, base/md/lg geometry, every title style and exact visible description gap, keyboard exclusion and one live owner, 320px with doubled root text/spacing/unbroken strings, RTL, scoped token overrides, forced-colour boundaries and axe including rendered contrast. The prior 45 checks pass unchanged. The six feedback checks also pass after component-level screenshot capture was added.
- Independent **React 18.3.1 and React 19.3.1** packed consumers compile positive/negative declarations, import/render without DOM globals, hydrate with stable refs/content, update Alert heading/announcement semantics and retain ordinary Badge content, alongside previous component checks. Archive: **52 intended files**, private/unpublished.
- Build, package/example type checks, production client example, YAML parsing and whitespace checks pass. The generated package dist is now cleared before compilation so renamed private modules cannot remain in later archives. This exposed and removes the old unused toast-icons output; the shared artwork module is feedback-icons. No public import changes for existing consumers.
- Token build remains **407 raw / 335 Studio**, 24 mapped responsive groups, zero unmapped groups and zero broken retained aliases. No canonical/compiled token changes. Resolved source foreground/background contrast: neutral 7.47:1, info 7.48:1, success 7.43:1, warning 7.52:1, error 7.51:1; all exceed the 4.5:1 normal-text threshold.
- Stress testing identified a long host-preview heading that overflowed at doubled root text; preview typography now inherits overflow-wrap:anywhere. Package content already wraps and retains its text without clipping. No production page typography is imposed by the package.

Reproduce: npm ci; npm run build; npm run typecheck; npm test; npm run build:example; npm run test:browser; npm run verify:package. Install Playwright Chromium or select OWLA11Y_BROWSER_EXECUTABLE; packed installs require registry access. Preview: `?feedback`; settings use the public OwlA11y Select/Checkbox/Button components.

Existing older fixtures emit act-environment warnings and the Dialog fixture's React19/jsdom autoFocus hydration warning; these do not fail the checks. New feedback hydration and packed consumers pass. Existing Vite use-client warnings apply to the client-only example bundle; package module directives remain preserved.

## Remaining release checks

Manual NVDA/JAWS/VoiceOver with the supported native browsers must verify one state prefix, ordinary Badge reading, polite/assertive speech and no duplicate outcomes. Native Safari/Firefox, real Windows high contrast, actual 400% browser zoom, translated content and consuming layouts/token palettes remain manual acceptance. Long arbitrary text is retained for stress testing; production labels should remain concise. No accessibility certification, npm publication, complete RSC acceptance or closure of unrelated launch gates is claimed.
