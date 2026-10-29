# Basic Table — local delivery plan

Status: delivered and published, 29 October 2026. Contract, React implementation, source/Figma review and automated validation are complete. PR 54 merged as c2ccbe50d4869e42ade43d859f947cf32355a732; the Table library assets are published and report CURRENT. See [publication evidence](../validation/react-table-parity.md). Richard accepted visual/API review and the revised VoiceOver/Chrome path. Wider manual accessibility checks, npm publication and deployment remain separate; website adoption is a consumer update.

Decision update, 29 October: following the recorded VoiceOver comparison, use the native table as the measured keyboard scroll target, with a scroll description. The wrapper has no group, region, name or tabindex. Page headings/caption and host-owned landmarks supply content navigation.

## Basis and discovery

- Agreed addition P02 in the private website's proposal review: captions, column headers, rows, cells and accessible overflow. Sorting, filtering, selection and virtualisation are excluded from the first version.
- Library baseline: `d04ab1e2cdcd9ff3309a197cb42bcd1a8e0299f1`. No Table contract or React implementation was found. Preserve the unrelated local selected-colour comparison files.
- Website baseline: `bbdab84ca379cec93bdd7b1f475fc3015831ef6d`. Preserve the separate uncommitted primary.700 logo review.
- There are now four website tables: Button keyboard behaviour, Button props/defaults, Accessibility release evidence, and the later proposal token-role comparison. The original P02 count of three predates the proposal table.
- Button's two captions are visually hidden; Accessibility has no caption; the proposal table has a visible caption and explicit row/column scopes. Adoption must improve consistency rather than copy these differences unchanged.
- Current site tables use ordinary native markup and local `.table-wrap`/global table styles, small body typography, cell padding and horizontal overflow. The system component must be reusable outside OwlA11y.
- Read-only Figma discovery on 27 October: no Table page or dedicated table variable paths. Existing `global` and `Breakpoint` (base/md/lg) collections remain intact. CodeBlock page `1550:46` and Side menu page `1570:296` provide recent examples of the four-area documentation structure. CodeBlock's four areas are `1550:96`, `1550:102`, `1550:108`, `1550:114`.
- Figma discovery session: `da1b3795-93e0-4410-9549-9516ef42e5ca`, file `dVFI0q1cXMtmjUAkdvSWkk`. No Figma edits were made.

## Usage scope and boundaries

Use Table for information with meaningful row/column relationships: API references, feature comparisons, factual records and status evidence. A list or description list is preferable when a grid does not help comparison. Do not use it to arrange page layouts.

First version supports simple column headers and optional row headers, ordinary text, inline code and existing component content in cells. Reuse Link, Badge and appropriate existing controls when the content needs them; their semantics and focus remain theirs. Do not make the row itself clickable or selectable.

Exclude sorting, filters, search, pagination ownership, selection, editable cells, expandable rows, sticky/pinned headers or columns, column resizing/reordering, virtualisation, drag-and-drop and ARIA grid behaviour. Complex multi-level/spanning headers need a separately reviewed contract; do not infer associations from visual placement. No zebra, hover, current-row, selected-row or density variant is justified yet. A consumer can place existing Pagination or filters outside the table, with application-owned data/state; they are not table features.

## Recommended anatomy and API direction

Recommend the public name `Table`, one default visual treatment, and native HTML composition rather than a generic columns/rows data engine. Proposed usage:

```tsx
<Table caption="Button keyboard behaviour">
  <thead>
    <tr><th scope="col">Key</th><th scope="col">Behaviour</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Tab</th><td>Moves to the next enabled control.</td></tr>
  </tbody>
</Table>
```

Recommended contract decisions to confirm before implementation:

- Required nonempty string `caption`, rendered as a native caption and supplying the table's accessible name. Visible by default; an explicit `captionVisibility="visually-hidden"` option would support an adjacent descriptive heading without removing the semantic caption. This is a component content rule, not a claim that WCAG requires a caption on every possible table.
- Native `thead`/`tbody`/`tr`/`th`/`td` children. Authors own accurate header relationships and cell contents; examples use explicit `scope="col"` and `scope="row"`. Do not silently turn data cells into headers or build a recursive validator for arbitrary React components. Document supported simple structures clearly.
- Forward the public ref to `HTMLTableElement`. Proposed native metadata belongs to the table, including id, className/style, lang/dir, data attributes and description relationships. Keep the scroll wrapper private. Use an ancestor for token overrides that must also affect the wrapper. Final allowed/forbidden attributes and caption ownership are part of the contract review.
- Own caption creation so a second child caption or a conflicting table name is not part of the supported API. Never override native table semantics with a grid role or cell tab stops.
- Allow a localisable scroll-description formatter, defaulting to “{caption}, horizontally scrollable”; reference its hidden text from the native table aria-describedby alongside author descriptions. Keep the caption as the native name and verify verbosity with a screen reader.
- No imperative table API, public scroll state, breakpoint selector or variant matrix. Native text alignment/column markup can handle content-specific presentation; determine the exact supported attribute surface in the contract.

## Responsive and keyboard behaviour

Keep the same table and header relationships at every width. Wrap cell content naturally, grow row heights and contain genuinely necessary horizontal scrolling within the table viewport. Do not squeeze text, reduce typography solely to fit a phone, hide columns or turn rows into cards at a breakpoint.

Use available container width rather than a mobile/desktop switch to detect overflow. The table's two-dimensional layout exception does not exempt the surrounding page or individual cell text from appropriate reflow. Keep prose, caption and nearby controls within the page at 320 CSS pixels. Validate a bounded, meaningful minimum column width using realistic examples rather than inventing a universal fixed table width.

Apply the established CodeBlock overflow behaviour where appropriate: compare scrollWidth/clientWidth with a one-pixel tolerance; observe viewport and content resizing, data/children changes and font readiness. Reuse an existing internal utility if suitable; otherwise extract one only if the common behaviour genuinely matches. There is no existing public scroll-container component to pretend to reuse.

When enhanced content overflows, make its native table focusable with tabindex=0 and a scroll description, native arrow-key scrolling and the existing visible focus treatment. When it fits, do not add an extra table tab stop or scroll description. Keep a focused table focusable/described until blur if overflow disappears, without moving focus. Cell links/buttons remain in ordinary Tab order. No roving focus or custom arrow navigation; screen-reader table-navigation shortcuts remain native.

Progressive enhancement must preserve the actual table before hydration, with JavaScript disabled or ResizeObserver unavailable. Resolve and test the fallback explicitly: natural wrapping first; when horizontal overflow remains, retain keyboard focus on the native table and a scroll description without waiting for measurement. A conservative baseline tab stop may be preferable to inaccessible content. Do not promise the measured-only tab order in an environment where measurement cannot run. Print must reveal the full table without clipping a scroll viewport. Actual zoom and browser/AT fallback behaviour remain manual acceptance.

## Existing token proposal

Start with no new primitives, semantic tokens or component aliases. Bind directly to existing roles and document the mapping:

| Part | Existing token direction |
| --- | --- |
| Header/body surface | `color.surface.default` |
| Header/caption text | `color.text.heading`, `typography.emphasis.strong` |
| Cell text | `color.text.default` |
| Typography | `typography.body.default`, following existing base/md/lg values |
| Cell inset | `spacing.inset.sm` (12px) block and `spacing.inset.md` (16px) inline, one standard density |
| Caption-to-table gap | `spacing.stack.sm` (8px) |
| Row separators | `border.width.thin` with `color.border.light` or `color.border.default`, to review visually |
| Scroll focus | Existing ring/separator family and widths from `accessibility/focus-indicators.yaml` |

Existing text/default and text/heading on white provide approximately 7.00:1 and 10.86:1 contrast. Decorative separators are supplementary; do not claim these subtle borders meet 3:1 or rely on them alone to convey a necessary relationship. If an essential visible boundary is needed, review an appropriate existing semantic role and its contrast instead of borrowing an interactive border simply because its value is darker.

A subtle or coloured header is not a requirement. Do not reuse selected, hover, primary-action, informational or featured tokens for static headings. T01 remains conditional; only propose a new semantic role if a reviewed visual requirement cannot be met with existing roles. No Tokens Studio export is needed if sources are unchanged. Fixed cell padding does not require a new responsive token branch.

## Accessibility acceptance to put in the contract

- Native table, caption, header and data-cell semantics; correct column/row header associations, reading order and localisable labels. No duplicate caption/name or gratuitous live region.
- WCAG 2.2 AA coverage: relevant checks include 1.3.1/1.3.2, 1.4.3/1.4.4/1.4.10/1.4.11/1.4.12, 2.1.1/2.1.2, 2.4.3/2.4.7/2.4.11 and 4.1.2; cell controls retain their own target-size/name requirements. A static data cell is not a button requiring a 44px target.
- At least 4.5:1 ordinary text contrast and 3:1 meaningful focus/boundary cues. No colour-only state, truncation or forced single-line cell text.
- 320px containing width, long translated captions/headers, unbroken identifiers, mixed text/numbers, RTL, doubled text and all four text-spacing overrides; actual 400% browser zoom is a separate check.
- No clipped keyboard focus for the wrapper or interactive cell content. Forced colours retain table structure and focus; no animation is required.
- Manual VoiceOver/Safari and NVDA/Firefox or Chrome: table discovery, caption/name, row/column header announcements, reading/navigation, native keyboard scroll entry/exit, link access and no-JavaScript fallback. Record actual results without treating axe or Figma as speech evidence.

## Delivery sequence and review points

1. Contract: create `components/table/table.yaml` and `table.md`; confirm the proposed native composition API, caption visibility/name policy and overflow fallback. Record usage scope, tokens, responsibilities, limitations and QA. Update package/API inventories only when an implementation exists.
2. Local React candidate: implement and export Table with a realistic `?table` preview. Include a short table, API-like wide table, column-plus-row headers, long content and focusable content. Build/type/unit/browser/packed-consumer checks precede any external delivery. Review the appearance locally, including caption, typography, dividers, padding and mobile scroll discoverability.
3. Validation: semantic/API and SSR/hydration tests; actual keyboard overflow and resizing, focus retention, scoped tokens, native controls, print, no-JavaScript, RTL, font loading and 320px/text-spacing checks. Run axe/rendered contrast, React 18.3/19 package consumers, and the established build/token-diff checks. Add regressions for evidenced bugs rather than tests that mirror implementation.
4. GitHub: after local acceptance and authorization, use a focused PR with source contract/docs and real evidence; check its exact head before merge. Preserve unrelated logo and palette work. Never edit compiled token output manually.
5. Figma: inspect again immediately before construction. Provisionally use the next numbered component page (currently 28), following the four areas and existing Page Header/Card instances. Compose editable header/data-cell and row building blocks with a Table master as needed; preserve aligned column widths across rows. Do not create column-count, data-count or breakpoint variant axes. Caption visibility can be a content property. Reuse actual Link/Badge/Button instances inside examples; bind surfaces, text, typography, spacing and focus to existing variables/styles. Use Breakpoint modes, not new responsive variants.
6. Figma QA/docs: column-only and row/column header examples, narrow scroll composition, visible/hidden-caption guidance, empty results as host-owned content, long labels, links, RTL and text spacing. Figma cannot implement native HTML associations, keyboard scrolling or assistive-technology conformance; document runtime requirements. Publish only at the authorized workflow checkpoint.
7. Site adoption: after library validation/delivery, replace all four local table compositions through a new immutable archive with provenance and lockfile integrity. Supply a meaningful caption for Accessibility; preserve existing keyboard/API content and proposal comparison row headers. Remove only superseded site table styles. Recheck the site and keep deployment separate.

## Review decisions still needed

Confirm the native-markup API and caption visibility policy; inspect a local candidate before fixing the final typography, separator treatment and whether an overflow hint is necessary. The recommended baseline uses existing roles and one density. A coloured header, sticky header, alternate density or data-grid API is not presumed agreed.

## Primary sources checked 27 October 2026

- [WAI Tables tutorial](https://www.w3.org/WAI/tutorials/tables/) — native data/header relationships and table purpose.
- [WAI Tables with two headers](https://www.w3.org/WAI/tutorials/tables/two-headers/) — explicit row/column scope and captions.
- [WCAG 2.2 Reflow understanding](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) — two-dimensional table exception does not include individual cells.
- [MDN overflow accessibility](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow#accessibility) — named keyboard-focusable scroll areas.

These sources support the semantics/access requirements; the proposed component API, visual mapping and delivery sequence are project recommendations.
