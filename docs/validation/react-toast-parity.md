# React Toast comparison and validation

19 October 2026. Base: GitHub main `bbe58ade410d3b58598317cf778b3c02d727625b`, after PR #42 merged and local main matched origin/main. Canonical repository contracts and tokens remain authoritative.

## Scope and host API

The thirteen existing React components gain the Toast notification host: ToastProvider, ToastRegion, ToastNotificationsButton and useToast. This is sixteen named component exports plus the hook, rather than a new standalone Toast card API. There are no dependency, canonical-token or compiled-token changes. The package remains private and unpublished.

One provider owns the active chronological queue, stable generated region ID and exactly two initially empty text-only announcers. Exactly one persistent region and one entry are required before events can be added. Keep them in the app shell, outside dialogs and changing route content, in the same document. Nested providers, duplicate parts and a second provider in the document throw configuration errors. Lifecycle ownership and observer/timer cleanup survive Strict Mode replay. SSR accesses no browser globals and exposes the same empty host/IDs before hydration. There is no initial/history input: do not announce restored messages or replay add from mount effects.

`useToast().add({id,state='info',titleText,descriptionText?,announcement='polite',dismissLabel})` returns the required stable ID. Text is escaped; title/ID/dismiss label must be nonempty, descriptions must be strings, invalid enums and unsupported fields are rejected. IDs are checked synchronously, including multiple adds before React commits. Duplicate active IDs cannot replace messages; after explicit dismissal an ID may be reused. `dismiss(id)` removes only that ID; unknown IDs do nothing. Provider `onDismiss(id)` fires once per actual removal. No auto-dismiss, timer/duration input, capacity eviction, action slot, hidden close, rich content or icon swap is exposed.

Provider `regionLabel`, `emptyText`, complete `stateLabels`, `formatCountLabel(count)` and `formatAnnouncement(newEvents)` support localisation. Formatters must be pure and return nonempty text; custom burst summaries must include event count and essential outcomes. Host containers accept className; semantic/live/focus overrides are deliberately unavailable.

## Announcements, modal integration and focus

The roles status and alert supply their implicit live/atomic semantics, without redundant aria-live/aria-atomic. The visible ordinary list and nonfocusable items have no live role. Each title paragraph contains one visually hidden state prefix; status icons are decorative. The close button name is never copied into live text.

A 50ms delivery window clears committed live text, batches new events independently per urgency, and publishes one summary to each selected channel. This delivery scheduler never expires or removes a message. Counts cover every event; duplicate wording within one burst is spoken once, while every distinct ID remains visible. Separate identical-text events clear and repopulate the channel, and dismissal never republishes old messages. Removing a pending event cancels its unpublished delivery. Assertive is explicit and independent of visual error state; it does not wait behind a separate polite queue. DOM publication cannot guarantee that every assistive technology speaks every update.

The adapter detects native `dialog:modal` ownership both before scheduling and immediately before delivery. Both channels wait until the modal closes; the visible list can remain mounted behind native modal inertness without announcing unreachable controls. Immediate relevant/urgent feedback belongs inside the modal with one local owner. An older selector fallback conservatively treats any open dialog as blocking. An observer detects relevant host/modal DOM changes and a captured close event retries queued delivery. Custom ARIA modal systems must actually make the host inert and restore it. A host hidden only by a media/stylesheet change without a DOM mutation is not a supported delivery integration: keep it visible or provide accessible local feedback. No second modal announcement service is introduced.

Arrival never calls focus. Entry activation deliberately reveals/focuses the named region. The persistent zero-count entry and named empty region remain usable. Native Tab/Shift+Tab, Enter/Space and click operate the close buttons; pointerdown alone does not remove anything. Escape is handled only from inside the focused Toast, respects an already handled event and modal ownership, and has no global document listener. Removal of a focused item selects the next close in chronological order, otherwise previous, otherwise recorded usable origin, persistent entry or region. Hidden/inert/disabled/disconnected origins are rejected. Focus remains outside when the removed item did not contain it. Destinations scroll into view; consuming sticky/overlay layouts still need application acceptance.

## Source and Figma comparison

Sources: components/toast/toast.yaml and toast.md, tokens/components/toast.json, shared status/icon/interactive colours, size/spacing/radius and responsive typography. The previously provisional React host integration is now documented and typed. Toast's earlier token round-trip is complete; this batch requires no new export.

Figma file `dVFI0q1cXMtmjUAkdvSWkk`, page `1238:6`; Toast set `1238:15`, eight variants `1238:7`–`1238:14`; private close set `1238:34`, masters `1238:16`, `1238:22`, `1238:28`; documentation `1238:135`. Library discovery was performed first; the library search returned unrelated assets, so the canonical recorded IDs were inspected directly rather than substituting another component.

No production Figma changes or temporary nodes were needed. Inspection confirms four visual states × optional description, shared strong/body text styles, fixed registered icons, close interaction states/independent focus, six geometry aliases with exact scopes/Web syntax, and preserved global (329 variables) / Breakpoint (30, base/md/lg) collections. The existing documentation screenshot and browser's eight-state preview were visually inspected. See [machine-readable receipts](react-toast-figma-evidence.json).

| Property | Source / Figma / browser |
| --- | --- |
| Inset / icon-to-content gap | 16px / 12px |
| Title-to-description / stack gap | 4px / 8px |
| Surface radius / status icon | 8px / 24px |
| Neutral compact close target / x canvas | 44px / 20px |
| Body base/md; lg | 16px/24px line; 18px/27px line |
| Strong title | shared typography.emphasis.strong = 600 |
| Reference-height lg title-only / description | 76px / 90px |

Pixel equivalents assume a default 16px root. CSS uses the exact canonical Web references, with no new collection or responsive branch. Phosphor Regular status/x outlines reuse the registered Figma artwork (five decimal coordinate precision), and its existing MIT notice is retained/updated. Status surfaces use canonical foreground/background and icon tokens; close default/hover/pressed/focus reuses IconButton. Axe covers rendered colour contrast for all eight variants; source design contrast remains recorded in toast.md.

The browser caught a real combined 320px/doubled-root/text-spacing failure: fixed controls could squeeze the message column to zero. The region now supplies an inline-size container query; below 15em of usable container width, Toast stacks status icon, message and close in the same DOM/visual order. At the normal 288px narrow reference it retains the three-column appearance. Stress content remains entirely visible in document scrolling, with no clamp, cap, fixed height or shrinking close target. Forced colours retain system boundary, x and focus outline without forced-color-adjust:none.

## Automated evidence

- Build, package/example type checking and production client example pass. Positive and negative declarations cover the host, message text, required dismiss name and unsupported duration/semantic overrides.
- **70 unit/integration tests**, including thirteen Toast cases: configuration/unique ownership; plain content/ID policy; empty SSR and Strict Mode hydration/IDs; per-channel publication; 24-message chronology without expiration; repeated text and pending cancellation; localisation; next/previous/origin/fallback focus; background dismissal/global Escape isolation; modal deferral/race; host lifecycle cleanup and route rerenders.
- **45 Chromium checks** pass across the package, including eight Toast checks. They cover eight-state geometry, arrival focus, real Tab/Enter/Space/Escape recovery, pointerdown, repeated-text live DOM mutations, concise bursts, a simulated ten-minute lifetime, view changes, native modal deferral/Escape ownership, 320px reflow with doubled root text and all spacing overrides, DOM-order RTL, forced-colour focus, responsive typography and axe including contrast. After the final burst-wording simplification the eight Toast checks are rerun; CI reruns the complete suite on the exact PR commit.
- Independent **React 18.3.1 and React 19.3.1** consumers compile package declarations and verify DOM-free import/SSR, stable hydration/IDs, empty announcers, event delivery, deliberate region focus and final-dismissal focus in Strict Mode, alongside all prior component checks. The packed archive contains **46 intended files**. No npm publication.
- Token build remains **407 raw / 335 Studio**, 24 mapped groups, zero unmapped groups and zero broken aliases. Canonical token files and both compiled outputs are unchanged. Toast YAML parses; whitespace checks pass.

Reproduce: npm ci; npm run build; npm run typecheck; npm test; npm run build:example; npm run test:browser; npm run verify:package. Install Playwright Chromium or set OWLA11Y_BROWSER_EXECUTABLE. Registry access is required for independent packed installs. The runnable preview is `?toast`; all preview settings use OwlA11y components.

The existing Dialog SSR unit fixture emits an autoFocus hydration attribute warning under the current React 19/jsdom combination, and some older fixtures emit act-environment warnings. These are not new Toast warnings or test failures; Toast's dedicated hydration and packed-consumer checks pass. The client-only Vite bundle also reports its existing use-client warnings; package module directives remain preserved.

## Remaining release gates

Manual NVDA with Firefox/Chrome, JAWS with Chrome/Edge and VoiceOver with Safari must verify actual repeated speech, burst summaries, polite/assertive interruption, modal transitions and recovery. Native Safari/Firefox, touch, actual Windows high contrast, full browser 400% zoom, application sticky-layout focus visibility and translated content remain manual acceptance. Automated live DOM mutations establish publication, not speech. Container-query and native-dialog support form part of broader-browser acceptance. No complete Next.js/RSC integration acceptance is claimed.

The library is not ready to publish solely because these automated checks pass. Existing launch gates, including unrelated Tabs repeat-export acceptance, remain open. No Tokens Studio operation or Figma library publication was performed in this batch.
