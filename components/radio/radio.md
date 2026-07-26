# Radio

**Status:** Draft
**Version:** 0.1.0
**Machine-readable specification:** [`radio.yaml`](./radio.yaml)
**Component tokens:** [`../../tokens/components/radio.json`](../../tokens/components/radio.json)

## Overview

Radio is an individual option in a set of native radio inputs. Use it when users must choose exactly one answer from mutually exclusive options.

A Radio set is composed by placing multiple Radio instances inside the existing Fieldset content slot. Fieldset provides the native `fieldset` and `legend`, the shared question, group helper text, group error text and required or optional group status.

Radio does not create a public Radio Group component.

## When to use

Use Radios when:

- users can choose exactly one option;
- the options should be visible without opening a menu;
- the option labels are short enough to scan;
- there are usually only a few options.

Use Checkboxes when users can choose more than one option. Use Select when the list is long or when showing every option would make the form harder to scan.

Do not preselect an option merely to avoid an unanswered state. Restoring a previously selected or saved answer is allowed. If returning to no selection is a legitimate user need, provide an explicit option such as "None", "Not applicable" or "I do not know".

## Anatomy

```text
Radio
├── Native input
├── Visual control
│   └── Selected indicator
└── Option content
    ├── Label
    └── Description - optional
```

The native input and visual control may overlap or be visually composed in implementation, but the native input must remain available to assistive technology. Do not hide it with `display: none` or `visibility: hidden`.

The native control and visible label must form a generous clickable target. The optional description remains outside the label text so it is announced as a description, not as part of the Radio name.

## Fieldset Composition

Radio relies on Fieldset for grouped semantics:

- Fieldset owns the shared question through `legend`;
- Fieldset owns group helper text and group error text;
- Fieldset owns required or optional group status;
- Fieldset owns the gap between the group header and content slot;
- Fieldset may use the native `disabled` attribute when the complete group is unavailable.

Individual Radios own their `input type="radio"`, `id`, `name`, `value`, label, optional option description, selected state, focus state and disabled state.

## Labels And Legends

The legend identifies the shared question. Fieldset helper text gives shared guidance for the whole group. Fieldset error text gives group-level validation feedback. Each Radio label identifies one answer option.

The legend does not replace Radio labels. Every Radio option needs its own visible label.

Do not put required or optional wording on individual Radio labels. Required and optional status belongs in the Fieldset legend.

## Option Descriptions

Most Radio options need only a concise visible label. Add an option description only when that specific choice needs extra explanation. Put information that applies to the whole group in the Fieldset helper text instead.

Option descriptions are optional and should be uncommon. Use them for choices such as delivery methods with different timescales, payment methods with option-specific consequences, or an answer that needs clarification that does not apply to the others.

Give the description a stable ID and reference it from that Radio using `aria-describedby`. The Radio label remains the accessible name for one option. The option description is the optional accessible description for that option.

Do not put the description inside the associated `label`. Do not associate it as a second label. When no option description exists, omit both the description element and `aria-describedby`; do not render an empty description element or reserve hidden spacing.

Group-wide guidance belongs in Fieldset helper text. Do not automatically repeat Fieldset helper or error IDs on every Radio.

## Required And Optional Groups

Fieldset communicates group requirement status. Required groups do not need a visible suffix when the form pattern says fields are required unless marked optional. Optional groups include `(optional)` in the Fieldset legend.

Fieldset itself has no native `required` attribute. Required selection is a group-level implementation concern expressed through the native Radio inputs and the validation pattern.

## Selected State

The native `checked` state is the source of truth. The selected visual state mirrors the native checked state with a selected boundary and inner circular indicator.

Only one Radio with the same `name` in the same form owner can be selected.

## Focus Behaviour

Visible focus surrounds the circular Radio control, not the whole option row. Use the shared double-ring focus treatment:

```text
separator colour: form.state.focus.separator
separator width: border.width.medium
outer ring colour: form.state.focus.ring
outer ring width: border.width.medium
shape: circular
```

Focus must remain visible for selected and unselected Radios.

## Disabled Behaviour

Disabled Radios use the native `disabled` attribute. They cannot receive focus and are not submitted with the form.

Support disabled unselected and disabled selected states. The disabled selected state must still communicate that the option is selected. Do not rely on opacity alone.

## Validation And Errors

A missing required selection is a Fieldset group error.

Fieldset displays the inline error message and associates it with the Fieldset using `aria-describedby`. Radio options retain their normal visual state. Do not turn every Radio boundary red, do not create individual Radio error messages, and do not apply `aria-invalid` to every Radio for a missing group selection.

When an error summary links to a missing Radio answer, target the first relevant visible, enabled Radio in the group. On activation, scroll the legend into view and focus that Radio, never Fieldset. Preserve programmatic access to the Fieldset-owned inline error without repeating its ID on every Radio, and preserve the user's selected value after validation.

## Native HTML

Requirements:

- use `input type="radio"`;
- give every Radio a unique `id`;
- give every Radio a non-empty `value`;
- give every Radio in one set the same non-empty `name`;
- give every Radio its own visible associated label;
- associate the visible label with the input using `for` and `id`;
- keep the label text limited to the option accessible name;
- keep any option description outside the associated label;
- use `aria-describedby` only when an option description exists;
- use native `checked` and `disabled` state;
- do not use `role="radio"` or `aria-checked` on native radio inputs;
- do not use `readonly`.

Native keyboard behaviour must be preserved. Tab reaches the selected Radio in a group when one is selected, or the first enabled Radio when none is selected. Arrow keys and Space follow browser radio behaviour.

Click behaviour should come from native controls. Clicking the visible label activates the Radio, and clicking the native control activates the Radio. Implementations may enlarge the visual label hit area using layout and CSS while keeping the option row at the documented minimum block size. Do not compromise the label-description separation merely to make the description itself toggle the Radio.

## Simple Default Example

```html
<fieldset aria-describedby="contact-hint">
  <legend>How would you like to be contacted?</legend>
  <p id="contact-hint">Choose one option.</p>

  <div>
    <input id="contact-email" name="contact-method" type="radio" value="email">
    <label for="contact-email">Email</label>
  </div>

  <div>
    <input id="contact-phone" name="contact-method" type="radio" value="phone">
    <label for="contact-phone">Telephone</label>
  </div>
</fieldset>
```

## Option Description Example

The `.radio` and `.radio__content` class names are illustrative only. They demonstrate one possible implementation structure and are not required public API. Consuming implementations may use different class names or styling approaches while preserving the documented native HTML semantics and accessible relationships.

```html
<fieldset>
  <legend>Choose a delivery method</legend>

  <div class="radio">
    <input
      id="delivery-standard"
      name="delivery-method"
      type="radio"
      value="standard"
      aria-describedby="delivery-standard-description"
    >

    <div class="radio__content">
      <label for="delivery-standard">Standard delivery</label>
      <div id="delivery-standard-description">
        Usually arrives within 3 to 5 working days.
      </div>
    </div>
  </div>

  <div class="radio">
    <input
      id="delivery-express"
      name="delivery-method"
      type="radio"
      value="express"
      aria-describedby="delivery-express-description"
    >

    <div class="radio__content">
      <label for="delivery-express">Express delivery</label>
      <div id="delivery-express-description">
        Usually arrives the next working day.
      </div>
    </div>
  </div>
</fieldset>
```

## Layout

The Radio control appears before the label. Use horizontal layout for the control and option content. Option content stacks the label and optional description vertically.

Align the control with the first line of the label rather than centering it against a long description. Labels and descriptions may wrap.

Use `spacing.control.gap` between the control and option content. Use `form.group.gap.betweenOptions` between Radio instances inside the Fieldset slot. Fieldset continues to own `form.group.gap.headerToContent`.

Vertical Radio sets are the default composition. Horizontal layout is a parent composition decision, not a Radio component variant.

## Figma Usage

Component properties:

| Property | Type | Values |
| --- | --- | --- |
| `selected` | Variant | `false`, `true` |
| `state` | Variant | `default`, `focus`, `disabled` |
| `description` | Boolean | `false`, `true` |
| `labelText` | Text | Any visible option label |
| `descriptionText` | Text | Option-specific description |

`description` defaults to `false`. A hidden description collapses without empty spacing. A description is supported for documented option-specific cases, but it is not the normal default.

Figma visual grouping does not mean the HTML label contains the description. Handoff notes must preserve the semantic separation: label text provides the Radio accessible name, and description text is a sibling referenced with `aria-describedby`.

Do not create Figma variants for error, error focus, hover, active, read-only, indeterminate, required, optional or responsive size. Do not create a Radio Group Figma component.

## Accessibility

Target WCAG 2.2 AA, but do not claim Radio alone guarantees conformance. Fieldset composition, validation and surrounding form behaviour must also be correct.

Check:

- the Fieldset legend is announced as the group question;
- each Radio label is announced as the option name;
- option descriptions are not included in Radio accessible names;
- selected and disabled states are exposed;
- option descriptions are announced when present;
- plain options omit `aria-describedby` when no option description exists;
- keyboard operation follows native browser behaviour;
- focus is visible on selected and unselected Radios;
- labels and descriptions wrap at narrow widths, 200% zoom and text-spacing overrides;
- selected state and focus remain perceivable in forced-colours or high-contrast modes;
- missing-selection errors are shown and associated at Fieldset level.

## Testing

Test at least:

- unselected default;
- selected default;
- unselected focus;
- selected focus;
- disabled unselected;
- disabled selected;
- optional option description;
- long wrapping label;
- long wrapping description;
- narrow container;
- several Radio instances sharing one name;
- unique IDs and values;
- Fieldset helper plus option descriptions;
- missing-selection Fieldset error without Radio error styling;
- error-summary scrolling the legend and focusing the first relevant visible, enabled Radio without focusing Fieldset;
- no default preselection;
- restored previous selection;
- 200% zoom;
- text-spacing adjustments;
- forced-colours or high-contrast mode;
- keyboard interaction;
- screen-reader announcement of legend, option label, selected state and option description.
