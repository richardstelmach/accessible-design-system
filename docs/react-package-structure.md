# OwlA11y package structure

Accepted baseline: React 18.3 and 19; styled components with token overrides; light theme at launch. The workspace implements seventeen components: Button, IconButton, Link, TextInput, Textarea, Select, Fieldset, Checkbox, Radio, ErrorSummary, DateInput, Dialog, Tabs, Alert, Badge, Stepper and Accordion, plus the Toast notification host (ToastProvider, ToastRegion, ToastNotificationsButton and useToast). Publication remains disabled.

## Repository layout

- tokens/: existing canonical primitives, semantic and component tokens plus generated interchange outputs. Preserve their current paths.
- components/: framework-neutral semantic contracts and companion guides.
- packages/react/api-contract.json: initial machine-readable React interface inventory.
- packages/react/src/components/: implementations grouped by public family.
- packages/react/src/internal/: private field associations, IDs, focus and announcement helpers. Expose no internal Figma documentation components.
- packages/react/src/styles/: component CSS; no global reset or font download.
- packages/react/generated/: generated token CSS and metadata, never manually edited.
- packages/react/src/index.ts: named component/type exports after implementation exists.
- apps/docs/: public documentation and examples, using the actual package.
- examples/client-consumer/ and examples/server-consumer/: separate installation fixtures testing packed artifacts.
- scripts/: current token compiler plus a browser CSS generator and release validation.

The workspace uses npm workspaces and a committed lockfile. Root is private; the React package remains private during development until release checks are satisfied. Keep one publishable component package for launch rather than splitting every component into its own package.

## Distribution contract

Provisional name @owla11y/react; beta line 0.1.0-beta.N. React and React DOM peer range >=18.3.0 <20.0.0, with explicit React 18.3 and 19 CI lanes. Do not broaden the range without evidence. Use ESM with explicit exports for the package root and styles.css, generated declarations and CSS listed as side effects. Add CommonJS only for a demonstrated consumer need.

Generate token custom properties using canonical Web codeSyntax references; detect name collisions. Resolve aliases by role while preserving CSS variable references where possible. Expand composite typography into font family/size/weight/line-height/spacing declarations. Map base/md/lg to the existing 48rem/64rem policy using default values and media overrides. Tokens Studio JSON is not production CSS. Never prefix or rename variables inconsistently with current Web references.

Scope component styles with owla11y classes. Offer documented CSS-variable overrides on a parent container; default light variables must allow scoped overrides to inherit. Include no Tailwind dependency, forced font fetch, analytics or runtime network calls. Font installation/licensing is documented separately. Custom palettes require consumer contrast verification; dark-mode tokens are out of launch scope.

## Build and test contract

Clear generated package dist, build canonical tokens, generate browser CSS, compile React/types, assemble styles and pack the artifact. Clearing dist prevents renamed private modules from leaking into later package builds. CI must install that artifact into both fixtures, exercise production builds and test hydration. Test both React versions, native form behaviour, focus and accessibility. Include Strict Mode lifecycle cases. Never publish an empty index or manifest that advertises unimplemented components.

Before adding dependency versions, verify current official tool documentation and lock the chosen versions. A build-tool selection is an implementation choice; it must preserve per-component use-client boundaries so static components remain usable in server-rendered applications. Do not mark the entire library client-only by default.

## Immediate implementation order

1. Establish the workspace, CSS generation, type checking and packed-consumer fixtures.
2. Implement Button/IconButton, Link and TextInput, verifying the shared API conventions.
3. Add Textarea, Select, Fieldset, Checkbox and Radio with integrated native form and Figma comparison checks.
4. Implement ErrorSummary and DateInput with native error routing, explicit part IDs and a complete failed-submit example.
5. Implement Dialog and its native modal backdrop with focus/lifecycle and Figma comparison evidence.
6. Implement Tabs baseline/enhancement, responsive focus continuity and Figma parity.
7. Implement Toast host ownership, announcement delivery, modal deferral and focus recovery; retain manual assistive-technology acceptance as a release gate.
8. Implement Alert and Badge contextual feedback, semantic headings, wrapping and source/Figma validation.
9. Implement Stepper and Accordion with native quantity behaviour, progressive disclosure and source/Figma validation.
10. Complete Card, Breadcrumb and Pagination, then finish release evidence.

## Scaffold verification

The root commands build ESM and declarations with TypeScript, generate browser styles, run Vitest and compile the Vite consumer. scripts/verify-react-package.mjs packs the actual artifact and installs it into temporary independent React 18.3 and 19 consumers for declaration, SSR, hydration and native reset checks. The server consumer is generated temporarily by that script; it is not an additional published application. See packages/react/README.md for remaining manual accessibility checks.
