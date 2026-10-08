# Card

**Status:** Draft — contract and Figma phase; production implementation not started.

**Version:** 0.1.0

**Machine-readable specification:** [card.yaml](./card.yaml)

**Component tokens:** [card.json](../../tokens/components/card.json)

## Overview

Card groups related content about one subject inside a consistent surface. Images,
titles and actions are optional. One family covers vertical and horizontal layouts.
An empty shell is available for composition through the Content slot.

The container never becomes a focusable widget. Optional JavaScript enhancement
makes the non-interactive surface activate the real title link. Keyboard users and
assistive technology follow ordinary HTML structure and operate the actual controls.

## Accepted decisions

- One public Card family, with reusable nested Title and Media parts.
- Vertical media uses 16:9; horizontal media uses a square, 12rem column.
- Horizontal layout begins at 32rem of available container width. Below this it
  becomes vertical, including the media ratio. This is a component layout decision,
  not a new global breakpoint; content retains at least 20rem before its padding.
- Heading levels follow the page structure. Visual typography matches by default;
  an explicit compact heading treatment uses the existing H5 style.
- Whole-card clicking requires a non-empty linked title. It is enabled in the
  standard linked-card recipe, but defaults off in the low-level API.
- Selection, expansion, dragging, loading and disabled states are outside this version.

## When to use

Use Card for independently understandable summaries, resources or related information
in a collection. A static information card is valid; an image or action is not mandatory.
Use a list or table where comparison or a reading sequence matters more than grouping.
Do not wrap every section in a card merely to add a border.

Use the same composition and image treatment across peer cards. Article, product and
event examples are compositions, not different public components. Do not use the internal
`_Documentation/Card` for product interfaces.

## Anatomy and API

| Part / property | Behaviour |
|---|---|
| Container | Standard surface, thin border, radius and content padding; automatic height. |
| `layout` | Vertical by default; horizontal where the container has sufficient width. |
| `title` | Optional plain text; required for a linked title or clickable surface. |
| `headingLevel` | `none`, 2–6; explicitly chosen from document structure; no H1. |
| `titleStyle` | `auto` matches the heading; `compact` uses H5 styling without changing semantics. |
| `titleHref` | Real native anchor inside the title, with ordinary native link attributes. |
| `wholeCardClickable` | Enlarges the linked title's pointer target; never a separate callback or URL. |
| `image` | Source, explicit alt text, cover/contain, focal position and responsive source options. |
| Content | Flexible native slot for supporting content. |
| Actions | Optional native slot for existing links and buttons. |
| Image badge | One existing non-interactive Badge over the image; requires an image. |

Omitted parts and their gaps collapse. Hide both the title and image to use the composition
shell. Do not render empty headings or anchors. A visible blank shell is an authoring example,
not a loading state or a recommended empty-state message.

## Heading and document semantics

Use `div` by default, `article` only for independently meaningful article content, and
`ul`/`li` for an unordered collection. There is no card ARIA role. Avoid giving every
card a named landmark or labelling a generic wrapper unnecessarily.

Under an H2 section, use H3 card headings. Cards directly under the page H1 may use H2.
Do not choose H5 semantics just to make the text small. For a compact semantic H2,
keep `headingLevel=2` and set `titleStyle=compact`. Ordinary non-heading titles use
strong body text. Heading visual styles inherit the surrounding Breakpoint mode.

Illustrative markup, not a runnable implementation:

```html
<li>
  <div class="card" data-card>
    <div class="card__media">
      <img src="garden.jpg" width="800" height="450" alt="">
    </div>
    <div class="card__content">
      <h3><a href="/gardens" data-card-primary>Visit the gardens</a></h3>
      <p>Explore accessible paths and seasonal planting.</p>
      <div class="card__actions">
        <button type="button">Save gardens</button>
      </div>
    </div>
  </div>
</li>
```

The image is decorative in this example. Supply meaningful alternative text when the
image communicates information not available in the title or body. Do not link it again
to the same destination and add a redundant tab stop.

## Pointer enhancement

The title link is the only primary destination. The container has no `tabindex`, link/button
role or keyboard handler. Native controls continue to work when JavaScript fails.

Enhance only a completed, unmodified primary click/tap on non-interactive content. Forward
activation to the explicitly designated title anchor once. Never infer it from the first
arbitrary link, copy its URL to a second root action, or require secondary controls to stop
event propagation.

Exclude interactive descendants and their nested children: links, buttons, form controls,
labels, disclosure summaries, editable content, media controls and custom widgets. Provide
an explicit opt-out region for integrations and respect event-path/shadow boundaries.
Ignore cancelled events, default-prevented events and recursive forwarded events.

Do not navigate while selecting text, dragging or scrolling. Selection intersecting the
card and gestures that produced selection must suppress forwarding. Do not use a brief
time threshold that rejects slow deliberate clicks. Do not hijack touch long press.

Native title link events retain modifier keys, context menus, `target`, `rel`, `download`
and router integration. Modified/middle/right clicks on the background are ignored rather
than being downgraded to same-tab navigation. The background does not acquire native link
context menus or touch link previews; these remain available on the title link.

Secondary actions are allowed when the primary destination remains clear. If several
actions compete equally, disable whole-card clicking and leave each control independent.
Do not add a second Read more link to the title destination.

## Keyboard and focus

Tab visits actual controls in DOM order; it skips the container. Enter activates native
links, and buttons retain their native Enter/Space behaviour. No keyboard trap or automatic
focus movement is introduced. Screen readers encounter normal content and descriptive
heading links, without an extra card widget announcement.

Focus is shown on the actual title link or secondary control using the system treatment.
Never substitute a card-wide outline that leaves the focused control ambiguous. Focus
remains visible when pointer states overlap it. Keep the root unclipped and clip only media.

## Layout and images

Vertical images fill the card width at 16:9. Horizontal images use a 12rem square at
inline-start, with the content column taking remaining space. In RTL, inline-start is right.
The horizontal image stays top-aligned when content makes the card taller.

Use `object-fit: cover` for photography and an author-adjustable focal point. Use `contain`
when cropping would remove important information. Preserve intrinsic dimensions and reserve
the media frame while loading. A failed image must not remove the card's content or link.

At container widths below 32rem, use the vertical layout. Container queries must use a
build-resolved literal threshold: CSS custom properties cannot supply a size-query condition.
The fallback without container-query support is vertical. Figma does not execute container
queries: choose Layout explicitly while previewing typography through Breakpoint modes.

Images and text keep the same DOM order across layouts. Long text wraps; no automatic
ellipsis, line clamping, fixed content height or type shrinking. Empty sections leave no
gap. Natural grid stretching may align card heights without clipping content.

The image badge uses the existing opaque Badge background, preserving text contrast over
photography. It wraps within the image width. A status too long for the image belongs in
Content instead. If no image is supplied, status also belongs in Content.

## Tokens and visual states

Use `color.surface.default`, `radius.lg` and `border.width.thin`. Static borders use
`color.border.light`; enhanced surface borders use `color.border.interactive`, then
the shared hover/active border colours. The surface fill stays stable so arbitrary
slotted content does not unexpectedly lose contrast. Linked titles remain underlined.

Card adds six source tokens: content padding, title-to-content gap, actions gap, badge
inset, horizontal media width and horizontal minimum container width. The four spacing
tokens alias existing semantic spacing. No new responsive token groups
are needed. All six tokens include explicit Figma scopes and Web code syntax.
Six composed linked-title text styles preserve the base typography and its variable
bindings while adding an underline. Their reproducible recipes live in the YAML contract;
they are manually managed styles rather than new exported typography tokens.

## Figma handoff

Built and visually reviewed on 9 October 2026 in
[22 - Components - Card](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk/Accessible-Design-System?node-id=1179-7709).
Start with the [documentation examples](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk/Accessible-Design-System?node-id=1181-108).

- Card: 8 variants (`Layout=Vertical/Horizontal` × `Surface=Static/Default/Hover/Pressed`).
- Card / Title: 12 variants (`Style=Body strong/H2/H3/H4/H5/H6` × `Linked=False/True`),
  editable Title text and independent Focus boolean. Style is visual, not an HTML heading selector.
- Card / Media: 2 layout variants, replaceable image fill and a native Image badge slot.
- Card exposes native Content and Actions slots, visibility controls and nested Title/Media.

Figma's `Show body` controls the whole content area, including actions. The empty-shell
example hides Body and fixes its presentation height to 34px (padding plus border).
When filling it, show Body and restore Hug height on the Card and Content area. Empty native
slot layouts can retain their previous size, so check Hug sizing after clearing all content.
This is a Figma authoring limitation, not the intended production layout behaviour.

Figma cannot enforce every API dependency: Default/Hover/Pressed require a visible linked
title. Static may still contain a title link when surface enhancement is off. Focus belongs
to the linked title or secondary controls, never the root.

The page follows the standard Component set, Documentation examples, QA and responsive tests,
and Accessibility notes areas. Examples use instances; guidance uses `_Documentation/Card`.

## Validation and release gate

The YAML defines the complete WCAG 2.2 AA acceptance matrix. Source compilation, alias
resolution, metadata, contrast and Figma structure/appearance can be checked in this phase.
Browser, touch and screen-reader behaviour cannot be certified by a Figma component.

Before production release, validate normal/slow clicks, secondary controls and their icons,
selection, drag, scroll, cancellation, shadow/opt-out regions, modifiers, native link attributes,
keyboard order, screen-reader names/headings and the no-JavaScript fallback. Check 320px reflow,
400% zoom, text-spacing overrides, RTL, long status labels and visible focus in forced colours.

Keep releaseReady false until a runnable implementation passes those checks. Merge, Tokens
Studio pull/export and library publication remain separate workflow checkpoints.

The token build passed with 372 raw and 300 Tokens Studio tokens, 24 mapped responsive
groups, no unmapped groups and no broken retained aliases. Card adds six variables and
22 Figma variants across its three sets. Text contrast on the white surface is 7:1 for
body, 10.86:1 for headings and 4.52:1 for links; focus against its white separator is 4.52:1.
The token round-trip and production acceptance checks remain pending.

## References

- [Inclusive Components: Cards](https://inclusive-components.design/cards/) — title-link pointer enhancement.
- [Fluent Card](https://fluent2.microsoft.design/components/web/react/core/card/usage/) — composable layouts and focus modes.
- [USWDS Card](https://designsystem.digital.gov/components/card/) — shared vertical/horizontal structure.
- [Carbon Tile](https://www.carbondesignsystem.com/building-blocks/core/components/tile/guidelines) — distinct interaction models.
- [NHS Card](https://service-manual.nhs.uk/design-system/components/card) — navigation and non-clickable examples.
- [WCAG keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) and
  [pointer cancellation](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html).
