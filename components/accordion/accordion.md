# Accordion

**Status:** Draft — source review; Figma inspected, construction pending

**Version:** 0.1.0

**Machine-readable specification:** [accordion.yaml](./accordion.yaml)

**Component tokens:** [accordion.json](../../tokens/components/accordion.json)

## Overview

Accordion groups content into vertically stacked disclosure sections. Each item opens and closes independently: opening one never closes another. Users may leave any number open, including none or all. Richard confirmed this behaviour; there is no single-open mode or requirement to keep a panel open.

This phase defines the component contract, tokens and Figma handoff. As with the existing Tabs component, production browser code and runtime accessibility testing are future implementation work.

## When to use

Use Accordion for supplementary sections that people choose to explore. Prefer visible content when everyone needs to read it, when comparison is the primary task, or when hiding content makes a process harder to understand. Keep essential instructions, urgent information and error summaries visible outside the panels.

## Anatomy and semantics

Each item contains a native heading, one `button type="button"` inside that heading, a decorative state caret, and an associated panel. The button occupies the header width. Its visible title supplies the accessible name. Persistent adjacent controls must sit outside the heading and its button; this first version has no built-in header-action slot.

The button uses `aria-expanded="true"` when open and `"false"` when closed. `aria-controls` references its panel's stable, globally unique ID. There is no `aria-collapsed` attribute. Use `hidden` on collapsed panels, preserving its display behaviour in CSS so descendants cannot receive focus. Keep their DOM mounted to retain entered values.

Panel landmarks are optional. `panelLandmark=true` adds `role="region"` and `aria-labelledby` referencing the trigger; default panels are ordinary `div` elements. Avoid excessive landmarks, particularly when more than about six panels can be open. These semantics follow the [W3C Accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/).

## Heading level and visual style

Expose a required `headingLevel` of **2, 3, 4, 5 or 6**. The consumer chooses it from the page hierarchy. Peer accordion items share a level; a panel's subheadings continue beneath that level. The component does not guess the surrounding outline or use the page's H1 for its repeated section titles.

Expose an optional `titleStyle` of **h2–h6**, defaulting to the matching semantic level. It selects an existing responsive heading style. A deliberate smaller treatment can use `headingLevel=2` with `titleStyle=h4`: the output remains an H2. Record both choices in the design handoff and apply them consistently. This follows the existing [heading standard](../../accessibility/headings.yaml).

| Visual style | Base | md | lg |
|---|---:|---:|---:|
| h2 | 24px | 30px | 36px |
| h3 | 20px | 24px | 30px |
| h4 | 18px | 20px | 24px |
| h5 | 16px | 18px | 20px |
| h6 | 16px | 16px | 18px |

These pixel equivalents assume a 16px root and describe the current source tokens. Font weight, line height and letter spacing also come from the complete shared heading style. No new type scale, responsive branches or breakpoint variants are needed. Native button styles must inherit the intended typography rather than resetting it to the browser's button font.

## Slots and content

Use a native Figma **Content slot** for each panel and an **Items slot** for the overall composition. Panel content can include paragraphs, lists, links, buttons and form controls; content height remains automatic. Reuse existing components inside the panel. The composition accepts a variable number of item instances without count variants.

The **title is a text property**, not an arbitrary content slot. This prevents nested controls, misleading accessible names and headings inside the button. Keep titles concise and distinct, but allow complete wrapping for long or translated content. Do not truncate titles or replace them with icon-only labels.

Panel content does not need to repeat the trigger title. Any internal headings must fit beneath it. An H6 item cannot have a deeper native heading; simplify the hierarchy rather than inventing H7. Nested accordions, status badges, leading icons and header actions are outside this initial component.

## Icons

Reuse registered Phosphor regular **caret-down** for collapsed and **caret-up** for expanded, placed at the logical inline end. Use `size.icon.md` (currently 20px) and `color.icon.default`. These vertical indicators work in both left-to-right and right-to-left layouts.

The icon is decorative to assistive technology because the button already exposes its state. Use `aria-hidden="true"` and prevent separate icon focus. The entire header is the target; the caret is not a second button. Expansion selects the glyph, so there is no public arbitrary indicator-swap option.

## Keyboard, focus and expansion

| Key | Behaviour |
|---|---|
| Enter / Space | Toggle the focused header once, using native button activation. |
| Tab / Shift+Tab | Move through every trigger and the controls in visible panels in ordinary DOM order. |
| Arrow keys / Home / End | Retain normal browser and embedded-control behaviour. |

Keep focus on the trigger when the user toggles it. Every trigger remains a normal tab stop. Do not add roving focus, a focus trap, Escape-to-collapse or duplicate key handlers. The [W3C example](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/examples/accordion/) illustrates native heading/button relationships and sequential keyboard navigation.

**A chosen item can start open on page load.** Set `initialExpandedIds` to its key—for example, `initialExpandedIds: ["delivery"]`. This can be any item, including one other than the first. Its panel starts visible, its trigger has `aria-expanded="true"`, and its icon is caret-up. Other items start collapsed unless their keys are also supplied.

If omitted, initial expansion defaults to none after successful enhancement. The list may contain any number of valid unique item keys; reject unknown or duplicate keys. Apply initial state once without moving focus, and do not reset the user's choices on later renders.

An initially open item can be closed normally. Opening another item leaves it open until the user closes it. Updating one item never changes another item's expansion state. There is no disabled trigger or `aria-disabled` state in this version, since every open item can be closed.

If an integration hides a panel while focus is inside, move focus to its trigger before hiding it. Error links and deep links must reveal their target panel before focusing or scrolling to its content. Do not automatically focus a panel on expansion or announce its full content through a live region.

## HTML relationship example

The following shows one **enhanced state**, not a runnable implementation. Event handling and the baseline behaviour below are required.

```html
<!-- A semantic H2 may deliberately use the existing visual H4 style. -->
<div class="accordion-item">
  <h2 class="accordion-heading heading-style-h4">
    <button type="button" id="delivery-trigger"
            aria-expanded="false" aria-controls="delivery-panel">
      <span>Delivery options</span>
      <svg aria-hidden="true" focusable="false"><!-- caret-down --></svg>
    </button>
  </h2>
  <div id="delivery-panel" hidden>
    <p>Choose standard or express delivery at checkout.</p>
  </div>
</div>

<!-- A substantial panel can opt into a named landmark. -->
<div class="accordion-item">
  <h2 class="accordion-heading heading-style-h4">
    <button type="button" id="returns-trigger"
            aria-expanded="true" aria-controls="returns-panel">
      <span>Returns</span>
      <svg aria-hidden="true" focusable="false"><!-- caret-up --></svg>
    </button>
  </h2>
  <div id="returns-panel" role="region" aria-labelledby="returns-trigger">
    <p>Find out how to arrange a return.</p>
  </div>
</div>
```

Use an instance-specific ID prefix when multiple accordions appear on a page. Do not substitute `aria-selected`, `aria-pressed`, `aria-haspopup` or tab roles for expansion semantics.

## Progressive enhancement and print

Start with ordinary headings and all content visible. Introduce trigger buttons and collapse selected panels only after handlers are ready. If enhancement fails, the page remains readable without dead toggle buttons. Initialisation must preserve any panel already containing focus, in addition to the requested initial expanded items.

Print every section with its heading, regardless of screen expansion. Hide decorative control indicators for print without changing stored interaction state. URL history, automatic search reveal and form-validation orchestration are integration responsibilities; never attempt to focus a hidden target.

## Tokens and visual states

Five new tokens alias existing spacing decisions:

| Token under `component.accordion.spacing` | Existing alias | Current value |
|---|---|---:|
| `triggerPaddingBlock` | `spacing.control.paddingBlock.default` | 12px |
| `paddingInline` | `spacing.control.paddingInline.default` | 16px |
| `triggerGap` | `spacing.control.gap` | 8px |
| `panelPaddingBlock` | `spacing.inset.md` | 16px |
| `itemGap` | `spacing.stack.sm` | 8px |

All five declare `GAP` scope and exact `Web` CSS syntax in canonical JSON. Reuse `radius.none`, `border.width.thin` with `color.border.default` for decorative item dividers, and `size.control.minBlockSize.default` / `size.target.comfortable` for 44px minimum block/inline target dimensions. The system's 44px preference exceeds the WCAG AA 24px minimum, which has exceptions. [W3C target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

| Pointer state | Foreground | Background |
|---|---|---|
| Default | `color.interactive.default.foreground` | `color.interactive.default.background` |
| Hover | `color.interactive.default.hover.foreground` | `color.interactive.default.hover.background` |
| Pressed | `color.interactive.default.active.foreground` | `color.interactive.default.active.background` |

The caret retains `color.icon.default` in all states. Expansion is expressed through caret direction and visible content. Keyboard focus is independent of pointer state and expansion, using the shared [double ring](../../accessibility/focus-indicators.yaml): a 2px separator and 2px outer ring. Preserve the ring outside the trigger, above adjacent content. Dividers are decorative and do not identify the control by themselves.

Require at least 4.5:1 text contrast even for the larger titles, and 3:1 for the caret and meaningful focus boundary. Check all pairings from resolved source tokens, including the pressed surface. In forced colours, preserve system foregrounds, caret shape and a visible focus outline; do not rely solely on box shadow or background imagery.

## Layout and reflow

Triggers and panels fill their container and hug their content. Titles wrap, carets retain their size, and panel content grows naturally. Use logical properties for RTL. The vertical accordion stays an accordion at every breakpoint; only shared responsive typography changes.

Test at 320 CSS pixels, corresponding to a 1280px viewport at 400% zoom, without page-level horizontal scrolling. Also test 200% text sizing. [W3C reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)

Allow overrides of line height to 1.5 times font size, paragraph spacing to 2 times font size, letter spacing to 0.12em and word spacing to 0.16em without losing content or operation. [W3C text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)

No animation is required. Future motion must respect reduced-motion preferences and synchronise hidden content with focusability. Keep focused headers visible near sticky page furniture. [W3C focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)

## Figma handoff

Read-only preflight on 8 October 2026 confirmed the existing Tabs page, native slots, five responsive heading styles, `global` and `Breakpoint` collections, and the local caret masters (`61:635` down, `61:629` up). No Accordion page or variables existed. No Figma content has been changed.

Planned page: **21 - Components - Accordion** in the [Accessible Design System file](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk/Accessible-Design-System).

- **Accordion / Title:** five visual style variants H2–H6 and a Title text property.
- **Accordion / Item:** six variants, Expanded=False/True × State=Default/Hover/Pressed; independent Focus boolean, native Content slot and exposed nested Title / Title style properties.
- **Accordion:** a native vertical Items slot containing item instances, with no item-count variants.

Splitting the nested title keeps typography separate from the interaction matrix. The HTML heading level is documented alongside the instance; a Figma text style cannot create browser semantics. Switching Expanded must preserve title and slot overrides. Figma instances illustrate state and do not implement runtime ARIA or keyboard behaviour.

Follow the [documentation template](../../patterns/component-documentation-page.yaml): separate component masters, documentation examples, QA and accessibility areas; reuse shared headers and cards. Include a compact instance review showing a chosen non-first item open on page load, several items open, all closed, independent focus, a documented H2/H4 visual exception, and populated content slots. QA includes every visual style, narrow long titles, RTL, responsive modes, text stress and slot retention.

Source review and merge to GitHub `main` precede Figma construction and the Tokens Studio pull. Pull `tokens/compiled/tokens.studio.json` into **global**, then use the [routine non-destructive export](../../docs/token-sync-workflow.md). Keep **Breakpoint** manually managed. Finish with a binding/metadata audit and repeat export before accepting the round-trip.

## Validation and remaining acceptance

Source checks cover YAML/JSON parsing, token references, aliases, metadata, contrast, unchanged unrelated output and an idempotent build. These do not establish runtime conformance.

- [ ] Confirm heading navigation for levels 2–6, with visual overrides preserving semantics.
- [ ] Verify native keyboard activation, normal Tab order, correct names and expansion announcements.
- [ ] Open and close every item independently; test any initial combination and multiple sets.
- [ ] Start a chosen non-first item open; verify its state, caret and visibility, then close it and open siblings without resetting other choices.
- [ ] Verify hidden content is unreachable and focus survives external collapse.
- [ ] Verify form values and panel content survive collapse/reopen.
- [ ] Test no-JavaScript, initial focus preservation, print and reveal-before-focus integrations.
- [ ] Test NVDA, VoiceOver, mobile touch navigation, forced colours, reflow and text-spacing overrides.
- [ ] Build and audit Figma component structure, bindings, slots, examples and appearance.
- [ ] Complete source merge, token export and repeat-export audit before publication.

## References

Reviewed 8 October 2026. W3C APG informs semantics and keyboard behaviour; WCAG defines conformance. Heading style choices, independent-only expansion, slot inventory and visual tokens are this design system's decisions. The [APG example](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/examples/accordion/) also calls for testing with real assistive technologies before production use.
