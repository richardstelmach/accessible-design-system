## Summary

<!-- Describe what changed and why. Focus on the design-system decision or problem being addressed. -->

## Type of change

<!-- Tick all that apply. -->

- [ ] Design token
- [ ] Component contract
- [ ] Pattern or accessibility guidance
- [ ] Figma implementation
- [ ] Build tooling or automation
- [ ] Documentation only
- [ ] Bug fix
- [ ] Other

## Source-of-truth checks

- [ ] The change was made in the appropriate GitHub source file.
- [ ] Generated files were not edited manually.
- [ ] Related Markdown and machine-readable documentation remain aligned.
- [ ] Not applicable to this change.

## Token checks

Complete this section when tokens or token tooling are affected.

- [ ] Source tokens were updated in `tokens/primitives/`, `tokens/semantic/`, `tokens/components/` or `tokens/themes/`.
- [ ] `node scripts/build-tokens.mjs` completed successfully.
- [ ] `tokens/compiled/tokens.raw.json` was reviewed.
- [ ] `tokens/compiled/tokens.studio.json` was reviewed.
- [ ] Retained aliases resolve correctly.
- [ ] Compiled outputs were committed when changed.
- [ ] Not applicable to this change.

## Responsive-token checks

Complete this section when a responsive `base`, `md` or `lg` token is added, changed or removed.

- [ ] The source contains the required `base`, `md` and `lg` branches.
- [ ] `tokens/figma/breakpoint-mapping.json` was updated.
- [ ] Responsive branches remain in `tokens.raw.json`.
- [ ] Mapped responsive branches are absent from `tokens.studio.json`.
- [ ] The matching Figma `Breakpoint` variable was updated manually.
- [ ] `base`, `md` and `lg` modes were validated in Figma.
- [ ] No production `/base`, `/md` or `/lg` variables, styles or component variants were introduced.
- [ ] Not applicable to this change.

## Figma checks

Complete this section when the production Figma library is affected.

- [ ] GitHub remained the source of truth for the decision.
- [ ] Existing semantic variables, styles and components were reused where appropriate.
- [ ] Responsive values inherit from the parent frame's `Breakpoint` mode.
- [ ] Routine Tokens Studio export used non-destructive settings.
- [ ] Representative components and documentation frames were visually checked.
- [ ] No missing variable or text-style bindings were introduced.
- [ ] No unintended component, variant or instance changes were introduced.
- [ ] Not applicable to this change.

## Deletion, renaming or destructive reconciliation

Complete this section when tokens, variables or styles are removed or renamed.

- [ ] Active Figma consumers were identified before removal.
- [ ] Active bindings were migrated.
- [ ] A duplicate Figma file or suitable backup was tested.
- [ ] Zero stale references were confirmed.
- [ ] A named production Figma version was created.
- [ ] A post-export audit passed.
- [ ] Not applicable to this change.

## Component and accessibility checks

Complete this section when a component or pattern is affected.

- [ ] The component YAML contract is updated.
- [ ] Human-readable component documentation is updated.
- [ ] Accessibility guidance and states are documented.
- [ ] Keyboard, focus, error and disabled behaviour were considered where relevant.
- [ ] Component tokens use semantic or primitive tokens appropriately.
- [ ] Figma implementation matches the GitHub contract.
- [ ] Not applicable to this change.

## Validation evidence

<!-- Add relevant command output, screenshots, Figma links or a short description of checks completed. -->

- Build or validation commands:
- Figma pages or nodes checked:
- Accessibility checks:
- Other evidence:

## Documentation and decisions

- [ ] Existing documentation was updated where the change affects an established workflow.
- [ ] A Notion decision or decision-log entry was added or updated when the change introduces an architectural decision.
- [ ] No documentation update was required.

## Final review

- [ ] The diff contains only intended changes.
- [ ] No secrets, credentials or personal data are included.
- [ ] File names, token paths and terminology are consistent.
- [ ] This change is ready for review.

---

Reference: [`docs/token-sync-workflow.md`](https://github.com/richardstelmach/accessible-design-system/blob/main/docs/token-sync-workflow.md)
