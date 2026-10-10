# Breadcrumb

**Status:** Draft — contract, tokens and Figma built; production implementation not started.

**Version:** 0.1.0

**Machine-readable specification:** [breadcrumb.yaml](./breadcrumb.yaml)

**Component tokens:** [breadcrumb.json](../../tokens/components/breadcrumb.json)

## Overview

Breadcrumb shows the current page's ancestors in the site hierarchy. It supports
orientation and navigation without replacing the page heading or main navigation.
The application supplies the path; it never comes from browser history, referrers
or recently visited pages.

## Accepted decisions

Richard accepted the research recommendations on 10 October 2026:

- Keep meaningful ancestor levels accessible.
- When the path overflows, allow native horizontal scrolling and offer **Show full path**.
- Expand the same hierarchy in place into a wrapping layout, with **Show compact path** to return.
- Wrap long labels within their own item in both presentations. Do not truncate with ellipsis.
- Represent an included current page as plain text, never a self-link.
- Make Home and current-page omission explicit page-level choices.

The [research notes](./research.md) distinguish Baymard's ecommerce evidence from
our proposed full-path accessibility enhancement. A mobile product page can omit
Home when the header has an obvious accessible home link, and omit the product name
when the page heading identifies it. Do not apply those omissions automatically to
all websites or remove meaningful intermediate ancestors.

## When to use

Use for pages within a meaningful hierarchy. Keep labels consistent with their
destinations. A concise editorial breadcrumb label can differ from a long page
title, but it must remain descriptive. Review unnecessary categorisation before
trying to solve every deep path through display changes.

History controls, Back to results, steppers, primary navigation, ellipsis menus,
disabled items and icon-only labels are outside this component's scope.

## Anatomy and API

| Part / property | Behaviour |
|---|---|
| `label` | Localised navigation landmark name; defaults to Breadcrumb. |
| `ancestors` | Ordered entries with a stable unique `id`, non-empty `label`, valid `href` and native anchor integration. |
| `currentPage` | Optional plain text appended after the ancestors, marked `aria-current="page"`. |
| `expanded` | User's presentation preference; defaults false after enhancement. |
| `onExpandedChange` | Optional callback for controlled presentation state. |
| Toggle labels | Localised Show full path and Show compact path strings. |
| Separator | Decorative slash before each item except the first. |

The component does not accept an arbitrary root navigation callback or infer
ancestor destinations from URL segments. Omit it when there are no ancestors.
When current-page text is omitted, the last ancestor remains an ordinary link
without `aria-current`. Do not duplicate the current page among the ancestors.

## Semantics

Use a named `nav` containing an ordered list of `li` items. Ancestors are native
anchors. Current-page text is a non-focusable span. Decorative slashes are hidden
from assistive technology. Preserve list semantics when removing visible markers.

The presentation toggle is a native `button type="button"` after the list, inside
the navigation landmark. Its `aria-controls` points to the stable trail container;
`aria-expanded` describes whether the full-path presentation is active. This changes
layout, not whether ancestor links exist. Do not use menu, tab, tree or stepper roles.

Illustrative markup, not a runnable implementation:

```html
<nav aria-label="Breadcrumb">
  <div id="breadcrumb-path" class="breadcrumb__viewport">
    <ol>
      <li><a href="/resources">Resources</a></li>
      <li>
        <span aria-hidden="true">/</span>
        <a href="/resources/design-system">Design system</a>
      </li>
      <li>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Breadcrumb</span>
      </li>
    </ol>
  </div>
  <!-- Render this only when overflow enhancement is ready and applicable. -->
  <button type="button" aria-expanded="false" aria-controls="breadcrumb-path">
    Show full path
  </button>
</nav>
```

## Responsive and long-content behaviour

Choose presentation from actual content width and available container space, not
item count or a hardcoded mobile breakpoint. Font loading, translations, item
changes and resizing can all change overflow.

**Inline:** the complete path fits, so no toggle is needed. **Scrollable:** confine
native horizontal overflow to the trail viewport, preserve every ancestor and keep
Show full path outside the scroller. A partially visible following item reinforces
continuation where present. Start at the logical beginning without moving focus.

**Expanded:** wrap the same list into rows. Keep each separator with its following
item. Never recreate links or alter their hierarchy order. Retain the same toggle
element and its focus while changing its label to Show compact path.

A long item is bounded by the available inner viewport width. Its text wraps and
height grows; long unbroken strings may break as a final safeguard. Never require
horizontal panning to read a single label, shrink text, clamp lines or hide its
meaning behind a hover tooltip. The compact trail may therefore become taller.

Remember the user's expanded preference across resizing. Determine whether the
compact path would overflow independently of the expanded layout. When overflow
vanishes, remove an unfocused toggle; if it holds focus, retain it until blur.
Deliberate collapse resets to the logical start and must preserve any focused link.

Before JavaScript enhancement and in print, show the complete wrapping path and
omit the toggle. Use instant layout changes; no animation is needed.

In RTL, use logical spacing, native direction and stable logical DOM order. Slashes
are direction-neutral; mixed-script labels may need bidi isolation. Do not assume
all browsers expose RTL scroll offsets in the same way.

## Keyboard, pointer and focus

Tab follows the ancestor links and then the toggle. Current text and separators
are not tab stops. Enter activates native links; Enter or Space operates the button.
There is no roving focus or custom arrow-key navigation.

Reveal the focused link and its entire focus indicator within the viewport. Keep
focus visible alongside hover and pressed states. Focus must not shift layout or
become obscured. Reserve clearance inside the clipped viewport for both focus rings.

Use native browser scrolling instead of custom drag handlers. Swiping, scrolling
and cancelled gestures must not activate links. Preserve modifier clicks, context
menus, new-tab behaviour and native routing integration. Do not navigate on focus
or pointerdown. Announce changes through the button's name and expanded state,
not a live region repeating the whole path.

## Tokens and visual states

Breadcrumb adds seven spacing aliases: item gap, separator gap, block and inline
target padding, expanded row gap, toggle gap and focus clearance. All include
canonical Figma scopes and exact Web syntax. No new responsive groups are needed.

Use the existing semantic link colours, body typography, focus ring and separator.
Ancestor labels remain underlined in Default, Hover and Pressed states. Focus is an
independent boolean. Current-page text and separators use the body text colour.

Targets use the existing comfortable 44px minimum block size and 24px minimum inline
size at the reference root size; these are scalable token values. This is standalone
navigation, not the inline-prose exception. Reuse the compact text Button for the
presentation toggle and allow its localised label to wrap in implementation.

The shared `component/breadcrumb/link` text style copies the body style and its
responsive bindings, then adds underline. The YAML records its reproducible recipe.
It is a composed Figma style, not a separate Tokens Studio typography token.

## Figma handoff

Built in [23 - Components - Breadcrumb](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk/Accessible-Design-System?node-id=1202-6).
Start with the [documentation examples](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk/Accessible-Design-System?node-id=1202-153).

- **Breadcrumb:** Inline, Scrollable and Expanded variants with one native Items slot.
- **Breadcrumb / Link:** Default, Hover and Pressed; one Label property, Show separator and independent Focus.
- **Breadcrumb / Current:** Label and Show separator, with no interaction states.
- **Full path toggle:** existing compact text Button instance; override its label text to localise.

Populate Items in hierarchy order. Hide the first separator and show subsequent
ones. Add Current only when the page context calls for it. Resize long items to the
viewport's inner width, with their target and text filling width and hugging height.

Layout selection is manual in Figma. Examples show visual states and native prototype
scroll regions, not working overflow detection or an interactive toggle prototype.
Switching Scrollable to Expanded was checked to preserve custom slot content and
labels. Real browser focus and state preservation remain implementation checks.

The four standard areas separate masters, usage examples, QA and accessibility.
Documentation uses shared Header and Card instances. The QA area shows 320px
viewports with page padding, long labels, pointer/focus combinations, responsive
text modes, enlarged label text and spacing simulations. RTL is documented as a
browser release gate; this page does not claim a validated RTL composition.

## Validation and release gate

Source compilation produces 380 raw and 308 Tokens Studio tokens, with 24 mapped
responsive groups and no unmapped groups or broken retained aliases. The component
adds seven spacing variables, one composed text style and seven masters in Figma.
The audit found no label overflow across 71 targets. All ordinary component and
documentation text uses shared styles; 12 explicit typography overrides belong only
to the labelled stress examples. Layout and pointer-state changes preserve content.
Text contrast on white is 7:1 for body, 4.52:1 for default links, 7:1 for hover and
10.87:1 for pressed links. The focus ring is 4.52:1 against its white separator.

This repository contains contracts and tokens rather than a runnable Breadcrumb
implementation. Keep `releaseReady` false until native scrolling, overflow detection,
keyboard handling, touch cancellation, screen-reader semantics, focus preservation,
320px reflow, 400% zoom, text resizing, all four text-spacing overrides, RTL and forced
colours pass in a browser. Figma appearance alone cannot certify those behaviours.

## Repository and sync state

Work is on local `feat/breadcrumb-contract`, based on fetched `main` at `a977e2c`.
The new variables were created from canonical local sources. GitHub source merge,
Tokens Studio pull/export and post-export audit remain pending. Figma library
publication is a separate checkpoint.

## References

- [Research findings and applicability](./research.md)
- [WAI-ARIA Breadcrumb pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/)
- [W3C full-layout alternative technique](https://www.w3.org/WAI/WCAG22/Techniques/general/G206)
- [Component documentation page](../../patterns/component-documentation-page.yaml)
- [Token sync workflow](../../docs/token-sync-workflow.md)
