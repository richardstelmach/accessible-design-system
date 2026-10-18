# Toast

**Status:** Draft · **Version:** 0.1.0

**Machine-readable specification:** [toast.yaml](toast.yaml)

**Component tokens:** [toast.json](../../tokens/components/toast.json)

**Decision evidence:** [research.md](research.md)

## Overview

Toast reports an event without interrupting the user's current task. Every Toast stays until the user dismisses it with the × button. There is no timed option, no duration setting and no disappearing action.

This is a deliberate design-system policy. WCAG can permit a timed notification when equivalent information and functionality remain available without a timer. Our Toast avoids making that an application-by-application prerequisite.

## When to use

Use Toast for concise event feedback, such as a completed save, an available download or a failed background upload. Use Alert for persistent contextual information already present in a page; use inline errors and Error Summary for validation. Put important outcomes and recovery controls in the relevant task UI as well.

This version contains a close control only. Actions, links, expiring Undo, required acknowledgement and high-volume notification feeds are outside its scope.

## Anatomy

1. Fixed status icon, hidden from assistive technology.
2. Canonical hidden state prefix and required title.
3. Optional description.
4. Always-present, named × button.

The title is a paragraph with `typography/body/default/strong`. Description uses `typography/body/default`. Neither becomes a heading because it looks prominent.

| State | Icon | Accessible prefix | Shared colour family |
|---|---|---|---|
| Success | check-circle | Success: | color.status.success |
| Info | info | Information: | color.status.info |
| Warning | warning-circle | Warning: | color.status.warning |
| Error | x-circle | Error: | color.status.error |

## Persistence and dismissal

There is no auto-dismiss or nondismissible variant. A new event cannot replace an earlier message, and reaching a capacity limit cannot silently evict it. Dismissal removes only the chosen ID. Escape also dismisses when keyboard focus is inside that Toast; Escape elsewhere has no Toast behaviour.

The host keeps active messages across in-app navigation while relevant. A full document unload ends the host lifetime, so important information must also have a durable home in the task UI.

## Announcement behaviour

| Choice | Live text semantics | Example |
|---|---|---|
| Polite — default | `role="status"` | Your changes were saved; We could not upload the file |
| Assertive — explicit exception | `role="alert"` | Connection lost; unsaved changes are at risk |

Visual state never selects urgency. An error is not automatically assertive. Both roles imply atomic announcements and their respective live priority; do not add redundant `aria-live` or `aria-atomic` attributes.

The host mounts two empty text-only announcers before events occur, then publishes a new message through exactly one. The visible notification list is not a live region. Do not put a live role on every item as well, nest live regions, announce the close button, or reread the list whenever it changes. The hidden announcement copy does not justify hiding the visible message from screen-reader navigation.

Batch a burst into a concise summary with its count and essential outcomes; preserve all distinct messages in the visible region. Distinguish repeated events by ID, not message text. Do not assume rapidly replacing announcer text produces reliable speech. Verify repeated identical text, bursts and interrupted speech in supported assistive technology.

### Integration sketch

The announcers exist empty at application startup. The notification below is added after the event; then its state, title and description are published once to the chosen channel. This is a markup sketch, not a working runtime implementation.

```html
<div class="visually-hidden" role="status" id="toast-polite"></div>
<div class="visually-hidden" role="alert" id="toast-assertive"></div>

<a href="#notifications">Notifications (1)</a>
<section id="notifications" aria-label="Notifications" tabindex="-1">
  <ol class="toast-list">
    <li class="toast toast--success" data-toast-id="save-42">
      <svg aria-hidden="true" focusable="false"><!-- check-circle --></svg>
      <div class="toast__message">
        <p class="toast__title">
          <span class="visually-hidden">Success: </span>Your changes were saved
        </p>
        <p>Your new settings are now active.</p>
      </div>
      <button type="button"
              aria-label="Dismiss notification: Your changes were saved">
        <svg aria-hidden="true" focusable="false"><!-- x --></svg>
      </button>
    </li>
  </ol>
</section>
```

Explicit activation of Notifications reveals and focuses the region. It is not an arrival-focus mechanism. The host supplies the dismissal handler, active count, announcement routing and focus recovery. Provide a persistent empty region or entry as a fallback after the final dismissal.

## Keyboard and focus

Arrival never moves focus. Tab reaches close buttons in chronological DOM order. Enter and Space use native button activation; pointer dismissal happens on activation, not pointerdown.

If the removed Toast contained focus, move to the next close button, otherwise the previous. If the last Toast is removed, return to the recorded origin when it is still available; otherwise use the persistent Notifications entry or region. If focus was outside the removed Toast, leave it there.

Use the shared two-part focus ring on every close-control pointer state. The target is at least `size.target.comfortable` in both axes, 44 × 44px at the reference root size. A 20px icon is not a 20px hit target.

## Region, layout and reflow

Provide a labelled Notifications region and a visible Notifications (N) entry while messages exist. Append new items in chronological order without reordering the focused message. The count does not need its own live region.

Use an in-flow stack or reserved notification rail. A desktop floating presentation is acceptable only if it cannot cover content or focused controls. Switch to in-flow when space is insufficient, including narrow screens, zoom and growing lists. Do not fix the stack over form controls or make older items inaccessible to preserve a compact overlay.

At a 320px viewport the Toast fits the 288px page-content width. Text wraps and height grows; do not truncate, clamp or shrink the close button. Use logical CSS and `overflow-wrap: anywhere` for long strings. Verify 200% text, 400% zoom, all WCAG text-spacing overrides, RTL and forced colours in the browser.

While a modal makes the notification host inert, defer nonurgent Toast delivery or route relevant feedback through the modal's accessible scope. Never announce an unreachable control behind the modal.

## Tokens

Six geometry aliases live in `component.toast`: inset, icon-to-content gap, title-to-description gap, stack gap, status-icon size and surface radius. Colours reuse the existing status and icon tokens. Close composes neutral compact Icon Button. Its focus treatment uses shared ring, separator and width tokens.

Every new token includes precise Figma scopes and exact Web syntax. Responsive text inherits the existing Breakpoint modes; Toast introduces no new collection, responsive branch or colour.

## Figma contract

`Toast` has eight variants: four `State` values × `Description=False|True`. Expose Title and Description text. The nested `_Toast/Close` has Default, Hover and Pressed states plus independent Focus. It reuses Icon Button and the registered x icon. Close visibility and icon choice are not consumer options.

Announcement priority, ID, dismissal name and callback are implementation metadata. There are no timing, urgency, heading or breakpoint visual axes.

Use the four standard documentation areas. Show every state, optional descriptions, routine versus urgent announcement examples, a persistent stack, close states and focus, narrow long content, inherited typography and labelled text-stress examples. Documentation and QA use instances, not additional production variants.

## Content guidance

Lead with the outcome: “Your changes were saved” or “We could not upload the file”. Use the description for the consequence or the next step in the task UI. Do not say only “Success”, “Error” or “Something happened”. Keep content plain text and concise; long material belongs in the task context.

## Accessibility and release checklist

- [ ] No timeout, automatic replacement, capacity eviction or hidden close button.
- [ ] State has a textual equivalent, not colour alone; decorative SVGs do not receive focus.
- [ ] Each close button has a contextual, localised accessible name and comfortable target.
- [ ] Polite is default; assertive is intentional and independent of visual state.
- [ ] One text-only announcement owner; no duplicated live region or reannouncement on dismissal.
- [ ] Repeated events and bursts remain understandable and recoverable in the region.
- [ ] Focus stays put on arrival and recovers predictably when a focused close button is removed.
- [ ] Notification-region access, modal scoping and in-app navigation are verified.
- [ ] Text, icons, focus, narrow layout, text resizing, zoom, spacing, RTL and forced colours pass.
- [ ] NVDA, JAWS and VoiceOver combinations are tested in the production implementation.

Figma and token validation cannot verify browser announcements or keyboard behaviour. Production runtime work and its assistive-technology checks remain a release gate. GitHub merge, Tokens Studio pull/export and library publication are separate workflow checkpoints.

## Design validation record

Built on 18 October 2026 in [25 - Components - Toast](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk/Accessible-Design-System?node-id=1238-6). Start with the [documentation examples](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk/Accessible-Design-System?node-id=1238-135).

The structural audit passed eight Toast masters, three close-control masters, 19 Toast examples, six geometry aliases, 3,162 binding references and no visible overflow. Repeated text uses shared styles; four labelled QA text nodes deliberately override text sizing/spacing. Existing Breakpoint modes remain intact.

Status text contrast ranges from 7.43:1 to 7.52:1. Close-icon contrast ranges from 7.01:1 at rest to 3.42:1 when pressed; the shared focus ring has 4.52:1 contrast against its separator. Token compilation and an unchanged repeat build pass. No unrelated token values changed.

Source merged in PR #36. Richard completed the Tokens Studio pull/export on 18 October 2026 and reported no new variables. The post-export audit confirmed all six existing variable IDs, aliases, scopes, descriptions and Web references match the merged source. All eight Toast and three close-control masters remain intact, with no broken bindings, duplicate Toast variable names or visible overflow. This is a successful unchanged round-trip. Browser implementation and assistive-technology testing remain separate release gates.
