# Pagination research

Reviewed 10 October 2026. Research and design proposals precede the component contract. Richard explicitly requires a navigation landmark with an accessible label and handling for very large page counts.

## Baymard evidence and its scope

[Product List UX: The Number of Products to Load by Default](https://baymard.com/research-articles/number-of-items-loaded-by-default), Rebecca Hugo-Terrey, 7 January 2020.

Product counts per batch depend on product type, device, search relevance and performance. Too few items can conceal a catalog's breadth; too many can overwhelm users. Baymard generally recommends Load more for ecommerce product lists. Its batch-size findings concern products displayed, not how many numbered pagination links to render; they do not establish an ellipsis threshold.

[Infinite Scrolling, Pagination Or “Load More” Buttons? Usability Findings In eCommerce](https://www.smashingmagazine.com/2016/03/pagination-infinite-scrolling-load-more-buttons/), Christian Holst, Baymard co-founder, 1 March 2016. This is Baymard's first-party research published externally, and is linked from its own articles.

Participants commonly used Previous and Next rather than specific page numbers. Long pagination lists discouraged product exploration; Load more preserved a consolidated list and encouraged more deliberate browsing than endless scrolling. Endless scrolling also obstructed footer access. The author explicitly limits these findings to ecommerce testing; they do not settle the best navigation for administrative tables, archives or known-page retrieval.

[17 Common UX Pitfalls Telco Websites Suffer From](https://baymard.com/research-articles/2021-telco-benchmark), Sally Collins, 27 July 2021, sections 8–9.

Small, tightly packed page links were difficult to tap, especially on mobile; slow responses encouraged repeated taps. This later study again favors Load more for ecommerce product discovery, with careful restoration when returning to the list. These observations support generous targets and clear transition feedback in any pagination proposal, while the loading-method conclusion remains domain-specific.

[Return Users to the Same Place in the Product List When Returning from the Product Page](https://baymard.com/research-articles/return-same-place), Mark Crowley, 17 November 2020.

Returning to the beginning forces users to refind their position. This is especially disruptive on mobile and with long lists. A pagination integration should restore the actual list state and position on return from an item, rather than merely loading the correct page number.

[4 Design Patterns That Violate “Back” Button UX Expectations](https://baymard.com/research-articles/back-button-expectations), Christian Holst, 20 July 2020.

Users expect Back to restore their perceived previous view, including filters and sorting. As a design-system inference, changing pagination in place should maintain meaningful URL/history state together with filters and sorting, and keep visible controls consistent with restored content.

## Accessibility and established component guidance

[W3C navigation landmark guidance](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html) supports native `nav`. Different navigation sets need distinct names; repeated landmarks containing identical links can share a name. Require a localized label such as `aria-label="Search results pagination"`; top and bottom copies of that same navigation can use the same label.

[WAI-ARIA 1.2, aria-current](https://www.w3.org/TR/wai-aria-1.2/#aria-current) explicitly identifies pagination links as a use for `aria-current="page"` and advises marking only one element in a set current. Pagination is navigation, not a tablist or selection widget.

[GOV.UK Pagination](https://design-system.service.gov.uk/components/pagination/) keeps the first, last, current and neighboring page numbers, uses ellipses for skipped pages, and adjusts the visible set to available horizontal space. It omits Previous at the start and Next at the end, and recommends the page number in the document title. Its examples use labelled `nav`, a list and current-page links.

[USWDS Pagination](https://designsystem.digital.gov/components/pagination/) defines at most seven number/ellipsis slots, plus Previous and Next. It keeps navigation in one line, uses non-selectable ellipses and generous targets, and distinguishes known-total from unbounded sets. It recommends actual links, including the current page, descriptive page names and `aria-current="page"`. Seven slots are this design system's rule, not Baymard's experimentally established universal optimum.

[WCAG 2.2 Reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) requires a usable presentation at the equivalent of 320 CSS pixels for vertically scrolling content, subject to its exceptions. A pagination bar should not require horizontal page scrolling or clipped controls to fit. [Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) sets a 24-by-24 CSS pixel minimum with exceptions and encourages larger targets. A 44-pixel design-system target is a proposed usability choice, not the AA minimum.

## Proposed component decisions

These are recommendations for this system, subject to implementation testing; they are not claims that Baymard tested this exact component.

- Keep a numbered pagination component for explicit page navigation. Document Load more as an alternative to consider for ecommerce discovery. Do not automatically turn pagination into endless scrolling or hide the footer.
- Use a labelled native `nav` and list. Link names identify their destination, for example “Page 248”; exactly one current link has `aria-current="page"`. Keep Previous and Next visibly labelled. Omit unavailable boundary links rather than inventing disabled anchor behavior.
- For a known total, use a maximum seven-slot numbered window: show all pages when there are seven or fewer; otherwise show the first five and last page near the start, the first and last five near the end, or first/current-minus-one/current/current-plus-one/last in the middle. Insert noninteractive ellipses in the omitted ranges. Never render thousands of DOM links.
- Examples: `1 2 3 4 5 … 1000`, `1 … 247 248 249 … 1000`, `1 … 996 997 998 999 1000`. Previous and Next sit outside those seven slots. Ellipses are omission indicators, not unlabeled jump controls.
- When the numbered row cannot fit comfortably, offer a compact presentation centered on “Page 248 of 1,000” with Previous and Next. This is our responsive proposal, not Baymard or GOV.UK's exact pattern. Preserve any required direct first/last access through explicit controls or a suitable additional row. Do not reduce targets to squeeze in numbers; test narrow containers, translated labels, large counts and enlarged text.
- A labelled “Go to page” field with an explicit submit action may help demonstrated known-page tasks. Keep it optional: users rarely know a meaningful page number in exploratory browsing, and a field adds validation and focus-management work. Avoid a select containing thousands of page options. Do not add the field solely because a numeric total exceeds an arbitrary threshold.
- Keep total pages and result totals honest. If the service cannot supply a reliable final page, do not fabricate “of N” or a last-page link. Decide whether an unknown-total mode belongs in the initial contract or a separate extension.
- Preserve filters, sorting, page and prior scroll position on browser return. Full navigation and in-place updates need separate acceptance cases for focus, document title, loading/error feedback, history and screen-reader announcements. Do not mark a destination as current before successful navigation.

## Decisions carried into the draft contract

The evidence does not uniquely determine the product choices. The initial draft retains explicit First/Last links in compact mode, keeps page jump optional and off by default, and scopes version one to known exact totals. It chooses layout by actual available width, describes omissions as noninteractive text, and moves focus to the results heading after successful deliberate in-place navigation while preserving history-restoration behaviour. These system-specific choices are recorded in the contract and need browser/assistive-technology validation; they are not Baymard findings. The page-jump inclusion remains a provisional default pending Richard's preference.
