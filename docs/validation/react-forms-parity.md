# Form React components: source comparison and validation

18 October 2026. Implements Textarea, Select, Fieldset, Checkbox and Radio after the first four exports. GitHub component YAML, shared form patterns and canonical tokens govern the implementation; Figma provides the visual reference. This is a private beta implementation, not a release-conformance claim.

## Source baseline and Figma inventory

Fetched GitHub main before branching and confirmed the checkout matched commit `49acf49a9d91e2ed765ce98aabb5efa46a8884d1`. The baseline source blobs were:

| Source | Git blob | Figma set | Variants |
| --- | --- | --- | --- |
| [Textarea](../../components/text-area/text-area.yaml) | `3a17ac0a57e308af2a1cec9d3fba51cbc61e3818` | [359:8013](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk?node-id=359-8013) | 12 |
| [Select](../../components/select/select.yaml) | `9891f5b4511c9ae041d92580aeb000f5f9f06598` | [384:1122](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk?node-id=384-1122) | 10 |
| [Fieldset](../../components/fieldset/fieldset.yaml) | `e38de9c6bd03b378b12fe8c31e5d6b87f4817130` | [485:1699](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk?node-id=485-1699) | 2, plus 15 internal legend variants |
| [Checkbox](../../components/checkbox/checkbox.yaml) | `0c5de7e0419df076e32abdbb74e224306e33f235` | [710:3450](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk?node-id=710-3450) | 15 |
| [Radio](../../components/radio/radio.yaml) | `2c0016a9a2c72e06422401e0e46ef054e848f4e6` | [582:73](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk?node-id=582-73) | 6 |

Shared references include [single-control pattern](../../patterns/forms/single-control-pattern.md), [grouped-control pattern](../../patterns/forms/grouped-control-pattern.md), [required/optional policy](../../patterns/forms/required-and-optional.md), [validation](../../patterns/forms/validation-and-errors.md), and the [icon registry](../../icons/registry.json). The component contracts now record the React adapters alongside their existing framework-neutral semantics.

Live inspection covered the complete variant/property inventory, representative geometry, text styles and variable bindings. Representative masters were visually inspected. This was not an exhaustive screenshot-difference comparison of every state. The opened native Select menu remains browser/OS controlled and is not a Figma popup specification.

## Implementation decisions and comparisons

| Area | Source rule and result |
| --- | --- |
| Textarea | Native textarea, required by default, rows=5 fallback, 160px initial height and 128px minimum, vertical resizing without a maximum height. Label/helper/error order and native readOnly semantics follow TextInput. |
| Select | Native single select; enabled empty-value first prompt, explicit stable string option values, plain text option labels and labelled optgroups. Controlled value/defaultValue belongs to React, never option.selected. Required/optional follows the single-field policy. Native size is omitted or 1 and tabIndex is omitted or 0. |
| Fieldset | Native legend remains the first direct child, with helper, one shared error and consumer controls following as siblings. Plain legend is the default; visual style and heading level remain independent. Header-to-content gap is 24px, including error state; header gaps are 4px. |
| Error ownership | Group mode describes only the Fieldset. Children mode requires an explicit error ID and explicit references on affected enabled controls; it never clones children or assigns an error to every choice. |
| Checkbox | Optional unless independently mandatory. Checkedness controls submission; indeterminate is a separate DOM property. Individual errors are distinct from Fieldset selection-rule errors. Description and error stay outside the label. |
| Radio | Native same-name selection and keyboard behaviour. No preselection for a new answer, no individual error/indeterminate API and no RadioGroup wrapper. Option descriptions do not become part of the accessible name. |
| Choice geometry | 24px square/circular controls, 20px Checkbox indicator and 12px Radio indicator. Responsive labels produce 48/48/51px plain rows across base/md/lg, with 12px vertical padding and the 44px minimum. |
| Disabled groups | Native fieldset disabling controls focus and submission; CSS uses effective :disabled. A private context suppresses unavailable errors in library descendants, including TextInput. |
| Indicators | Existing Phosphor Regular caret/check/minus artwork is reused; its MIT notice is included in the package. Forced colours restore the native Select indicator and retain choice outlines/selection indicators. |

## Figma reconciliation

Two existing single-field constructions drifted from the source. Repairs were made in place and recorded as durable construction recipes in their YAML:

- **Textarea:** all twelve masters used a uniform 4px root gap, including the error-to-control transition. Added twelve ordinary `_Textarea/Header` layout frames to keep internal label/helper/error gaps at 4px, with an 8px error-to-control gap and 4px otherwise. The existing 160px height and 128px minimum remain unchanged. All ten existing page instances were checked for control/header overflow; no issues were found by the recorded audit.
- **Select:** all ten masters used a uniform root gap and fixed 44px control height despite 12px vertical padding and responsive text. Added ten ordinary `_Select/Header` frames and the same single-field error gap rule. Removed the fixed-height binding, retained the 44px minimum, included borders in layout and allowed height to hug content. A clipped `Value viewport` keeps values on one line while reserving the existing indicator space. The shared `form/control/typography` style and its responsive font binding were restored after the layout edits, then verified on every master. Final base/md/lg heights are **50/50/53px**. All seventeen existing page instances were checked for control/header overflow; no issues were found by the recorded audit.

Public component IDs, variant axes, property definitions, existing shared style IDs and canonical token values were preserved. Fieldset, Radio and Checkbox required no Figma construction changes in this comparison. Their representative base/md/lg geometry was verified. The final variable inventory remains **329 global variables** and **30 Breakpoint variables** with base/md/lg modes. All temporary measurement instances were removed. No Tokens Studio export or token migration was needed; no Figma library publication was performed.

The [machine-readable evidence](react-forms-figma-evidence.json) contains baseline inventory, affected IDs and final audit receipts. One intermediate Select measurement preceded restoration of the responsive binding; the final binding receipt supersedes those intermediate heights.

## Validation

- Canonical token build passes: 407 raw tokens, 335 Studio tokens, 24 mapped responsive groups, zero unmapped groups and zero broken retained aliases. Committed canonical compiled outputs remain unchanged.
- Type checking covers native refs/events, controlled/uncontrolled ownership, required labels/values, supported enum values and prohibited combinations. Independent packed consumers compile the same positive/negative API cases with each React major's typings.
- **27 Vitest tests** cover the original components and new native form behaviour, controlled selection, value/reset/submission, disabled/read-only states, description/name separation, shared error ownership, unique IDs, SSR/hydration, Strict Mode ref/indeterminate lifecycle and automated markup accessibility.
- **10 Chromium tests** cover the original parity matrix and new responsive geometry, Fieldset/single-field spacing, native Select type-ahead, Radio arrow keys and Tab exit, Checkbox Space, submission/reset, initially unselected Radio indicators, indeterminate state, forced-colour focus, 320px reflow, text-spacing overrides and 200% root text size. The integrated form passes rendered axe checks with colour contrast enabled. The narrow screenshot was visually inspected for clipping and alignment.
- The actual npm archive contains 28 intended files, including declarations, styles and both licence notices. Independent **React 18.3.1 and React 19.3.1** consumers pass types, all nine exports, SSR/hydration, stable IDs, native reset and Fieldset/choice relationships. No publication occurs.
- Client production build, component YAML parsing and whitespace checks pass. Fully client-rendered Vite examples emit the expected warnings about ignoring use-client directives; the unbundled library preserves them.

Reproduce from the repository root: `npm ci`, `npm run build`, `npm run typecheck`, `npm test`, `npm run build:example`, `npm run test:browser`, and `npm run verify:package`. Install Chromium through Playwright first; the browser configuration accepts `OWLA11Y_BROWSER_EXECUTABLE` for an existing installation. The packed-consumer check needs npm registry access. CI runs the same commands for this branch.

The development preview uses `?forms`; the original comparison remains at `?parity`.

## Remaining release evidence

Manual NVDA, VoiceOver and TalkBack checks remain open, including group/legend announcements, option descriptions, dynamic errors and indeterminate announcement. Full Firefox/Safari/mobile, native Select popup behaviour, browser zoom, text-spacing combinations and real Windows high-contrast checks remain part of launch acceptance. A Chromium axe pass covers the supplied example, not every consumer palette, content combination or application. SSR/hydration checks do not establish a complete Next.js RSC integration. Indeterminate cannot be encoded in server HTML and becomes available after hydration. ErrorSummary and DateInput integration remain the next implementation batch.
