# Select

**Status:** Active  
**Version:** 0.1.0  
**Machine-readable specification:** [`select.yaml`](./select.yaml)

## Overview

The Select component allows a user to choose one value from a finite, predefined list.

It uses a native HTML `<select>` element and follows the shared single-control form-field pattern. The browser and operating system control the opened option menu and much of its interaction behaviour.

The YAML specification is the source of truth for the machine-readable component contract. This document explains how designers, developers, content authors and AI systems should apply that contract.

## When to use

Use Select when:

- the user must choose one option;
- the options form a finite, predefined list;
- displaying every option at once would make the form unnecessarily long or difficult to scan;
- users do not need to search, filter or create options.

Select should not be the default control for every single-choice question.

Where a small set of options can be displayed clearly, prefer a Radio group so users can compare the available choices without opening another control.

## When not to use

Do not use Select for:

- multiple selection;
- searchable or filterable lists;
- creating new values;
- free-text entry;
- very long lists that require autocomplete;
- a small number of choices that would be clearer as Radios;
- hierarchical navigation;
- command menus or application actions.

The initial Select component does not support:

- `multiple`;
- `size` values greater than `1`;
- custom listbox behaviour;
- custom combobox behaviour;
- searchable Select behaviour;
- option creation;
- rich option content;
- icons or secondary actions inside options.

## Native HTML

Use a native `<select>` element.

Do not replace it with:

- a styled `<div>`;
- a button and custom popup;
- an ARIA listbox;
- a custom combobox;

unless a separate, fully documented component and interaction pattern is created.

Do not add an explicit role to the native `<select>` element.

## Anatomy

The Select follows the shared single-control form-field order:

1. Label
2. Helper text, when present
3. Error message, when present
4. Select control

The closed Select control contains:

1. Displayed option text
2. Dropdown indicator

The opened option menu is browser and operating-system controlled. It is not part of the core Figma component anatomy.

## Labels and accessible names

Every Select must have a visible label by default.

Associate the label with the native `<select>` using matching `for` and `id` values:

```html
<label for="country">Country</label>
<select id="country" name="country">
  ...
</select>
```

The visible label must provide the accessible name of the Select.

The accessible name should include the visible label text.

Do not:

- use the prompt option as a replacement for the label;
- use `aria-label` when a visible label can be used;
- duplicate the accessible name with both a visible label and `aria-label`;
- hide the label after an option has been selected.

## Required and optional fields

Fields are treated as required unless marked optional.

### Required Select

A required Select must:

- use the native `required` attribute;
- begin with an empty-value prompt option when there is no saved answer;
- not preselect a valid answer when asking a question;
- remain invalid while the empty prompt option is selected.

Required fields do not need `(required)` in the label when the form explains that fields are required unless marked optional.

Example:

```html
<label for="country">Country</label>

<select id="country" name="country" required>
  <option value="" selected>Select a country</option>
  <option value="england">England</option>
  <option value="scotland">Scotland</option>
  <option value="wales">Wales</option>
  <option value="northern-ireland">Northern Ireland</option>
</select>
```

### Optional Select

An optional Select must:

- include `(optional)` in the visible label;
- not use the `required` attribute;
- include an empty option so users can retain or return to no selection.

Example:

```html
<label for="title">Title (optional)</label>

<select id="title" name="title">
  <option value="" selected>No selection</option>
  <option value="mr">Mr</option>
  <option value="mrs">Mrs</option>
  <option value="ms">Ms</option>
  <option value="mx">Mx</option>
</select>
```

Do not rely on an asterisk or colour alone to communicate required or optional status.

## Prompt option

The prompt represents the unanswered state. It is not placeholder text.

For a required Select, use an instruction that begins with `Select`:

```text
Select a country
Select a department
Select a delivery method
```

Use `Select an option` only when more specific wording would add no useful meaning.

The required prompt option must:

- be the first direct option;
- have `value=""`;
- be selected initially when there is no saved answer;
- remain available so users can return to the unanswered state;
- not be disabled;
- not be hidden.

Use:

```html
<option value="" selected>Select a country</option>
```

Do not use:

```html
<option value="choose" selected>Choose a country</option>
```

A non-empty artificial value would be treated as a valid selection by native required validation.

For an optional Select, use `No selection` unless the context requires clearer wording.

### Prompt styling

The prompt must remain readable and meet normal text-contrast requirements.

Do not style it as low-contrast placeholder text.

The prompt and selected values use the same control typography and foreground token.

## Preselected values

Do not preselect a valid answer when the Select asks the user a question.

A valid option may be selected when:

- a previously saved answer is being shown;
- the Select represents an existing setting;
- there is a genuine, documented system default.

Do not use a preselected setting value as a way to avoid designing an unanswered state for a question.

## Selected values

A selected value is content, not a separate visual state.

Selecting an option must not:

- move the label;
- change the field anatomy;
- create a separate filled treatment;
- remove useful helper text.

In Figma, use the editable `Value text` property to show prompt and selected examples.

Do not create `Prompt`, `Selected` or `Filled` variants.

## Helper text

Helper text is optional.

Use it when it helps users:

- understand why they need to choose an option;
- understand how their choice will be used;
- distinguish between options;
- find information needed to choose correctly.

Place helper text between the label and the Select.

Associate it using `aria-describedby`.

Do not:

- repeat the label;
- use helper text as a replacement for the label;
- hide essential instructions inside the prompt option;
- use helper text to compensate for a poorly designed option list.

## Options

Each real option must have:

- a visible label;
- a stable submitted value;
- a non-empty value;
- wording that is distinct from the other options.

Reserve the empty value for the unanswered or no-selection option.

Option labels should:

- be concise;
- use sentence case;
- use consistent grammatical structure;
- be understandable without relying on visual order alone;
- avoid duplicate or nearly duplicate wording.

## Option order

Use a predictable order.

Use:

- alphabetical order when there is no more meaningful sequence;
- chronological order for dates or time periods;
- numerical order for numbered values;
- a logical process order where one exists.

A frequency-based order may be used when supported by evidence, but it must not hide, disadvantage or bias less common options.

Do not arrange options randomly.

## Disabled options

Native disabled options are supported but should be used rarely.

A disabled option:

- cannot be selected;
- must not be the prompt option;
- must not be the only way to explain why a choice is unavailable;
- must not rely on colour alone to communicate unavailability.

Where possible, remove unavailable options or explain the restriction before the Select.

Disabled-option styling is browser-controlled and is not represented as a base Figma property.

## Option groups

Native `<optgroup>` may be used when genuine categories help users navigate a longer list.

Do not use option groups:

- to compensate for an excessively long or poorly organised list;
- when category labels are ambiguous;
- when users may not know which category contains their answer.

Option groups are implementation content and are not represented in the closed Figma component.

## Keyboard accessibility

Every enabled Select must be reachable and operable using a keyboard alone.

### Sequential focus

- Tab must move focus to an enabled Select in logical document order.
- Shift+Tab must move focus to the preceding focusable element.
- Tab must move focus away to the next focusable element.
- Disabled Selects must be skipped.
- Do not set `tabindex="-1"` on an enabled Select.
- Do not use a positive `tabindex`.

### Selection

A keyboard-only user must be able to inspect and select options.

Preserve native keyboard behaviour, including:

- arrow-key navigation;
- character-key navigation where supported;
- platform-standard Enter, Space and Escape behaviour.

Do not:

- require pointer input;
- add custom key handlers that conflict with native behaviour;
- trap keyboard focus;
- move focus while users navigate or select options.

## Focus

Keyboard focus must be clearly visible for as long as the Select has focus.

Use the shared form focus treatment:

```text
form.state.focus.ring
form.state.focus.separator
```

The focus indicator must remain visible when the Select is also invalid.

Do not remove the browser focus indicator unless it is replaced with an accessible equivalent.

Author-created content must not completely obscure the focused Select.

## States

The Select supports:

- default;
- focus;
- error;
- error focus;
- disabled.

The Select does not support:

- read-only;
- open as a Figma variant;
- hover as a Figma variant;
- prompt as a visual state;
- selected as a visual state;
- filled as a visual state.

### Default

The default state shows either:

- the unanswered prompt or no-selection option; or
- the current selected value.

The control must be clearly identifiable as interactive.

### Focus

Show the shared visible focus treatment.

### Error

An invalid Select must:

- show a visible inline error message;
- use `aria-invalid="true"`;
- associate the error using `aria-describedby`;
- preserve the current prompt or selected option;
- not rely on colour alone.

For a required Select left on its prompt, use a specific error:

```text
Error: Select a country
```

Avoid vague messages such as:

```text
Invalid selection
This field is required
```

### Error focus

Show both:

- the error treatment;
- the visible focus treatment.

Neither treatment should hide the other.

### Disabled

Use the native `disabled` attribute.

A disabled Select:

- cannot be changed;
- does not receive keyboard focus;
- is not submitted with the form;
- retains its visible label;
- retains its displayed value;
- must not rely on opacity alone.

Use:

```text
form.state.disabled.background
form.state.disabled.foreground
form.state.disabled.border
```

## No read-only state

Native Select does not support a `readonly` attribute.

Do not:

- create a read-only Select variant;
- use `aria-readonly` to simulate native read-only behaviour;
- use `disabled` when the value still needs to be submitted;
- make the control look editable when it cannot be changed.

When a value must be shown but not changed, display it as static text or another suitable read-only presentation.

## Error messages

Show validation errors close to the Select.

Error messages should:

- identify what went wrong;
- explain how to fix it where possible;
- use plain language;
- avoid technical validation wording;
- avoid blaming the user.

When helper and error text are both present, include both IDs in `aria-describedby`.

Example:

```html
<select
  id="country"
  name="country"
  required
  aria-invalid="true"
  aria-describedby="country-hint country-error"
>
```

Inline errors remain present when an error summary is also used.

When multiple fields contain errors, an error-summary link should move focus to the relevant Select.

Do not move focus while the user is interacting with the Select.

## Name, role, value and state

The Select must expose:

- its accessible name;
- its native role;
- its current selected value;
- its required state;
- its disabled state;
- its invalid state when present.

Use native HTML attributes wherever possible.

Do not add ARIA that duplicates or conflicts with native HTML.

Use `aria-invalid="true"` only while the Select is invalid.

## Width

The Select fills the available width of its form-field container by default.

The parent form layout owns the practical maximum width.

Use:

```text
form.layout.column.maxWidth
```

for the default form-column maximum width.

Recommended CSS:

```css
.select {
  box-sizing: border-box;
  inline-size: 100%;
  min-inline-size: 0;
  max-inline-size: 100%;
}
```

Do not:

- create width variants;
- allow long selected values to overlap the indicator;
- allow the control to overflow its container.

## Height

Use the shared control minimum block size:

```text
size.control.minBlockSize.default
```

The Select should align visually with Text Input and other single-line controls.

Do not create Select-specific height variants unless a genuine future requirement cannot be met by shared control sizing.

## Dropdown indicator

The closed Select includes a visual dropdown indicator.

Use:

```text
size.icon.md
form.control.foreground
```

The indicator:

- is decorative;
- must not receive keyboard focus;
- must not have an accessible name;
- must not intercept pointer interaction;
- must remain visible in default, focus, error and disabled states.

If the browser-native indicator is replaced:

- retain the native `<select>` element;
- hide only the native visual indicator;
- mark the replacement icon as decorative;
- ensure it remains visible in forced-colour and high-contrast modes;
- provide enough inline-end padding so option text does not overlap it.

Do not add a separate button for the indicator.

## Open option menu

The browser and operating system control the opened option menu.

The base component does not define:

- popup dimensions;
- popup placement;
- popup shadows;
- popup animation;
- option hover styling;
- selected-option styling inside the popup.

Do not include an opened menu in the core Figma component set.

An opened-menu illustration may be used in documentation, but it must be labelled as platform-dependent.

## Supported attributes

The Select supports:

```text
id
name
required
disabled
autocomplete
form
aria-describedby
aria-invalid
```

Options support:

```text
value
selected
disabled
label
```

Option groups support:

```text
label
disabled
```

The initial component excludes:

```text
multiple
size greater than 1
readonly
```

## Autocomplete

Use a valid `autocomplete` value when the Select collects recognised personal or address information and browser autofill would help users.

Do not invent autocomplete values.

## Figma implementation

Build the Select as a single-control form-field component using Auto Layout.

Use this layer order:

1. Label
2. Helper text
3. Error message
4. Select control

### Field wrapper

Set the field wrapper to:

```text
Width: Fill container
Height: Hug contents
Direction: Vertical
```

### Select control

Set the control to:

```text
Width: Fill container
Minimum height: size.control.minBlockSize.default
```

Use this internal structure:

```text
Select control
├── Value text
└── Dropdown indicator
```

The value text must fill the available space and must not overlap the indicator.

The indicator stays aligned to the inline end of the control.

Do not model the opened popup.

## Figma component properties

### Variant property: State

Use:

```text
Default
Focus
Error
Error focus
Disabled
```

### Variant property: Requirement

Use:

```text
Required
Optional
```

This creates 10 core variants:

```text
5 states × 2 requirement values
```

### Boolean property: Helper text

Use:

```text
True
False
```

Do not create another variant axis for helper text.

### Text properties

Use:

```text
Label text
Helper text content
Error text
Value text
```

Recommended defaults:

```text
Label text:
Country

Helper text content:
Select the country where you currently live.

Error text:
Error: Select a country

Required value text:
Select a country

Optional value text:
No selection
```

### Visibility rules

Show error text when:

```text
State = Error
State = Error focus
```

Hide error text when:

```text
State = Default
State = Focus
State = Disabled
```

Use the `Helper text` Boolean property to show or hide helper text.

## Figma exclusions

Do not create Figma variants for:

- open or closed;
- prompt or selected;
- filled or empty;
- option count;
- option groups;
- width;
- height;
- indicator visibility;
- disabled individual options;
- saved value;
- setting default;
- read-only.

Use documentation and QA examples for these conditions.

## Tokens

Reuse the shared semantic form tokens.

### Label

```text
form.label.typography
form.label.color
```

### Helper text

```text
form.helper.typography
form.helper.color
```

### Error

```text
form.error.typography
form.error.color
```

### Field spacing

```text
form.field.gap.labelToHelper
form.field.gap.helperToError
form.field.gap.errorToControl
form.field.gap.controlToNextField
```

### Control

```text
form.control.background
form.control.foreground
form.control.typography
form.control.border.color
form.control.border.width
form.control.border.radius
form.control.padding.block
form.control.padding.inline
size.control.minBlockSize.default
```

### Indicator

```text
size.icon.md
spacing.control.gap
form.control.foreground
```

### States

```text
form.state.focus.ring
form.state.focus.separator
form.state.error.border
form.state.disabled.background
form.state.disabled.foreground
form.state.disabled.border
```

No new Select-specific tokens are required for the first version.

Report a token gap rather than introducing a raw value if the indicator needs a reusable offset, padding or spacing role that existing tokens cannot provide.

## HTML examples

### Required Select

```html
<div class="form-field">
  <label for="country">Country</label>

  <select id="country" name="country" required>
    <option value="" selected>Select a country</option>
    <option value="england">England</option>
    <option value="scotland">Scotland</option>
    <option value="wales">Wales</option>
    <option value="northern-ireland">Northern Ireland</option>
  </select>
</div>
```

### Required Select with helper text

```html
<div class="form-field">
  <label for="department">Department</label>

  <p id="department-hint">
    Select the department responsible for your request.
  </p>

  <select
    id="department"
    name="department"
    required
    aria-describedby="department-hint"
  >
    <option value="" selected>Select a department</option>
    <option value="accounts">Accounts</option>
    <option value="customer-services">Customer services</option>
    <option value="repairs">Repairs</option>
  </select>
</div>
```

### Required Select with an error

```html
<div class="form-field">
  <label for="country">Country</label>

  <p id="country-error">
    Error: Select a country
  </p>

  <select
    id="country"
    name="country"
    required
    aria-invalid="true"
    aria-describedby="country-error"
  >
    <option value="" selected>Select a country</option>
    <option value="england">England</option>
    <option value="scotland">Scotland</option>
    <option value="wales">Wales</option>
    <option value="northern-ireland">Northern Ireland</option>
  </select>
</div>
```

### Optional Select

```html
<div class="form-field">
  <label for="title">Title (optional)</label>

  <select id="title" name="title">
    <option value="" selected>No selection</option>
    <option value="mr">Mr</option>
    <option value="mrs">Mrs</option>
    <option value="ms">Ms</option>
    <option value="mx">Mx</option>
  </select>
</div>
```

### Setting with a valid default

```html
<div class="form-field">
  <label for="results-order">Sort results by</label>

  <select id="results-order" name="resultsOrder">
    <option value="relevance" selected>Relevance</option>
    <option value="newest">Newest first</option>
    <option value="oldest">Oldest first</option>
  </select>
</div>
```

## Accessibility testing

### Keyboard checks

Confirm that:

- Tab reaches an enabled Select;
- a visible focus indicator appears;
- options can be inspected and selected without a pointer;
- Tab and Shift+Tab move focus away normally;
- no keyboard trap occurs;
- disabled Selects are skipped.

### Screen-reader checks

Confirm that:

- the visible label is announced as the name;
- required, disabled and invalid states are announced when present;
- helper and error text are available as descriptions;
- the current selected value is announced;
- the prompt is not the only accessible name.

### Visual checks

Confirm that:

- focus is visible;
- error focus shows both focus and error treatments;
- prompt text meets normal contrast requirements;
- disabled styling does not rely on opacity alone;
- long selected values do not overlap the indicator;
- the indicator remains visible in supported contrast modes.

## QA examples

Create documentation examples for:

- required prompt;
- required selected value;
- optional no selection;
- optional selected value;
- helper text;
- error;
- error focus;
- disabled;
- saved value;
- setting with a default;
- long selected value;
- narrow container.

Do not add these conditions as additional variant axes.

## WCAG references

The component supports the following WCAG 2.2 requirements:

- **1.3.1 Info and Relationships:** labels, helper text and errors are programmatically associated;
- **1.4.1 Use of Color:** error and disabled states do not rely on colour alone;
- **1.4.3 Contrast Minimum:** visible text meets text contrast requirements;
- **1.4.11 Non-text Contrast:** the control boundary and focus indicator have sufficient contrast;
- **2.1.1 Keyboard:** all Select functionality works using a keyboard alone;
- **2.1.2 No Keyboard Trap:** focus can enter and leave normally;
- **2.4.3 Focus Order:** the Select appears in a logical focus order;
- **2.4.7 Focus Visible:** a visible focus indicator is shown;
- **2.4.11 Focus Not Obscured Minimum:** author-created content does not completely hide the focused Select;
- **2.5.3 Label in Name:** the accessible name includes the visible label text;
- **2.5.8 Target Size Minimum:** the closed Select uses the shared minimum control size;
- **3.3.1 Error Identification:** errors are identified in visible text;
- **3.3.2 Labels or Instructions:** the Select has a visible label and instructions where needed;
- **3.3.3 Error Suggestion:** errors explain how to correct the selection where possible;
- **4.1.2 Name, Role, Value:** name, native role, selected value and states are exposed programmatically.

## Acceptance criteria

The Select is ready when:

1. It uses a native single-selection `<select>`.
2. Every enabled Select appears in the logical sequential focus order.
3. Every Select can be completed using a keyboard alone.
4. Keyboard focus is clearly visible.
5. Every Select has a visible, associated label.
6. The accessible name includes the visible label text.
7. Helper and error text are programmatically associated.
8. The selected value and states are exposed to assistive technologies.
9. Required questions begin with an empty-value prompt.
10. No valid answer is preselected for a question without a saved value.
11. Optional Selects provide a no-selection option.
12. The component has no read-only or open-menu variant.
13. Prompt and selected values are content conditions, not visual variants.
14. Width is Fill container and controlled by the parent layout.
15. Shared form, sizing, spacing and icon tokens are reused.
16. The dropdown indicator is decorative.
17. Error focus shows both error and focus treatments.
18. The Markdown, YAML, Figma component and implementation guidance agree.

## Related documentation

- `patterns/forms/form-field-patterns.yaml`
- `patterns/forms/form-field-patterns.md`
- `patterns/forms/single-control-pattern.md`
- `patterns/forms/labels.md`
- `patterns/forms/helper-text.md`
- `patterns/forms/required-and-optional.md`
- `patterns/forms/validation-and-errors.md`
- `patterns/forms/focus-management.md`
- `patterns/forms/tokens.md`
- `patterns/form-layout.yaml`
- `components/text-input/text-input.yaml`
- `components/textarea/textarea.yaml`
