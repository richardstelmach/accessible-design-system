# OwlA11y React

Local beta scaffold. Implemented exports: Button, IconButton, Link and TextInput. React 18.3 and 19 are supported by the automated consumer checks. The remaining design-system families are not exported yet. This package stays private until release review.

```tsx
import { Button, TextInput } from '@owla11y/react';
import '@owla11y/react/styles.css';

<form>
  <TextInput label="Email address" name="email" type="email" autoComplete="email" />
  <Button type="submit" variant="primary">Continue</Button>
</form>
```

Button defaults to type=button, variant=default and size=default. IconButton requires an icon and aria-label or aria-labelledby; the referenced label must exist and be nonempty. Icons must be decorative SVGs without focusable descendants, title or controls. Link renders a real anchor and requires href and meaningful visible content. Native props, events and refs are retained; className on TextInput styles its field wrapper and its ref targets the input.

TextInput requires label and name. IDs are stable through SSR/hydration and generated unless supplied. It defaults to required. Use requirement="optional" for the localisable optional marker (optionalLabel). Supported purposes are text, email, tel, url, password and search. Placeholder text and accessible-name overrides are prohibited; use the visible label and helperText. width accepts full (default), 2ch, 3ch, 4ch, 5ch, 10ch or 20ch. Character measures reserve the answer width plus padding/borders and shrink to the container. Controlled inputs require onChange or readOnly; uncontrolled inputs support native form reset. A controlled form must reset application state itself.

Use helperText and error={{message, id?}} for associated descriptions. errorDescribedBy references an existing shared error without duplicating it. Do not combine it with an individual error. Disabled/read-only inputs suppress error presentation. Supplied IDs and external aria-describedby/aria-labelledby targets must remain unique and valid. Invalid configuration throws an actionable error in all builds; an application error boundary may present an appropriate fallback.

## Styling

The stylesheet includes the canonical light tokens and responsive typography. No Tailwind, global reset, telemetry or font download is included. Install licensed Inter separately or accept the system sans-serif fallback.

Override consumed variables on a parent container, for example --color-interactive-primary-background or --form-control-background. To override primitive tokens and recompute their dependent aliases, add the owla11y-theme class to the container and declare overrides after the library stylesheet. Never override the internal --owl-button-* properties; use canonical variables. Custom palettes require contrast verification.

## Local development

From the repository root:

- npm ci: install the committed lockfile.
- npm run build: validate canonical tokens, generate CSS and compile ESM/declarations.
- npm run typecheck: positive and negative API type checks.
- npm test: interactions, automated markup accessibility and hydration checks.
- npm run verify:package: pack locally and verify fresh React 18.3 and 19 consumers; requires registry access.
- npm run dev: open the local preview at the address printed by Vite.
- npm run build:example: compile the preview for production.

The public root exports only implemented components and types; styles.css is a separate export. React is a peer dependency. Component modules preserve use-client directives through the TypeScript build; the root barrel is not globally marked client-only. Client application bundlers may intentionally ignore these directives.

Automated accessibility checks exclude contrast in jsdom. Screen-reader/browser combinations, full zoom/text spacing, contrast and visual parity still need the release audit. Do not claim certification or application conformance from these tests.

## Source comparison

See [core parity report](../../docs/validation/react-core-parity.md) for source references, corrected differences and recorded Figma/source disagreements. Use the local preview with ?parity for the state/size comparison matrix. npm run test:browser runs reproducible Chromium checks (install the browser with npx playwright install chromium first). Inter is installed only in the preview, not bundled or fetched by the library.
