# Side menu

Status: implemented in React and published to the Figma library, 27 October 2026. [Component contract](side-menu.yaml) · [Side-navigation design pattern](../../patterns/side-navigation.yaml).

## Overview

A side menu can provide the **primary navigation for an entire website or application**, or navigation within a substantial section. Documentation-heavy sites, B2B software, administration consoles and larger account areas are suitable contexts. This component is reusable by any design-system consumer; OwlA11y is one possible use, rather than its definition.

Two working exports separate responsibilities. `SideMenu` provides navigation content and independent group disclosures. `ResponsiveSideMenu` composes it with the existing Accordion, Button and Dialog to provide persistent desktop navigation and a mobile drawer or optional in-flow disclosure. Neither export constructs a website, routes content, supplies a brand header or implements search/accounts/permissions.

## When to use

Choose a side menu when users repeatedly move among many stable destinations and named groups, visible sibling links and current-page indication help them orient themselves. Leave enough reading or working space beside it. Do not choose it merely because a list exceeds an arbitrary item count: task frequency, grouping, label length and available space matter.

For primary navigation, the top header may contain identity, search and utility links while the sidebar carries the main hierarchy. For section navigation, a global header can coexist with the sidebar; use distinct landmark names such as “Primary” and “Account settings”. These contexts do not require different visual variants or ARIA roles.

Prefer top navigation for a small shallow set of broad destinations or a focused journey where a sidebar offers little benefit. Use breadcrumbs for ancestry, a separate table of contents for headings in one document, Tabs for panels and appropriate task/progress patterns for sequential steps. This side menu is not a command menu, tree widget or generic sidebar container. [The design pattern](../../patterns/side-navigation.yaml) records these choices and ownership boundaries independently of the React API.

## Static and expandable groups

A group is **static by default**: its label is ordinary text and all its links remain visible. This suits short, frequently scanned groups such as “Start here” or “Administration”. Set `expandable: true` where a larger or less frequently used list benefits from disclosure. Mix the two types freely; expandable groups open independently and can all close.

Group labels never navigate. If a group needs a landing page, put an “Overview” link first inside it. The first candidate supports one group level. Deeper structures, link-plus-toggle parent rows, icon-only rails, counts/badges and hover flyouts require a separate reviewed requirement.

Expandable groups are actual instances of the existing **Accordion**, using its neutral default/hover/pressed treatment, registered caret, focus behaviour and H6 visual title style. Supply an explicit `headingLevel={2..6}` when expandable groups exist. Static-only navigation may omit it and use paragraph captions; supplying it also gives static peer captions matching semantic headings. A missing heading level for expandable groups is rejected instead of silently guessing the outline.

## React API

```tsx
import { SideMenu } from '@owla11y/react';

<SideMenu
  aria-label="Main navigation"
  headingLevel={3}
  currentId="projects"
  items={[
    { id: 'home', label: 'Home', href: '/workspace' },
    { id: 'work', label: 'Work', items: [
      { id: 'projects', label: 'Projects', href: '/projects' },
      { id: 'people', label: 'People', href: '/people' },
    ] },
    { id: 'admin', label: 'Administration', expandable: true, items: [
      { id: 'settings', label: 'Settings', href: '/settings' },
    ] },
  ]}
/>
```

Required `items` contains direct links or groups. Optional `aria-label` names the native navigation landmark; omit it when a single navigation landmark is clear from context. When multiple navigation regions serve different purposes, give them distinct contextual names, such as `aria-label="Main navigation"` and `aria-label="Account navigation"`. A supplied name must be nonempty. IDs must be nonempty and globally unique within the navigation. Links retain genuine destinations and optional permitted `linkAttributes`. `currentId` is an explicit existing link ID, never a URL-prefix guess. Exactly that link receives `aria-current="page"`, a blue leading rule and strong dark text. The forwarded ref targets `nav`.

`defaultExpandedIds` sets uncontrolled initial expandable groups; the current branch is added initially. Alternatively, `expandedIds` with `onExpandedChange` provides controlled ownership and excludes defaults. Ownership cannot switch. Static groups cannot appear in either expansion list. A controlled initial state is explicit: include the current branch if it should start open. Later changes to `currentId` request the new expandable branch open without closing unrelated groups; controlled owners may decline. Users may subsequently collapse the current branch. Removing an uncontrolled group discards its expansion state; reintroducing its ID does not restore the old choice.

## Responsive composition and mobile drawer

```tsx
const [menuOpen, setMenuOpen] = useState(false);

<ResponsiveSideMenu
  label="Documentation"
  aria-label="Main navigation"
  headingLevel={3}
  items={navigationItems}
  currentId={currentPageId}
  open={menuOpen}
  onOpenChange={setMenuOpen}
  mobilePresentation="drawer"
/>
```

The responsive export requires `label` for its visible drawer title, independently of the optional navigation `aria-label`. A drawer always retains its accessible title even when its inner nav is unnamed. It accepts the navigation props and a required application-owned `open` / `onOpenChange` pair. `toggleLabel` defaults to “Menu”; `closeLabel` defaults to “Close navigation”. Both can be localised. The same nav ref is forwarded. Optional `drawerTriggerContainer` supplies a mounted element in the same document for the existing drawer Menu Button; omitting it keeps the control local. `returnFocusRef` passes an explicit logical destination to Dialog, particularly after successful client-side routing.

At and above existing `lg` (**64rem**), navigation is persistent. Below it, the default is a drawer at logical inline-start. It reuses the existing dismissible Dialog, including visible title, Close IconButton, initial container focus, Tab boundary, native background inertness, backdrop, scroll lock, Escape and focus restoration. The Menu button exposes a dialog popup relationship. Scoped shell CSS supplies edge placement and safe-area padding; **the Dialog implementation, public API and canonical contract remain unchanged**.

The drawer uses existing `component.dialog.size.small` (32rem) as its maximum width and never exceeds the viewport; it fills smaller phones. It uses viewport height with a scrollable content region and a reachable close control. It has no slide animation. A drawer open during resizing stays modal until explicitly dismissed. It does not suddenly become a desktop sidebar while a user is interacting with it.

`mobilePresentation="inline"` uses our existing **Accordion** as a single Menu item, with navigation in its content panel. Supply `inlineHeadingLevel={2..5}` explicitly, with deeper group headings (for example, outer H2 and groups H3). It uses ordinary Tab order and existing Accordion focus recovery, with no background inertness, trap, backdrop or scroll lock. Close before changing mobile presentation. Outer and group expansion remain independent; closing Menu preserves group choices.

This is an explicitly requested, bounded two-layer exception to Accordion's general exclusion of nesting. It does not introduce arbitrary recursive navigation or expand the general Accordion API. The [Accordion contract](../accordion/accordion.yaml) records that local composition and its release gates.

The lg threshold is a reusable starting point, not a universal content-fit guarantee. The wrapper serves viewport-level page/application shells. Consumers embedding navigation in a narrow area of a wide page should use `SideMenu` in their own appropriate responsive composition. The core does not prescribe column widths, sticky positioning or a desktop scroll area.

## Page composition: padding, divider and trigger placement

The core `nav` has **zero outer padding** and supplies no sidebar divider. Link targets, static captions and Accordion triggers retain their existing internal padding and hover/target geometry. The host owns any column inset, separation from main content and clearance for external focus rings. Do not add an outer nav inset merely because its items already have padded targets.

A vertical separator belongs to the **page or application shell**, separating the sidebar column from the content column. It is not a boolean menu option and does not travel with navigation into a drawer. The local preview draws it on its desktop sidebar wrapper using existing border tokens, with host-owned focus clearance; compact navigation has no column divider.

For **primary site/application navigation**, put the mobile drawer Menu button in the page header near the product identity. For **section navigation**, keep the button beside the section or in its local toolbar and use a contextual name, such as “Account navigation”. The in-flow Accordion remains local to its content even when it represents the primary hierarchy; moving that disclosure into a separate header would separate its header from its in-flow panel.

`drawerTriggerContainer` lets the host choose the button's physical location without copying the control, manually wiring IDs or creating another open-state owner. It renders the existing Button in the supplied slot only when the drawer is available. Inline presentation ignores this slot. The slot must remain mounted in the same document while the trigger/drawer is in use; do not move or remove it while focused or open. Normal dismissal returns focus to the actual button, including a header button, and responsive changes preserve it until focus safely leaves. Successful routing can still use `returnFocusRef` for a logical destination.

```tsx
const [menuOpen, setMenuOpen] = useState(false);
const [headerSlot, setHeaderSlot] = useState<HTMLDivElement | null>(null);

return <>
  <header>
    <div ref={setHeaderSlot} />
    <strong>Product name</strong>
  </header>
  <ResponsiveSideMenu
    label="Primary"
    aria-label="Main navigation"
    headingLevel={3}
    items={navigationItems}
    currentId={currentPageId}
    open={menuOpen}
    onOpenChange={setMenuOpen}
    drawerTriggerContainer={headerSlot}
  />
</>;
```

For section navigation, omit `drawerTriggerContainer` and set `toggleLabel` to a clear local label. Keep the overall header, sidebar wrapper, divider, main content and routing at the application boundary. The component does not infer primary versus section use from the label.

## Routing, cancellation and focus

The application owns destinations, URL/history, current identity, route completion and document titles. Links keep modifier-click, new-tab and context-menu behaviour. An SPA adapter should intercept only an accepted, unmodified primary activation, respecting `defaultPrevented`.

The component **does not close on every click**. Close the controlled drawer after navigation succeeds. If navigation is cancelled or fails, preserve the current page and access to the open menu. After accepted SPA navigation, provide the new main/heading as `returnFocusRef` and close; Dialog releases modal state and focuses that destination. Ordinary dismissal omits that explicit destination and returns to Menu. A same-page destination still needs appropriate focus handling even if `currentId` does not change. The preview demonstrates these boundaries, including simulated failure. RTL support remains in the reusable implementation and browser regression tests; its selector is removed from the normal review interface.

Resize never silently hides a focused desktop navigation link: compact placement is deferred until focus leaves. An open drawer is not dismissed by a breakpoint. An open in-flow Menu becomes persistent above lg once focus is outside its trigger and navigation; focused descendants remain protected in both resize directions. Returning to desktop retains a focused Menu trigger until blur. Group expansion survives placement changes and outer closing. There is one mounted navigation tree, with stable explicit IDs; it is moved through React composition rather than duplicating desktop/mobile landmarks. That placement can remount native nodes while no navigation descendant has focus; group state is preserved by the wrapper. Consumers should not retain references to individual descendant nodes across placement changes.

## Accessibility and keyboard behaviour

Native `nav`, `ul`/`li`, anchors, Accordion disclosures and Dialog provide the semantics. [WAI disclosure navigation guidance](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) explains why ordinary site links do not need ARIA menu/menubar roles. Groups in this candidate expand only on activation and stay in document flow; no hover/focus popup behaviour is introduced.

Tab/Shift+Tab follow visible controls. Enter activates native links or buttons; Space toggles a Button. Arrows, Home and End retain normal scrolling. There is no roving tabindex, navigation-on-focus or redundant live announcement. Escape dismisses the modal drawer through existing Dialog; it does not collapse in-flow groups. The [modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) defines the contained keyboard sequence and explicit dismissal expectations.

The navigation landmark accepts optional `aria-label`; it has no default name. If multiple navigation landmarks serve different purposes, supply distinct contextual names such as “Main navigation” and “Account navigation”. The drawer title is required and separate. Provide a skip-to-main link before repeated navigation, a main landmark, consistent destination order and clear route focus/title changes. Do not open this drawer over another modal: it retains Dialog's one-modal-owner contract. Hidden groups remain mounted but are excluded from the tab sequence. External collapse returns focus to the controlling Button before hiding a focused group's links.

Use the existing two-layer focus treatment, 44px comfortable targets, full label wrapping, RTL logical geometry and a current-page shape/weight cue. Verify 4.5:1 ordinary text contrast and 3:1 meaningful focus/current markers, including pointer states. Support 320 CSS pixel reflow, doubled text and the four text-spacing overrides; real 400% browser zoom and assistive-technology acceptance remain distinct checks.

## Progressive enhancement and print

SSR/no-JavaScript output exposes all groups and real links with static labels. No inactive Menu/group buttons or closed dialog hides primary destinations before enhancement. If CSS, ResizeObserver or native modal support is unavailable, the wrapper keeps navigation in flow. All links and groups print, including those in a closed drawer; shell controls and caret indicators are hidden in print.

## Tokens and visual decisions

No new tokens are required. The current destination uses strong `color.text.heading` text on `color.surface.default`, without an underline. A logical leading rule uses the unchanged `color.interactive.selected.background`, `.hover.background` and `.active.background` tokens. Rule width is `border.width.thick` (4px), block inset `spacing.1` (4px), and radius `radius.sm`. Hover and pressed row surfaces use `color.interactive.default.hover.background` and `.active.background`. Hover applies only when `(hover:hover) and (pointer:fine)` matches, avoiding persistent touch hover; pressed feedback is transient and focus is preserved. Pagination and selected form controls retain their existing filled selected mappings.

Text contrast is 10.86:1 at rest, 7.47:1 on hover and 5.30:1 pressed; the rule has 4.52:1, 4.82:1 and 5.30:1 against the respective adjacent surface. Existing focus indicators remain independent of current and pointer state. Forced colours use a complete system-colour border and a `CanvasText` leading rule. The marker follows the inline-start edge in RTL.

The host owns desktop column geometry, dividers, outer insets and focus clearance. The core navigation has zero outer padding. Child lists beneath static captions and inside Accordion panels receive one logical `spacing.inset.md` (16px) indentation; top-level direct links and parent labels remain aligned. The current rule moves with its child row. Existing Link and Accordion target padding is retained. Accordion content cancels its duplicated list inset before adding the single hierarchy indent; its neutral controls and master styling are unchanged.

The drawer reuses existing Dialog width/surface/padding/backdrop tokens and the lg breakpoint. Its layout removes duplicate nav inset, uses the small stack header gap and aligns parent captions with the title; child labels sit one indent deeper. The private compact CSS signal is runtime state, not a token.

Component aliases can be introduced later if independent navigation width, indentation or current-item theming becomes an evidenced requirement. No new palette, type scale, breakpoint or speculative token family is introduced merely because this composition exists.

## Figma implementation and local review

Figma page [27 - Components - Side menu](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk?node-id=1570-296) is constructed and audited. It contains the four standard areas, existing Page Header/Card instances and production Side menu / Link (six Current × State variants with independent Focus), Side menu / Static group, Side menu and Responsive side menu (five Layout states). Links retain existing Link instances and shared typography; actual Accordion, Dialog, Button and Modal backdrop instances remain linked. Core padding is zero and the divider stays in the host example. The source is merged through [PR 49](https://github.com/richardstelmach/accessible-design-system/pull/49).

Existing selected-state variables and base/md/lg modes are preserved; no new token family or production text style was required. A QA-only reference style records the intentional 200% text/spacing stress case. Usage, primary/section placement, optional landmark naming and independent drawer title are aligned with this contract. [The audit receipt](../../docs/validation/react-side-menu-figma-evidence.json) records exact IDs, bindings, instance counts and visual checks. The original four Side menu assets and Accordion guidance were published on 27 October 2026. The subsequent approved leading-rule and indentation update is tracked in [the current treatment evidence](../../docs/validation/side-menu-current-treatment.md). The QA-only reference style remains hidden from publication.

### Figma authoring constraints

The Items slot has zero gap, so direct links remain contiguous as in React. Keep the existing Link/Accordion target padding. A group followed by another item uses the `Group — separation after` layout wrapper with `spacing.stack.md` bottom padding (16px); the final group has no trailing inset. These layout frames preserve existing component instances and add no outer nav padding.

Resize the Drawer open viewport wrapper to the desired device width and height. Its existing Dialog fills the height and caps its width through `component.dialog.size.small` (512px). A scrollable navigation frame sits in Dialog's Content slot beneath the header/Close control. All six link variants bind both minimum axes to `size.target.comfortable` (44px); larger content still grows.

The [repair regression example](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk?node-id=1591-1432) shows a short 768 × 560 viewport with a 512 × 560 surface and an adjacent zero-gap flat list. Temporary-instance checks also cover 320 × 560, 390 × 720, 512 × 400 and 1280 × 900 viewports, plus undersized target requests. Richard accepted the final review and authorized publication; the repaired masters are now published.

## Validation and remaining acceptance

The local comparison remains at `?side-menu`, with documentation-primary and B2B-primary header drawer controls, a locally labelled section control, a desktop composition divider, mobile presentation choices, long labels and simulated navigation failure. [The evidence report](../../docs/validation/react-side-menu-parity.md) records actual checks, exact files and remaining release work. Source and Figma construction are complete. Figma library publication is complete. Remaining device acceptance and npm package publication are separate steps; automated checks do not establish accessibility certification.
