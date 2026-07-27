# Stepper

**Status:** Active
**Version:** 0.1.0
**Machine-readable specification:** [stepper.yaml](./stepper.yaml)

## Overview

Stepper collects one mathematical numeric quantity. Users can type a value into
an editable native number input or make an incremental change with adjacent
Minus and Plus buttons.

Stepper is not a multi-page progress indicator or progress tracker.

The control order is always:

~~~text
[Minus button] [Numeric input] [Plus button]
~~~

This is the visual and DOM order at every viewport size. Never use input,
Minus, Plus order.

## When to use

Use Stepper when the answer is a mathematical quantity with a meaningful
increment, such as a number of rooms, guests, items or seats. It is especially
useful when users may reasonably make small adjustments but may also need to
enter a larger value directly.

Do not use Stepper for identifiers, phone numbers, account numbers, dates,
values with meaningful leading zeroes, currency formatting, arbitrary-precision
financial values or a multi-step progress display.

Stepper is one single-control form field. Do not add a public Stepper Group or
wrap one Stepper in a fieldset. Use the existing Fieldset pattern only when
several controls answer one shared question.

## Anatomy and semantic structure

~~~text
Stepper
├── Label
├── Helper text - optional
├── Error message - conditional
├── Control row
│   ├── Minus button
│   ├── Numeric input
│   └── Plus button
└── Status region - visually hidden, button-origin changes only
~~~

The visible label is associated with the native number input using for and id.
The input owns the answer, validation, form name and helper/error
aria-describedby relationships.

The buttons are real native button elements with type="button". Their names
must include both the action and the field subject. For example:

~~~text
Decrease number of rooms
Increase number of rooms
~~~

The Minus and Plus graphics are decorative when those button names are present.
They must not add a second accessible name.

Do not add role="spinbutton", aria-valuenow, aria-valuemin or aria-valuemax to
the native number input. Its native type, value, min, max and step attributes
provide the number-input semantics, range and increment behaviour.

~~~html
<div class="form-field">
  <label for="rooms">Number of rooms</label>
  <p id="rooms-helper">Choose a number from 1 to 10.</p>

  <div class="stepper">
    <button type="button" aria-label="Decrease number of rooms">
      <svg aria-hidden="true" focusable="false"><!-- Minus --></svg>
    </button>

    <input
      id="rooms"
      name="rooms"
      type="number"
      min="1"
      max="10"
      step="1"
      value="2"
      required
      aria-describedby="rooms-helper"
    >

    <button type="button" aria-label="Increase number of rooms">
      <svg aria-hidden="true" focusable="false"><!-- Plus --></svg>
    </button>
  </div>

  <span class="visually-hidden" role="status" aria-atomic="true"></span>
</div>
~~~

## Labels, helper text and errors

Follow the shared single-control pattern:

~~~text
Label
Helper text - optional
Error message - conditional
Control row
~~~

Required is the default. For an optional Stepper, include "(optional)" in the
complete visible label and do not add required to the input. Do not add
"(required)" by default, use an asterisk alone, or rely on colour alone.

Helper and error text are associated with the numeric input using stable,
ordered aria-describedby IDs. Apply aria-invalid="true" only while the input is
invalid. Keep invalid values visible and editable, including after a failed
submit.

~~~html
<label for="guests">Number of additional guests (optional)</label>
<p id="guests-helper">You can add up to 8 guests.</p>

<div class="stepper">
  <button type="button" aria-label="Decrease number of additional guests">
    <svg aria-hidden="true" focusable="false"><!-- Minus --></svg>
  </button>

  <input
    id="guests"
    name="guests"
    type="number"
    min="0"
    max="8"
    step="1"
    aria-describedby="guests-helper"
  >

  <button type="button" aria-label="Increase number of additional guests">
    <svg aria-hidden="true" focusable="false"><!-- Plus --></svg>
  </button>
</div>
~~~

For an error, render the inline text before the control row and add its ID to
the same numeric input description.

~~~html
<label for="rooms">Number of rooms</label>
<p id="rooms-error">Error: Enter a number from 1 to 10.</p>

<div class="stepper">
  <button type="button" aria-label="Decrease number of rooms">
    <svg aria-hidden="true" focusable="false"><!-- Minus --></svg>
  </button>

  <input
    id="rooms"
    name="rooms"
    type="number"
    min="1"
    max="10"
    step="1"
    value="12"
    aria-describedby="rooms-error"
    aria-invalid="true"
  >

  <button type="button" aria-label="Increase number of rooms">
    <svg aria-hidden="true" focusable="false"><!-- Plus --></svg>
  </button>
</div>
~~~

## Keyboard and direct entry

| Focus or command | Behaviour |
| --- | --- |
| Tab, within range | Minus → numeric input → Plus |
| Tab, minimum reached | Numeric input → Plus |
| Tab, maximum reached | Minus → numeric input |
| Tab, minimum equals maximum | Numeric input only |
| Tab, whole component disabled | No Stepper controls |
| Shift+Tab | Traverses the same enabled controls in reverse order |
| Enter or Space on Minus/Plus | Activates that enabled native button once |
| Up/Down Arrow in input | Preserves native number-input behaviour |
| Home/End in input | No Stepper-specific override |
| Direct entry | Allowed, including normal editing shortcuts |
| Enter in input | Preserves ordinary form-submission behaviour |

Do not intercept useful native number-input behaviour. Use inputmode="decimal"
as a hint when decimal entry is allowed; use inputmode="numeric" when an
integer-only keyboard hint is useful. Browsers remain responsible for the final
on-screen keyboard.

Minus and Plus use the input’s native stepDown() and stepUp() behaviour, not
manual floating-point arithmetic. A button change must update controlled state,
validity and boundary state through the normal component path.

### Direct-entry example

This direct-entry example is still the same fixed control order:

~~~html
<label for="rooms">Number of rooms</label>
<div class="stepper">
  <button type="button" aria-label="Decrease number of rooms">
    <svg aria-hidden="true" focusable="false"><!-- Minus --></svg>
  </button>
  <input id="rooms" name="rooms" type="number" min="1" max="10" step="1" value="7">
  <button type="button" aria-label="Increase number of rooms">
    <svg aria-hidden="true" focusable="false"><!-- Plus --></svg>
  </button>
</div>
~~~

## Boundaries and native disabled buttons

Boundary-unavailable buttons use native disabled, never aria-disabled. They
cannot be activated and are removed from sequential keyboard navigation.

| Condition | Minus | Numeric input | Plus |
| --- | --- | --- | --- |
| Within range | Enabled | Enabled | Enabled |
| Minimum reached | Natively disabled | Enabled | Enabled |
| Maximum reached | Enabled | Enabled | Natively disabled |
| Minimum equals maximum | Natively disabled | Enabled | Natively disabled |
| Whole Stepper disabled | Natively disabled | Natively disabled | Natively disabled |

Minimum and maximum are valid values when they satisfy the field’s constraints.
They must not produce error styling, aria-invalid, inline error text or an
error announcement.

## Focus when a boundary is reached

Ordinary button changes keep focus on the activated button when it remains
enabled. Do not move focus merely because the input is initially at a boundary
or because the value changes within the range.

When activating a button reaches the corresponding boundary, that same button
becomes natively disabled. After the updated disabled state has rendered, test
whether leaving focus there would lose meaningful focus. If so, move focus to
the numeric input.

~~~text
Value 2; minimum 1
→ User activates Minus
→ Value becomes 1
→ Minus becomes natively disabled
→ Focus fallback, only if needed: numeric input
→ Next Tab: Plus
~~~

The numeric input is the only fallback destination. Do not move focus to the
opposite button. Do not move focus while users type. Test this after framework
updates because browsers differ when a focused control becomes disabled.

~~~html
<label for="rooms">Number of rooms</label>
<div class="stepper">
  <button type="button" disabled aria-label="Decrease number of rooms">
    <svg aria-hidden="true" focusable="false"><!-- Minus --></svg>
  </button>
  <input id="rooms" name="rooms" type="number" min="1" max="10" step="1" value="1">
  <button type="button" aria-label="Increase number of rooms">
    <svg aria-hidden="true" focusable="false"><!-- Plus --></svg>
  </button>
</div>
~~~

~~~js
// Run after committing the new value and native disabled state.
if (activatedButton.disabled && focusWouldOtherwiseBeLost()) {
  numericInput.focus();
}
~~~

## Value announcements

Use one restrained, visually hidden role="status" region for a successful
button-origin change unless focus actually moved to the numeric input. For
example, it may announce “Number of rooms: 3”. This covers ordinary changes
that leave the button enabled and a boundary change when a browser does not
move focus away from the newly disabled button.

When the activated button becomes disabled and focus moves to the numeric
input, do not also send a status message for that change. The focused native
input should expose the updated value, label, role and range. Similarly, do not
add a status message for direct entry or native Arrow-key changes.

This avoids duplicate announcements. Spoken wording varies by browser and
screen reader; the contract is the exposed name, role, value, range, state and
relationships, not one guaranteed sentence. Do not use an assertive live region
for ordinary quantity changes.

~~~html
<label for="rooms">Number of rooms</label>
<div class="stepper">
  <button type="button" aria-label="Decrease number of rooms">
    <svg aria-hidden="true" focusable="false"><!-- Minus --></svg>
  </button>
  <input id="rooms" name="rooms" type="number" min="1" max="10" step="1" value="3">
  <button type="button" aria-label="Increase number of rooms">
    <svg aria-hidden="true" focusable="false"><!-- Plus --></svg>
  </button>
</div>

<span class="visually-hidden" role="status" aria-atomic="true">
  Number of rooms: 3
</span>
~~~

The status content above is appropriate after a button-origin change unless the
focus fallback moved to the numeric input. The label, native number input and
action-plus-subject button names are the screen-reader naming contract; the
icons remain decorative.

## Validation and submission

| Condition | Treatment |
| --- | --- |
| Valid minimum or maximum | Valid boundary state; no error |
| Value below min | Inline range-underflow error |
| Value above max | Inline range-overflow error |
| Step mismatch | Inline error explaining the permitted increment |
| Empty required input | Inline value-missing error |
| Empty optional input | Valid empty value |
| Bad manually entered number | Preserve value and show inline error at the established validation trigger |
| Whole Stepper disabled | Excluded from native validation and submission |

Do not silently clamp or replace a bad manually entered value. Do not use
step="any"; Stepper requires a finite positive increment. When an empty value
is changed with Minus or Plus, use the native stepping algorithm subject to the
supplied range and step.

The numeric input has the submitted name/value. Both buttons have type="button"
and do not submit the form. After failed submission, preserve the entered value,
show both inline error and Error Summary, and follow the shared Error Summary
focus pattern. An Error Summary link focuses the visible, enabled numeric input
after bringing its label into view.

## States and token reuse

Stepper reuses the shared form control treatment:

| Part | Existing token or component |
| --- | --- |
| Numeric input shell | form.control.* |
| Input focus | form.state.focus.ring, form.state.focus.separator |
| Error input | form.state.error.border, form.error.* |
| Disabled input | form.state.disabled.* |
| Field spacing | form.field.gap.* |
| Control-row gap | spacing.inline.sm |
| Numeric input height | size.control.minBlockSize.default |
| Short quantity width | component.textInput.width.5ch |
| Minus/Plus buttons | Production neutral default-size icon-only Button |
| Displayed icons | size.icon.md, registered Minus and Plus components |

No Stepper-specific token file is required. Do not create a token only to
reproduce an example dimension.

## Figma implementation contract

This GitHub contract is the source of truth. The later Figma stage creates no
new semantics; it represents the documented visual states and reuses the
existing Button, icon and form token system.

The public Stepper API is:

| Property | Type | Default |
| --- | --- | --- |
| State | Variant | default |
| Requirement | Variant | required |
| Boundary | Variant | none |
| Helper text | Boolean | false |
| Label text | Text | Number of rooms |
| Value text | Text | 2 |
| Helper text content | Text | Choose a number from 1 to 10. |
| Error text | Text | Error: Enter a whole number from 1 to 10. |

The public variant axes are:

- `State=default|focus|error|errorFocus|disabled`
- `Requirement=required|optional`
- `Boundary=none|minimum|maximum|both`

State × Requirement × Boundary creates 5 × 2 × 4 = 40 public variants.
Boundary is a normal top-level variant property, not an exposed nested
property. The 40 variants are the deterministic Figma representation; they do
not prescribe 40 separate runtime implementations. Requirement remains an
intentional public authoring and handoff axis; it does not provide a
variant-specific `Label text` default.

The internal `_Stepper/Control row` component set has these axes:

- `State=default|focus|error|errorFocus|disabled`
- `Boundary=none|minimum|maximum|both`

State × Boundary creates 5 × 4 = 20 internal variants. Every public Stepper
variant uses the internal row with the same State and Boundary values.

The control row uses two non-detached production neutral/default Icon Button
instances, with the left nested icon swapped to Minus and the right using Plus.
The centre is a Stepper-owned value field built from existing form-control
tokens, not a nested public Text Input instance. Its order remains Minus →
numeric input → Plus.

Boundary represents a valid range condition:

| State | Boundary | Required result |
| --- | --- | --- |
| Non-disabled | none | Minus, numeric input and Plus are available |
| Non-disabled | minimum | Only Minus is unavailable |
| Non-disabled | maximum | Only Plus is unavailable |
| Non-disabled | both | Minus and Plus are unavailable; numeric input remains available |
| disabled | Any value | Minus, numeric input and Plus are unavailable |

State disabled always takes precedence. All four disabled Boundary combinations
remain in the component set so designers can change the axes in any order, but
they are intentionally visually redundant: changing Boundary while disabled
cannot re-enable a control.

Boundary does not cause error styling, error text, aria-invalid, an error
announcement or a disabled numeric input. Runtime code normally derives the
condition from the supplied minimum, maximum and current valid value; Boundary
is not separate user-entered data.

### Figma label authoring

Figma exposes one public `Label text` property with one global default:
`Number of rooms`. Every required and optional public master binds its one
complete visible label layer to that same property. The layer remains editable,
automatic-height and naturally wrapping, without a fixed or maximum width.

Selecting `Requirement=optional` does not append `(optional)` or otherwise
rewrite the label. To author an optional Stepper in Figma:

1. Set `Requirement=optional`.
2. Override `Label text` with the complete visible label, for example
   `Number of rooms (optional)`.

Switching between Requirement variants must preserve that complete-string
override and must not alter the visible label. Do not leave an optional label
layer unbound, display `(required)` by default, or create a separate
optional-marker layer, Boolean property or nested marker component. Production
masters must not depend on variant-specific text-property defaults.

This single-global-default constraint is specific to Figma authoring and follows
the established Checkbox single-label model; it does not change the runtime
accessibility pattern. Runtime implementations may construct or append optional
wording programmatically, provided the result is one coherent visible and
accessible label.

The later Figma build and QA must confirm:

- exactly 40 public Stepper variants and 20 internal control-row variants;
- every public combination uses the matching internal State and Boundary;
- Boundary works in every non-disabled State;
- every disabled combination disables Minus, numeric input and Plus;
- changing Boundary while disabled cannot visually re-enable a control;
- State, Requirement and Boundary can be changed in any order;
- every required and optional master binds its complete label layer to the same
  `Label text` property;
- `Label text` works in both Requirement variants and has the one global default
  `Number of rooms`;
- a complete-string `Label text` override persists when Requirement changes;
- changing Requirement does not automatically alter the visible label;
- no required or optional label layer is left unbound;
- all text-property overrides persist across State, Requirement and Boundary
  changes;
- no separate optional-marker layer, Boolean property or nested marker component
  exists;
- optional documentation examples use an inserted instance with a complete
  manual `Label text` override;
- long optional labels wrap naturally as one editable layer without a fixed
  width;
- Helper-text Boolean overrides persist across variant changes;
- error and focus styling remain controlled by State;
- valid boundaries are never presented as errors;
- every example uses Minus → numeric input → Plus; and
- nested Icon Button and inserted Stepper instances remain attached to their
  production masters.

Do not edit Figma or Tokens Studio while implementing this GitHub contract.

## Required documentation and QA examples

Document and test each of the following using the fixed Minus → numeric input
→ Plus order:

- Default value and direct entry
- Helper text and optional field, using a complete `Label text` override on the
  inserted optional Figma instance
- Error and error focus
- Minimum reached, maximum reached, and minimum equals maximum
- Whole-component disabled
- Long label, helper text and error text wrapping
- Retained value after failed validation
- Button-origin value announcement
- Focus fallback after a boundary-causing activation
- Native names, range, disabled state and aria-describedby relationships
- Keyboard-only, touch, zoom, text-spacing and forced-colours behaviour

## Implementation checklist

- [ ] Native editable input type="number" in the centre
- [ ] Native Minus and Plus button type="button" controls
- [ ] Every example uses Minus → numeric input → Plus
- [ ] Visible label associated with input id
- [ ] Helper/error IDs associated through aria-describedby
- [ ] Boundary buttons use native disabled, never aria-disabled
- [ ] Valid boundaries do not create errors
- [ ] Activated boundary button falls back only to numeric input when focus would otherwise be lost
- [ ] No duplicate status announcement after input focus fallback
- [ ] No new Stepper tokens or Tokens Studio sync
- [ ] No public Stepper Group or read-only Stepper
