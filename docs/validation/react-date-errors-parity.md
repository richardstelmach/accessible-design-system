# ErrorSummary and DateInput comparison

18 October 2026. Implements the next two React components and a pure date-ID helper. GitHub remains the source of truth. This is a private beta implementation with automated validation; manual release acceptance remains open.

## Baseline

PR #39 was merged and local main fast-forwarded to `81418009cb14a2a0d27cd9fc730dc2bd3f4079a8` before creating this branch.

| Source contract | Baseline blob | Figma |
| --- | --- | --- |
| [Error Summary](../../components/error-summary/error-summary.yaml) | `3bf66c2a9de7cac45851d8c4203cca1e5f2e39b0` | [set 833:39](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk?node-id=833-39), two states; supporting Item 830:18 |
| [Date Input](../../components/date-input/date-input.yaml) | `14e4e2fe1601a2b9e8edc9e29fbdf19e44fd2178` | [set 1099:424](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk?node-id=1099-424), thirteen states |

The [error-summary pattern](../../patterns/forms/error-summary.md), [grouped-control pattern](../../patterns/forms/grouped-control-pattern.md), Fieldset and TextInput contracts define the shared semantics and presentation. Existing variables and text styles were inspected before reconciliation. No canonical token values changed.

## API and behaviour

ErrorSummary renders a native div with persistent tabindex=-1, h2, optional description and ul/li/a. It keeps real fragment links and native list markers; Figma slot/item wrappers do not appear in the DOM. Duplicate current issues collapse; conflicting reuse of one issue ID fails configuration checks. After all sibling controls commit, targets are resolved uniquely, checked for native focusability/visibility/enabled state and sorted into document order. Only then does a new focusRequestKey move focus once. Corrective rerenders do not refocus, including Strict Mode replay. Omit the key for passive presentation; a new explicit failed submit gets a new key.

While mounted, a title owner adds one Error: prefix and restores the base title on resolution/unmount. Multiple summary owners share it; cleanup does not overwrite a title replaced by navigation. Focus is the only exposed announcement strategy: there is no alert or aria-live override. Link activation scrolls the associated label or legend and focuses the control, preserving inline descriptions and values. Explicit contextId can name a label, legend or Fieldset; Fieldset is never focused. Modified link clicks retain native behaviour.

DateInput uses a native fieldset, first-child legend and three labelled text inputs in Day/Month/Year order. It shares field/legend tokens but owns one group header and one shared error. No public Fieldset is nested or detached to construct it. Controlled raw strings use onValueChange(next,{part}); uncontrolled defaults reset natively. It does not parse, clamp, pad, auto-correct, truncate or advance focus. A supplied form owner is forwarded to each part. Disabled and read-only apply to the whole answer; disabled values are omitted from submission, read-only values remain submitted, and both suppress stale errors.

The pure getDateInputIds(id) helper returns group/day/month/year. Passing that same id to DateInput gives ErrorSummary stable targets without DOM-ID guessing. Group errors describe only the Fieldset; part errors require nonempty invalidParts and describe only affected enabled parts. All entered strings survive validation. required defaults to true; false appends optionalLabel to the legend and makes all parts optional. labels and partNames support localisation/submission integration. Birthday autocomplete is opt-in for the user's own date of birth.

Calendar validation remains consumer policy. The example validator runs only on submit and demonstrates missing parts, numeric ranges, year format, month lengths, Gregorian leap years (2000 valid, 1900 invalid) and a birth date in the past. It never mutates entered strings or relies on JavaScript rollover. It is not a package export.

## Figma comparison and reconciliation

ErrorSummary's existing native slot, supporting item, two focus states, semantic typography and error-surface colours match the source. A temporary attached instance verified 1, 2, 5 and 10 independently editable items, preservation through state/description changes, responsive title sizes 24/30/36px and body sizes 16/16/18px, and a 320px ten-item layout without recorded text overflow. Its default slot retained one item and preferred-instance enforcement. No Summary production objects were modified. Production uses the browser's list marker metrics rather than exporting a decorative Figma bullet into link text.

Date Input's copied TextInput anatomy still used fixed 44px control heights and older focus-overlay offsets. This lagged the already accepted source-led TextInput reconciliation. All **39 controls across 13 masters** were repaired in place:

- Removed fixed height bindings, reused the 44px minimum token, included strokes in layout and let controls hug content.
- Added one ordinary clipped Value viewport per control to retain native single-line overflow behaviour within the existing short measures.
- Reused and verified the existing form/control/typography text style and responsive font binding.
- Updated the existing focus separator/ring geometry to the canonical 2px/4px offsets and retained stretch constraints.

Filled probes confirm base/md/lg control heights **50/50/53px**, input text sizes **16/16/18px**, 24px header-to-fields spacing and 16px between fields. Existing 56/56/78px Figma part measures remain illustrative; React uses the canonical 2ch/2ch/4ch measures plus padding/borders and allows whole units to wrap with their labels. A character measure is font-dependent and is not a promise of those fixed pixel widths.

All thirteen exposed _Fieldset/Header instances still point to master 1094:1500. Public set/component IDs, state axes, value properties, header exposure and existing text-style IDs remain unchanged. The recorded final audit found no missing control/style bindings, root focus clipping or field-wrapper overflow in the nineteen existing Date Input page instances checked. The variable inventory remains 329 global plus 30 Breakpoint variables, with base/md/lg modes. All temporary probes and their inserted children were removed. No token migration, Tokens Studio export or Figma publication was needed.

Detailed IDs, initial measurements, repairs and probe receipts are in [machine-readable evidence](react-date-errors-figma-evidence.json). Filled probes supersede empty-text font getters, which may retain their pre-resolution reported size even when the resolved layout height changes. Representative Figma screenshots and the browser's narrow comparison screenshot were visually inspected. The preview includes Inter 400/500/700 so heading comparison uses the real bold face rather than synthetic bold; distributed CSS still downloads no fonts.

## Preview typography correction

The page H1 and explanatory body copy initially inherited browser defaults: H1 stayed 32px at every breakpoint while the correctly responsive date legend reached 36px on large screens. Shared development-only preview styles now use the canonical responsive body and H1/H2/H3 tokens across all four preview routes. Inter 600 is also loaded for the H3 semibold style. Package styles and Figma component/token definitions require no changes.

Computed sizes with the default 16px browser root:

| Viewport | Page H1 | Date legend / page H2 | Body / date labels / input text |
| --- | --- | --- | --- |
| Below 48rem (768px) | 30px | 24px | 16px |
| 48rem to below 64rem (1024px) | 36px | 30px | 16px |
| 64rem and above | 48px | 36px | 18px |

The date legend deliberately uses the default Fieldset legend style, visually equivalent to H2 while retaining native legend semantics. A browser regression check verifies the shared page H1/body on every preview route and the date legend, H2, part labels and inputs at 767, 768, 1023 and 1024px. Responsive token sizes use rem units, so the pixel values above reflect default browser settings rather than fixed text sizes.

## Automated validation

- Build and generated public declarations pass. Package API type checks now also compile the actual examples, catching the native fieldset/defaultValue declaration conflict during implementation; that conflict is fixed and covered by a compile-checked uncontrolled example.
- **42 Vitest tests** cover the existing nine components plus raw date preservation, part IDs/names/autocomplete, explicit external form association, group/child error ownership, disabled/read-only/reset behaviour, Gregorian validation, error ordering/deduplication, real fragments, one focus per submission under Strict Mode, title restoration, SSR/hydration and markup accessibility.
- **18 Chromium checks** pass, including the prior ten. The new suite covers repeated failed submits, Tab exit and link activation, input/textarea/select/Radio/Checkbox/date routing, preserved values, successful correction, title restoration, native reset, responsive heights/gaps, no auto-advance, forced-colour focus, 320px reflow, text-spacing overrides and 200% root text size. Rendered axe checks include colour contrast and pass for the supplied failed-submit form.
- The packed archive contains **36 intended files**. Independent **React 18.3.1 and React 19.3.1** consumers compile positive/negative API cases and verify eleven components plus the pure date helper, SSR/hydration, stable IDs, summary sorting/routing/focus, title lifecycle, inline relationships and native reset. React act flushes hydration/effects deterministically; a fixed-delay fixture assumption was removed after a concurrent validation run exposed it. jsdom layout/scroll is stubbed in this fixture; actual layout/focus visibility is established by the browser checks.
- Canonical token build remains 407 raw tokens, 335 Studio tokens, 24 mapped groups, zero unmapped groups and zero broken retained aliases. Canonical compiled outputs are unchanged. Component YAML parsing and whitespace checks pass.
- The client production example builds successfully. Expected Vite warnings about ignoring use-client directives in an entirely client-rendered example do not alter the unbundled library directives. No package publication occurs.

Reproduce: npm ci, npm run build, npm run typecheck, npm test, npm run build:example, npm run test:browser and npm run verify:package. Install Playwright Chromium first; OWLA11Y_BROWSER_EXECUTABLE can select an existing test browser. Packed consumers require registry access. The existing CI workflow runs these checks. Use ?date-errors for the complete failed-submit example; ?forms and ?parity remain available.

## Remaining release acceptance

Manual NVDA, VoiceOver and TalkBack announcement checks remain open, especially one announcement per failed submit, group-versus-part context, dynamic errors and birthday autofill. Broader browser/mobile popup/focus behaviour, full zoom/text-spacing combinations and real Windows high-contrast testing remain launch work. Chromium reflow/root-text-size checks do not substitute for every browser's zoom or assistive technology. An axe pass applies to the supplied example, not every consumer palette/content combination. Hosts must keep current summary targets visible/enabled and supply correct unique IDs. Sticky-layout focus visibility and navigation-title integration must be checked in the consuming application. Full Next.js RSC acceptance remains open.
