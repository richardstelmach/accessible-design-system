# Button

**Status:** React implementation and automated checks complete locally; manual release checks pending.

**Machine-readable specification:** [button.yaml](./button.yaml)

## Overview

Use Button for actions and Link for destinations. Button defaults to type="button"; choose submit or reset explicitly. Four variants are supported: primary, default, destructive and text. All use compact, default or comfortable sizing. Defaults are variant=default and size=default.

Provide a visible label through children. At most one leading or trailing decorative icon is supported in version one. IconButton requires an icon and a non-empty accessible name through aria-label or aria-labelledby. Its variants are primary, default and destructive; text is unsupported.

Preserve native button attributes and events. Disabled uses the native disabled attribute. Focus must retain the shared double-ring treatment during hover and press. Do not model focus or hover as React props.

## Acceptance

Verify explicit submission, ordinary actions within forms, reset, disabled activation, accessible names, independent focus, long labels and all supported variants/sizes. IconButton must be circular with the selected target size. Test native Enter/Space activation without duplicate handlers, 320px reflow, zoom, forced colours and text spacing.

## React contract

See [React APIs](../../docs/react-api.md) for shared attributes, state and error conventions. Token sources remain canonical; no token values change in this documentation revision.
