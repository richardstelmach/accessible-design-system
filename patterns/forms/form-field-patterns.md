# Form field patterns

Form fields should help users understand what information is needed, enter it correctly and recover from errors.

This page defines the two shared form field patterns used across the design system:

1. Single control pattern
2. Grouped control pattern

## Labels and legends are not interchangeable

Labels and legends are different HTML mechanisms.

A label identifies an individual form control.

A legend identifies a group of related controls inside a fieldset.

Use a label for individual controls.

Use a legend for grouped controls.

Do not describe this as “label or legend” because that makes them sound interchangeable.

## Single control pattern

Use the single control pattern when one form control answers one question.

Examples include:

- text input
- textarea
- select
- single checkbox
- search input
- password input
- currency input
- stepper

### Anatomy

```text
Single form control
├── Label
├── Helper text, optional
├── Error message, optional
└── Control
```

### Rules

Every control must have an accessible name.

Labels should be associated with fields programmatically.

A visible label is the default.

Helper text is optional.

If helper text exists, associate it with the control.

If error text exists, associate it with the control.

If the control is invalid, set `aria-invalid="true"`.

Placeholder text must not be used as the label.

## Grouped control pattern

Use the grouped control pattern when several controls answer one shared question.

Examples include:

- radio group
- checkbox group
- date of birth
- address group
- multi-part questions

### Anatomy

```text
Grouped form control
├── Fieldset
│   ├── Group header, visual layout region
│   │   ├── Legend
│   │   ├── Group helper text, optional
│   │   └── Error message, optional
│   └── Related controls / content slot
```

Group header is a visual layout region, not extra public HTML anatomy. Use `form.group.gap.headerToContent` between the Group header and related controls. A runtime implementation must keep the native legend as the Fieldset's first direct child and must not render a Group header wrapper.

### Rules

Use `fieldset` and `legend` when several controls answer one shared question.

The legend describes the group.

Each child control may still need its own label.

Associate shared Helper text with the Fieldset. Error association follows the authoritative [Fieldset error-association contract](../../components/fieldset/fieldset.md#error-association): `group` is the default for an error concerning the complete group, while a consuming composite may use `children` when it can identify one or more affected visible, enabled children. The one visible Error remains in the Group header in either mode; its visual position does not determine its accessible owner.

Labels and legends are not interchangeable.

## Relationship to components

Components should consume these patterns rather than redefining them.

For example, text input should follow the single control pattern.

Radio and checkbox groups should follow the grouped control pattern.

Date of birth should follow the grouped control pattern because day, month and year answer one shared question.
