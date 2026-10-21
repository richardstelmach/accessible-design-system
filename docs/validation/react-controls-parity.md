# React Stepper and Accordion comparison and validation

21 October 2026. Base: GitHub main `b21742fc3984f7f3b10539f1a10c8ea28a140e50`, after PR #44 merged with both core CI checks passing and local main synced to origin/main. Canonical repository documentation and tokens are authoritative.

## Scope and public APIs

Stepper and Accordion add two components to the fifteen standalone components and Toast host already implemented. The package now has seventeen standalone components plus ToastProvider, ToastRegion, ToastNotificationsButton and useToast. No dependencies, token values, generated token output or publication settings change. Card, Breadcrumb and Pagination remain unimplemented.

Stepper follows components/stepper/stepper.yaml and stepper.md, shared form-field/required/error/focus patterns, native numeric constraints and existing IconButton. It requires label, name, positive finite step and contextual incrementLabel/decrementLabel. min/max must be finite when supplied and ordered. Initial nonempty raw strings must be valid numeric values, in range and step-aligned. Later invalid edits are retained without clamping. Browser-native badInput lexical editing remains browser-owned; the package cannot promise to expose every partial lexical string through a number input. Buttons refuse to replace badInput. Native stepUp/stepDown handles decimals and step bases. The native input ref supports ErrorSummary routing and ordinary form submission.

value/onValueChange(raw,{source}) controls the value; defaultValue is uncontrolled and resettable through the native form. Sources are input/increment/decrement. Controlled owners can decline requests and own reset. No competing onChange/onInput, readOnly, placeholder, custom spinbutton ARIA or nonzero tabIndex is supported. The input retains native Arrow keys and spinners. The fixed Minus/input/Plus row is retained in RTL; field labels retain the surrounding writing direction. A character-based input width reserves canonical 5ch plus padding/borders, then shrinks with the container. Figma's numeric 96px illustration is not a browser width requirement.

Only a valid current value equal to a supplied boundary disables the corresponding button; whole disabling or disabled Fieldset disables all three controls and suppresses stale errors. Buttons remain native buttons, never aria-disabled substitutes. Focus stays on the activated button unless it becomes unavailable; after a committed change it then falls back to the input without stealing focus from elsewhere. One initially empty mounted role=status publishes eligible button-change text. formatValueAnnouncement(raw,label) can localise it. Direct input/Arrow changes clear old text and do not announce; boundary fallback to the input suppresses duplicate speech. Native stepUp/stepDown bypass the input value setter: reapplying the resulting value through that setter keeps React's subsequent native-input change observation current. The browser regression explicitly checks ArrowDown after a button reaches maximum.

Accordion follows components/accordion/accordion.yaml and accordion.md, existing five geometry aliases, heading scale, caret artwork and independent-only expansion. headingLevel=2..6 is required, with titleStyle defaulting to its matching visual style. Each item has a unique nonempty id, plain nonempty title and body content. panelLandmark is false by default; true adds a named region. defaultExpandedIds maps framework-neutral initialExpandedIds and is initial-only. expandedIds/onExpandedChange provides the documented React controlled adapter; owners may decline requests. No single-open mode, disabled item, arbitrary title slot, lazy loading, animation or built-in URL/error routing is introduced.

SSR/no-JavaScript renders ordinary headings and all bodies, with no dead toggle buttons. Enhancement adds native heading buttons only after handlers exist. Normal Tab, Shift+Tab, Enter and Space apply; Arrow/Home/End/Escape are not intercepted. All body DOM stays mounted. Initially focused baseline content remains expanded in addition to defaults; a declining controlled owner cannot hide it during enhancement. External collapse restores focus to its trigger before hiding an active panel. Print exposes all bodies without changing state. A reveal-before-focus preview waits for the panel's actual hidden attribute to clear before focusing its input; application integrations must respect that sequence. This also fixes the preview's initially premature focus request. Required cross-panel validation and essential instructions remain consumer concerns.

## GitHub and Figma comparison

Figma file `dVFI0q1cXMtmjUAkdvSWkk` was discovered through library inventory and scoped family search before inspection.

- Stepper page `922:6`, public set `931:5765` (40 variants), private control row set `925:4854` (20 variants), public default `927:90`, private default `924:15`.
- Accordion page `1176:101`, Title set `1176:107` (H2–H6), Item set `1176:182` (six Expanded × State variants, independent Focus), root `1176:183` with native Items slot and native per-item Content slot. Existing frames `1176:227` masters, `1176:233` documentation, `1176:239` QA and `1176:245` accessibility remain intact.

Stepper discrepancies were repaired in place:

1. Detached label/helper/error/value typography now uses the existing responsive named form styles. All existing text IDs, colour bindings and component-property references remain intact.
2. The input was fixed at 44px despite 12px top/bottom padding and 24/27px line height. It now hugs content including the 1px inside border, with existing 44px min-height binding. Rows hug the result rather than retaining an unrelated fixed 56px height. Buttons remain 44px.
3. Normal label/helper-to-control spacing now binds form.field.gap.labelToHelper=4px; error/errorFocus retains errorToControl=8px.
4. Existing public Value text property overlays keep their IDs and property references. Forty new private alignment frames centre them through responsive auto-layout, avoiding fixed 24px text height and manual vertical offsets. These are ordinary internal frames, not new public components or variables.
5. Existing focus rectangles now stretch with the field and use canonical 2px separator/ring extents (2px/4px outside the field), retaining the shared 2px stroke/colour bindings. Their former fixed rectangles used 3px/6px offsets and did not follow responsive height.

All 40 public/20 private variants, state/boundary mappings, public property keys, default master and IDs are retained. Optional wording remains the canonical complete editable Label text property in Figma; it is not fabricated from the Requirement variant. In React the shared requirement policy supplies the localisable marker. Global remains 329 variables and Breakpoint 30; no token migration or collection reconciliation occurred.

Accordion existing structure, exposed nested title properties, independent focus, native slots, component aliases/scopes/exact WEB syntax, responsive title styles and geometry match source. No production Accordion Figma changes were needed. The YAML/guide now distinguish the historical read-only preflight from the confirmed live masters and current React implementation, without claiming an unverified token round-trip. Shared H6 retains the canonical 150% repair from PR #44.

| Property | base (<48rem) | md (48–<64rem) | lg (>=64rem) |
| --- | --- | --- | --- |
| Stepper label/control font / line | 16 / 24px | 16 / 24px | 18 / 27px |
| Numeric field natural height | 50px | 50px | 53px |
| Adjacent buttons / row gap | 44px / 8px | 44px / 8px | 44px / 8px |
| Accordion H2 font / line | 24 / 28.8px | 30 / 36px | 36 / 43.2px |
| Accordion H3 font / line | 20 / 24px | 24 / 28.8px | 30 / 36px |
| Accordion H4 font / line | 18 / 27px | 20 / 24px | 24 / 28.8px |
| Accordion H5 font / line | 16 / 24px | 18 / 27px | 20 / 24px |
| Accordion H6 font / line | 16 / 24px | 16 / 24px | 18 / 27px |
| Accordion H3 trigger natural height | 48px | 52.8px | 60px |

Pixels assume a 16px root. Figma rounds some fractional text boxes (e.g. 28.8 to 29), while browser lines retain exact source values. Accordion trigger padding is 12px block/16px inline, gap 8px, caret 20px, panel padding 16px and item gap 8px. Existing token values drive each measurement. The bottom divider is decorative inset geometry so it does not add layout height; forced-colour mode uses a visible system-colour border.

Responsive Figma probes verify every Accordion title style, expanded-item geometry, Stepper default/errorFocus states, text centring and focus bounds. Figma and desktop/mobile browser screenshots were visually inspected. Probe frames `1449:1537` and `1450:9943` and their recorded descendants were removed. [Machine-readable evidence](react-controls-figma-evidence.json) records affected IDs, added alignment frames, probes, mappings and cleanup. No library publication or Tokens Studio operation occurred. Accordion's existing repeat-export acceptance and confirmation of shared H6 through routine typography export remain open.

## Validation

- **92 unit/integration tests pass**, including 14 new quantity/disclosure cases: native semantics/associations/ref, decimals/boundaries/reset, invalid edits, controlled acceptance/decline, disabled Fieldset, empty values, configuration rejection, large-value mismatch guard, independent disclosure, retained DOM/value, semantic/visual headings, optional landmarks, focus recovery and pre-enhancement focus preservation in Strict Mode hydration.
- **60 Chromium checks pass**, including nine new cases: responsive geometry/all title styles; complete native Tab/Arrow/button sequences and announcement ownership; decimal stepping; badInput preservation; ErrorSummary input routing; disabled/submission exclusion; controlled independent expansion; retained values; external collapse/reveal focus; print; forced colours; 320px doubled-root text and spacing with unbroken labels; RTL fixed order; scoped token override; no-JavaScript baseline; axe including rendered contrast. The previous 51 checks pass unchanged.
- Independent packed consumers pass with **React 18.3.1 and React 19.3.1**, including positive/negative public declarations, import/SSR without DOM globals, stable hydration IDs/ref, native decimal step/reset, announcement DOM, disclosure enhancement and preserved hidden values, alongside previous component checks. Archive: **58 intended files**, no publication.
- Build, package/example type checks, production client example, YAML/JSON parsing, whitespace and unchanged generated-token checks pass. Token build remains **407 raw / 335 Studio**, 24 mapped responsive groups, zero unmapped groups and zero broken retained aliases.

Reproduce: npm ci; npm run build; npm run typecheck; npm test; npm run build:example; npm run test:browser; npm run verify:package. Use installed Playwright Chromium or OWLA11Y_BROWSER_EXECUTABLE. Packed installs require registry access. Preview: `?controls`, using actual OwlA11y settings components.

Existing old fixtures emit act-environment and Dialog React19/jsdom autoFocus warnings; these do not fail validation. The client preview's Vite use-client warnings do not strip directives from the distributed component modules.

Manual NVDA/JAWS/VoiceOver speech, native Safari/Firefox behaviour, actual 400% browser zoom, Windows high contrast, translated labels and application-specific layouts/palettes remain release acceptance. Automated DOM publication does not guarantee audible announcements or establish accessibility certification. Package publication, RSC acceptance and unrelated launch requirements remain open.
