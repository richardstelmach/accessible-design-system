# Link

**Status:** React implementation and automated checks complete locally; manual release checks pending.

**Machine-readable specification:** [link.yaml](./link.yaml)

## Overview

Use an anchor with a real href for navigation. Inline links inherit paragraph typography and remain underlined; standalone links use the existing component treatment. The React presentation prop defaults to inline and may be standalone.

Preserve href, target, rel, download, native anchor events and a ref to the anchor. Keep the browser's modifier clicks, context menu and new-tab behaviour. An optional trailing icon is decorative. Link has no disabled or button mode; use Button for actions.

Router integration must preserve a real anchor and destination. Version one exposes native anchor props rather than a generic as/asChild API. Add a documented router adapter only after testing it against native navigation behaviour.

## Acceptance

Verify descriptive visible text, inline wrapping, native and modified activation, external links and downloads, focus across hover/press, forced colours, text resizing and long translations. Inline links use the documented target-size exception; standalone links follow the system target guidance.

## React contract

See [React APIs](../../docs/react-api.md) for shared attributes, state and error conventions. Token sources remain canonical; no token values change in this documentation revision.
