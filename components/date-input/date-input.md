# Date Input

**Status:** Draft

**Version:** 0.1.0

**Machine-readable specification:** [`date-input.yaml`](./date-input.yaml)

## Overview

Date Input collects one calendar date through three visible text fields: Day, Month and Year. It is a compound Fieldset-based component, not a single native date control.

Use a native `<fieldset>` and `<legend>` for the shared question. Keep a visible label for each date part. The group header contains the legend, optional helper text and one shared error; the three fields follow it in Day, Month, Year order.

GitHub is the source of truth for semantics, state, validation, tokens and the Figma contract. Figma is the visual implementation of this contract.

## When to use

Use Date Input when:

- users need to enter a memorable or known date;
- the service needs the separate day, month and year values;
- users may need to enter dates far from the current date, such as a date of birth;
- a calendar picker would make the answer slower or harder to provide.

## When not to use

Do not use Date Input:

- for a time or date-and-time value;
- where selecting a nearby date from a calendar is the main task;
- for partial dates such as month and year only;
- as three unrelated standalone fields;
- where a locale-specific free-text date field has been deliberately researched and specified instead.

## Anatomy

```text
Date Input
├── _Fieldset/Header
│   ├── Legend
│   ├── Helper - optional
│   └── Error - error state only
└── Fields
    ├── Day
    │   ├── Label
    │   └── Text input
    ├── Month
    │   ├── Label
    │   └── Text input
    └── Year
        ├── Label
        └── Text input
```

`_Fieldset/Header` and `Fields` are siblings in Figma. This visual composition does not add a runtime header wrapper: the legend must remain the first direct child of the native Fieldset, followed by helper text, shared error and the fields.

Do not nest Date Input inside the public Fieldset component's content slot. Do not detach or rebuild the public Fieldset to create Date Input.

## Native HTML contract

Use text inputs rather than `type="date"` or `type="number"`.

```html
<fieldset aria-describedby="dob-hint">
  <legend>What is your date of birth?</legend>

  <p id="dob-hint">For example, 31 3 1980.</p>

  <div class="date-input-fields">
    <div>
      <label for="dob-day">Day</label>
      <input id="dob-day" name="dob-day" type="text"
        inputmode="numeric" autocomplete="bday-day" required>
    </div>

    <div>
      <label for="dob-month">Month</label>
      <input id="dob-month" name="dob-month" type="text"
        inputmode="numeric" autocomplete="bday-month" required>
    </div>

    <div>
      <label for="dob-year">Year</label>
      <input id="dob-year" name="dob-year" type="text"
        inputmode="numeric" autocomplete="bday-year" required>
    </div>
  </div>
</fieldset>
```

The `Fields` wrapper is allowed for layout, but it must not replace the native Fieldset or change the reading and focus order.

### Input attributes

- Use `type="text"` so date parts are treated as structured text, not mathematical quantities.
- Use `inputmode="numeric"` as a keyboard hint. Do not use it as the only validation mechanism.
- For the user's date of birth, use `autocomplete="bday-day"`, `bday-month` and `bday-year`.
- For another person's date or a date that is not the user's birthday, omit those autocomplete tokens.
- Give each field a stable `id`, a distinct `name`, and an associated visible label.
- Do not use placeholders.
- Do not use `maxlength` as a substitute for validation; it can prevent correction and alternative accepted input.

## Labels, helper text and requirement

The legend states the complete question. Day, Month and Year label the individual inputs. Neither replaces the other.

Use helper text for the expected order and a realistic example when that helps users. Do not put the example in placeholders. Keep useful helper text visible after an error.

Fields are required unless the whole Date Input is marked optional. For an optional date, append `(optional)` to the legend and leave all three child inputs without `required`. Do not repeat `(optional)` on Day, Month and Year.

This version does not support mixed requirement: the three parts form one answer and share the same requirement.

## Values and parsing

Treat the three entered strings as one date answer, but preserve each string exactly when validation fails.

- Accept one or two numeric digits for Day and Month.
- Accept four numeric digits for Year unless the consuming service documents a different year policy.
- Do not require leading zeroes.
- Do not auto-pad, auto-correct or reorder parts while the user is typing.
- Do not automatically move focus to the next field.
- Parse and normalise only at an explicit validation or submission boundary.
- Use real calendar validation, including month length and leap years.
- Do not rely on JavaScript date rollover to decide that an impossible date is valid.

The initial 0.1 contract is numeric Day, Month and Year to preserve the existing 2ch, 2ch and 4ch Text Input source decision. Accepting written month names is a documented research candidate, not an undocumented implementation extension; it needs its own width, keyboard, parsing and internationalisation review.

## Width and layout

Reuse existing Text Input widths:

| Field | Token | Intended input |
| --- | --- | --- |
| Day | `component.textInput.width.2ch` | 1–2 digits |
| Month | `component.textInput.width.2ch` | 1–2 digits |
| Year | `component.textInput.width.4ch` | 4 digits |

Keep the visual and DOM order Day, Month, Year. Use `form.group.gap.betweenFields` between parts and `form.group.gap.headerToContent` between the complete header and Fields.

The fields stay in one row while they fit without clipping labels, values or focus indicators. At narrow widths, wrap complete field units in source order. Never reorder the parts or place an input apart from its label.

## Validation and error ownership

Show one shared visible inline error after helper text and before Fields. Do not show three repeated inline messages for one date answer.

Date Input selects the Fieldset `errorAssociation` mode from the validation result:

### Group association

Use `group` when:

- the entire required date is missing;
- the combined date is impossible but no single part is the sole cause;
- the date violates a whole-date rule, such as being in the future or outside an allowed range;
- the implementation cannot deterministically identify affected visible, enabled children.

The Fieldset references the shared error after any helper ID. Child inputs do not reference that error and do not receive `aria-invalid` from it. The Fieldset never receives `aria-invalid`.

### Children association

Use `children` only when validation can identify affected parts, for example a missing Year or a Month outside the accepted numeric range.

Only affected visible, enabled inputs reference the shared error and receive `aria-invalid="true"`. Unaffected inputs remain neutral. The Fieldset keeps only its helper association. Never associate the same shared error with both the Fieldset and child inputs.

### Error examples

- Empty required answer: `Enter your date of birth.` — group.
- Missing Year: `Date of birth must include a year.` — Year child.
- Month outside 1–12: `Month must be between 1 and 12.` — Month child.
- Impossible combined date: `Enter a real date of birth.` — group unless affected parts are deterministic.
- Whole-date constraint: `Date of birth must be in the past.` — group.

Preserve all entered values for every error.

## Focus and error summary

After a failed submit, follow the shared error-summary pattern and focus the summary once. Do not focus Date Input automatically while the user is typing or merely because validation rerenders.

When its error-summary link is activated:

- for a group-associated error, scroll the legend into view and focus Day, the first visible enabled relevant field;
- for a children-associated error, scroll the first affected field label into view and focus the first affected visible enabled field in Day, Month, Year order;
- never focus the Fieldset, legend, header or error text;
- never target a hidden or disabled input.

Only one child can have keyboard focus. In Figma, focus and error-focus examples must identify the focused child explicitly; do not apply focus styling to all three fields.

## Disabled and read-only

Whole-component disabled takes precedence over error and focus presentation. Apply native `disabled` to the Fieldset, which disables all descendant controls. Disabled fields are not focusable and are not submitted. Keep the legend and labels readable. Do not display stale error styling as the active state.

Read-only is different. Apply `readonly` to all three inputs. Read-only inputs remain focusable and are submitted. Do not use disabled styling. A read-only Date Input is only appropriate when users benefit from selecting or copying the separate values; otherwise consider static review content.

Do not support partially disabled or partially read-only Date Input in this version.

## Figma contract

Create one public `Date Input` component set after this source contract passes review.

Use one flat `State` variant axis so impossible combinations cannot be created:

- `Default`
- `Focus day`, `Focus month`, `Focus year`
- `Error group`, `Error day`, `Error month`, `Error year`
- `Error focus day`, `Error focus month`, `Error focus year`
- `Disabled`
- `Readonly`

Expose `_Fieldset/Header` so its existing `Helper text`, `Legend text`, `Helper text content` and `Error text` properties remain available without duplicating or disconnecting them. Keep `State`, `Day value`, `Month value` and `Year value` on Date Input itself. `Requirement` and `Error association` remain semantic handoff metadata, not Figma properties. The state value determines which child is visually invalid and which child, if any, is focused.

Required and optional Date Inputs have no visual difference except the inline legend wording. Authors set the complete `Legend text`, including the lowercase `(optional)` suffix when needed. Do not add a disconnected Optional Boolean or double all state masters with a Requirement axis that changes no other presentation.

Use the default legend style for the initial component. Additional legend styles require a separately reviewed, non-Cartesian extension; do not multiply all Date Input states by the five public Fieldset legend styles.

The production component must:

- compose the existing `_Fieldset/Header` instance and a Fields frame as siblings;
- keep Day, Month and Year labels visible;
- reuse Text Input visual anatomy, styles, state bindings and the existing 2ch/2ch/4ch sizing guidance;
- expose one unambiguous Header property group plus Date Input's top-level state and value properties;
- let authors include `(optional)` in the complete Legend text when the Date Input is optional;
- hide Error outside error states and omit its spacing;
- keep Helper visibility independent of validation state;
- avoid detached instances, raw styling values and a Date Input token namespace.

The Day, Month and Year visual field layers mirror the canonical Text Input label and control anatomy rather than exposing three complete nested Text Input instances. This is deliberate: Date Input owns one shared header error, and its public API needs three clearly named value properties without also exposing irrelevant child helper, error and requirement controls. The copied visual layers retain the Text Input text styles and variable bindings and must be re-audited whenever Text Input presentation changes.

## Accessibility verification

Before release, verify:

- keyboard order and error-summary routing;
- native Fieldset and Legend announcements;
- individual Day, Month and Year accessible names;
- helper and error `aria-describedby` ownership in both association modes;
- only affected children receive `aria-invalid` in children mode;
- zoom, text spacing and 320 CSS pixel reflow;
- focus visibility in normal and error states;
- disabled and read-only behaviour;
- date-of-birth autofill with valid autocomplete tokens;
- preservation of entered values after every validation failure.

## Standards and research basis

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C: Identify Input Purpose](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html)
- [W3C: Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
- [W3C: Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)
- [W3C: Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
- [HTML Standard: autofill field names](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill-field)
- [GOV.UK Design System: Date input](https://design-system.service.gov.uk/components/date-input/)
