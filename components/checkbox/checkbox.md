# Checkbox

**Status:** Draft
**Version:** 0.1.0
**Machine-readable specification:** [`checkbox.yaml`](./checkbox.yaml)
**Component tokens:** [`../../tokens/components/checkbox.json`](../../tokens/components/checkbox.json)

## Overview

Checkbox is one native checkbox control. Use it for an independently answerable binary choice, confirmation or statement.

Several Checkbox instances can also be placed inside the existing Fieldset content slot when they answer one shared multi-select question. Fieldset owns the `fieldset`, `legend`, shared helper text, shared error text, group requirement status and group validation.

Checkbox does not create a public Checkbox Group component.

## When To Use

Use a standalone Checkbox for:

- agreeing to a mandatory term;
- opting into an optional service;
- enabling one preference;
- confirming that a statement is true.

Use several Checkboxes inside Fieldset when users can select more than one related option.

Use Radio instead when the choices are mutually exclusive. Do not use Checkbox to build a Switch, conditional reveal component or custom ARIA checkbox.

## Anatomy

Figma visual anatomy:

```text
Checkbox root
|-- Option row
|   |-- Visual control
|   `-- Option content
|       |-- Label
|       `-- Description - optional
`-- Error message - individual error states only
```

The semantic implementation still requires a native `input type="checkbox"` and retains native input ownership even though that input is not a literal layer in the Figma visual tree. The native input must remain available to assistive technology. Do not hide it with `display: none` or `visibility: hidden`.

The visual control represents the native input. The complete visible Label and native input form the primary clickable target. The optional Description and individual Error remain outside the HTML label so they are exposed as descriptions, not as part of the Checkbox name.

Figma uses one visible Label text layer. Do not create a Label row, Optional-marker layer or separate optional-status column.

## Standalone And Grouped Use

An individual standalone Checkbox owns its input, `id`, `name`, `value`, checked state, indeterminate property, disabled state, complete visible label, optional description and individual error state when it is independently validated.

When several Checkbox instances answer one shared question, place them inside Fieldset. Fieldset owns:

- the native `fieldset` and `legend`;
- shared helper text;
- shared error text;
- required, optional or mixed group status;
- minimum, maximum or exact selection constraints;
- group-level validation;
- the spacing between the group header and Checkbox content.

Use `form.group.gap.betweenOptions` between sibling Checkbox instances. Do not create a Checkbox Group wrapper, YAML file, Markdown file or token namespace.

## Native HTML

Requirements:

- use `input type="checkbox"`;
- give every Checkbox a unique `id`;
- give every Checkbox a meaningful `name`;
- give every Checkbox a non-empty `value`, especially where several related Checkboxes share a name;
- give every Checkbox its own visible associated label;
- associate the label with the input using `for` and `id`;
- use native `checked` and `disabled` state;
- do not use `role="checkbox"` on a native Checkbox;
- do not add `aria-checked` to duplicate native semantics;
- do not use `readonly`;
- do not hide the native input with `display: none` or `visibility: hidden`.

The native `checked` state is the source of truth for checkedness. Checked enabled Checkboxes submit their `name` and `value`. Unchecked Checkboxes are not included in native form submission, so consuming applications must handle the absent submitted name and value. Disabled Checkboxes are not submitted with the form.

Space toggles a focused Checkbox. Tab moves focus according to the normal document order. Do not add custom keyboard handling that conflicts with native Checkbox behaviour.

## Indeterminate

Checkbox supports an indeterminate presentation.

Indeterminate is set through the native input's `indeterminate` DOM property. It is not an HTML content attribute. It is also independent of native checkedness, so form submission is still determined by the checked state, not by the indeterminate visual presentation.

Use indeterminate primarily for an aggregate parent Checkbox representing partially selected child Checkboxes. Do not use it as a third user answer such as "unknown", "maybe" or "not applicable".

Do not add `aria-checked="mixed"` to a native Checkbox when the native indeterminate property provides the state. Do not create a separate Indeterminate component.

In Figma, the `selection` property models the mutually exclusive displayed states `unchecked`, `checked` and `indeterminate`. That property is a design and handoff abstraction. Production DOM still has separate `checked` and `indeterminate` properties.

## Labels And Descriptions

Every Checkbox must have its own visible label. `labelText` represents the complete visible Checkbox label, including all visible wording. The label forms the accessible name, uses `form.label.typography` and `form.label.color`, and should describe the positive meaning of checking the control.

When optional wording is useful, include the established lowercase wording `(optional)` within `labelText`. It must flow as ordinary text with the rest of the label. Do not create a separately aligned marker, separate optional-status column or separate Figma layer.

Production code does not have to store the complete label as one indivisible string. It may author one complete string, append a textual optional suffix or render the suffix in an inline textual `<span>`. The resulting content must remain inside the associated native `<label>` and flow as ordinary inline text.

Use clear affirmative wording. Do not put descriptions, links, buttons or other interactive descendants inside the label. Do not replace the label with placeholder text.

Checkbox supports an optional Checkbox-specific description. Use it only when that individual Checkbox needs additional explanation. Place it visually below the label, keep it outside the associated `label`, give it a stable ID and reference it from that Checkbox using `aria-describedby`.

When `description=false`, omit the description element instead of rendering empty markup. A hidden description must not reserve layout space. Descriptions must not contain links, buttons or other interactive descendants.

Shared guidance for a Checkbox group belongs in Fieldset helper text. Do not repeat the same group-wide guidance beneath every Checkbox.

## Required And Optional

The design system's visible authoring pattern remains "required unless marked optional", but being optional is normally the default semantic state for a Checkbox. Optionality is not a separate native Checkbox state or public Checkbox property.

For a standalone Checkbox, native `required` means the Checkbox must be checked before the form is valid. Use it only where a positive checked answer is genuinely mandatory.

A mandatory standalone Checkbox does not display `(required)` by default and must not gain `(optional)`. An optional standalone Checkbox may include `(optional)` within its complete visible label when that guidance is useful. The suffix is visible authoring guidance, belongs within `labelText`, and is part of the same visible text flow and accessible name.

For example:

- `Send me product updates (optional)`
- `Share anonymous usage data (optional)`
- `I agree to the terms` for an independently mandatory acceptance Checkbox

For a Checkbox group, Fieldset owns group-level required or optional wording. Do not repeat "(optional)" on every Checkbox when the complete group is optional.

Do not apply `required` to one arbitrary Checkbox as a shortcut for "select at least one". Applying `required` to every Checkbox means every Checkbox is individually mandatory, which is not equivalent to requiring one selection. Minimum, maximum and exact selection-count rules require group-level validation owned by Fieldset.

## Validation

Checkbox supports an individual error state only when that specific native Checkbox has its own independent validation rule and is invalid. A mandatory standalone acceptance Checkbox is the typical example.

When that specific Checkbox is invalid:

- show visible inline error text;
- set `aria-invalid="true"` on the native Checkbox;
- associate the error using `aria-describedby`;
- list the description ID before the error ID when both are present;
- use `form.state.error.border`;
- keep the inline error visible when an error summary is present;
- link the error summary item to the Checkbox input;
- preserve the user's current checked state.

An inline Checkbox error is error text, not a separate error surface. Use `form.error.typography` and `form.error.color`; do not give the message a fill, surface padding or surface radius, and do not apply `form.error.background` to an ordinary inline field error. That background token is reserved for a component or pattern that explicitly defines a filled error surface or container. Error Summary remains distinct and uses its dedicated `form.errorSummary.*` tokens.

Optional preferences, optional consent choices and ordinary independent toggles normally have no error merely because they remain unchecked.

When a Checkbox group fails a shared rule such as "select at least one", Fieldset owns the group error. Individual Checkbox instances retain their normal visual states. Do not turn every Checkbox boundary red, repeat `aria-invalid="true"` on every child Checkbox or repeat the Fieldset error ID on every Checkbox.

A Checkbox used as one option inside a Fieldset must not use its individual error state for shared minimum, maximum, exact-selection or other group-answer rules. Those are Fieldset group errors.

An aggregate parent Checkbox uses an individual error variant only when that aggregate parent itself has an independent validation rule. It never inherits the child Fieldset's minimum-selection, maximum-selection, exact-selection or other shared group-answer error. If the aggregate parent is not independently validated, it does not use Checkbox error variants.

## Visual States

Checkbox has three displayed selection states:

- `unchecked`
- `checked`
- `indeterminate`

Checkbox has five component states:

- `default`
- `focus`
- `error`
- `errorFocus`
- `disabled`

The complete Figma variant matrix has 15 combinations.

Error and error focus combinations are only for a specific native Checkbox that is independently validated and invalid. Fieldset-owned grouped validation must not place the aggregate parent or every child Checkbox into an individual error state.

Checked/error and checked/errorFocus preserve checkedness when that specific Checkbox fails a different independent validation rule. Indeterminate/error and indeterminate/errorFocus preserve the indeterminate presentation only when that specific aggregate Checkbox has its own independent validation rule. These variants do not imply that an ordinary required standalone Checkbox remains invalid after it has been checked, and they do not represent a shared validation error belonging to the child Checkbox group.

Focus surrounds the square visual control, not the whole option row. Use the established double-layer focus strategy with `form.state.focus.separator`, `form.state.focus.ring` and `border.width.medium`. The focus shape follows the Checkbox visual control radius, not Radio's circular focus shape.

Disabled checked and disabled indeterminate states must remain visually distinguishable. Do not rely on opacity alone.

## Figma Usage

Component properties:

| Property | Type | Values |
| --- | --- | --- |
| `selection` | Variant | `unchecked`, `checked`, `indeterminate` |
| `state` | Variant | `default`, `focus`, `error`, `errorFocus`, `disabled` |
| `description` | Boolean | `false`, `true` |
| `labelText` | Text | Complete visible Checkbox label |
| `descriptionText` | Text | Checkbox-specific description |
| `errorText` | Text | Individual error text |

`selection` defaults to `unchecked`. `state` defaults to `default`. `description` defaults to `false`.

`labelText` contains all visible label wording, including `(optional)` when that guidance is authored. `descriptionText` is required only when `description=true`. `errorText` is visible only in `error` and `errorFocus`.

This is the complete public Figma property list. Do not add an `optional` Boolean or replacement `optionalText`, `requirement`, `required`, `labelSuffix`, `width`, responsive-layout property or another variant axis. Do not create helper-text, error-text or optional-marker variant axes, a Checkbox Group property, or a native-required Figma property where it creates no visible difference.

The visual control is 24 x 24. Indicator choice is determined by `selection`: `unchecked` has no visible indicator, `checked` uses a nested `Icon/check` instance and `indeterminate` uses a nested `Icon/minus` instance. Resize both nested icon component frames to `component.checkbox.indicator.size`, which aliases `size.icon.md` and resolves to 20 x 20. Centre the indicator frame inside the visual control. Do not detach the icon instances, redraw their vector paths or create a separate Figma property for icon choice. The existing internal spacing in each icon component controls the visible mark size.

Nested icon colour must come from the Checkbox state: use `form.state.selected.foreground` in enabled checked and indeterminate states, and `form.state.disabled.foreground` in disabled checked and disabled indeterminate states. Do not rely on the source icon component's library default colour inside Checkbox instances.

### Confirmed Figma Auto Layout Limitation

Figma Auto Layout wraps child rectangles rather than inline text fragments. The confirmed behaviour is:

- an intrinsic or Hug Label keeps a separate marker adjacent, but long Label text cannot wrap within the available width;
- a Fill, automatic-height Label wraps, but a separate marker follows the Label rectangle rather than the final text glyph and appears edge-pinned;
- a fixed Label width can coordinate separate layers, but creates arbitrary early wrapping and detached optional wording;
- therefore Checkbox uses one visible Label text layer.

This is a Figma Auto Layout limitation, not a browser or production-code limitation. Production HTML may still use one complete string, append a textual suffix, or place the suffix in an inline textual `<span>` inside the associated `<label>`.

### Single Label And Reflow

In Figma, Option content fills the remaining width and stacks one Label text layer above the optional Description.

- Label fills the available Option-content width and uses automatic height.
- Label has no arbitrary fixed width or max width.
- Label wraps naturally within the Checkbox root.
- `(optional)` is authored within `labelText` and wraps as part of the same text.
- Do not create a Label row, Optional-marker layer, separate optional-status column or right-aligned suffix.
- The visual control remains aligned with the Label's first line.
- Description and Error message wrap independently.
- The complete Checkbox reflows within a 320px-wide container.
- Hiding Description or Error leaves no gap, and removed Optional-marker anatomy leaves zero residual layout space.

QA must cover 288px, 320px, 400px, 480px and 640px widths. At every width, test short, medium and long labels; optional wording within short, medium and long labels; Description hidden and visible; a long Description; a long inline Error; and all 15 selection/state variants.

Accept only layouts with no arbitrary Label width or max width, escaped descendants, overlap, clipping, detached or right-aligned optional wording, separate marker layer, or residual marker space. Text must wrap naturally and the visual control must remain aligned with the first line.

### Figma Migration Guidance

This guidance is for the upcoming Figma correction; this source task does not modify Figma.

1. Before removing the existing `optional` property, find every Checkbox instance where `optional=true`.
2. Preserve every existing `labelText` override and append ` (optional)` to the current value unless it is already present.
3. Remove the Optional-marker property reference and layer.
4. Remove the public `optional` component property only after instance text has been migrated.
5. Audit every Checkbox instance for duplicated or missing suffixes.

## Examples

### Standalone Unchecked

```html
<input id="paperless" name="paperless" type="checkbox" value="yes">
<label for="paperless">Use paperless billing</label>
```

### Standalone Checked

```html
<input id="email-receipts" name="email-receipts" type="checkbox" value="yes" checked>
<label for="email-receipts">Email me receipts</label>
```

### Optional Standalone

```html
<input id="product-updates" name="product-updates" type="checkbox" value="yes">
<label for="product-updates">Send me product updates (optional)</label>
```

Production HTML may keep optional wording as ordinary inline text inside the label:

```html
<input id="usage-data" name="usage-data" type="checkbox" value="yes">
<label for="usage-data">Share anonymous usage data <span>(optional)</span></label>
```

The inline `<span>` does not imply a separate Figma layer or Checkbox property.

### Mandatory Standalone

```html
<input id="terms" name="terms" type="checkbox" value="accepted" required>
<label for="terms">I agree to the terms</label>
```

### Description

The `.checkbox`, `.checkbox__option` and `.checkbox__content` class names used in the following examples are illustrative only. They demonstrate one possible implementation structure and are not required public API.

```html
<div class="checkbox">
  <div class="checkbox__option">
    <input
      id="sms-alerts"
      name="sms-alerts"
      type="checkbox"
      value="yes"
      aria-describedby="sms-alerts-description"
    >
    <div class="checkbox__content">
      <label for="sms-alerts">Send me text alerts</label>
      <div id="sms-alerts-description">
        We will only text you about important account activity.
      </div>
    </div>
  </div>
</div>
```

### Individual Error

```html
<div class="checkbox">
  <div class="checkbox__option">
    <input
      id="terms-invalid"
      name="terms"
      type="checkbox"
      value="accepted"
      required
      aria-describedby="terms-error"
      aria-invalid="true"
    >
    <label for="terms-invalid">I agree to the terms and conditions</label>
  </div>

  <p id="terms-error">
    <span class="visually-hidden">Error:</span>
    Confirm that you agree before continuing.
  </p>
</div>
```

### Description And Individual Error

```html
<div class="checkbox">
  <div class="checkbox__option">
    <input
      id="legal-confirmation"
      name="legal-confirmation"
      type="checkbox"
      value="confirmed"
      required
      aria-describedby="legal-confirmation-description legal-confirmation-error"
      aria-invalid="true"
    >
    <div class="checkbox__content">
      <label for="legal-confirmation">I confirm the information is accurate</label>
      <div id="legal-confirmation-description">
        Check this only after reviewing every section.
      </div>
    </div>
  </div>
  <p id="legal-confirmation-error">
    <span class="visually-hidden">Error:</span>
    Confirm the information is accurate before continuing.
  </p>
</div>
```

### Grouped Checkboxes Inside Fieldset

```html
<fieldset aria-describedby="contact-options-hint">
  <legend>How would you like us to contact you?</legend>
  <p id="contact-options-hint">Select all options that apply.</p>

  <div>
    <input id="contact-email" name="contact-options" type="checkbox" value="email">
    <label for="contact-email">Email</label>
  </div>

  <div>
    <input id="contact-sms" name="contact-options" type="checkbox" value="sms">
    <label for="contact-sms">Text message</label>
  </div>
</fieldset>
```

### Group-Level Error Owned By Fieldset

```html
<fieldset aria-describedby="contact-options-hint contact-options-error">
  <legend>How would you like us to contact you?</legend>
  <p id="contact-options-hint">Select all options that apply.</p>
  <p id="contact-options-error">
    <span class="visually-hidden">Error:</span>
    Select at least one contact method.
  </p>

  <div>
    <input id="contact-email-error" name="contact-options" type="checkbox" value="email">
    <label for="contact-email-error">Email</label>
  </div>

  <div>
    <input id="contact-sms-error" name="contact-options" type="checkbox" value="sms">
    <label for="contact-sms-error">Text message</label>
  </div>
</fieldset>
```

### Same-Named Grouped Checkboxes

```html
<fieldset>
  <legend>Which newsletters do you want?</legend>

  <input id="news-product" name="newsletters" type="checkbox" value="product">
  <label for="news-product">Product updates</label>

  <input id="news-events" name="newsletters" type="checkbox" value="events">
  <label for="news-events">Events</label>
</fieldset>
```

### Indeterminate Parent

```html
<input id="all-notifications" name="all-notifications" type="checkbox" value="all">
<label for="all-notifications">Select all notification methods</label>

<fieldset>
  <legend>Notification methods</legend>

  <input id="notification-email" name="notification-methods" type="checkbox" value="email" checked>
  <label for="notification-email">Email</label>

  <input id="notification-sms" name="notification-methods" type="checkbox" value="sms">
  <label for="notification-sms">Text message</label>
</fieldset>

<script>
  const parentCheckbox = document.getElementById("all-notifications");
  const childCheckboxes = [
    document.getElementById("notification-email"),
    document.getElementById("notification-sms")
  ];

  function updateParentCheckbox() {
    const checkedCount = childCheckboxes.filter((checkbox) => checkbox.checked).length;
    const allChildrenChecked = checkedCount === childCheckboxes.length;
    const someButNotAllChildrenChecked = checkedCount > 0 && !allChildrenChecked;

    parentCheckbox.checked = allChildrenChecked;
    parentCheckbox.indeterminate = someButNotAllChildrenChecked;
  }

  parentCheckbox.addEventListener("change", () => {
    childCheckboxes.forEach((checkbox) => {
      checkbox.checked = parentCheckbox.checked;
    });
    updateParentCheckbox();
  });

  childCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateParentCheckbox);
  });

  updateParentCheckbox();
</script>
```

### Disabled States

```html
<input id="archived-alerts" name="archived-alerts" type="checkbox" value="yes" disabled>
<label for="archived-alerts">Send alerts for archived projects</label>

<input id="required-audit" name="required-audit" type="checkbox" value="yes" checked disabled>
<label for="required-audit">Keep audit logging enabled</label>

<input id="locked-topics" name="locked-topics" type="checkbox" value="all" disabled>
<label for="locked-topics">Select all locked topics</label>
<script>
  const lockedTopics = document.getElementById("locked-topics");
  lockedTopics.indeterminate = true;
</script>
```

Submission checks:

- a disabled Checkbox is not included in submitted form data, regardless of checkedness or indeterminate presentation;
- an enabled Checkbox with `checked=false` and `indeterminate=true` does not submit a name/value pair;
- an enabled Checkbox with `checked=true` and `indeterminate=true` submits its configured name/value pair.

Indeterminate does not determine submission. Checkedness determines whether an enabled Checkbox submits, and disabled state prevents submission in every selection presentation.

## Tokens

Checkbox reuses shared form tokens for labels, descriptions, errors, focus, disabled, error and selected treatments.

New shared semantic tokens:

```text
form.state.selected.background
form.state.selected.foreground
```

New component geometry tokens:

```text
component.checkbox.control.size
component.checkbox.indicator.size
```

`component.checkbox.control.size` aliases `size.target.minimum` and resolves to 24px. `component.checkbox.indicator.size` aliases `size.icon.md` and resolves to 20px. Use the shared indicator token for both `Icon/check` and `Icon/minus`; do not add bespoke Checkbox vectors, a separate indeterminate icon component, a second minus-size token or Checkbox-specific icon-colour tokens.

Do not add Checkbox-specific aliases for existing radius, border width, focus colours, error colours, selected colours, typography, disabled colours or layout spacing. Do not add responsive Checkbox tokens.

## Accessibility

Target WCAG 2.2 AA, but do not claim Checkbox alone guarantees conformance. Fieldset composition, validation and surrounding form behaviour must also be correct.

Check:

- native name, role and state;
- visible label association;
- Label in Name;
- keyboard operation with Tab and Space;
- visible focus and focus not obscured;
- error identification and suggestions;
- non-text contrast and text contrast;
- use of colour;
- minimum target size;
- reflow, text spacing and 200% zoom;
- forced-colours or high-contrast mode;
- long wrapping labels, descriptions and individual errors;
- narrow containers;
- checked, unchecked, indeterminate and disabled screen-reader announcement;
- programmatic description and individual-error association;
- native form-submission behaviour;
- unchecked-value absence in submitted form data;
- checked and unchecked indeterminate submission according to checkedness;
- disabled Checkbox exclusion from submitted form data in unchecked, checked and indeterminate presentations;
- Fieldset ownership for group validation;
- preserving selections after failed validation.

## Acceptance Checklist

- One public Checkbox component is created.
- No Checkbox Group component or token namespace is created.
- Checkbox supports standalone use and use inside Fieldset.
- Native `input type="checkbox"` is required.
- Every Checkbox has a visible label.
- Descriptions default to `false`, remain outside the label and are associated only with the relevant Checkbox.
- The public Figma properties are exactly `selection`, `state`, `description`, `labelText`, `descriptionText` and `errorText`.
- No replacement optional property, width property, responsive-layout property or variant axis is introduced.
- `labelText` contains the complete visible label, including `(optional)` when authored.
- Option content fills the available width and contains one visible, automatic-height Label text layer.
- Label has no arbitrary fixed width or max width.
- No Label row, Optional-marker layer, separate status column or right-aligned optional wording is created.
- Labels, descriptions and individual errors wrap naturally and independently without escaped descendants, clipping, overflow or overlap.
- Optional wording stays in the Label text flow and never becomes detached.
- The visual control stays aligned to the Label's first line.
- Figma QA covers 288px, 320px, 400px, 480px and 640px with short, medium and long labels, optional wording at every label length, hidden and visible descriptions, a long description and a long inline error.
- All 15 variants remain non-overlapping.
- Removed Optional-marker anatomy leaves zero residual layout space; hidden Description and Error layers leave no empty gap.
- Native input ownership remains mandatory even when Figma omits a literal hidden native-input layer.
- `selection` supports `unchecked`, `checked` and `indeterminate`.
- `state` supports `default`, `focus`, `error`, `errorFocus` and `disabled`.
- Individual error states are limited to independently validated Checkbox controls.
- Fieldset group errors do not produce individual Checkbox error styling.
- Checked/error and checked/errorFocus preserve checkedness only for a different independent validation rule on that specific Checkbox.
- Indeterminate/error and indeterminate/errorFocus require an independent validation rule on that specific aggregate Checkbox.
- Aggregate parent and child Checkboxes do not inherit Fieldset group errors.
- Independently invalid Checkboxes include visible error text and `aria-invalid`.
- Indeterminate is documented as a DOM property rather than an HTML attribute.
- Switch, read-only and responsive Checkbox token groups are excluded.
