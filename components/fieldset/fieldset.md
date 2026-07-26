# Fieldset

**Status:** Draft
**Version:** 0.1.0
**Machine-readable specification:** [`fieldset.yaml`](./fieldset.yaml)

## Overview

Fieldset groups related form controls that answer one shared question.

It uses native HTML `<fieldset>` and `<legend>` elements. The legend gives the group its accessible name, while optional group helper text and group-level errors can provide a shared description through `aria-describedby`.

Fieldset provides a generic content slot for child form components. It is the foundation for Radio groups, Checkbox groups, Date of birth, Address groups and other multi-part questions.

Fieldset is the published component. Legend is mandatory anatomy within Fieldset, not a separate public component.

The YAML specification is the source of truth for the machine-readable component contract. This document explains how designers, developers, content authors and AI systems should apply that contract.

## When to use

Use Fieldset for:

- radio groups;
- checkbox groups;
- date-of-birth inputs;
- address groups;
- several related controls answering one question;
- genuine parent-child grouped questions.

## When not to use

Do not use Fieldset:

- for a standalone control;
- as a generic layout wrapper;
- only to add spacing, a border or visual grouping;
- for unrelated fields;
- around arbitrary page content;
- where a visible label for one control is sufficient.

## Anatomy

```text
Fieldset
├── Group header - internal layout wrapper
│   ├── Legend
│   ├── Group helper text - optional
│   └── Group error message - error state only
└── Related controls / content slot
```

Use this order:

1. Legend
2. Helper text
3. Error message
4. Related controls

The legend and content slot are required. Group helper text is optional. Group error message appears only when there is a group-level error.

Group header is an internal layout wrapper for Figma and implementation structure. It is not an extra public HTML part, and it must not change the native order.

Omitted optional elements must not leave empty markup or empty spacing.

## Native HTML requirements

Use a native `<fieldset>`.

The native `<legend>` is mandatory and must be the first direct child of the `<fieldset>`.

Do not:

- add `role="group"` to a native Fieldset;
- make the Fieldset focusable;
- add a positive `tabindex`;
- add `tabindex="-1"` by default;
- put `required` on the Fieldset;
- put `readonly` on the Fieldset.

Fieldset may use the native `disabled` attribute when the whole group is unavailable.

Child controls retain their own labels, names, roles, values and states.

```html
<fieldset>
  <legend>How would you like to be contacted?</legend>

  <label>
    <input type="radio" name="contact-method" value="email">
    Email
  </label>

  <label>
    <input type="radio" name="contact-method" value="phone">
    Phone
  </label>
</fieldset>
```

## Legend and child labels

The legend identifies the shared group question.

Labels identify individual child controls.

The legend does not replace child labels. A label does not replace the legend.

Keep the legend visible by default. Do not replace it with placeholder text, hidden-only text or child labels.

Do not put interactive content inside a legend. This includes links, buttons, inputs and focusable descendants.

Legend text may wrap and must not be truncated.

## Legend as a heading

A heading may be nested inside the legend when the grouped question genuinely participates in the document heading structure.

Plain legend is the default semantic configuration:

```html
<fieldset>
  <legend>What is your address?</legend>
  ...
</fieldset>
```

Use a nested heading only when the document structure needs one:

```html
<fieldset>
  <legend>
    <h2>What is your address?</h2>
  </legend>
  ...
</fieldset>
```

Do not automatically add a heading to every legend.

Heading level follows the real document structure. Do not choose a heading level only for visual size.

Do not duplicate identical text in a heading before the Fieldset and in the legend.

H1 through H6 are allowed when structurally correct.

Visual legend style and semantic heading level are separate decisions.

| Legend style | Typical semantic heading |
| ------------ | ------------------------ |
| Page         | H1                       |
| Default      | H2 or no heading         |
| Section      | H3                       |
| Subsection   | H4                       |
| Compact      | No heading               |

H5 and H6 are supported semantically but do not currently have dedicated Fieldset visual tokens.

## Responsive legend styles

Fieldset supports these legend styles:

- `page`
- `default`
- `section`
- `subsection`
- `compact`

The default component style is `default`.

Style mappings:

- `page` uses responsive H1-aligned typography;
- `default` uses responsive H2-aligned typography;
- `section` uses responsive H3-aligned typography;
- `subsection` uses responsive H4-aligned typography;
- `compact` uses responsive form-label typography.

A plain legend may use H2-aligned visual styling without becoming an H2. Visual styling does not create heading semantics.

## Required, optional and mixed groups

Fields are treated as required unless marked optional.

### Required groups

Required groups do not use a suffix by default.

Fieldset itself has no native `required` attribute. Required behaviour is owned by child controls or by the grouped child component.

```html
<fieldset>
  <legend>What is your preferred contact method?</legend>
  ...
</fieldset>
```

### Optional groups

Add `(optional)` to the visible legend.

The optional wording is part of the accessible group name.

```html
<fieldset>
  <legend>What is your previous address? (optional)</legend>
  ...
</fieldset>
```

### Mixed groups

Use mixed groups where child controls have different requirement states.

Do not add `(required)` or `(optional)` to the group legend. Individual child labels communicate their own statuses.

```html
<fieldset>
  <legend>What is your delivery address?</legend>

  <label for="address-line-1">Address line 1</label>
  <input id="address-line-1" name="address-line-1" required>

  <label for="address-line-2">Address line 2 (optional)</label>
  <input id="address-line-2" name="address-line-2">
</fieldset>
```

## Group helper text

Group helper text is optional.

Use it for shared constraints, examples or explanatory guidance that helps users answer the grouped question.

Place group helper text after the legend and before any group error.

Keep it visible after validation when it still helps users correct the answer.

Give group helper text a stable ID and associate it with the Fieldset using `aria-describedby`.

Do not automatically repeat group helper text on every child control. Child-specific help remains associated with the relevant child.

```html
<fieldset aria-describedby="dob-hint">
  <legend>What is your date of birth?</legend>

  <div id="dob-hint">
    For example, 31 3 1980.
  </div>

  ...
</fieldset>
```

## Group errors

Use this order when a group error is present:

```text
Legend
Helper text, if present
Group error
Related controls
```

A group error appears only for a group-level problem.

Give the group error a stable ID and associate it with the Fieldset through `aria-describedby`.

Keep the inline group error when an error summary exists.

Use specific and actionable error text. Explain what went wrong and how to fix it where possible.

Do not rely on colour alone. Preserve user-entered values and selections.

When helper and error text are both present, the helper ID comes before the error ID:

```html
<fieldset aria-describedby="contact-hint contact-error">
  <legend>How would you like to be contacted?</legend>

  <div id="contact-hint">
    Select all options that apply.
  </div>

  <p id="contact-error">
    <span class="visually-hidden">Error:</span>
    Select at least one contact method.
  </p>

  ...
</fieldset>
```

## Validation ownership

Grouped controls can have whole-group errors, child-field errors and combination errors. The error owner determines where the message is shown and what receives `aria-invalid`.

### Whole-group error

Examples:

- no required Radio selected;
- no required Checkbox selected;
- no part of a required group answered.

Rules:

- show a group-level error;
- associate it with Fieldset;
- do not make Fieldset focusable;
- do not apply `aria-invalid` to Fieldset by default;
- error-summary link targets the first relevant visible, enabled interactive child;
- activation scrolls the legend into view and focuses that child, never Fieldset;
- the Fieldset-owned inline error remains programmatically available.

### Child-field error

Examples:

- missing year in Date of birth;
- invalid postcode inside an address group.

Rules:

- child component owns the error;
- associate the error with the specific child;
- only the affected control receives `aria-invalid` where required;
- error-summary activation scrolls the child's label into view and focuses the visible, enabled child;
- preserve the child's `aria-describedby` access to its inline error;
- do not add a second vague group error.

### Combination error

Examples:

- date is not real;
- start date follows end date;
- answers conflict.

Rules:

- use a group-level error;
- associate it with Fieldset;
- summary link targets the first relevant visible, enabled control;
- activation scrolls the legend into view and focuses that control, never Fieldset;
- child component determines whether any individual children also receive invalid treatment.

## Error summary relationship

Fieldset does not render the page error summary.

An error summary supplements inline errors. It does not replace them.

Inline group or child errors remain visible.

Summary wording should match or clearly correspond to the inline error.

Summary links target a visible, enabled interactive child rather than the non-focusable Fieldset. Activation scrolls the associated label or legend into view and focuses the child while preserving the control's or Fieldset's established `aria-describedby` access to the inline error.

Do not add `tabindex` to Fieldset merely to make it an error-summary target.

## Disabled Fieldset

Use native `disabled` only when the whole group is unavailable.

Native descendant controls become disabled and are not submitted.

Disabled is not read-only.

Child components own disabled visual presentation.

Do not rely on opacity alone.

No new Fieldset disabled token is required.

## Nested Fieldsets

Nested Fieldsets are allowed only for a real parent-child question structure.

Each nested Fieldset needs its own legend.

Avoid unnecessary nesting. Never nest only for styling or spacing.

Test screen-reader verbosity because repeated group announcements can become hard to follow.

Sibling Fieldsets are often clearer.

## Content slot

The content slot may contain:

- Radio group;
- Checkbox group;
- Date of birth;
- related Text Inputs;
- related Selects;
- address fields;
- other documented grouped controls.

All children must relate to the legend.

Child labels remain where required. Child components retain their own interaction, state and validation contracts.

The slot fills the available width and hugs content vertically.

The child component controls vertical, horizontal or grid layout.

Do not create content-type variants. Do not put arbitrary navigation, actions or unrelated content in the slot.

## States

Fieldset owns only these states:

- Default
- Error

Do not create Fieldset states for:

- Hover
- Focus
- Error focus
- Filled
- Selected
- Read-only
- Child-control state
- Content type

Focus belongs to the slotted interactive controls.

## Width and layout

Fieldset uses Fill container.

The parent form layout controls the maximum width.

Do not create Fieldset width variants.

Fieldset has no fixed height.

Legend, helper and error text may wrap.

Do not add a default decorative border or background.

## Layout spacing

Use `form.group.gap.headerToContent` between the Group header and the content slot. This resolves through `spacing.stack.lg` to `spacing.6`, which is `1.5rem` or about 24px.

Inside the Group header, keep the tighter relationships:

- `form.field.gap.labelToHelper` between Legend and helper text;
- `form.field.gap.helperToError` between helper text and group error.

Group error remains inside the Group header. The error state uses the same `form.group.gap.headerToContent` gap between the Group header and content slot.

When helper text or group error is hidden, it must collapse without leaving empty spacing. Do not use one 24px gap across Legend, helper text, error message and content slot.

`form.field.gap.errorToControl` is for a single field inline error and its own control. `form.field.gap.controlToNextField` is for the gap after one complete field or Fieldset before the next field.

## Tokens

Use the current responsive legend tokens:

```text
form.legend.typography.page.base
form.legend.typography.page.md
form.legend.typography.page.lg

form.legend.typography.default.base
form.legend.typography.default.md
form.legend.typography.default.lg

form.legend.typography.section.base
form.legend.typography.section.md
form.legend.typography.section.lg

form.legend.typography.subsection.base
form.legend.typography.subsection.md
form.legend.typography.subsection.lg

form.legend.typography.compact.base
form.legend.typography.compact.md
form.legend.typography.compact.lg

form.legend.color
form.helper.typography.base
form.helper.typography.md
form.helper.typography.lg
form.helper.color
form.error.typography.base
form.error.typography.md
form.error.typography.lg
form.error.color
form.field.gap.labelToHelper
form.field.gap.helperToError
form.group.gap.headerToContent
form.group.gap.betweenOptions
form.group.gap.betweenFields
```

No Fieldset-specific token is currently required.

Do not document unavailable tokens or use raw visual values.

## Figma guidance

This guidance describes the future Figma component contract. It does not create the Figma component.

Properties:

- State: Default | Error
- Requirement: Required | Optional | Mixed
- Legend style: Page | Default | Section | Subsection | Compact
- Helper text: True | False
- Legend text
- Helper text
- Error text
- Content slot

Structure:

```text
Fieldset
├── Group header
│   ├── Legend
│   ├── Helper text
│   └── Error message
└── Content slot
```

Use the root Fieldset gap for `form.group.gap.headerToContent` between Group header and Content slot. Use the smaller header spacing tokens inside Group header.

Heading level is handoff metadata, not a visual variant.

The slot or instance swap should accept related form components.

Do not create variants for Radio, Checkbox, Date or Address.

Do not create a Fieldset focus variant.

Use responsive styles and Auto Layout.

## Accessibility requirements

Target WCAG 2.2 AA, but do not claim that using Fieldset automatically guarantees conformance. Slotted child controls and the surrounding form patterns must also be implemented correctly.

Relevant considerations:

- WCAG 1.3.1 Info and Relationships: native `<fieldset>` and `<legend>` expose the grouped relationship.
- WCAG 1.3.2 Meaningful Sequence: legend, helper text, group error and related controls must appear in a meaningful order.
- WCAG 1.4.1 Use of Color: errors and disabled states must not rely on colour alone.
- WCAG 1.4.3 Contrast Minimum: legend, helper and error text need sufficient contrast.
- WCAG 1.4.10 Reflow: content must wrap and reflow in narrow containers.
- WCAG 1.4.12 Text Spacing: adjusted text spacing must not clip or overlap content.
- WCAG 2.4.6 Headings and Labels: the legend must clearly describe the grouped question, and nested headings must follow the document structure.
- WCAG 3.3.1 Error Identification: group-level errors must be identified in visible text.
- WCAG 3.3.2 Labels or Instructions: legend, helper text and child labels provide required instructions.
- WCAG 3.3.3 Error Suggestion: group errors should explain how to correct the answer where possible.
- WCAG 4.1.2 Name, Role, Value: native semantics expose the group name and role while child controls expose their own names, roles, values and states.

## Testing

Manual checks:

- The legend is announced as the group name.
- Child labels are still announced.
- Group helper text is available as the group description.
- Group error text is available as the group description.
- Helper and error text are exposed in the helper-then-error order.
- Nested heading is exposed at the selected level when used.
- Disabled descendants expose native disabled state.
- Legend, helper and error text wrap and reflow.
- Fieldset does not create a focus stop.
- The question is not announced twice because of a duplicate heading.
- Nested Fieldsets are used only where necessary.

## Acceptance checklist

- Use a native `<fieldset>`.
- Use a native `<legend>`.
- Make the legend the first direct child.
- Give every Fieldset a visible group name.
- Preserve child labels where needed.
- Associate helper and group errors with Fieldset using `aria-describedby`.
- Put helper ID before error ID in `aria-describedby`.
- Keep group, child and combination validation ownership clear.
- Keep inline errors when an error summary is present.
- Do not make Fieldset focusable.
- Keep heading semantics and visual legend style separate.
- Use plain legend as the default semantic configuration.
- Allow H1-H6 heading levels only when structurally correct.
- Use responsive semantic legend tokens.
- Represent optional and mixed groups correctly.
- Support generic slot content without content-type variants.
- Do not add Fieldset-specific tokens.
- Do not use raw visual values.
- Follow the shared grouped-control pattern.

## Related documentation

- [`fieldset.yaml`](./fieldset.yaml)
- [`patterns/forms/form-field-patterns.yaml`](../../patterns/forms/form-field-patterns.yaml)
- [`patterns/forms/grouped-control-pattern.md`](../../patterns/forms/grouped-control-pattern.md)
- [`patterns/forms/legends-and-fieldsets.md`](../../patterns/forms/legends-and-fieldsets.md)
- [`patterns/forms/helper-text.md`](../../patterns/forms/helper-text.md)
- [`patterns/forms/required-and-optional.md`](../../patterns/forms/required-and-optional.md)
- [`patterns/forms/validation-and-errors.md`](../../patterns/forms/validation-and-errors.md)
- [`patterns/forms/error-summary.md`](../../patterns/forms/error-summary.md)
- [`patterns/forms/focus-management.md`](../../patterns/forms/focus-management.md)
- [`patterns/forms/tokens.md`](../../patterns/forms/tokens.md)
- [`patterns/form-layout.yaml`](../../patterns/form-layout.yaml)
