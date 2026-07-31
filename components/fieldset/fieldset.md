# Fieldset

**Status:** Draft
**Version:** 0.1.0
**Machine-readable specification:** [`fieldset.yaml`](./fieldset.yaml)

## Overview

Fieldset groups related form controls that answer one shared question.

It uses native HTML `<fieldset>` and `<legend>` elements. The legend gives the group its accessible name. Optional group helper text always describes the Fieldset, while the one shared visible error describes either the Fieldset or affected child controls according to the error-association contract.

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
├── Group header - visual layout region
│   ├── Legend
│   ├── Group helper text - optional
│   └── Error message - error state only
└── Related controls / content slot
```

Use this order:

1. Legend
2. Helper text
3. Error message
4. Related controls

The legend and content slot are required. Group helper text is optional. The Error message appears only in the error state.

Group header names the visual layout region containing Legend, Helper and Error. It is not an extra public HTML part, and it must not change the native order. The exact internal Figma component `_Fieldset/Header` is reserved for new compound fieldset-based components; it does not imply that the existing public Fieldset is composed from that component.

Omitted optional elements must not leave empty markup or empty spacing.

## Native HTML requirements

Use a native `<fieldset>`.

The native `<legend>` is mandatory and must be the first direct child of the `<fieldset>`.

Do not:

- add `role="group"` to a native Fieldset;
- make the Fieldset focusable;
- add a positive `tabindex`;
- add `tabindex="-1"`;
- put `required` on the Fieldset;
- put `readonly` on the Fieldset.

Fieldset may use the native `disabled` attribute when the whole group is unavailable.

Child controls retain their own labels, names, roles, values and states.

### Effective DOM order

The effective runtime DOM order is:

```text
fieldset
├── legend - first direct child
├── helper text - optional
├── error message - error state only
└── consumer controls
```

The native `<legend>` must remain the first direct child. Helper text, the one shared visible error and consumer controls follow as direct siblings in that order.

A visual Group header or `_Fieldset/Header` Figma layer must not become a runtime wrapper. If code uses a Header abstraction, it must return a fragment or equivalent direct children so that it does not insert an element between `<fieldset>` and `<legend>`.

`errorAssociation` is a component integration option, not an HTML attribute. Do not forward it to the native `<fieldset>` or any other DOM element.

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

Place group helper text after the legend and before any Error message.

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

## Error message

Use this visual order whenever Fieldset presents an error:

```text
Legend
Helper text, if present
Error message
Related controls
```

Render exactly one visible Error message in this established position. Do not repeat the same message inside consumer content.

Give the Error message a stable ID. Its visual position inside Fieldset does not determine its accessible owner; `errorAssociation` determines whether the Fieldset or affected children reference that ID.

Keep the inline Error message when an error summary exists.

Use specific and actionable error text. Explain what went wrong and how to fix it where possible.

Do not rely on colour alone. Preserve user-entered values and selections.

## Error association

Fieldset defines this semantic integration option:

```text
errorAssociation: "group" | "children"
default: "group"
```

The default preserves existing Fieldset behaviour. The option changes programmatic association only; it does not add a visual variant, move the Error message or change layout.

| Mode | Use when | Fieldset `aria-describedby` | Child controls |
| ---- | -------- | --------------------------- | -------------- |
| `group` (default) | The error concerns the complete grouped answer, including a whole-group required failure. | Reference Helper first when present, then the shared Error. | Do not reference the shared Error or receive `aria-invalid` because of it. |
| `children` | The consuming composite can identify one or more affected visible, enabled children. | Reference Helper when present and exclude the shared Error. | Only affected visible, enabled children reference the shared Error and receive `aria-invalid="true"`; unaffected children remain neutral. |

Fieldset itself never receives `aria-invalid`.

The same Error message must never be associated with both Fieldset and children. In `children` mode, preserve each affected child's other description IDs and add the shared Error ID after any child-owned Helper ID, without repeating the group Helper ID.

A whole-group required failure remains group-associated. Do not infer that every validation failure inside grouped controls is group-associated. For child-specific or combination failures, choose `children` only when the consuming composite can identify the affected visible, enabled children; otherwise use the default `group` mode.

### Group association example

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

The Helper ID precedes the Error ID. Children do not reference `contact-error` and do not receive `aria-invalid` for this whole-group error.

### Children association example

```html
<fieldset aria-describedby="dob-hint">
  <legend>What is your date of birth?</legend>

  <div id="dob-hint">
    For example, 31 3 1980.
  </div>

  <p id="dob-error">
    <span class="visually-hidden">Error:</span>
    Date of birth must include a year.
  </p>

  <label for="dob-day">Day</label>
  <input id="dob-day" name="dob-day" inputmode="numeric">

  <label for="dob-month">Month</label>
  <input id="dob-month" name="dob-month" inputmode="numeric">

  <label for="dob-year">Year</label>
  <input
    id="dob-year"
    name="dob-year"
    inputmode="numeric"
    aria-describedby="dob-error"
    aria-invalid="true"
  >
</fieldset>
```

The one visible Error remains before consumer content. Fieldset continues to reference only the Helper; only the affected Year control references the Error and receives `aria-invalid="true"`.

## Error summary relationship

Fieldset does not render the page error summary.

An error summary supplements inline errors. It does not replace them.

The one inline Fieldset Error remains visible.

Summary wording should match or clearly correspond to the inline error.

The consuming composite defines a deterministic visible, enabled interactive target for each Fieldset error-summary link. In `group` mode, target a relevant child. In `children` mode, target one of the affected children. Activation scrolls the associated label or legend into view and focuses that child while preserving the selected error-association mode.

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

The Error state controls presentation only. It does not encode whether the shared Error is associated with `group` or `children`.

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
- `form.field.gap.helperToError` between helper text and the Error message.

The Error message remains inside the Group header. The Error state uses the same `form.group.gap.headerToContent` gap between the Group header and content slot.

When Helper or Error is hidden, it must collapse without leaving empty spacing. Do not use one 24px gap across Legend, Helper, Error and Content slot.

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

This source guidance does not create or modify production Figma components.

### Public Fieldset compatibility

The existing published Fieldset structure and API remain unchanged:

| Property | Type or values | Default |
| -------- | -------------- | ------- |
| State | Default \| Error | Default |
| Requirement | Required \| Optional \| Mixed | Required |
| Legend style | Page \| Default \| Section \| Subsection \| Compact | Default |
| Helper text | Boolean | False |
| Legend text | Text | What is your preferred contact method? |
| Helper text content | Text | Select all options that apply. |
| Error text | Text | Error: Select your preferred contact method |
| Content slot | Slot or instance swap | - |

The existing public structure remains:

```text
Fieldset
├── Group header
│   ├── Legend
│   ├── Helper text
│   └── Error message
└── Content slot
```

`errorAssociation` is a semantic implementation option, not a public Figma property or variant. The compatibility bridge maps existing consumers that omit it to `group`; both association modes use the existing Error presentation without changing the public visual API.

Production currently has two public Fieldset masters. Do not expand or rebuild them into a 30-master Cartesian matrix, replace or rebind instances, detach instances, or migrate the public Fieldset to `_Fieldset/Header` as part of this additive contract. Existing Legend, Helper, Error and Content overrides and their current defaults remain unchanged. Any future public migration must be explicitly versioned and include consumer remediation.

The public Fieldset remains the correct generic Fieldset component and is not deprecated by this compatibility bridge.

### `_Fieldset/Header`

`_Fieldset/Header` is the canonical internal Figma primitive for new compound fieldset-based components only. It is one nonvariant component with this proven anatomy:

```text
_Fieldset/Header
├── Legend
├── Helper
└── Error
```

It exposes only these properties:

| Property | Type | Default |
| -------- | ---- | ------- |
| Legend text | Text | - |
| Helper text | Boolean | False |
| Helper text content | Text | - |
| Error text | Text | - |

Do not add Content, State, Requirement, Legend style, Error visible or `errorAssociation` properties to `_Fieldset/Header`.

In a new compound component, `_Fieldset/Header` and consumer content are siblings. Do not place consumer content inside Header. The consuming component owns State, Requirement, Legend style and Error visibility.

A future compound consumer such as Date Input may compose `_Fieldset/Header` and its own Fields wrapper as siblings. It must not route that wrapper through the public Fieldset Content slot or nest or detach the public Fieldset merely to claim literal reuse. This bounded example does not define Date Input properties, field counts, widths, parsing or focus rules.

Record semantic association in component descriptions, notes or annotations. Do not represent it as a visual axis. A runtime Header equivalent must preserve the direct-child DOM requirements and must not render a wrapper.

This contract does not define Date-specific properties, field counts or source.

### Figma layout

Use `form.group.gap.headerToContent` between the complete Header and consumer content. Use the smaller header spacing tokens within Header.

Heading level is handoff metadata, not a visual variant.

The public Fieldset Content slot or instance swap should continue to accept related form components.

Do not create variants for Radio, Checkbox, Date or Address.

Do not create a Fieldset focus variant.

Use responsive styles and Auto Layout.

## Accessibility requirements

Target WCAG 2.2 AA, but do not claim that using Fieldset automatically guarantees conformance. Slotted child controls and the surrounding form patterns must also be implemented correctly.

Relevant considerations:

- WCAG 1.3.1 Info and Relationships: native `<fieldset>` and `<legend>` expose the grouped relationship.
- WCAG 1.3.2 Meaningful Sequence: legend, helper text, Error message and related controls must appear in a meaningful order.
- WCAG 1.4.1 Use of Color: errors and disabled states must not rely on colour alone.
- WCAG 1.4.3 Contrast Minimum: legend, helper and error text need sufficient contrast.
- WCAG 1.4.10 Reflow: content must wrap and reflow in narrow containers.
- WCAG 1.4.12 Text Spacing: adjusted text spacing must not clip or overlap content.
- WCAG 2.4.6 Headings and Labels: the legend must clearly describe the grouped question, and nested headings must follow the document structure.
- WCAG 3.3.1 Error Identification: validation errors must be identified in visible text.
- WCAG 3.3.2 Labels or Instructions: legend, helper text and child labels provide required instructions.
- WCAG 3.3.3 Error Suggestion: errors should explain how to correct the answer where possible.
- WCAG 4.1.2 Name, Role, Value: native semantics expose the group name and role while child controls expose their own names, roles, values and states.

## Testing

Manual checks:

- The legend is announced as the group name.
- Child labels are still announced.
- Group helper text is available as the group description.
- In `group` mode, the Error is available as a Fieldset description after Helper when both are present.
- In `children` mode, Fieldset continues to reference Helper and excludes Error.
- In `children` mode, only affected visible, enabled children reference the shared Error and receive `aria-invalid="true"`.
- Unaffected children remain neutral, and Fieldset never receives `aria-invalid`.
- Exactly one visible Error is rendered, and its ID is never referenced by both Fieldset and children.
- Nested heading is exposed at the selected level when used.
- Disabled descendants expose native disabled state.
- Legend, helper and error text wrap and reflow.
- Fieldset does not create a focus stop.
- No Group header wrapper appears between Fieldset and its first-child Legend in the runtime DOM.
- The question is not announced twice because of a duplicate heading.
- Nested Fieldsets are used only where necessary.

## Acceptance checklist

- Use a native `<fieldset>`.
- Use a native `<legend>`.
- Make the legend the first direct child.
- Give every Fieldset a visible group name.
- Preserve child labels where needed.
- Associate Helper with Fieldset using `aria-describedby`.
- Default `errorAssociation` to `group`.
- In `group` mode, associate Error with Fieldset after Helper when both are present.
- In `children` mode, exclude Error from Fieldset and associate it only with affected visible, enabled children.
- Apply `aria-invalid="true"` only to affected children in `children` mode, never to Fieldset.
- Keep unaffected children neutral and never associate the same Error with both Fieldset and children.
- Keep semantic ownership independent from the Error's visual position.
- Keep whole-group required failures group-associated without treating every grouped validation failure as group-associated.
- Render exactly one visible Error after Helper and before consumer content.
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
