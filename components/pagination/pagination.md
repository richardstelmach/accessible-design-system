# Pagination

Pagination provides named navigation between addressable pages of a known result
set. It keeps the visible page window small even when thousands of pages exist.

Status: draft contract, tokens and Figma work. This repository does not contain a
production implementation. Browser and assistive-technology checks remain release
requirements.

## Research and when to use

Use Pagination for explicit page navigation in search results, archives and
operational lists. [Baymard's product-list research](https://baymard.com/research-articles/number-of-items-loaded-by-default)
generally favours Load more for ecommerce discovery. Do not treat a numbered bar
as the default answer for every product catalogue, or interpret a product batch
size as a recommended number of pagination links.

Baymard also found that small, tightly packed pagination links were hard to use,
especially on mobile. We use generous targets and keep Previous and Next visible.
The seven-position window follows [USWDS pagination guidance](https://designsystem.digital.gov/components/pagination/),
not a numerical threshold established by Baymard. Compact mode and optional page
entry are proposals for this system. See [research and sources](./research.md).

## Scope and API

| Input | Requirement |
| --- | --- |
| `label` | Non-empty localised landmark name; defaults to Pagination. |
| `currentPage` | Positive safe integer within the known result set. |
| `totalPages` | Exact non-negative safe integer. |
| `pageHref(page)` | Real destination URL preserving filters and sorting. |
| `presentation` | Auto by default; numbered or compact available explicitly. |
| `pageJump` | Off by default; enable only for known-page retrieval tasks. |
| Labels | Localisable page names, summary, directions, help and errors. |

For zero results, `currentPage=1` is an internal sentinel, not a visible page.
Hide the component entirely for zero or one page. Reject invalid data rather than
rounding, clamping or inventing totals. Cursor-only APIs and unknown totals are
outside this first version; do not display a fabricated last-page link.

## Landmark and link semantics

Require native `<nav aria-label="Pagination">`. Prefer a contextual label such as
`Search results pagination` when a page contains different result sets. Identical
top/bottom copies of the same navigation may share the same label; different sets
need different labels. This follows [W3C navigation landmark guidance](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html).

Use a list of native links. Numbered links have names such as “Page 500”. Exactly
one current link per numbered list has `aria-current="page"`; it remains a real
link, with a distinct filled current indicator. Pagination is not a tablist,
menu, toolbar or selection widget.

```html
<nav aria-label="Search results pagination">
  <a href="?page=499" rel="prev">Previous<span class="visually-hidden"> page</span></a>
  <ul>
    <li><a href="?page=1" aria-label="Page 1">1</a></li>
    <li><span aria-hidden="true">…</span><span class="visually-hidden">Pages omitted</span></li>
    <li><a href="?page=499" aria-label="Page 499">499</a></li>
    <li><a href="?page=500" aria-label="Page 500" aria-current="page">500</a></li>
    <li><a href="?page=501" aria-label="Page 501">501</a></li>
    <li><span aria-hidden="true">…</span><span class="visually-hidden">Pages omitted</span></li>
    <li><a href="?page=10000" aria-label="Page 10,000">10,000</a></li>
  </ul>
  <a href="?page=501" rel="next">Next<span class="visually-hidden"> page</span></a>
</nav>
```

The example omits surrounding result content and filter parameters for clarity.
In production the same URL builder must preserve all relevant query state.
Ellipses have no click behaviour or tab stop. Omit unavailable Previous/First and
Next/Last links at the respective ends; do not simulate disabled anchors.

## Many pages

There are at most seven number-or-ellipsis positions, plus Previous and Next.

| Position | Example for 10,000 pages |
| --- | --- |
| Start | **1** 2 3 4 5 … 10,000 |
| Middle | 1 … 499 **500** 501 … 10,000 |
| End | 1 … 9,996 9,997 9,998 9,999 **10,000** |

The deterministic window is:

```text
if total <= 7: show all pages
else if current <= 4: show 1..5, omission, total
else if current >= total-3: show 1, omission, total-4..total
else: show 1, omission, current-1, current, current+1, omission, total
```

Current and both endpoints always appear, numbers are sorted and unique, and an
ellipsis represents at least two omitted pages. Compute this in bounded time and
space; never allocate one item per page. Keep complete localised numbers rather
than abbreviations such as 10k. The contract's algorithm was checked across all
page positions for totals through 500 and selected boundaries up to JavaScript's
maximum safe integer: 125,301 multi-page cases and nine invalid inputs passed.
This checks the contract algorithm, not a production component.

## Compact layout and reflow

Choose layout from actual available width, translated labels and digit lengths.
When the numbered row cannot fit, compact mode shows:

```text
Page 500 of 10,000
Previous    Next
First       Last
```

The summary has `aria-current="page"`. The numbered list is hidden from both
assistive technology and keyboard navigation; do not expose two current markers.
Direct endpoint links remain available. Compact rows can wrap or stack, and the
summary can wrap. Never shrink targets, clip text or require horizontal scrolling.
At extreme lengths permit numeric strings to wrap as a final fallback.

Do not hide a focused page link on resize. Keep it available until blur, or defer
the layout transition. A no-JavaScript page uses working links and a wrapping
numbered layout. Use logical spacing and native direction for RTL; keep numbers
isolated from surrounding bidirectional text.

## Optional page jump

Keep page entry off by default. It is useful when someone knows a destination
page, not merely because a list has a large total. Avoid a dropdown with thousands
of options.

Compose the existing Text Input and Button. Use a visible “Go to page” label,
associated “Enter a page from 1 to N” help, `type="text"`, `inputmode="numeric"`
and an explicit Go submit button. A native GET form should preserve existing
filter and sort parameters. The enabled field is required when its form is
submitted, despite the feature being optional.

Use `component.textInput.width.20ch` as the maximum content width, constrained by
the available form column. It accommodates supported unformatted safe-integer
page values. In Figma, character units are approximated by measuring 20 zeroes in
the shared control font and adding control padding; do not bind the number 20 as
20 pixels. Resize the complete nested field when changing its available width.

Validate the entire value, not a partially parsed prefix. Empty, signed,
fractional, exponential and out-of-range input receives an associated inline
error and `aria-invalid="true"`; focus the field on failed submission. Do not
navigate while typing or on blur. Submitting the current page keeps focus and
politely reports “Already on page N”. Localised digit entry requires explicit
parser support.

## Keyboard, focus and navigation

Use native Tab and Enter behaviour. Space retains link behaviour and activates
the submit button when focused. No custom arrow navigation or roving tabindex.
Focus remains visible independently of hover and pressed states. Page and
directional targets are at least 44 by 44px at the reference root size and grow
with content; 44px is the system's usability choice, not the WCAG AA minimum.

Native navigation needs meaningful document titles. For in-place navigation,
retain href fallback and mark the results region busy while loading. Keep the
current page unchanged until success. Then commit URL/history, title and results,
focus the results heading and reveal it without obscuring it. The heading should
identify the new context; avoid duplicating its announcement with a live region.

On failure keep the current page and initiating control available, announce the
error and allow retry. Ignore stale requests. Browser Back/Forward restores page,
filters, sorting and scroll position instead of forcing the deliberate-navigation
focus policy. Filtering or sorting applies to the complete dataset and resets to
page one. These are integration requirements, not behaviour supplied by Figma.

## Figma and tokens

Page: **24 - Components - Pagination**. The family has ten masters: Numbered
and Compact roots, three Link states, three Current states, Ellipsis and Page jump.
Root `Pages` and `Auxiliary` slots preserve content across layout changes. Label
and Focus remain independent in Link and Current. Root Summary and boundary
booleans must agree with the supplied data. Auxiliary is empty by default.

The six component spacing aliases are canonical in
`tokens/components/pagination.json`; all preserve precise GAP scopes and Web code
syntax. Six current-page colour aliases reference the shared
`color.interactive.selected` semantic family. Default, Hover and Pressed use its
paired background and foreground tokens. The filled indicator, strong type and
`aria-current="page"` persist through all interactions; focus is an independent
ring. The semantic family's `active` branch means a transient press, never current
location. See [shared selection guidance](../../docs/token-structure.md#persistent-selection-and-current-location).

Targets, focus, typography, field and button styling reuse existing foundations. `component/pagination/link` composes the body style with a
persistent underline; its recipe and bindings are maintained in the contract.

## Acceptance and workflow state

Figma includes first/middle/last, short and very large totals, 320px layouts,
translations, focus combinations, responsive modes, text stress and invalid
page-entry examples. Layout changes are manual previews; no navigation or
responsive detection prototype is claimed.

Keep `releaseReady` false until production tests cover screen-reader semantics,
native navigation, focus, no-JavaScript behaviour, history, asynchronous errors,
all four text-spacing overrides, 320px/400% reflow, 200% text, RTL, forced colours
and jump validation. Library publication remains separate.

Work is on `feat/pagination-contract`, based on `main` at `783289a`. Source review,
GitHub merge, Tokens Studio pull/export and the post-export audit remain pending.
