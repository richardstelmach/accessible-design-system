# Alert

**Status:** Draft

**Version:** 0.1.0

**Machine-readable specification:** [`alert.yaml`](./alert.yaml)

**Component tokens:** [`../../tokens/components/alert.json`](../../tokens/components/alert.json)

## Overview

Alert communicates a brief success, informational, warning or error message without interrupting the user's task. It has a fixed state icon, a required title and an optional description.

The visual state does not choose the live-region behaviour. A static error Alert may need no live region, while a dynamically inserted success message may need polite status semantics. Treat those as separate decisions.

## When to use

Use Alert for concise contextual feedback such as:

- confirming that an action succeeded;
- providing neutral information or guidance;
- warning about a condition that does not block the current task;
- reporting a brief failure outside a field-validation flow.

Do not use Alert as a replacement for inline field errors and Error Summary. Do not use it for a message that requires acknowledgement or blocks the workflow; use the appropriate Dialog or alert-dialog pattern instead.

Alert has no actions, links, close control, keyboard interaction or automatic dismissal in this version.

## Anatomy

1. Fixed state icon
2. Visually hidden state label
3. Required title
4. Optional description

The state determines the icon and semantic colour pairing:

| State | Icon | Hidden label | Background | Foreground/icon |
|---|---|---|---|---|
| Success | `check-circle` | `Success:` | `color.status.success.background` | `color.status.success.foreground` |
| Info | `info` | `Information:` | `color.status.info.background` | `color.status.info.foreground` |
| Warning | `warning-circle` | `Warning:` | `color.status.warning.background` | `color.status.warning.foreground` |
| Error | `x-circle` | `Error:` | `color.status.error.background` | `color.status.error.foreground` |

The icon is not independently swappable. This prevents a state colour, shape and accessible label from drifting apart.

## Title semantics

The title is a paragraph by default, styled with `typography.body.default` and `typography.emphasis.strong`.

```html
<p class="alert__title">
  <span class="visually-hidden">Information: </span>
  Scheduled maintenance begins at 8pm
</p>
```

Do not make the title a heading merely because it is prominent. Alert can appear inside many different page structures, and automatically adding a heading would pollute the page outline.

Use `headingLevel="2"` through `headingLevel="6"` only when the title genuinely introduces a section in the surrounding document. Alert does not support `h1`; it must not own the page title.

Whether a description is present does not determine whether the title is a heading. A one-line Alert can be a genuine heading in the right structure, and an Alert with a description can still use an ordinary paragraph title.

When a heading is appropriate, use the matching responsive heading token and let it inherit from the parent frame's `Breakpoint` mode. Do not choose a lower heading level simply to obtain a smaller size.

## Icon accessibility

The registered icons are inline SVGs, so they do not use an `alt` attribute. Hide the SVG from assistive technology and provide the canonical state label as text:

```html
<svg aria-hidden="true" focusable="false"><!-- warning-circle --></svg>
<p class="alert__title">
  <span class="visually-hidden">Warning: </span>
  Check your passport details
</p>
```

This makes state available without relying on colour and avoids announcing both an icon name and a text prefix. If an implementation uses an actual image instead of inline SVG, use the state label as the image's alternative text and omit the separate hidden label.

## Announcement behaviour

The `announcement` API is independent from `state`:

| Value | Semantics | Use |
|---|---|---|
| `none` | No live-region role | Static content or content already present at page load |
| `polite` | `role="status"` | New advisory information that should not interrupt speech |
| `assertive` | `role="alert"` | Newly inserted, important and time-sensitive information |

The default is `none`.

`role="status"` already supplies polite, atomic live-region behaviour. `role="alert"` already supplies assertive, atomic live-region behaviour. Do not add redundant `aria-live` or `aria-atomic` values.

Alert never receives focus. It has no keyboard interaction. If the user must stop and respond, use an alert dialog rather than moving focus to Alert.

Do not announce the same message through Alert, Error Summary and inline validation at the same time. Create or update the message once and test supported browser and screen-reader combinations.

## Markup examples

### Static informational Alert

```html
<div class="alert alert--info">
  <svg aria-hidden="true" focusable="false"><!-- info --></svg>
  <div class="alert__content">
    <p class="alert__title">
      <span class="visually-hidden">Information: </span>
      Scheduled maintenance begins at 8pm
    </p>
  </div>
</div>
```

### Dynamic polite success message

```html
<div class="alert alert--success" role="status">
  <svg aria-hidden="true" focusable="false"><!-- check-circle --></svg>
  <div class="alert__content">
    <p class="alert__title">
      <span class="visually-hidden">Success: </span>
      Your changes were saved
    </p>
    <p class="alert__description">The new settings are now active.</p>
  </div>
</div>
```

### Structurally headed warning

```html
<div class="alert alert--warning">
  <svg aria-hidden="true" focusable="false"><!-- warning-circle --></svg>
  <div class="alert__content">
    <h3 class="alert__title">
      <span class="visually-hidden">Warning: </span>
      Before you continue
    </h3>
    <p class="alert__description">Check that the account details are current.</p>
  </div>
</div>
```

The `h3` is correct only if this Alert occupies an H3 position in the page hierarchy.

## Tokens

The shared semantic status family provides all colours. Alert does not duplicate those values as component colour tokens.

The new shared tokens are:

- `color.status.info.background` → `color.primary.100`
- `color.status.info.foreground` → `color.primary.950`
- `color.icon.info` → `color.status.info.foreground`

Alert-specific tokens are limited to geometry:

- `component.alert.spacing.inset`
- `component.alert.spacing.iconToContent`
- `component.alert.spacing.titleToDescription`
- `component.alert.icon.size`
- `component.alert.surface.radius`

## Figma contract

Create one `Alert` component set with eight variants:

- `State = Success | Info | Warning | Error`
- `Description = False | True`

Expose:

- `Title` text;
- `Description text` when `Description=True`;
- the nested `_Alert/Title` `Style` property as `Title style`.

`_Alert/Title` has `Default`, `H2`, `H3`, `H4`, `H5` and `H6` variants. `Default` uses body typography with strong emphasis. The heading variants use the corresponding semantic heading style. This avoids turning title treatment into another Alert variant axis and prevents a 48-variant matrix.

The state icon remains fixed and is not an instance-swap property. `announcement` and production `headingLevel` remain handoff/implementation metadata rather than Figma visual properties.

Use the existing Token Studio-managed `global` collection for ordinary variables. Use the existing manual `Breakpoint` collection with `base`, `md` and `lg` modes for responsive typography. Do not create Alert breakpoint variants or breakpoint-suffixed text styles.

## Content guidance

Write the title so it communicates the outcome or condition on its own. Use the description for a concise consequence or next step.

Prefer:

- “Your changes were saved”
- “Applications close on Friday”
- “Check your passport details”
- “We could not upload the file”

Avoid vague labels such as “Notice” or “Important” without the actual message.

## Accessibility checklist

- [ ] The state is conveyed by text and icon shape, not colour alone.
- [ ] The inline SVG is `aria-hidden` and not focusable.
- [ ] The canonical state label appears once in the accessible reading order.
- [ ] The title is non-empty.
- [ ] Description markup is omitted when no description is supplied.
- [ ] The title is a paragraph unless it genuinely introduces a section.
- [ ] Heading levels follow the surrounding document and never use `h1`.
- [ ] Static Alerts have no unnecessary live-region role.
- [ ] `role="status"` is used only for suitable dynamic polite messages.
- [ ] `role="alert"` is used sparingly for suitable dynamic assertive messages.
- [ ] The message is not announced through another live region at the same time.
- [ ] Focus does not move to Alert.
- [ ] The component has no keyboard interaction or timed dismissal.
- [ ] Foreground/background status pairs meet normal-text contrast requirements.
- [ ] Long content wraps without clipping at 320px and under text spacing or zoom changes.

## Figma acceptance checklist

- [ ] There are exactly eight Alert variants.
- [ ] All four states use their fixed registered icon instances.
- [ ] All state colours are bound to shared semantic variables.
- [ ] Padding, gaps, radius and icon size are bound to Alert geometry variables.
- [ ] `_Alert/Title` exposes Default and H2–H6 styles without multiplying Alert variants.
- [ ] Description visibility does not change title semantics.
- [ ] Title and description wrap and grow automatically.
- [ ] The component remains readable at 320px.
- [ ] One compact review frame shows every state with and without a description.
- [ ] Applied text styles respond to `base`, `md` and `lg` parent `Breakpoint` modes.
