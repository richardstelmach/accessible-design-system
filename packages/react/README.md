# OwlA11y React

Local beta scaffold. Implemented exports: Button, IconButton, Link, TextInput, Textarea, Select, Fieldset, Checkbox, Radio, ErrorSummary, DateInput, Dialog, Tabs, Alert, Badge, Stepper, Accordion, Card, Breadcrumb and Pagination, plus ToastProvider, ToastRegion, ToastNotificationsButton and useToast. React 18.3 and 19 are supported by the automated consumer checks. All current component families are implemented, including the native Dialog backdrop through CSS. Manual release acceptance remains open. This package stays private until release review.

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

## Dialog

```tsx
const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>Edit profile</Button>
<Dialog open={open} onOpenChange={setOpen} title="Edit profile"
  actions={<><Button onClick={() => setOpen(false)}>Cancel changes</Button>
    <Button variant="primary" form="profile" type="submit">Save profile</Button></>}>
  <form id="profile" method="dialog" onSubmit={event => {
    // Prevent submission here if service validation fails.
  }}>
    <TextInput name="display-name" label="Display name"/>
  </form>
</Dialog>
```

Import Dialog with the other named exports; this snippet belongs inside a React component. Native field validation runs before submission. A prevented method=dialog submit leaves the modal open. Other forms can submit normally; the application closes only after successful work. Close requests report close-button/escape/backdrop/action; prop changes and consumer-owned action callbacks do not manufacture another request. No dismissal commits data.

The default is medium/inset/dismissible with a close control. size is small/medium/large; presentation=fullscreen fills the viewport below 48rem and respects safe areas. Title typography is responsive H3 (20/24/30px), while headingLevel=2..6 selects semantics. Supply accessibleLabel when showTitle=false or there is no title. Forced decisions require dismissal=forced-decision, no close control, and actions with an enabled native button that resolves the flow. You own that handler and must keep it available.

The native dialog ref supports focus/measurement; open is controlled through props and showModal is managed internally. One modal may be open per document. No descendant autoFocus or positive tabIndex. Browser-supported open shadow roots participate in tab boundaries; closed shadow roots are outside the inspected content contract. Native autofocus has a compatibility focus fallback, with manual screen-reader acceptance still pending. Use returnFocusRef for a logical destination when a trigger is removed/disabled; navigation flows own destination focus.

Dialog uses the MIT tabbable runtime dependency. It locks underlying page overflow and restores original inline styles. Importing package CSS adds no global reset or fonts. The shared Modal backdrop is native ::backdrop CSS, not an additional React export. See the [comparison report](../../docs/validation/react-dialog-parity.md) and preview at ?dialogs.

## Tabs

```tsx
import { Tabs } from '@owla11y/react';

function ProfileSections() {
  return <>
    <h2 id="profile-sections">Profile information</h2>
    <Tabs labelledBy="profile-sections" headingLevel={3} items={[
      { id: 'details', label: 'Details', heading: 'Details', content: <p>Your current details.</p> },
      { id: 'history', label: 'History', heading: 'History', content: <p>Earlier changes.</p> },
    ]}/>
  </>;
}
```

Use at least two sections with unique stable IDs, distinct plain-text labels, heading strings and body content. The component renders the heading; do not repeat it at the start of content. headingLevel defaults to 3 (2–6 supported), with responsive H3 styling. Prefer labelledBy for an existing visible contextual heading; otherwise use label. The ref targets the root div.

Selection defaults to the first item. defaultSelectedId is initial-only. For controlled selection, supply selectedId and onSelectedChange(id), omit defaultSelectedId, and keep ownership fixed. The owner may decline requests. Unknown explicit keys and invalid configuration throw actionable errors. If an uncontrolled selected key is removed, the first remaining item is used; the application owns focus when removing content.

Automatic activation follows focus for content that displays immediately. activation=manual lets arrows/Home/End move focus while Enter/Space/click selects. Tab exits the list for the selected panel, its content, then the rest of the page. Hidden panel DOM stays mounted, retaining entered values and React state. Keep essential instructions and required cross-panel validation outside this initial API. Lazy loading, disabled/nested/vertical tabs and URL/history synchronization are not included.

SSR starts with ordinary OwlA11y Link anchors and every section visible. Enhancement happens after measurement, only at/above 48rem when the full row fits its container. Missing layout/observer support retains the baseline. Narrow/overflow fallback removes widget semantics and preserves focus; re-enhancement selects the focus-containing section before hiding others. If a controlled owner declines that selection, all sections remain visible until the conflict ends. Print shows every section.

See [source/Figma comparison and validation](../../docs/validation/react-tabs-parity.md) and the runnable ?tabs preview. Manual assistive-technology and broader browser checks remain release work.


## Toast

```tsx
import { Button, ToastProvider, ToastNotificationsButton, ToastRegion, useToast } from '@owla11y/react';

function SaveFeedback() {
  const { add } = useToast();
  return <Button onClick={() => {
    // Invoke after the save succeeds, with a distinct event ID.
    add({ id: crypto.randomUUID(), state: 'success', titleText: 'Your changes were saved',
      descriptionText: 'Your new settings are now active.',
      dismissLabel: 'Dismiss notification: Your changes were saved' });
  }}>Report completed save</Button>;
}
function AppShell() {
  return <ToastProvider>
    <SaveFeedback />
    <ToastNotificationsButton />
    <ToastRegion />
  </ToastProvider>;
}
```

Mount exactly one provider, region and entry per document, outside dialogs and changing route content. Both host parts stay visible/in flow, including the empty state. The provider retains active messages across route changes while it stays mounted; full document unload ends its lifetime. No historical or initial-message API is provided. Call add from a new event after the complete host mounts, not during render or a mount effect replay. `add(message)` returns its required stable ID; duplicate active IDs and unsupported message fields throw. `dismiss(id)` removes only that ID; unknown IDs are no-ops. Provider `onDismiss(id)` observes actual removals.

All content is plain text; titles and contextual dismissLabel are required. State defaults to info; announcement defaults to polite independently of visual state. Assertive is an explicit urgent exception. No timer, duration, action slot, hidden close, replacement or count limit is supported. The 50ms delivery scheduler batches new events separately per priority and resets live text between separate identical announcements; it never removes messages. Dismissal does not republish the list. Burst summaries contain the event count and new outcomes (identical outcomes are spoken once within that burst), with all messages retained in chronological order. DOM delivery is not a guarantee that every assistive technology speaks every update.

Arrival preserves focus. Explicit entry activation focuses the named region; normal Tab visits each close button. Escape only dismisses the focused Toast. Removing a focused item chooses the next close, then previous, then a usable recorded origin or persistent entry/region. Background removal preserves external focus. Keep the host mounted and usable; the application owns focus when removing its entire shell.

Both announcement channels wait while a native modal owns the document. The list may already be mounted behind modal inertness, but no unreachable message is announced. Put immediate relevant/urgent feedback inside the modal with one announcement owner; an app-shell Toast is not a substitute. Native `dialog:modal` detection integrates with OwlA11y Dialog and external native dialogs; unsupported selectors conservatively defer for any open dialog. Custom ARIA modal systems must make the host inert and restore it on close. If hiding is controlled by stylesheet/media changes without DOM mutations, render the host visible or publish the outcome in an accessible local scope instead.

Localise `regionLabel`, `emptyText`, the complete `stateLabels` map, `formatCountLabel(count)` and, if needed, `formatAnnouncement(newEvents)`. Custom announcement formatters receive only one priority's new messages and must return nonempty text including count and essential outcomes for bursts. They must be pure. Entry text is derived from the count; role, live, timing, icon and content overrides are deliberately unavailable. Style host containers through className and canonical token overrides.

See [comparison and validation](../../docs/validation/react-toast-parity.md), the runnable `?toast` preview and the remaining manual screen-reader/browser release gates. No npm publication is performed.


## Alert and Badge

```tsx
import { Alert, Badge } from '@owla11y/react';

<Alert state="info" titleText="Applications close on Friday"
  descriptionText="You can save your answers and return before the deadline." />;
<Badge tone="success" label="Completed" />;
```

Alert defaults to info, a strong paragraph title and announcement=none. Its fixed decorative icon and one visually hidden state prefix convey the state without relying on colour. Required titleText and optional descriptionText are escaped strings; blank descriptionText omits the paragraph. Use headingLevel=2 through 6 only when the title introduces a real section; matching responsive heading tokens supply its appearance. H1 is forbidden. A complete stateLabels map can localise each prefix including punctuation. Ref targets the ordinary div; Alert never moves focus or dismisses itself.

Alert's announcement can explicitly select polite (status) or assertive (alert), independently of visual state. Use these for appropriate new outcomes, never to announce historical/static content. A newly mounted populated polite region does not guarantee speech. For reliable update structure, keep an empty application announcement container mounted before the event, then render/update Alert inside it with announcement=none. This preview strategy is shown at ?feedback; exactly one element owns the live role. Do not also announce the outcome through Toast or validation feedback. Manual screen-reader acceptance remains necessary.

Badge defaults to neutral and supports info/success/warning/error tones. Its visible nonempty string label supplies all meaning; no hidden tone text, icon, live role or interaction is added. The span ref targets ordinary phrasing content. Keep labels concise and meaningful without colour; do not use it as a counter, link, button or removable chip. Small-body text wraps without truncation within min(parent width, 15rem). The application owns any needed announcement of a dynamic status change.

Both components accept id, className, style, lang, dir and data attributes for layout/testing. Native behavioural props, event handlers, ARIA/role/focus overrides, polymorphism and arbitrary children/HTML slots are intentionally unavailable. Container styles and token overrides must preserve accessibility. Invalid text, enum values and unsupported runtime props throw actionable configuration errors.

See [source/Figma comparison and validation](../../docs/validation/react-feedback-parity.md). Figma's Alert default and shared H6 line height were reconciled to GitHub; Badge required no production repair. All IDs remain intact. Package publication and manual release acceptance remain separate steps.

## Stepper and Accordion

```tsx
import { Accordion, Stepper } from '@owla11y/react';

<Stepper label="Number of rooms" name="rooms" min={1} max={10} step={1}
  defaultValue="2" helperText="Choose a whole number from 1 to 10."
  incrementLabel="Add a room" decrementLabel="Remove a room" />;
<Accordion headingLevel={3} defaultExpandedIds={['delivery']} items={[
  { id: 'delivery', title: 'Delivery information', content: <p>Delivery details.</p> },
  { id: 'returns', title: 'Returns', content: <p>Return instructions.</p> },
]} />;
```

Stepper is a native number field between decrement/increment IconButtons. Supply a positive finite step and contextual button names. Its ref targets the input; requirement defaults to required, with the usual optional/helper/error policy. min/max are finite when supplied and min must not exceed max. Initial nonempty values must be finite, in range and step-aligned. Empty and later invalid edits stay editable; service validation belongs to the host. value and defaultValue are raw strings. Controlled value requires onValueChange(raw,{source:'input'|'increment'|'decrement'}); uncontrolled values support native form reset. A controlled host owns reset and may decline requests. No onChange/onInput second value owner, readOnly, placeholder or custom spinbutton ARIA is supported.

Native stepUp/stepDown preserves browser decimal and step-base rules. Valid matching min/max values disable the corresponding button; whole-control and Fieldset disabling disable all three controls. Activation keeps button focus unless that button becomes unavailable, when focus returns to the input after commit. One mounted polite status announces eligible button changes; direct typing/Arrow changes and the input-focus fallback do not duplicate speech. formatValueAnnouncement(raw,label) can localise the complete result. The fixed Minus/input/Plus visual and DOM order is retained in RTL. Native number spinners remain available; platform appearance varies.

Accordion uses explicit headingLevel=2..6 and independent expansion: none, one or all may be open. titleStyle defaults to the matching heading; a visual override does not change its semantic level. Every item needs a unique stable nonempty id, plain title and content. defaultExpandedIds is initial-only. For controlled expansion, supply expandedIds/onExpandedChange and omit defaults; the owner may decline. Ref targets the root div. panelLandmark=false uses ordinary div panels; true opts into named regions for substantial sections.

Server/no-JavaScript content consists of ordinary headings with every body visible. After enhancement, native buttons use normal Tab/Enter/Space; there is no roving/arrow navigation. Hidden panels remain mounted, retaining form and React state. Enhancement protects focused baseline content in addition to the requested defaults. External collapse moves focus to the panel's trigger before hiding it. Print shows every body without changing expansion state. To reveal an error/deep-link target, the application must expand its section and wait for actual visibility before focusing; the preview demonstrates this. Keep essential instructions and cross-section required validation outside hidden panels. Single-open mode, disabled items, arbitrary header slots, nesting, lazy loading and animation are outside this initial API.

See [source/Figma comparison and validation](../../docs/validation/react-controls-parity.md) and the runnable `?controls` preview. Settings use OwlA11y Select, Checkbox and Button. Automated results do not close manual screen-reader, Safari/Firefox or release acceptance.

## Card, Breadcrumb and Pagination

```tsx
import { Badge, Breadcrumb, Card, Pagination } from '@owla11y/react';

<Card title="Accessible resources" headingLevel={3} titleHref="/resources"
  wholeCardClickable layout="horizontal"
  image={{ src: '/resources.jpg', alt: '', width: 800, height: 450 }}
  imageBadge={<Badge label="New" tone="info" />}>
  <p>Guidance and practical examples.</p>
</Card>;
<Breadcrumb ancestors={[
  { id: 'home', label: 'Home', href: '/' },
  { id: 'resources', label: 'Resources', href: '/resources' },
]} currentPage="Guidance" />;
<Pagination currentPage={3} totalPages={10000}
  pageHref={page => `/results?filter=accessible&page=${page}`}
  pageJump jumpForm={{ action: '/results', pageName: 'page',
    hiddenFields: [{ name: 'filter', value: 'accessible' }] }} />;
```

Card's ref targets its ordinary div. headingLevel defaults to none (strong body title); explicit levels 2–6 follow page structure. titleStyle=compact uses H5 appearance without changing semantics. titleHref requires title and wholeCardClickable requires that real title link. The enhanced surface forwards only eligible completed pointer activation; text selection, slow clicks, scrolling/drag/cancelled gestures, modifiers, native controls and opt-out regions remain independent. Native title attributes/events belong in titleLinkAttributes. No root action, widget role or tab stop is provided. Use data-owla11y-card-ignore on opaque integration/shadow hosts when needed. Intrinsic images reserve space, may cover or contain, and use explicit alt. One OwlA11y Badge may overlay an image. Horizontal layout requires the canonical 32rem of available inner container width; smaller/unsupported containers use vertical layout. Slots own internal paragraph spacing; absent sections leave no gap.

Breadcrumb's ref targets nav. Supply the complete meaningful hierarchy as unique keyed ancestor links, with optional plain currentPage. Empty ancestors omit the landmark. The component keeps every ancestor, measures actual overflow and offers native scrolling with Show full path. Expanded presentation wraps the same anchors in place. Controlled expanded/onExpandedChange excludes defaultExpanded; uncontrolled preference defaults false and survives resizing. A focused toggle remains until blur if overflow ends. Labels can localise the landmark and both toggle states. SSR/no-JS, missing measurement support and print retain the complete wrapping path. Native keyboard/link behaviour remains intact; there is no ellipsis menu, roving navigation or live repetition of the trail.

Pagination's nav ref exposes known-total native navigation. currentPage and totalPages must be safe integers and in range; zero uses sentinel currentPage=1 and zero/one page renders nothing. The seven-position window stays bounded for huge totals. presentation=auto uses measured label widths; compact retains summary, Previous/Next and First/Last, while explicit numbered may wrap. Focused numbered controls are not hidden during resize. Exactly one visible current marker identifies the page. labels can localise text and number/page/summary/help/error/no-op formatters; formatPageLabel includes the complete displayed number. No unknown-total or cursor approximation is supplied.

Optional pageJump requires the explicit jumpForm GET configuration in the example; preserve filters/sorting through hiddenFields and never nest the generated form. The required text field has numeric inputMode and 20ch maximum content width. Before enhancement native required/pattern validation applies. Enhanced validation checks the entire trimmed ASCII integer, associates/focuses errors, and politely reports a current-page no-op without moving focus. Formatting numbers does not add a localised-digit parser. All navigation uses pageHref. Native anchors remain the fallback. Optional onNavigate(page,{href,source}) handles ordinary enhanced link/jump requests; the consuming application owns currentPage, loading/failure/stale requests, URL/history, titles, success focus and history restoration. Alternate-target, modified and download links remain native. linkAttributes(page) supplies native link integration.

See [source/Figma comparison and validation](../../docs/validation/react-navigation-parity.md) and the runnable `?navigation` preview, including explicit success/failure/history integration. All current component families are now implemented; the package remains private pending manual release acceptance.


CodeBlock is implemented with required plain-text `code` and visible `label`, optional `copyable` (true), partial `labels` localisation and successful-copy `onCopy(code)`. Its ref targets the wrapper div. It reuses IconButton, preserves exact clipboard text, provides persistent visible polite feedback and adds a named code tab stop only for measured overflow. SSR and print wrap content; SSR omits inactive copy controls. See [the canonical CodeBlock contract](../../components/code-block/code-block.yaml) and the CodeBlock validation report. Source/Figma reconciliation and the exported token foundation are recorded in the CodeBlock validation report. Manual screen-reader acceptance and publication remain release gates.
