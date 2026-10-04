# Dialog

**Status:** Draft

**Version:** 0.1.0

**Machine-readable specification:** [`dialog.yaml`](./dialog.yaml)

**Component tokens:** [`../../tokens/components/dialog.json`](../../tokens/components/dialog.json)

## Overview

Dialog presents a focused task, decision or important information above the current page. It is modal: while open, the rest of the page is inert and keyboard focus remains inside the dialog.

The component is called **Dialog**, matching the native HTML `<dialog>` element and the ARIA `dialog` role. “Dialogue” is not used in component names or APIs.

The YAML specification is the source of truth for the component contract. This document explains how designers, developers, content authors and AI systems should apply it.

## When to use

Use Dialog when:

- the user needs to complete one focused task without leaving the page;
- a decision must be made before the current flow can continue;
- important information needs an acknowledgement or closely related action;
- preserving the context of the underlying page materially helps the user.

Use interruption sparingly. A dialog adds cognitive and navigation cost even when it is implemented accessibly.

## When not to use

Do not use Dialog for:

- long or complex work that deserves a page;
- information users need to compare with the underlying page while acting;
- passive status messages or confirmations that do not need input;
- tooltips, menus, popovers or inline disclosures;
- persistent navigation or filters;
- errors that can be explained next to the affected control;
- a non-modal floating panel.

Use a dedicated Alert dialog contract, rather than changing this component to `role="alertdialog"`, when a genuinely urgent interruption needs alert-dialog semantics.

## Default configuration

The default Dialog is:

- modal;
- dismissible;
- medium width;
- inset from viewport edges;
- titled;
- shown with a close control;
- able to close with Escape, the close control or a click/tap outside;
- composed with optional primary and secondary actions.

## Anatomy

1. Modal dialog container
2. Optional title
3. Optional close control
4. Required Content slot
5. Optional action area
6. Optional secondary action
7. Optional primary action
8. Modal backdrop

The header and action area remain visible when practical. When content is taller than the available space, the Content region—not the entire page—scrolls vertically with native browser scrolling.

## Semantics

Use a native `<dialog>` element and open it with `showModal()`.

```html
<dialog
  id="profile-dialog"
  class="dialog dialog--medium"
  autofocus
  closedby="any"
  aria-labelledby="profile-dialog-title"
>
  ...
</dialog>
```

Do not open the component by adding only the `open` attribute. `showModal()` creates the modal interaction model and makes content outside the dialog inert.

The native element already has the implicit `dialog` role. Do not add `role="dialog"` or `aria-modal="true"` unless a verified platform support issue requires a documented workaround.

## Accessible name

Every Dialog must have an accessible name.

### With a visible title

When the title is present, use `aria-labelledby` to reference its unique `id`:

```html
<dialog aria-labelledby="delete-file-title" autofocus closedby="any">
  <h2 id="delete-file-title">Delete file?</h2>
  ...
</dialog>
```

Do not also add `aria-label`. One naming method avoids duplicate or conflicting names.

The heading level depends on the page structure. The title may be visually styled with the Dialog title style without changing its correct semantic level.

### Without a visible title

When no visible title is shown, require a concise, purpose-specific `aria-label`:

```html
<dialog aria-label="About session timeout" autofocus closedby="any">
  ...
</dialog>
```

Do not derive the name from body copy, the close button or an action label. The component API should fail development validation when neither a title nor an accessible label is supplied.

## Accessible description

`aria-describedby` is optional. Use it only for a short, stable summary that makes the dialog easier to understand when it opens.

Do not point `aria-describedby` at a long article, form, list or other structured content. Doing so can turn the entire region into one unwieldy announcement. Let users explore complex Content slot material with normal screen-reader reading commands.

## Content slot

Product content is inserted through a technical slot named `content`:

```html
<ads-dialog>
  <div slot="content">
    <p>Your changes have not been saved.</p>
  </div>
</ads-dialog>
```

The component’s internal template exposes:

```html
<div class="dialog__content">
  <slot name="content"></slot>
</div>
```

The slot accepts structured content, including forms, lists and other components. Slotted content owns its internal semantics, labels and validation. The Dialog owns the modal boundary, name, sizing, scroll container, dismissal and focus lifecycle.

In implementations without Web Components, expose the same contract through the framework’s standard composition mechanism—for example a `content` render prop, child region or named template slot. Keep the public name `content`.

## Figma Content slot

Create the content region as a native Figma slot named **Content** where slots are available. The slot must:

- accept structured component compositions;
- fill the available dialog width;
- hug its content until the dialog reaches its maximum height;
- represent vertical scrolling for overflowing examples;
- preserve the component’s content padding;
- remain separate from primary and secondary action properties.

If the current Figma tooling cannot create native slots, use a nested placeholder component or instance-swap property named **Content**. Record the fallback for later migration and do not change the public property name.

Do not remove or rename a published Content slot without migration testing. Doing so can reset content in existing instances.

## Focus behavior

### Opening

When a trigger opens the Dialog:

1. Record the currently focused trigger.
2. Put `autofocus` on the native Dialog container, not on a descendant.
3. Call `showModal()` and let the native dialog focusing steps focus the container.

Do not add `tabindex` to `<dialog>`; the HTML Standard prohibits it. The explicit `autofocus` placement is the standards-aligned way to implement this component contract’s decision that initial focus belongs on the Dialog object itself.

Do not move initial focus to:

- the close button;
- the first form field;
- the primary action;
- a destructive action;

by default. A product-specific exception needs a clear usability reason and documented testing.

### While open

Tab and Shift+Tab must remain within the modal dialog. Prefer the native `showModal()` focus model and inert background behavior. Do not layer a second focus-trap library over the native behavior unless testing identifies a specific browser defect; competing traps commonly cause skipped controls or focus loops.

Content added while the Dialog is open must join the logical focus order. Do not use positive `tabindex` values.

### Closing

After the Dialog closes, restore focus to the element that opened it.

If the trigger has been removed or disabled, move focus to a logical nearby target chosen by the product flow. If the action navigates to a new view, use the destination’s focus-management pattern instead.

## Dismissal modes

### Dismissible

Dismissible is the default. It closes through:

- Escape;
- the close control, when shown;
- click or tap on the backdrop;
- an action that intentionally closes it.

Set `closedby="any"` where supported so the native element accepts close requests and light dismissal. Keep the documented event handling as a compatibility path where the component’s supported-browser policy requires it.

Closing without completing an action must not silently save, submit or commit changes.

The close control is optional, but when present it must:

- use a native button with `type="button"`;
- use the Button component’s icon-only presentation;
- use the registered `x` icon;
- have the accessible name `Close dialog` or a more specific equivalent;
- meet target-size and visible-focus requirements;
- stay clear of title and body text at supported zoom and text-spacing settings.

The `x` icon is decorative because the button’s accessible name communicates the action.

The header must grow when the title wraps. Reserve inline space for the close control, but do not use a fixed header height or single-line title constraint. Long, translated or enlarged titles must remain fully visible and must not collide with the close control or body content.

### Forced decision

Forced-decision mode is for a flow that genuinely cannot continue until the user chooses an available action in the Dialog.

In forced-decision mode:

- Escape does not close the Dialog;
- backdrop click or tap does not close it;
- the close control is not shown;
- at least one enabled action inside the Dialog resolves the flow;
- declining is an explicit action when it is a valid outcome;
- consequences are explained before the actions.

Set `closedby="none"` where supported and retain the `cancel` prevention as the compatibility guard.

Prevent the native `cancel` event. Do not let the Dialog close and then reopen it, because that produces confusing announcements and focus movement.

Do not use forced-decision mode merely to increase conversion, block ordinary cancellation or pressure a user into consent.

## Backdrop interaction

Use the shared [`Modal backdrop`](../modal-backdrop/modal-backdrop.md) foundation when composing Dialog examples or product designs. Its background is `color.overlay.modal`; `component.dialog.backdrop.background` is a component-level alias of that semantic token.

On the web, keep the native `<dialog>` structure and apply the colour through `dialog::backdrop`. Do not add an extra backdrop element merely to mirror the Figma composition component.

For a dismissible Dialog, close only when both pointer down and pointer up occur outside the visible surface. This prevents an interaction that begins inside—such as selecting text or dragging—from dismissing the Dialog when it ends outside.

Do not close when users interact with content, a scrollbar or a descendant control.

## Actions

Primary and secondary actions are optional.

- Primary uses the Button `primary` variant.
- Secondary uses the Button `default` variant.
- Use native `<button>` elements.
- Use `type="button"` unless the control intentionally submits a form.
- Use specific labels such as `Save changes` or `Delete account`, not vague labels such as `OK`.

In a dismissible informational Dialog, both actions may be absent. In forced-decision mode, at least one enabled resolving action is required.

On narrow viewports, actions may stack and fill the available width. Keep the same secondary-then-primary sequence when the layout stacks so visual, reading and focus order remain aligned. Do not use CSS `order` to create a mismatch.

## Sizing

Dialog size is fluid up to a maximum inline size.

| Size | Token | Maximum | Use |
| --- | --- | ---: | --- |
| Small | `component.dialog.size.small` | `32rem` / 512px | Short confirmations and focused decisions |
| Medium | `component.dialog.size.medium` | `40rem` / 640px | Standard forms and common tasks; default |
| Large | `component.dialog.size.large` | `56rem` / 896px | Complex content that genuinely needs more width |

The actual width is the smaller of the selected maximum and the viewport minus two `component.dialog.size.viewportInset` values.

Sizes are consumer choices, not breakpoint variants. Do not choose Large only to avoid improving content structure. If a task remains hard to understand in Large, consider a page.

## Mobile presentation

### Inset

Inset is the default on mobile. Preserve at least `component.dialog.size.viewportInset`—1rem—from each viewport edge. The maximum block size also leaves this inset at the top and bottom.

This avoids a cramped edge-to-edge surface for short dialogs while leaving a clear visual relationship to the underlying page.

Use dynamic viewport units in code so mobile browser chrome and on-screen keyboards do not hide the header, content or actions.

### Full screen

Full screen is an explicit mobile option for tasks that need the available canvas. It uses:

- `100dvi` inline size;
- `100dvb` block size;
- no maximum size;
- `radius.none`;
- safe-area-aware padding for the header, Content slot and actions.

Do not use full screen for a short confirmation. It does not change the Dialog’s semantic, naming, focus or dismissal requirements.

## Overflow and scrolling

Constrain the Dialog to the available viewport height and apply native vertical scrolling to the Content region:

```css
.dialog {
  display: flex;
  max-block-size: calc(100dvb - 2 * var(--component-dialog-size-viewport-inset));
  flex-direction: column;
  overflow: hidden;
}

.dialog__content {
  min-block-size: 0;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
```

Do not replace browser scrolling with custom scrollbars. Do not create horizontal scrolling at 320 CSS pixels or when the page is viewed at 400 percent zoom.

Prevent the underlying page from scrolling while the Dialog is open, then restore its previous scroll behavior and position on close.

## Reference markup

The following expanded HTML illustrates the rendered anatomy. A framework or Web Component may generate it from the documented named slots.

```html
<button type="button" id="edit-profile-trigger">
  Edit profile
</button>

<dialog
  id="edit-profile-dialog"
  class="dialog dialog--medium"
  autofocus
  closedby="any"
  aria-labelledby="edit-profile-title"
>
  <header class="dialog__header">
    <h2 id="edit-profile-title">Edit profile</h2>
    <button
      type="button"
      class="button button--icon-only"
      aria-label="Close dialog"
      data-dialog-close
    >
      <!-- Registered x icon; aria-hidden="true" -->
    </button>
  </header>

  <div class="dialog__content">
    <!-- Content slot -->
    <form id="edit-profile-form">
      ...
    </form>
  </div>

  <footer class="dialog__actions">
    <button type="button" class="button" data-dialog-close>Cancel</button>
    <button type="submit" class="button button--primary" form="edit-profile-form">
      Save changes
    </button>
  </footer>
</dialog>
```

## Reference behavior

This framework-neutral controller shows the required lifecycle. Production adapters may express the same contract through framework hooks.

```js
export function createDialogController(dialog, { forcedDecision = false } = {}) {
  let trigger = null;
  let pointerStartedOutside = false;

  const isOutsideSurface = (event) => {
    const rect = dialog.getBoundingClientRect();
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    );
  };

  const open = (openingTrigger = document.activeElement) => {
    trigger = openingTrigger instanceof HTMLElement ? openingTrigger : null;
    dialog.setAttribute("closedby", forcedDecision ? "none" : "any");
    dialog.showModal();
  };

  const close = (returnValue = "") => dialog.close(returnValue);

  dialog.addEventListener("cancel", (event) => {
    if (forcedDecision) event.preventDefault();
  });

  dialog.addEventListener("pointerdown", (event) => {
    pointerStartedOutside = isOutsideSurface(event);
  });

  dialog.addEventListener("pointerup", (event) => {
    const endedOutside = isOutsideSurface(event);
    if (!forcedDecision && pointerStartedOutside && endedOutside) close("dismiss");
    pointerStartedOutside = false;
  });

  dialog.addEventListener("close", () => {
    if (trigger?.isConnected && !trigger.matches(":disabled")) {
      trigger.focus();
    }
    trigger = null;
  });

  dialog.querySelectorAll("[data-dialog-close]").forEach((control) => {
    control.addEventListener("click", () => close("dismiss"));
  });

  return { open, close };
}
```

The product adapter must add its documented fallback when the opening trigger is removed or disabled. It must also coordinate page scroll locking without resetting the page’s scroll position.

## Figma component model

Create one Dialog component set with these properties:

| Property | Type | Values/default |
| --- | --- | --- |
| Size | Variant | Small, Medium, Large; Medium default |
| Mobile presentation | Variant | Inset, Full screen; Inset default |
| Dismissal | Variant | Dismissible, Forced decision; Dismissible default |
| Show title | Boolean | True default |
| Title | Text | `Dialog title` default |
| Show close | Boolean | True default; false for Forced decision |
| Content | Native slot | Required; instance-swap fallback |
| Show primary action | Boolean | True default |
| Primary action | Instance swap | Preferred instance: Button / Primary |
| Show secondary action | Boolean | True default |
| Secondary action | Instance swap | Preferred instance: Button / Default |

Do not create variants for content type, title text, button label, overflow amount, focus position or individual examples.

Use Auto Layout throughout. Bind surface, border, radius, spacing and sizes to the Dialog component tokens. Reuse Button and registered icon components without detaching them.

Static Figma frames cannot prove modal semantics or focus containment. Annotate the expected behavior and validate it in implementation.

For every titleless Figma instance, add an accessibility annotation containing the required implementation `aria-label`. Do not add invisible text to the production component merely to simulate accessibility metadata.

## Documentation examples

Create instances—not additional masters—for:

- default dismissible Dialog;
- titleless Dialog with a documented accessible label;
- no close control;
- no actions;
- primary action only;
- primary and secondary actions;
- forced decision with two explicit outcomes;
- Small, Medium and Large;
- inset at 320px and 390px;
- mobile full screen;
- short content;
- overflowing content with the Content region marked as scrollable;
- long title and long action labels;
- right-to-left layout.

## Accessibility testing

### Contract checks

Confirm that:

- a title produces `aria-labelledby` and no `aria-label`;
- a titleless Dialog requires a non-empty, purpose-specific `aria-label`;
- forced-decision mode cannot show a close control;
- forced-decision mode requires an enabled resolving action;
- no undocumented variants or raw visual values are introduced.

### Keyboard checks

Confirm that:

- the trigger opens the Dialog with its native keyboard behavior;
- focus lands on the Dialog container;
- Tab and Shift+Tab reach every enabled control in logical order;
- focus cannot move into the background page;
- Escape closes dismissible mode;
- Escape does not close forced-decision mode;
- every available action works without a pointer;
- nested widgets retain their documented Escape behavior.

### Focus-restoration checks

Close through each applicable path:

- Escape;
- close control;
- backdrop;
- primary action;
- secondary action.

After each path, confirm focus returns to the opening trigger. Then remove or disable the trigger and confirm the product-defined fallback receives focus.

### Pointer checks

Confirm that:

- click or tap outside closes dismissible mode;
- interaction inside does not close it;
- a drag beginning inside and ending outside does not close it;
- backdrop interaction does not close forced-decision mode.

### Screen-reader checks

Confirm with representative browser and screen-reader combinations that:

- the Dialog role and accessible name are announced;
- title-based naming is not duplicated;
- focus starts on the Dialog container;
- background content is unavailable while the Dialog is open;
- controls are announced in a logical order;
- complex Content slot material can be explored normally;
- closing returns the virtual and keyboard interaction context appropriately.

### Visual and responsive checks

Check:

- 320px and 390px mobile;
- 768px tablet;
- 1024px and 1440px desktop;
- Small, Medium and Large sizes;
- inset and mobile full-screen presentation;
- short and overflowing content;
- browser default scrolling;
- 200 percent text spacing;
- 400 percent browser zoom;
- visible focus and focus not obscured;
- high contrast and forced-colours modes;
- long translated strings and right-to-left content;
- safe-area insets and an open on-screen keyboard.

## WCAG 2.2 AA considerations

The component supports:

- **1.3.1 Info and Relationships:** title, content and actions retain programmatic structure;
- **1.3.2 Meaningful Sequence:** reading and focus order match the presented flow;
- **1.4.3 Contrast Minimum:** text meets required contrast;
- **1.4.10 Reflow:** inset and full-screen layouts avoid two-dimensional scrolling at supported zoom;
- **1.4.11 Non-text Contrast:** boundaries, controls and focus indicators remain perceivable;
- **1.4.12 Text Spacing:** content does not overlap or become unavailable with adjusted text spacing;
- **2.1.1 Keyboard:** every dialog function works with a keyboard;
- **2.1.2 No Keyboard Trap:** modal focus is intentionally contained, and a documented close or resolving action always provides an exit;
- **2.4.3 Focus Order:** focus starts on the Dialog and moves logically within it;
- **2.4.6 Headings and Labels:** titles and controls describe their purpose;
- **2.4.7 Focus Visible:** focused controls have a visible indicator;
- **2.4.11 Focus Not Obscured (Minimum):** scrolling and sticky regions do not completely hide the focused item;
- **2.5.3 Label in Name:** visible control labels are included in their accessible names;
- **2.5.8 Target Size (Minimum):** the close control and actions meet the shared target-size requirement;
- **3.2.1 On Focus:** focus alone does not unexpectedly submit or close the Dialog;
- **3.2.2 On Input:** changing a field does not unexpectedly close the Dialog;
- **3.3.2 Labels or Instructions:** slotted forms provide visible labels and instructions;
- **4.1.2 Name, Role, Value:** the Dialog and its controls expose their names, roles and states.

Focus containment is not a failure of 2.1.2 when users have a keyboard-operable way to close or resolve the modal. A forced-decision Dialog therefore must always include an enabled resolving action.

## Acceptance criteria

- A native modal Dialog is used on the web.
- Focus moves to the Dialog container on open and remains inside while open.
- Focus returns to the trigger on close, with a documented fallback if restoration is impossible.
- Dismissible mode supports Escape, optional close control and backdrop dismissal.
- Forced-decision mode prevents Escape and backdrop dismissal, prohibits the close control and requires an enabled resolving action.
- Exactly one accessible naming method is used.
- Overflowing content scrolls vertically using native browser scrolling.
- Optional primary and secondary actions reuse Button.
- Mobile inset leaves sensible viewport space and mobile full screen respects safe areas.
- Small, Medium and Large remain fluid below their maximum widths.
- Technical and Figma Content slots share the same public name and intent.
- The documented keyboard, pointer, screen-reader, reflow and focus-restoration checks pass.
