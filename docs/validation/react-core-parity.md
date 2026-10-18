# Core React comparison with GitHub and Figma

18 October 2026. Compared Button, IconButton, Link and TextInput against the live GitHub contracts, the shared single-control pattern and live Figma masters. GitHub contracts and canonical tokens govern implementation. Local React adapter additions remain unmerged and do not replace the existing semantic contract.

## Source baseline

The three files fetched from GitHub main matched the corresponding HEAD blobs in this checkout before the local adapter changes:

| Contract | Git blob SHA | Figma reference |
| --- | --- | --- |
| [Button](https://github.com/richardstelmach/accessible-design-system/blob/main/components/button/button.yaml) | 5ec8cb3ca89045d1641ea12ad19a2346d684e0f8 | [Button and Icon Button](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk?node-id=85-1520) |
| [Link](https://github.com/richardstelmach/accessible-design-system/blob/main/components/link/link.yaml) | c403ebe20c99f0fa54937466113390eef0f5802e | [Link](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk?node-id=177-2882) |
| [Text Input](https://github.com/richardstelmach/accessible-design-system/blob/main/components/text-input/text-input.yaml) | ad5279424dbd5b96a07622b6b893d8941a323132 | [Text Input](https://www.figma.com/design/dVFI0q1cXMtmjUAkdvSWkk?node-id=259-2) |

The shared [single-control pattern](https://github.com/richardstelmach/accessible-design-system/blob/main/patterns/forms/single-control-pattern.md) confirms label, helper, error, control order and programmatic associations. Its fetched blob SHA is 3ce95347eec6edf0d08ff16a1eac0f88f1b2677e. TextInput does not have a dedicated Markdown guide on main; its YAML and linked shared form guides provide the existing specification.

Live Figma inspection covered the 180 Button variants, 45 IconButton variants, four Link states and twelve TextInput variants for inventory, then representative geometry, text and bindings. State recipes were inspected at the default size; representative sizes cover compact/default/comfortable. Screenshots were inspected for primary/default Button, standalone Link and default TextInput. This is a representative comparison, not a pixel-difference certification of every variant.

Detailed measurements and bindings are retained in [comparison evidence](react-core-figma-evidence.json). Figma font sizes in the recorded master measurements reflect their current inherited large breakpoint mode; browser checks explicitly exercise all three source modes.

## React corrections

| Area | Previous difference | Correction |
| --- | --- | --- |
| Button geometry | A transparent CSS border added two pixels to borderless button layouts; default outlined buttons also grew relative to inset Figma strokes | Paint the one-pixel border inside the existing geometry with an inset shadow; preserve it alongside the outer two-part focus treatment |
| Button sizes | Large/default expected 51px in Figma could render 53px | Browser checks confirm compact/default/comfortable heights 44/48/56px at base and md, 44/51/59px at lg, for all four variants |
| IconButton | Needs a circular native target independent of text-button height | Checked 44/44/48px square sizes, circular radius and shared state/focus behaviour |
| Link state roles | Primitive primary colours bypassed the canonical link role tokens; underline stayed on hover/press | Use color.link.default/hover/active.foreground and the documented state decorations |
| Standalone Link | No explicit responsive typography, and an imposed 44px target exceeded the documented target model | Use responsive default-body typography, canonical four-pixel target padding and a 24px minimum. Large-mode target is 35px high |
| Field spacing | Uniform root gap plus input margin created an extra gap before every control | Apply adjacency-specific label/helper/error/control gaps: 4px label-to-helper, 4px helper-to-error, 8px error-to-control; 4px before the control when no error exists |
| Optional marker | Rendered at the full label size | Keep wording in the label's accessible name and use the existing small-size token, matching the Figma marker |
| Character widths | Documented widths were unavailable | Add full/2ch/3ch/4ch/5ch/10ch/20ch. The character measure reserves answer content plus padding and borders, bounded by available width |
| Prohibited input props | Native props allowed placeholder and alternate ARIA names despite the visible-label contract | Exclude these in public types and reject them at runtime; consumers use label/helperText |
| Comparison font | Preview used system fallback when Inter was not installed | Bundle licensed Inter through a development-only font dependency in the preview. The distributed library still neither bundles nor fetches fonts |

No canonical token values changed. Native action/submit/reset/link behaviour, stable IDs, refs and helper/error associations remain intact.

## Figma discrepancies reconciled

The following table records the original discrepancies. A subsequent Figma reconciliation on 18 October 2026 corrected all four to the source rule. See [reconciliation results](figma-core-reconciliation.md) for final measurements and affected objects.

| Reference | Figma observation | Source rule and React result |
| --- | --- | --- |
| Link standalone style | component/link/standalone/typography uses Inter Medium, weight 500 | The contract specifies the default body typography, whose canonical weight is 400. React uses 400. If Medium is intended as a distinct product decision, the canonical recipe must be explicitly updated before adopting it |
| TextInput control height | Input control is fixed at 44px while also binding 12px vertical padding and responsive type | Source specifies minimum height, padding and responsive type. React grows naturally to 50px at base/md and 53px at lg, avoiding squeezed text and supporting resizing; do not hardcode Figma's fixed height |
| TextInput control spacing | The master uses a uniform 4px root gap even for the inline-error-to-control transition | Source names the specific 8px error-to-control token. React uses it without adding a second root gap |
| Disabled text Button | Figma's text variant stays transparent and borderless | The source disabled-state recipe specifies disabled background and border without a text-variant exception. React follows that source recipe. A transparent exception would require a canonical source decision |

The four differences above are now reconciled in Figma. Required versus optional semantics, native input growth, actual keyboard focus and native interaction states also cannot be established from a Figma variant alone.

## Verification

- Build, public type checks and thirteen Vitest tests pass, including rejection of placeholder/name overrides and acceptance of canonical widths.
- Four repeatable Playwright tests pass: all variant/size heights across 600/800/1200px viewports, IconButton targets, Link typography/padding/decoration, stable focus geometry, canonical state colours, field spacing, marker sizing, disabled/read-only semantics, narrow reflow and forced-colour focus.
- Both independently packed React 18.3.1 and React 19.3.1 consumers pass types, SSR, hydration, IDs and native reset.
- Client production build passes. Canonical token compiler outputs remain unchanged; generated browser references resolve.
- The mobile matrix screenshot was inspected for wrapping, clipping and field alignment. Screenshots use Inter 400/500, not a browser font substitute.

Run npm run build, npm run typecheck, npm test, npm run test:browser, npm run build:example and npm run verify:package. Install Chromium through Playwright first. The browser config accepts OWLA11Y_BROWSER_EXECUTABLE for an already installed test browser. CI installs its browser and runs the same checks.

Use the local preview with ?parity for the comparison matrix. Screen-reader combinations, all browsers, full text-spacing/zoom and complete release conformance still require the broader launch matrix. The initial React pass did not modify Figma; the linked follow-up records the Figma changes. No package or library publication has been performed.
