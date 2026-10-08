# Durable Figma variable scopes and code syntax

Research date: 6 October 2026

## Conclusion

Tokens Studio for Figma supports round-tripping Figma variable scopes and platform code syntax through Git-synced DTCG token JSON. The metadata must be present on each exported token under Tokens Studio's Figma-specific `$extensions` keys:

```json
{
  "spacing": {
    "100": {
      "$type": "dimension",
      "$value": "4px",
      "$extensions": {
        "com.figma.scopes": ["GAP"],
        "com.figma.codeSyntax": {
          "Web": "var(--spacing-100)"
        }
      }
    }
  }
}
```

The durable fix is therefore to make this metadata part of the canonical token source and compile it into `tokens/compiled/tokens.studio.json`. Repairing the fields only in Figma is not durable, especially for Web code syntax.

## What is officially supported

Tokens Studio added Figma Variable Scopes and Code Syntax in plugin version 2.11.0. Its release notes describe scope selection, Web/Android/iOS syntax, and automatic synchronization between Tokens Studio and Figma variables. See the [Tokens Studio 2.11.0 changelog](https://feedback.tokens.studio/changelog/2110-3) and the [official plugin changelog at the current source revision](https://github.com/tokens-studio/figma-plugin/blob/d18ea5a0d14ebfa300643fff196b18ef4c01eb41/packages/tokens-studio-for-figma/CHANGELOG.md#L138-L146).

The current plugin stores this data as flat vendor extension keys on individual tokens:

- `com.figma.scopes`: an array of Figma variable scope names.
- `com.figma.codeSyntax`: an object containing `Web`, `Android` and/or `iOS` syntax strings.

This encoding is shown directly in the official source:

- The token editor [writes `com.figma.scopes` and `com.figma.codeSyntax`](https://github.com/tokens-studio/figma-plugin/blob/d18ea5a0d14ebfa300643fff196b18ef4c01eb41/packages/tokens-studio-for-figma/src/app/components/EditTokenForm.tsx#L390-L405).
- Importing variables from Figma [serializes their scopes and code syntax into those extensions](https://github.com/tokens-studio/figma-plugin/blob/d18ea5a0d14ebfa300643fff196b18ef4c01eb41/packages/tokens-studio-for-figma/src/plugin/pullVariables.ts#L84-L109).
- Tokens Studio writes the canonical platform labels `Web`, `Android` and `iOS`; its reader [also accepts case variations](https://github.com/tokens-studio/figma-plugin/blob/d18ea5a0d14ebfa300643fff196b18ef4c01eb41/packages/tokens-studio-for-figma/src/utils/figma/variableMetadata.ts#L34-L43).

This remains valid DTCG. The [DTCG 2025.10 format specification](https://www.designtokens.org/TR/2025.10/format/#extensions-0) permits vendor-specific data under `$extensions` and recommends reverse-domain keys to avoid clashes.

Figma itself exposes both fields as native variable metadata:

- [`Variable.scopes`](https://developers.figma.com/docs/plugins/api/properties/Variable-scopes/) controls which variable pickers show the variable. It does not prevent programmatic binding elsewhere.
- [`VariableScope`](https://developers.figma.com/docs/plugins/api/VariableScope/) defines the valid scopes by variable type.
- [`Variable.codeSyntax`](https://developers.figma.com/docs/plugins/api/Variable/) supports Web, Android and iOS values.
- [`setVariableCodeSyntax`](https://developers.figma.com/docs/plugins/api/properties/Variable-setvariablecodesyntax/) adds or updates those values; Figma also provides a removal method.

## What a routine Tokens Studio export does

The two metadata fields behave differently when the token JSON does not declare them.

### Scopes

When `com.figma.scopes` exists, Tokens Studio applies it. In the current plugin, when the key is absent, an existing matched variable normally keeps its current scopes, apart from the plugin's special handling for string-based font weights. See the [scope comparison](https://github.com/tokens-studio/figma-plugin/blob/d18ea5a0d14ebfa300643fff196b18ef4c01eb41/packages/tokens-studio-for-figma/src/plugin/setValuesOnVariable.ts#L305-L325) and [scope update](https://github.com/tokens-studio/figma-plugin/blob/d18ea5a0d14ebfa300643fff196b18ef4c01eb41/packages/tokens-studio-for-figma/src/plugin/setValuesOnVariable.ts#L476-L500).

However, omission is not a durable definition. A newly created variable has no source-controlled scope, and an existing broad scope such as `ALL_SCOPES` is not corrected. This can explain why newly added or recreated Alert and Badge variables ended up with broad picker availability even though older variables appeared to retain their setup.

### Code syntax

Web code syntax is not preserved when it is absent from the token metadata. During export, Tokens Studio deliberately performs an "orphan purge" and removes a platform syntax that is not provided by the token source anywhere in the selected themes. See the [code-syntax update and removal logic](https://github.com/tokens-studio/figma-plugin/blob/d18ea5a0d14ebfa300643fff196b18ef4c01eb41/packages/tokens-studio-for-figma/src/plugin/setValuesOnVariable.ts#L502-L565).

This directly explains why manually assigned Web syntax disappeared after the recent routine export: the GitHub-synced tokens did not contain `com.figma.codeSyntax`, so the plugin treated the Figma-only value as orphaned metadata.

## Recommended durable workflow

1. Use Tokens Studio for Figma 2.11.0 or later; prefer the current supported release.
2. Define scopes and Web code syntax in the canonical source token files, not only in Figma and not by manually editing the generated `tokens.studio.json` file.
3. Preserve the two `$extensions` keys during the repository build so they appear on the corresponding tokens in `tokens/compiled/tokens.studio.json`.
4. Commit and push the source and generated token changes.
5. In Tokens Studio, pull from the GitHub provider and export the selected variables and styles to Figma.
6. Verify representative color, spacing/dimension, typography and component tokens, including the Alert and Badge variables.

For a small number of tokens, the metadata can be entered in each token's Figma Variable section in Tokens Studio, pushed to the provider, and then moved into canonical source files so the next build retains it.

If Figma already contains the desired metadata, Tokens Studio's variable import can capture it into token `$extensions`. Because this repository treats GitHub source files as canonical and generates the provider file, the safer use of that feature is on a temporary branch or duplicate: capture the metadata, review the resulting extensions, then add those extensions to canonical source and rebuild. Do not replace the repository's token architecture wholesale with an unreviewed import.

For a larger system, a repository-owned Figma metadata mapping is preferable to manually repeating rules. The build can use that mapping to add explicit extensions per token, for example:

- color roles: only the fill, text, stroke and effect scopes appropriate to their intended use;
- spacing: `GAP` and, where intended, `WIDTH_HEIGHT`;
- radii: `CORNER_RADIUS`;
- typography values: `FONT_SIZE`, `LINE_HEIGHT`, `LETTER_SPACING`, `FONT_WEIGHT`, `FONT_FAMILY` or `FONT_STYLE` as appropriate;
- Web syntax: the exact developer-facing reference expected in Figma Dev Mode, such as `var(--component-badge-max-width)`.

The mapping approach keeps GitHub authoritative, makes regeneration deterministic, and avoids manual metadata being silently lost during later exports.

## Practical acceptance check

After the first metadata-aware build and export:

- `tokens/compiled/tokens.studio.json` contains both extension keys for every variable where they are required;
- Alert and Badge variables expose only their intended picker scopes;
- their Web code syntax is present in Figma;
- a second no-change pull and export leaves both fields unchanged;
- there are no duplicate variables and existing component bindings remain intact.

If a second export removes metadata, first check the installed Tokens Studio version and then inspect the exact compiled token entry being pulled. The source metadata, not a Figma-only manual value, must be present.
