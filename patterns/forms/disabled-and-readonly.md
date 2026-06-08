# Disabled and read-only fields

Disabled and read-only are different states and must not be treated as the same thing.

## Disabled fields

Disabled fields cannot be edited.

Disabled fields cannot receive keyboard focus.

Disabled fields are not submitted with the form.

Assistive technology users may still navigate to disabled fields, so the field should still have a clear name and state.

## Disabled example

```html
<label for="reference">Reference number</label>
<input id="reference" name="reference" value="ABC123" disabled>
```

## Disabled rules

Disabled fields must still have a label.

Disabled fields must visually communicate that they are unavailable.

Disabled fields must not rely on colour alone.

Avoid making disabled content so low contrast that users cannot read it.

Do not use disabled styling for fields that are actually editable.

Do not use disabled fields when the value needs to be submitted.

Programmatically marked as disabled.

Disabled controls don't need to pass contrast, if defined as disabled.

## Read-only fields

Read-only fields cannot be edited.

Read-only fields can receive focus.

Read-only fields are submitted with the form.

## Read-only example

```html
<label for="reference">Reference number</label>
<input id="reference" name="reference" value="ABC123" readonly>
```

## Read-only rules

Use read-only instead of disabled when the value still needs to be submitted.

Read-only fields should have a distinct visual treatment from disabled fields.

Do not use disabled styling for read-only fields.

Read-only fields must still have a label.

## Difference summary

```text
Disabled:
- cannot be edited
- cannot receive keyboard focus
- not submitted with the form

Read-only:
- cannot be edited
- can receive keyboard focus
- submitted with the form
```