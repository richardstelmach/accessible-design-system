# OwlA11y React

Local beta scaffold. Implemented exports: Button, IconButton, Link, TextInput, Textarea, Select, Fieldset, Checkbox, Radio, ErrorSummary and DateInput. React 18.3 and 19 are supported by the automated consumer checks. The remaining design-system families are not exported yet. This package stays private until release review.

```tsx
import { Button, TextInput } from '@owla11y/react';
import '@owla11y/react/styles.css';

<form>
  <TextInput label="Email address" name="email" type="email" autoComplete="email" />
  <Button type="submit" variant="primary">Continue</Button>
</form>
```

Button defaults to type=button, variant=default and size=default. IconButton requires an icon and aria-label or aria-labelledby; the referenced label must exist and be nonempty. Icons must be decorative SVGs without focusable descendants, title or controls. Link renders a real anchor and requires href and meaningful visible content. Native props, events and refs are retained; className on TextInput styles its field wrapper and its ref targets the input.

TextInput requires label and name. IDs are stable through SSR/hydration and generated unless supplied. It defaults to required. Use requirement="optional" for the localisable optional marker (optionalLabel). Supported purposes are text, email, tel, url, password and search. Placeholder text and accessible-name overrides are prohibited; use the visible label and helperText. width accepts full (default), 2ch, 3ch, 4ch, 5ch, 10ch or 20ch. Character measures reserve the answer width plus padding/borders and shrink to the container. Controlled inputs require onChange or readOnly; uncontrolled inputs support native form reset. A controlled form must reset application state itself.

Use helperText and error={{message, id?}} for associated descriptions. errorDescribedBy references an existing shared error without duplicating it. Do not combine it with an individual error. Disabled/read-only inputs suppress error presentation. Supplied IDs and external aria-describedby/aria-labelledby targets must remain unique and valid. Invalid configuration throws an actionable error in all builds; an application error boundary may present an appropriate fallback.

## Form composition

```tsx
import { Textarea, Select, Fieldset, Radio, Checkbox } from '@owla11y/react';

<form>
  <Textarea label="What happened?" name="notes" helperText="Include relevant dates." />
  <Select label="Country" name="country">
    <option value="">Select a country</option>
    <option value="gb">United Kingdom</option>
  </Select>
  <Fieldset legend="How should we contact you?" legendStyle="compact" helperText="Choose one.">
    <Radio label="Email" name="contact" value="email" required />
    <Radio label="Telephone" name="contact" value="phone" required />
  </Fieldset>
  <Checkbox label="Send me updates (optional)" name="updates" value="yes" />
</form>
```

Textarea and Select share TextInput's label/helper/error/requirement policy. Textarea supports readOnly, rows=5 as a native fallback, and vertical resizing; canonical CSS sets its height. Select uses native options/optgroups, with a first enabled empty-value prompt that lets users return to no selection. Supply an existing answer through value/defaultValue; do not use option.selected. Multiple selection, readOnly and custom popups are excluded.

Fieldset keeps its native legend first, with optional helper and one shared error before its children. Its visual legendStyle and semantic headingLevel are independent. Optional wording belongs in the legend string. Group errors describe the Fieldset, never every child. For a child-specific error, use errorAssociation="children" and error={{id:'location-error',message:'Error: Explain the location.'}}, then explicitly pass errorDescribedBy="location-error" to the affected TextInput, Textarea or Select. Unaffected controls remain neutral. Fieldset does not infer affected children or repeat the error. Keep supplied IDs unique.

Checkbox and Radio require label, name and a nonempty string value. Descriptions stay outside the label and do not toggle the input. Use checked/onChange for controlled choices or defaultChecked for native reset. Checkbox is optional by default; required means that particular Checkbox must be checked. Indeterminate is a DOM property independent of checkedness; native activation clears it and an aggregate owner updates the prop when children change. SSR cannot encode indeterminate before hydration. Radio group requirements/errors belong to Fieldset and the native radio group. There is no RadioGroup export or individual Radio error prop. A disabled Fieldset retains native submission/focus behaviour and descendant disabled styles.

Use native refs for every new component. className styles the field/choice wrapper, or the Fieldset itself. See [API details](../../docs/react-api.md) for finite values and prohibited combinations.

## Dates and failed submission

```tsx
import { DateInput, ErrorSummary, getDateInputIds } from '@owla11y/react';

const ids = getDateInputIds('birth-date');
// After a failed submission, render the summary and inline error together.
<>
  <ErrorSummary
    errors={[{ id: 'missing-year', text: 'Date of birth must include a year.', targetId: ids.year }]}
    focusRequestKey={1}
  />
  <DateInput id={ids.group} legend="What is your date of birth?" name="birth"
    purpose="date-of-birth" helperText="For example, 31 3 1980."
    defaultValue={{ day: '31', month: '3', year: '' }}
    error={{ message: 'Date of birth must include a year.' }}
    errorAssociation="children" invalidParts={['year']} />
</>
```

Use a new focusRequestKey on every failed submit; rerendering the same key does not refocus. Omit the key for passive display. Remove the summary when errors resolve: its document-title prefix is then restored. Keep each inline error rendered alongside the summary. Items are deduplicated and sorted by target document order after commit. Targets must be unique, visible and enabled native controls. For a whole-date error, use targetId=ids.day and contextId=ids.group to scroll the legend before focusing Day. Part-specific errors use the affected part's ID and its own label. Summary uses focus-only announcements with tabIndex=-1; untested alert/live-role overrides are excluded.

DateInput uses native text inputs with numeric inputmode and preserves raw strings. It never parses, pads, clamps or moves focus while typing. value/onValueChange(next,{part}) is controlled; defaultValue uses native reset. A controlled host must reset its state. required defaults to true; false appends optionalLabel to the supplied legend and makes all three parts optional. Do not include the same suffix yourself. purpose=date-of-birth is for the user's own birthday; date (default) omits birthday autocomplete. labels localises Day/Month/Year; partNames supplies distinct submission names. An explicit form owner applies to all parts. The ref targets Day and className styles the fieldset. Disabled/read-only applies to the complete component and suppresses stale error presentation.

Calendar and business validation belongs to the consuming form at explicit submission. The runnable ?date-errors example demonstrates Gregorian month/leap-year checks and a birth date in the past, while retaining entered text. Its validator is example code, not a public package API. See [comparison and acceptance evidence](../../docs/validation/react-date-errors-parity.md).

## Styling

The stylesheet includes the canonical light tokens and responsive typography. No Tailwind, global reset, telemetry or font download is included. Install licensed Inter separately or accept the system sans-serif fallback.

Override consumed variables on a parent container, for example --color-interactive-primary-background or --form-control-background. To override primitive tokens and recompute their dependent aliases, add the owla11y-theme class to the container and declare overrides after the library stylesheet. Never override the internal --owl-button-* properties; use canonical variables. Custom palettes require contrast verification.

## Local development

From the repository root:

- npm ci: install the committed lockfile.
- npm run build: validate canonical tokens, generate CSS and compile ESM/declarations.
- npm run typecheck: positive and negative API type checks.
- npm test: interactions, automated markup accessibility and hydration checks.
- npm run verify:package: pack locally and verify fresh React 18.3 and 19 consumers; requires registry access.
- npm run dev: open the local preview at the address printed by Vite.
- npm run build:example: compile the preview for production.

The public root exports only implemented components and types; styles.css is a separate export. React is a peer dependency. Component modules preserve use-client directives through the TypeScript build; the root barrel is not globally marked client-only. Client application bundlers may intentionally ignore these directives.

Automated accessibility checks exclude contrast in jsdom. Screen-reader/browser combinations, full zoom/text spacing, contrast and visual parity still need the release audit. Do not claim certification or application conformance from these tests.

## Source comparison

See [core parity report](../../docs/validation/react-core-parity.md) for source references, corrected differences and recorded Figma/source disagreements. Use the local preview with ?parity for the state/size comparison matrix. npm run test:browser runs reproducible Chromium checks (install the browser with npx playwright install chromium first). Inter is installed only in the preview, not bundled or fetched by the library.

The next five components have a separate [form comparison report](../../docs/validation/react-forms-parity.md) and a runnable ?forms preview with integrated submission/reset, shared errors, disabled states and long content. Phosphor Regular indicator artwork and its licence are recorded in THIRD_PARTY_NOTICES.md.

ErrorSummary and DateInput have a [date/error comparison report](../../docs/validation/react-date-errors-parity.md) and a runnable ?date-errors preview. Type checks now include the actual examples as well as package consumers.
