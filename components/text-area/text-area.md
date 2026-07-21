# Textarea

**Status:** Draft  
**Version:** 0.1.0  
**Machine-readable specification:** [`textarea.yaml`](./textarea.yaml)  
**Component tokens:** [`../../tokens/components/textarea.json`](../../tokens/components/textarea.json)

## Overview

The Textarea component allows users to enter multiple lines of plain text.

Use it when an answer may need more space than a single-line Text Input, such as a description, explanation, message or additional information.

The Textarea follows the shared single-control form-field pattern. Its label, helper text, error message, required or optional status, focus treatment, disabled state and read-only state should remain consistent with Text Input and other form controls.

The YAML specification is the source of truth for the component contract and machine-checkable rules. This document explains how designers, developers and content authors should apply that contract.

## When to use

Use a Textarea for:

- descriptions;
- explanations;
- comments;
- messages;
- additional information;
- answers that may contain more than one sentence or paragraph.

## When not to use

Do not use a Textarea for:

- short, single-line answers;
- names, email addresses, telephone numbers or reference numbers;
- search terms;
- structured multi-part answers;
- rich text, Markdown or code editing;
- file uploads.

Use a [Text Input](../text-input/text-input.yaml) for short, single-line answers.

## Anatomy

The Textarea uses the shared single-control form-field order:

1. Label
2. Helper text, when needed
3. Error message, when present
4. Textarea control

Do not place unrelated content between these elements.

## Labels

Every Textarea must have a visible label by default.

The label should clearly describe the information being requested. Prefer specific, conversational labels such as:

- `Tell us what happened`
- `Describe the problem`
- `Additional information (optional)`

Avoid vague labels such as:

- `Details`
- `Text`
- `Input`

Associate the label with the native `<textarea>` using matching `for` and `id` attributes.

Do not use placeholder text as a label.

## Required and optional fields

Fields are treated as required unless marked optional.

Required fields do not need `(required)` in the label when the form explains that fields are required unless marked optional.

Optional Textareas must include `(optional)` in the visible label:

```text
Additional information (optional)
```

Do not rely on an asterisk or colour alone to communicate required or optional status.

## Helper text

Helper text is optional. Use it when users need information that is not clear from the label, such as:

- what information to include;
- why the information is needed;
- a genuine character limit;
- a format or content constraint.

Keep helper text visible while the user enters an answer.

Place helper text between the label and the Textarea. Associate it with the Textarea using `aria-describedby`.

Do not:

- repeat the label;
- use helper text as a substitute for the label;
- put essential instructions in placeholder text;
- hide known constraints until validation fails.

## Placeholder text

Placeholder text is not supported.

Do not use placeholder text for:

- labels;
- instructions;
- examples;
- format guidance;
- suggested answers.

Use a visible label and helper text instead.

## Width

The Textarea fills the available width of its form-field container.

The component does not own an independent minimum or maximum width. The parent form layout controls the practical maximum width.

The default relationship is:

```text
Form column
└── Form field: fills the form column
    └── Textarea: fills the form field
```

Use the existing form layout token for the default form-column maximum width:

```text
form.layout.column.maxWidth
```

Do not:

- reuse the short character-width options from Text Input;
- create half-width or fractional Textarea variants;
- allow the Textarea to overflow its container;
- allow horizontal browser resizing by default.

Recommended CSS layout behaviour:

```css
.textarea {
  box-sizing: border-box;
  inline-size: 100%;
  min-inline-size: 0;
  max-inline-size: 100%;
}
```

## Height

Textarea height is controlled by component-specific block-size tokens.

| Purpose | Token | Value |
| --- | --- | --- |
| Minimum height | `component.textarea.blockSize.minimum` | `8rem` / 128px at a 16px root size |
| Default initial height | `component.textarea.blockSize.default` | `10rem` / 160px at a 16px root size |
| Maximum height | None | The standard component does not impose a maximum |

The default height provides a clear multi-line writing area. The minimum prevents the control from being reduced to a size that no longer communicates multi-line entry.

Allow users to resize the Textarea vertically. Do not allow horizontal resizing by default.

Use `rows="5"` as a resilient native HTML fallback when CSS is unavailable. The `rows` attribute is not the design-system source of truth for rendered height.

Recommended CSS sizing behaviour:

```css
.textarea {
  block-size: var(--component-textarea-block-size-default);
  min-block-size: var(--component-textarea-block-size-minimum);
  resize: vertical;
}
```

Do not set a standard `max-block-size` or `max-height`.

Do not create compact, default or extended height variants. Where a specialised product context needs different behaviour, document that pattern separately rather than changing the base Textarea contract.

## Character limits

Do not impose a minimum or maximum character length by default.

Add a limit only when there is a genuine content, service or downstream-system constraint.

When a limit exists:

- explain it before the user enters text;
- include it in helper text;
- use the appropriate native `minlength` or `maxlength` attribute;
- provide a specific validation error when the answer does not meet the constraint;
- never truncate submitted text silently.

Example helper text:

```text
Enter 500 characters or fewer.
```

A live character count is not included in the initial component version. It requires a separate documented pattern covering visual placement, thresholds, validation and screen-reader announcements.

## States

The Textarea supports these documented states:

- default;
- focus;
- error;
- error and focus;
- disabled;
- read-only.

A filled Textarea is a content condition, not a separate visual state or Figma variant.

### Focus

Keyboard focus must be clearly visible.

Use the shared form focus treatment:

```text
form.state.focus.ring
form.state.focus.separator
```

The focus indicator must remain visible when the Textarea is also in an error state.

Do not remove the browser focus indicator unless it is replaced with an accessible equivalent.

### Error

An error state must include a visible error message. Do not rely on a red border or colour alone.

When invalid:

- set `aria-invalid="true"`;
- associate the error message using `aria-describedby`;
- retain useful helper text associations;
- preserve the user's entered text;
- show both error and focus treatments when the invalid Textarea has focus.

### Disabled

Use the native `disabled` attribute when the Textarea is unavailable and its value should not be submitted.

A disabled Textarea:

- cannot be edited;
- does not receive keyboard focus;
- is not submitted with the form;
- must retain a visible label;
- must not rely on opacity alone for its visual treatment.

### Read-only

Use the native `readonly` attribute when the value must remain visible and submitted but cannot be changed.

A read-only Textarea:

- may receive keyboard focus;
- is submitted with the form;
- allows text to be selected and copied;
- must look distinct from a disabled Textarea;
- must retain a visible label.

## Validation and errors

Show validation errors close to the relevant Textarea.

Error messages should:

- identify what went wrong;
- explain how to fix it where possible;
- use plain language;
- avoid technical validation wording;
- avoid blaming the user.

Prefer:

```text
Error: Enter a description of what happened
```

Avoid:

```text
Invalid input
```

Keep inline errors visible even when the page also uses an error summary.

When a form contains multiple errors, the error summary may receive focus after submission. Each summary item should link to the relevant control. Do not move focus while the user is typing.

Never clear a long-form answer after validation fails.

## Accessible implementation

Use a native `<textarea>` element.

Every implementation must:

- provide a visible label by default;
- associate the label using `for` and `id`;
- use `aria-describedby` for helper and error text;
- use `aria-invalid="true"` only while invalid;
- use the native `required`, `disabled` and `readonly` attributes correctly;
- preserve line breaks and entered text;
- support keyboard text entry and navigation;
- maintain visible focus;
- remain usable at supported zoom and text-resize settings.

Do not replace the native Textarea with `contenteditable`.

Do not prevent users from pasting text without a documented content or security reason.

## HTML examples

### Required Textarea with helper text

```html
<div class="form-field">
  <label for="incident-description">Tell us what happened</label>
  <p id="incident-description-hint">
    Include the main events in the order they happened.
  </p>
  <textarea
    class="textarea"
    id="incident-description"
    name="incidentDescription"
    rows="5"
    required
    aria-describedby="incident-description-hint"
  ></textarea>
</div>
```

### Optional Textarea

```html
<div class="form-field">
  <label for="additional-information">
    Additional information (optional)
  </label>
  <textarea
    class="textarea"
    id="additional-information"
    name="additionalInformation"
    rows="5"
  ></textarea>
</div>
```

### Textarea with an error

```html
<div class="form-field">
  <label for="incident-description">Tell us what happened</label>
  <p id="incident-description-hint">
    Include the main events in the order they happened.
  </p>
  <p id="incident-description-error">
    Error: Enter a description of what happened
  </p>
  <textarea
    class="textarea"
    id="incident-description"
    name="incidentDescription"
    rows="5"
    required
    aria-invalid="true"
    aria-describedby="incident-description-hint incident-description-error"
  ></textarea>
</div>
```

### Textarea with a genuine maximum length

```html
<div class="form-field">
  <label for="short-description">Short description</label>
  <p id="short-description-hint">
    Enter 500 characters or fewer.
  </p>
  <textarea
    class="textarea"
    id="short-description"
    name="shortDescription"
    rows="5"
    maxlength="500"
    required
    aria-describedby="short-description-hint"
  ></textarea>
</div>
```

## Figma implementation

Build the Textarea as a single-control form-field component using Auto Layout.

Use this layer order:

1. Label
2. Helper text
3. Error message
4. Textarea control

### Field wrapper

Set the outer field wrapper to:

```text
Width: Fill container
Height: Hug contents
```

### Textarea control

Set the editable control layer to:

```text
Width: Fill container
Initial height: component/textarea/blockSize/default
Minimum height: component/textarea/blockSize/minimum
Maximum height: none
```

The corresponding Figma Number variable values are:

```text
component/textarea/blockSize/minimum = 128
component/textarea/blockSize/default = 160
```

Do not create `base`, `md` or `lg` modes for these variables. The values do not change by breakpoint.

Do not create:

- width variants;
- height variants;
- compact, default or extended size variants;
- a filled-state variant;
- a hover-state variant;
- a decorative browser resize handle.

Figma cannot reproduce the browser's native resize handle. Document vertical resizing as implementation behaviour instead of drawing it into the component.

## Figma component properties

Use these component properties:

| Property | Type | Values |
| --- | --- | --- |
| `State` | Variant | `Default`, `Focus`, `Error`, `Error focus`, `Disabled`, `Read-only` |
| `Requirement` | Variant | `Required`, `Optional` |
| `Helper text` | Boolean | `True`, `False` |
| `Label text` | Text | Editable label content |
| `Helper text content` | Text | Editable helper content |
| `Error text` | Text | Editable error content |
| `Value text` | Text | Editable multi-line example value |

Error text visibility should be controlled by the `State` property. A filled example should be created by editing `Value text`, not by adding a filled variant.

## Tokens

Reuse the shared semantic form tokens for label, helper text, error message, control styling and states.

### Shared form tokens

```text
form.label.typography
form.label.color
form.helper.typography
form.helper.color
form.error.typography
form.error.color
form.field.gap.labelToHelper
form.field.gap.helperToError
form.field.gap.errorToControl
form.field.gap.controlToNextField
form.control.background
form.control.foreground
form.control.typography
form.control.border.color
form.control.border.width
form.control.border.radius
form.control.padding.block
form.control.padding.inline
form.state.focus.ring
form.state.focus.separator
form.state.error.border
form.state.disabled.background
form.state.disabled.foreground
form.state.disabled.border
form.state.readonly.background
form.state.readonly.foreground
form.state.readonly.border
```

### Textarea-specific tokens

```text
component.textarea.blockSize.minimum
component.textarea.blockSize.default
```

Do not create Textarea-specific colour, typography, border, radius, padding or state tokens when a shared form token already provides the required role.

## Content guidance

Labels should be clear, concise and written in sentence case.

Ask for one thing per Textarea. Explain what information to include when the request may otherwise be ambiguous.

Do not use implementation terms such as `field`, `input` or `textarea` in user-facing labels.

Use realistic example values in design documentation. Do not display example value text as placeholder text.

## Related documentation

- `patterns/forms/form-field-patterns.yaml`
- `patterns/forms/form-field-patterns.md`
- `patterns/forms/single-control-pattern.md`
- `patterns/forms/labels.md`
- `patterns/forms/helper-text.md`
- `patterns/forms/required-and-optional.md`
- `patterns/forms/validation-and-errors.md`
- `patterns/forms/focus-management.md`
- `patterns/forms/disabled-and-readonly.md`
- `patterns/forms/tokens.md`
- `patterns/form-layout.yaml`
- `components/text-input/text-input.yaml`
