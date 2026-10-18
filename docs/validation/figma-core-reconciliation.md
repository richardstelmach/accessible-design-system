# Figma core component reconciliation

18 October 2026. All four discrepancies from the React/source comparison have been corrected in the existing Figma file. GitHub's existing semantic contracts remain authoritative. No canonical token values, collections, public component IDs or variant axes were changed.

## Repairs and evidence

| Repair | Objects | Verified result |
| --- | --- | --- |
| Standalone Link weight | Existing component/link/standalone/typography style and 15 linked labels on the Link page | Inter Regular, existing regular-weight variable binding, shared style still attached. Existing responsive size binding retained: 16/16/18px; padded targets 32/32/35px in base/md/lg |
| TextInput height | All twelve variants in set 283:757 | Fixed height binding removed; minimum height bound to the existing 44px control token, vertical sizing hugs content and includes borders. Tested error/focus sample grows to 50/50/53px across base/md/lg |
| TextInput error gap | All twelve variants | Internal header frame groups label/helper/error with the existing 4px gap. Root header-to-control gap uses 8px for error/errorFocus and 4px otherwise |
| Disabled text Button | Nine variants: three sizes by no/leading/trailing icon | Canonical disabled background, foreground, icon and inset border bindings applied. Existing 44/51/59px large-mode heights and variant widths preserved |

The Link style ID remains S:74044515f79cad609a5b676cf7c7601c0c297d9c,. The Button set remains 95:801, Icon Button set 95:943, Link set 192:31 and TextInput set 283:757. There are still 225 Button/IconButton component nodes, four Link states and twelve TextInput variants.

TextInput uses two internal layout frames per master: _Text Input/Header and Value viewport. The viewport clips natural-width single-line value text so narrow examples do not wrap entered text and increase control height. These are ordinary layout frames, not new public components. Focus overlays remain outside the clipped value viewport and stretch with the control.

## Existing examples

All 26 TextInput example instances retained their exposed label/helper/error/value/state/requirement property values through the structural changes. Six character-width examples were then deliberately refined: inherited control sizing was restored, their illustrative widths were retained as short measures, and labels were changed to Day, Code, Year, Code, Postcode and Phone number. Other exposed values were restored. Labels no longer overflow; values remain on one line.

The final page audit found no control overflowing its instance and no visible label/header text overflowing its parent. Documentation and manual-width examples were visually inspected after repair. Shared Link-style attachments and responsive sizes were rechecked after restoring the regular-weight binding. A disabled text Button with a leading icon was inspected at 2× scale to verify resolved foreground paint and inset border.

## Durability

The existing GitHub contracts were fetched again and still matched the comparison baseline blobs: Button 5ec8cb3ca89045d1641ea12ad19a2346d684e0f8, Link c403ebe20c99f0fa54937466113390eef0f5802e and TextInput ad5279424dbd5b96a07622b6b893d8941a323132. The accompanying source changes record the explicit Figma construction recipes and this result for GitHub review. Merging the pull request remains the source-durability checkpoint.

Only existing variables and the existing shared Link style were reused. No token value, alias, collection or metadata migration is needed for this reconciliation. All temporary responsive test instances and measurement probes were removed. Detailed mutation IDs and verification receipts are retained in [repair evidence](figma-core-reconciliation.json).

No Figma library publication or npm publication was performed. Runtime screen-reader and full cross-browser acceptance remain separate release checks.
