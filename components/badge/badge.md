# Badge

**Status:** Draft

**Version:** 0.1.0

**Machine-readable specification:** [`badge.yaml`](./badge.yaml)

**Component tokens:** [`../../tokens/components/badge.json`](../../tokens/components/badge.json)

## Overview

Badge is a compact, non-interactive text label that communicates the current status of an adjacent item. Its text carries the meaning; its tone helps users scan repeated statuses.

Badge is deliberately not a button, link, filter, removable tag, notification counter or live region. If users can act on an element, use the component that matches that action.

## When to use

Use Badge when an item can have one of several short statuses and knowing the current status helps the user, for example `Active`, `Pending`, `Delayed` or `Rejected`.

Do not use Badge:

- as a category or keyword when there is no status relationship;
- as a button, link, filter, selected option or removable chip;
- for a number without an accompanying word, such as an unread count;
- as the only place that explains a critical error or required action;
- to decorate content that is already clear without it.

Use the smallest useful set of statuses. Keep the same label and tone mapping consistent within a product.

## Anatomy

Badge contains one required text label inside a rounded status surface.

```text
Badge
└── Label
```

There is no icon, close control, leading slot, trailing slot or arbitrary content slot in v1.

## Tones

Tone is a visual aid, not the status itself. The required label must remain meaningful when colours are unavailable.

| Tone | Intended use | Background | Foreground |
|---|---|---|---|
| Neutral | Default, inactive or unclassified status | `color.status.neutral.background` | `color.status.neutral.foreground` |
| Info | Informational or in-progress status | `color.status.info.background` | `color.status.info.foreground` |
| Success | Positive or completed status | `color.status.success.background` | `color.status.success.foreground` |
| Warning | Status needing attention but not an error | `color.status.warning.background` | `color.status.warning.foreground` |
| Error | Failed, blocked or rejected status | `color.status.error.background` | `color.status.error.foreground` |

Do not infer hidden text, an accessible name or live-region urgency from tone. Product teams define the visible label and must not use colour as the only difference between two statuses.

The current token pairs all exceed a 7:1 contrast ratio. Badge still uses the WCAG 2.2 AA normal-text threshold of 4.5:1 as its release requirement so future palette changes cannot rely on the current margin.

## Semantics

Render Badge as ordinary phrasing content, normally a `span`:

```html
<span class="badge badge--success">Completed</span>
```

Do not add `role="status"`, `role="alert"`, `aria-label`, `tabindex` or button semantics to a static Badge. The visible text already supplies its accessible content.

Badge is not focusable and has no keyboard interaction. It has no hover, focus, active, selected, disabled or dismissible states.

When a status change must be announced without moving focus, the application owns the announcement strategy. Place the changed content in an appropriate pre-existing status region or provide a separate concise announcement. Do not make every Badge a live region, and do not announce the same change twice.

```html
<div role="status">
  Application status:
  <span class="badge badge--info">Under review</span>
</div>
```

Use assertive announcements only for important, time-sensitive changes. Visual `tone="error"` does not automatically justify `role="alert"`.

## Content guidance

- Use short, specific status labels that make sense without colour.
- Use sentence case, not all capitals.
- Prefer adjectives or past participles such as `Active`, `Pending`, `Completed` and `Rejected`.
- Avoid action verbs such as `Approve`, `Download` or `Delete`, which can make Badge appear interactive.
- Keep a label to a few words where possible.
- Do not put markup, links or controls inside the label.
- Do not truncate the label. Allow it to wrap when space is constrained.
- Localise the complete label; do not concatenate fragments.

If the surrounding context does not identify what the status belongs to, add ordinary visible context outside Badge. Do not repair unclear visible content with an `aria-label` that differs from what sighted users see.

## Layout and responsive behaviour

Badge hugs its content by default and uses:

- `typography.body.small` for the label;
- `component.badge.spacing.paddingBlock` and `component.badge.spacing.paddingInline` for inset spacing;
- `component.badge.sizing.maxWidth` as the maximum width of the complete Badge;
- `component.badge.surface.radius` for the pill surface.

The semantic small-body text style inherits `base`, `md` and `lg` values from the parent frame's `Breakpoint` mode. Badge does not add breakpoint variants or component-specific responsive typography tokens.

Do not set a fixed width. Short labels hug their content; long labels wrap with automatic height before the complete Badge exceeds `component.badge.sizing.maxWidth`. The token is `15rem` (240px at the default root size). A narrower parent may constrain it further. Do not clip, ellipsise or horizontally scroll the text at 320 CSS pixels, 400% zoom or after text-spacing overrides.

## Figma contract

Create one `Badge` component set with five variants:

- `Tone = Neutral | Info | Success | Warning | Error`

Expose one required `Label` text property. Do not expose icon, interaction, size, announcement or arbitrary-content properties.

Use the existing Token Studio-managed `global` collection for colours, spacing, sizing and radius. Use the existing manual `Breakpoint` collection for the responsive `typography/body/small` style. Do not create Badge breakpoint variants or breakpoint-suffixed text styles.

Bind `component/badge/sizing/maxWidth` to the Badge root's maximum width. Figma does not currently permit a variable binding on a text node's `maxWidth` through the Plugin API, so set the label maximum to the resolved component width minus its two inline paddings (224px with the current tokens). Keep both the Badge and label in hug-content sizing so short labels remain compact and long labels wrap naturally.

## Production API

| Property | Type | Default | Required | Notes |
|---|---|---|---|---|
| `label` | string | — | Yes | Non-empty after trimming; rendered as text, not HTML |
| `tone` | `neutral \| info \| success \| warning \| error` | `neutral` | No | Visual aid only; does not add ARIA semantics |

The component does not accept `onClick`, `href`, `dismissible`, `selected`, `disabled`, `icon`, `count`, `role`, `aria-live` or raw HTML content as Badge-specific API.

## Accessibility checklist

- [ ] The visible label communicates the status without colour.
- [ ] Labels that differ in meaning do not differ only by tone.
- [ ] The label is non-empty and rendered as text.
- [ ] The label uses sentence case and does not resemble an action.
- [ ] Badge is rendered as ordinary text with no unnecessary ARIA role.
- [ ] Badge is not focusable and has no pointer or keyboard interaction.
- [ ] There are no hover, focus, active, selected, disabled or dismissible states.
- [ ] Each foreground/background token pair meets at least 4.5:1 contrast.
- [ ] Text remains visible under zoom, reflow and text-spacing changes.
- [ ] Long or translated labels wrap without clipping or truncation.
- [ ] Dynamic changes use an application-owned announcement only when needed.
- [ ] Dynamic status changes are not announced more than once.

## Figma acceptance checklist

- [ ] There are exactly five Badge variants.
- [ ] `Tone` and `Label` are the only public properties.
- [ ] Every tone uses the required shared semantic foreground and background variables.
- [ ] Padding and radius are bound to Badge component variables.
- [ ] Badge maximum width is bound to the Badge sizing variable and the label wraps within its padded content box.
- [ ] Label typography uses the semantic small-body style.
- [ ] Badge hugs short content and grows automatically for wrapped content.
- [ ] No interaction styling or prototype behavior suggests clickability.
- [ ] A compact review frame shows all five tones, a multi-word label and a constrained-width wrapping example.
- [ ] The applied text style responds to `base`, `md` and `lg` parent `Breakpoint` modes.

## Validation matrix

Source and implementation checks:

1. Reject an empty or whitespace-only label.
2. Escape label content and never interpret it as HTML.
3. Default an omitted tone to `neutral`.
4. Reject unsupported tone values.
5. Render a non-focusable `span` with no implicit or explicit widget role.
6. Render no icon, hidden status prefix or interaction handler.
7. Verify each token pair against the 4.5:1 normal-text contrast threshold.
8. Verify all five tones with the same label are announced identically.
9. Verify a long translated label at 320 CSS pixels, 400% zoom and WCAG text-spacing overrides.
10. Verify a dynamic status change is announced once only when the surrounding application provides a suitable live region.
