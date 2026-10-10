# Breadcrumb research

Reviewed 10 October 2026. Research evidence and proposals recorded before construction; the accepted recommendations are now carried into the component contract and Figma. Richard requires hierarchy breadcrumbs only.

## What wrapping means

Full path wrapping keeps the ordered breadcrumb items and moves items onto another line when the available width runs out. It describes layout, not the source of the path: a wrapped breadcrumb can still represent the site's hierarchy rather than browsing history.

## Baymard evidence

### Mobile product pages

[Mobile breadcrumb research](https://baymard.com/research-articles/implementing-mobile-hierarchy-breadcrumbs), Edward Scott, 21 September 2020.

Retain category ancestors. Omitting Home and the current product title caused no observed problems. Swipeable overflow performed well with discoverability cues. Wrapping risks crowded targets; middle-level ellipsis adds effort. Underlining, separators, and space support recognition. These findings concern ecommerce mobile product pages. They do not establish a tested solution for one exceptionally long label or WCAG conformance.

### Hierarchy and history

[Breadcrumb types research](https://baymard.com/research-articles/ecommerce-breadcrumbs), Jamie Holst, 10 December 2013; clarification July 2014.

Hierarchy links let users arriving through search or promotions explore the product's categories. History controls instead restore a previous results page and its filters or sorting. Baymard recommends both for ecommerce, but they solve different needs. The history recommendation is outside Richard's requested component scope; the hierarchy findings remain applicable.

### Excessive depth

[Catalog categorization research](https://baymard.com/research-articles/ecommerce-over-categorization), Edward Scott, 3 January 2023.

Unnecessary categories can fragment comparable products into separate lists. Shared attributes may work better as combinable filters; distinct product types can warrant categories. The choice depends on the catalog. For breadcrumb work, this suggests reviewing the information architecture before treating every depth problem as a display problem.

## Accessibility evidence

[W3C technique G206](https://www.w3.org/WAI/WCAG22/Techniques/general/G206), updated 15 July 2025, describes a control that switches to a layout where reading text does not require horizontal scrolling. It is a sufficient technique for Reflow, not a mandatory control. This supports investigating an expanded layout; it does not establish that this breadcrumb implementation conforms.

## Proposed component decisions

These are design-system proposals informed by the evidence, not claims that Baymard tested this exact component.

- Define each item as a named ancestor with a destination supplied by the application. Do not derive the trail from browser history, referrers, search terms, or recently visited pages.
- Treat a long trail and a long individual label as separate cases. Propose a compact mobile overflow presentation plus, when it overflows, a clearly labelled **Show full path** control that expands the same hierarchy in place into a wrapping or stacked version. This alternative needs usability and accessibility validation; it is not Baymard's tested pattern.
- In both compact and expanded presentations, constrain an individual item to the available container width and allow its label to wrap inside the link. The horizontal trail may therefore grow taller for a long label. Preserve its full text; do not rely on a hover tooltip, a screen-reader-only name, or horizontal panning to read the label. Permit breaking an otherwise unbreakable string as a final layout safeguard.
- Supply concise breadcrumb labels separately from long page titles when appropriate, with editorial guidance against ambiguous abbreviations. Keep destination identity clear.
- Make omission of the current item an explicit page-level choice. When shown, propose plain current-page text. On a general content page, retaining that text may be useful; do not extrapolate the product-page omission finding universally. A final ancestor remains an ancestor when the current item is omitted.
- Test actual depth, translations, long names, keyboard focus, touch use, screen readers, text spacing, and enlarged text. Establish the 320 CSS pixel and zoom/reflow contract before selecting a horizontal implementation. A swipeable trail is not automatically evidence of WCAG conformance; W3C guidance requires separate review.

## Remaining work

Richard accepted these recommendations on 10 October 2026. The component contract and Figma examples now carry them forward. The W3C review supports offering a reflowing alternative; actual implementation checks remain necessary. No token, code, or Figma change follows automatically from these research notes.
