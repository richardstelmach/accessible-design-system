# React core validation

18 October 2026. Initial implementation evidence for Button, IconButton, Link and TextInput, before the comparison and Figma reconciliation linked below. The package is private and unpublished; this initial pass changed no Figma objects or canonical token values.

## Completed checks

- Clean npm ci succeeds from the committed lockfile; dependency audit reported no known vulnerabilities at this run.
- Canonical token compiler passes: 407 raw tokens, 335 Tokens Studio tokens, 24 mapped responsive groups and no broken retained aliases. Existing generated interchange outputs are unchanged.
- ESM build and generated declarations pass, with use-client directives preserved in component modules.
- Positive/negative prop tests compile, including native refs/events, IconButton naming, invalid variants and controlled/uncontrolled input exclusivity.
- Eleven Vitest tests pass: native action/submit/disabled/keyboard behaviour, decorative icons, anchor attributes, descriptions/errors, controlled input, optional wording, form reset/submission, shared errors, configuration failures, SSR/hydration IDs, automated axe markup checks, and generated CSS references/responsive font aliases.
- npm pack artifact contains 17 intended files, including styles, declarations, README and MIT licence. Private contracts/tests and dependencies are excluded.
- Fresh independent consumers passed public type checks, SSR, hydration, stable IDs, native reset and native links with React 18.3.1 and React 19.3.1, using each major's typings.
- Client preview production build passes. Vite's warnings about ignoring use-client directives are expected in a fully client-rendered application; the unbundled library preserves those directives.
- Chromium checks passed controlled reset, keyboard focus-visible, responsive typography at 800/1100px, scoped background customisation, 320px document reflow, forced-colour outlines and absence of page errors. Mobile screenshot inspected for clipping/overlap.

## Remaining release evidence

Axe in jsdom excludes colour contrast; it cannot establish rendered contrast or assistive-technology behaviour. Complete the release matrix for NVDA, VoiceOver, TalkBack, full zoom/text spacing, other browsers, pointer/touch and comprehensive Figma parity. Chromium's forced-colour emulation does not substitute for Windows high-contrast testing. No public npm namespace, package publication or Figma distribution is claimed.

The independent server consumer verifies render/hydration, not a full Next.js React Server Components build. That integration remains a release task. Only four core exports are implemented; the remaining families remain drafts in api-contract.json.

## Reproduction

Run npm ci, npm run build, npm run typecheck, npm test, npm run build:example and npm run verify:package. The last command creates temporary packed consumers and requires npm registry access. Browser layout checks were performed against npm run dev using a separate Chromium test runner. Screen-reader checks remain manual tasks.

## Source and Figma comparison follow-up

See [core parity report](react-core-parity.md) for the later source-led corrections. The suite now has thirteen component tests plus four browser comparison tests. That report supersedes this initial pass for visual parity; the linked [Figma reconciliation](figma-core-reconciliation.md) records all four resolved discrepancies.

Before GitHub submission, the build, type checks, all thirteen Vitest tests, all four Chromium tests, client production build, independent packed consumers on React 18.3.1 and 19.3.1, component YAML parsing and whitespace checks passed again. The canonical compiled token outputs remained unchanged. These results do not close the manual release evidence above.
