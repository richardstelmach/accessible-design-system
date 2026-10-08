# Tabs

**Status:** Draft — Figma built and audited; repeat token export pending

**Version:** 0.1.0

**Machine-readable specification:** [`tabs.yaml`](./tabs.yaml)

**Component tokens:** [`../../tokens/components/tabs.json`](../../tokens/components/tabs.json)

## Overview

Tabs presents related sections in a shared space, with one panel visible in its enhanced presentation. Users enter the tab list once with Tab, move between tabs using arrow keys, and use Tab again to reach the selected panel.

The source defines tokens, behaviour and acceptance criteria for the Figma implementation. A production web component and runtime accessibility validation remain future work.

## Accepted decisions

The initial contract uses these decisions:

| Decision | Behaviour | Reason |
|---|---|---|
| Activation default | Automatic for immediately available, preloaded panels; support explicit manual activation | Fast switching when there is no loading delay. Use manual activation whenever display cannot be immediate. |
| Narrow presentation | Contents links followed by all sections below `breakpoint.md` (48rem), or whenever the complete row cannot fit its container | Avoid clipped controls, multiple tab rows and hidden off-screen labels. This is a system policy, not a W3C breakpoint requirement. |

The scope is horizontal, text-only tabs. Vertical, disabled, icon-only, nested, closable and draggable tabs are outside this version. The live preflight confirmed page `20 - Components - Tabs` and the component inventory below.

## When to use

Use Tabs for a small set of peer sections where people benefit from switching views. Prefer visible content for comparisons or information that must be read in order. Keep essential instructions outside hidden panels.

GOV.UK recommends clear labels, useful ordering and a heading inside each panel. Its implementation exposes all sections without JavaScript and on small screens; the fallback follows that approach while using this system's own breakpoint. GOV.UK also notes that its small-screen approach needs further research. [GOV.UK Tabs](https://design-system.service.gov.uk/components/tabs/)

Do not use Tabs as site navigation, a wizard, a sequence of required form steps or a way to fit too much content onto a page. For a single section, use ordinary content.

## Anatomy

1. A meaningful name for the tab set, preferably supplied by an existing visible heading.
2. A single horizontal list of text-labelled controls.
3. A persistent bottom border on the selected tab.
4. One associated content panel per tab, each starting with a contextual heading.

A tab label names its section. It is not itself a heading and cannot contain another control. Panels use the heading level appropriate to their place in the page, following the [heading standard](../../accessibility/headings.yaml).

## Keyboard and activation

| Key | Behaviour within the enhanced tab list |
|---|---|
| Tab | Enter on the selected tab; leave for its panel on the next Tab. |
| Shift+Tab | Move backwards in the normal page order. |
| Left / Right | Focus previous / next tab in DOM order, wrapping at either end. |
| Home / End | Focus the first / last tab. |
| Enter / Space | Activate the focused tab and retain focus there. |
| Up / Down | Keep normal browser scrolling and assistive-technology behaviour. |

The first tab is selected initially unless a valid initial selection is supplied. Returning to the list reaches the current selection, not always the first tab. [W3C Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)

In **automatic** mode, focus also changes selection. Use this only when panel content is ready to display immediately. In **manual** mode, arrow keys only move focus; activation commits the new selection. [W3C automatic example](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/) · [W3C manual example](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-manual/)

Use one roving `tabindex="0"`. Outside the list it belongs to the selected tab; while navigating inside it follows keyboard focus. In manual mode this does not change selection. After native Tab navigation leaves the list, restore the selected tab as its entry point. Do not restore it before the browser moves focus: that can cause an unwanted second stop inside the list when selection follows the focused tab in document order.

Scope keyboard handlers to the tab controls. Do not capture arrow keys inside panel inputs, editors or other widgets. Preserve modified shortcuts. Selection must not submit a form, navigate to another page or move focus into the panel.

## Semantics and progressive enhancement

Use a named `tablist`, individual `tab` controls with `aria-selected` and `aria-controls`, and `tabpanel` containers labelled by their controlling tabs. Keep IDs unique across multiple instances.

Start from usable HTML: a contents list linking to visible sections. Add widget semantics and hide inactive panels only after enhancement is ready. Enhanced anchors must handle Space as well as Enter, and cancel fragment navigation only while operating as tabs.

Each panel begins with a heading, so the visible panel is a `tabindex="0"` stop. Give it visible keyboard focus. Hide inactive panels with `hidden`; `aria-hidden` alone does not prevent focus reaching their controls. Preserve the hidden attribute's display behaviour in component CSS. Keep panel DOM mounted to retain local values.

These are illustrative states, not a runnable implementation:

```html
<!-- Baseline: every section is visible. -->
<h2 id="case-views">Case information</h2>
<ul>
  <li><a id="case-tab-details" href="#case-panel-details">Details</a></li>
  <li><a id="case-tab-history" href="#case-panel-history">History</a></li>
</ul>
<section id="case-panel-details">
  <h3>Details</h3>
  <p>Information about this case.</p>
</section>
<section id="case-panel-history">
  <h3>History</h3>
  <p>Previous updates to this case.</p>
</section>
```

```html
<!-- After successful enhancement: handlers are required. -->
<h2 id="case-views">Case information</h2>
<ul role="tablist" aria-labelledby="case-views">
  <li role="presentation">
    <a id="case-tab-details" href="#case-panel-details" role="tab"
       aria-controls="case-panel-details" aria-selected="true"
       tabindex="0">Details</a>
  </li>
  <li role="presentation">
    <a id="case-tab-history" href="#case-panel-history" role="tab"
       aria-controls="case-panel-history" aria-selected="false"
       tabindex="-1">History</a>
  </li>
</ul>
<section id="case-panel-details" role="tabpanel"
         aria-labelledby="case-tab-details" tabindex="0">
  <h3>Details</h3>
  <p>Information about this case.</p>
</section>
<section id="case-panel-history" role="tabpanel"
         aria-labelledby="case-tab-history" tabindex="0" hidden>
  <h3>History</h3>
  <p>Previous updates to this case.</p>
</section>
```

Do not apply `aria-expanded`, `aria-pressed` or `aria-current` in place of tab selection. Do not make the whole panel a live region. Tab name, role and selection already communicate the change; a second whole-panel announcement can become repetitive.

## Content guidance

Use concise, distinct sentence-case labels. Give empty sections a useful explanation or omit them; do not disable their tabs. Labels remain visible and complete in translation. No ellipsis, icon-only alternatives or tooltip-only wording.

Avoid changing labels as panels update. Keep their meanings stable so people can return to a section predictably.

## Tokens and visual states

The five new tokens are aliases of established spacing and border values:

| Token | Alias | Current resolved value |
|---|---|---|
| `component.tabs.spacing.tabPaddingBlock` | `spacing.control.paddingBlock.default` | 0.75rem / 12px |
| `component.tabs.spacing.tabPaddingInline` | `spacing.control.paddingInline.default` | 1rem / 16px |
| `component.tabs.spacing.tabGap` | `spacing.control.gap` | 0.5rem / 8px |
| `component.tabs.spacing.listToPanel` | `spacing.stack.md` | 1rem / 16px |
| `component.tabs.indicator.thickness` | `border.width.thick` | 4px |

Pixel equivalents for rem values assume a 16px root. These values are explanatory; canonical JSON remains authoritative.

Reuse `typography.body.default`, `radius.none`, `size.control.minBlockSize.default`, and `size.target.comfortable` for label style, square geometry and minimum block/inline target dimensions. The target minimums currently resolve to 44px. That is the system's comfortable size; WCAG 2.2 AA's minimum is 24 by 24 CSS pixels, subject to its exceptions. [W3C target size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

| Interaction | Foreground | Background | Text contrast |
|---|---|---|---|
| Default | `color.interactive.default.foreground` | `color.interactive.default.background` | 7.00:1 |
| Hover | `color.interactive.default.hover.foreground` | `color.interactive.default.hover.background` | 7.47:1 |
| Pressed | `color.interactive.default.active.foreground` | `color.interactive.default.active.background` | 5.30:1 |

Selection is a persistent bottom border using `color.interactive.default.border`, including during hover, pressed and focus states. Its lowest contrast against those surfaces is 3.42:1. Reserve its thickness on unselected tabs using padding compensation, so selection does not move text. Do not use a transparent border that becomes visible unexpectedly in forced colours.

Focus uses the shared [double-ring treatment](../../accessibility/focus-indicators.yaml): `color.interactive.focus.separator` plus `color.interactive.focus.ring`, both `border.width.medium`. Ring against separator and the default surrounding surface is 4.52:1. Preserve the ring when pointer states overlap focus. Keep the focused node above adjacent nodes and allow the ring outside its bounds.

Do not use the blue text colour against these grey hover/pressed surfaces: those combinations fall below 4.5:1. All ratios must be recalculated after token or surface changes.

The spacing tokens declare `GAP` scopes. Indicator thickness declares `STROKE_FLOAT` for the later Figma bottom-stroke binding. All five carry exact `Web` CSS references. No new shared colours, responsive branches, typography styles or Breakpoint mappings are required.

## Layout and responsive behaviour

Use automatic height and fill the available content width. Do not wrap the tab row into multiple rows, hide overflow, fix panel heights or shrink labels until they fit. The narrow fallback displays a contents list and every section, preserving ordinary reading order.

Presentation changes must update roles, attributes, keyboard handling and visibility together. Reuse the contents links when enhancing them into tabs. Keep focus in place on resize; when enhancing while focus is within a section, select that section before hiding others. Otherwise restore the last valid selection.

Verify narrow embedded containers as well as viewport width. A wide viewport does not guarantee that the component has room. At 320 CSS pixels and 400% zoom, users must retain access without page-level horizontal scrolling. [W3C Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)

Print all sections with headings. Without JavaScript, all sections and their links remain usable. Enhanced URL history, asynchronous loading and cross-panel form validation are outside the initial API. Future integrations must reveal a target panel before attempting to focus hidden content.

## Accessibility checklist

- [ ] The set has a meaningful name; each visible label supplies its tab's name.
- [ ] Exactly one tab is selected and one tab is in sequential focus order.
- [ ] Keyboard focus and selection remain distinguishable, including manual mode.
- [ ] Hidden panel content cannot be reached by keyboard or screen-reader navigation.
- [ ] Every panel has the correct label relationship and contextual heading.
- [ ] Keyboard handlers leave panel controls, Up/Down and modified shortcuts alone.
- [ ] Text reaches 4.5:1; selection and meaningful focus boundaries reach 3:1.
- [ ] Forced colours retain the selected border and an independent focus outline.
- [ ] Zoom, text resizing and text-spacing overrides preserve labels and controls.
- [ ] Focus is visible and is not entirely hidden by author-created overlays. [W3C focus guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- [ ] Fallback and print expose all sections.
- [ ] Switching preserves local content state and introduces no unnecessary animation.

These are implementation acceptance checks, not completed runtime results. Test with NVDA and Firefox or Chrome, VoiceOver and Safari, mobile touch navigation, and Windows forced colours. The complete automated/manual matrix is in the YAML contract.

## Figma handoff

Built and audited on 8 October 2026 in [20 - Components - Tabs](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk/Accessible-Design-System?node-id=1164-6). The page reuses existing variables, semantic text styles, native slots and shared documentation components.

- `Tabs / Tab`: six variants (`Selected=False/True` × `State=Default/Hover/Pressed`), a `Label` text property and an independent `Focus` boolean. Focus can coexist with any pointer state without adding variants.
- `Tabs / Panel`: a `Heading` text property and a native `Content` slot.
- `Tabs`: native `Tabs` and `Panel` slots for flexible composition, without a variant for each tab count.

The component set is `1164:13`, panel master `1164:32`, composition master `1164:36`, and review examples `1165:43`. The page contains the standard four areas, four shared header instances and 15 shared documentation cards.

The narrow fallback uses ordinary contents links and panel instances in documentation. Figma instances illustrate state; the contract remains authoritative for production keyboard and ARIA behaviour.

Follow the [standard documentation page](../../patterns/component-documentation-page.yaml), with separate component, documentation, QA and accessibility areas. Reuse shared headers, cards, text styles and variables. Responsive typography inherits the manual `Breakpoint` collection; do not create breakpoint-suffixed variants or styles.

The design audit confirmed six tab variants, independent focus rings, all five variable aliases/scopes/WEB references, bound spacing and indicators, intact Breakpoint modes, and no narrow-container text overflow. Visual checks covered component masters, selection/focus examples, 320px fallback, long labels and typography stress. Twenty text nodes in the two labelled stress examples deliberately override shared styles to simulate doubled text and increased spacing. Browser word spacing and runtime accessibility still require implementation tests.

The initial export exposed an invalid indicator scope (`STROKE_WEIGHT`). It was corrected to Figma's supported `STROKE_FLOAT` in canonical source and on the existing live variable, preserving its ID. A repeat pull/export is required to verify that the correction survives the provider round-trip; library publication has not been performed.

After the source changes are reviewed and merged to GitHub `main`, pull `tokens/compiled/tokens.studio.json` into Tokens Studio's `global` set and run the routine non-destructive export described in the [sync workflow](../../docs/token-sync-workflow.md). The initial tokens were merged in PR #27; the stroke-scope correction and Figma inventory are the follow-up source change.

## References

Reviewed 8 October 2026. The [W3C APG Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) and its examples guide behaviour. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) defines conformance requirements. [GOV.UK Tabs](https://design-system.service.gov.uk/components/tabs/) informs content and fallback guidance. These sources do not determine this system's token names, appearance or Figma architecture.
