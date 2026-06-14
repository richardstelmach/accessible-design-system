# Responsive modes

## Overview

Responsive modes describe layout and typography changes at defined breakpoint ranges. They are based on content width, not device type.

## Breakpoint definitions

* base = default, below md
* md = 48rem and above
* lg = 64rem and above

With 16px as the standard base unit, and as Figma doesn't deal with rems, these would commonly translate to:

* md = 768px
* lg = 1024px

These are more relevant for design purposes. Whereas rem units should always be used in a development context as are scalable. 


## How this translates

GitHub is the source of truth. Where tokens scale between devices sizes, tokens are represented in the following format:

* token.path.base
* token.path.md
* token.path.lg

However, in Figma, it's easier to have one variable with base, md, lg modes. The mode can be set on the container, page level frame, then everything on the frame with the various variables, will scale up or down accordingly.

In code, the default base values can be used, in combination with media query overrides.

AI should reference the GitHub tokens.

Example:

GitHub:
* form.label.typography.base
* form.label.typography.md
* form.label.typography.lg

Figma:
* form/label/typography/fontSize
* Modes: base, md, lg

Code:
* default CSS variable
* @media (min-width: 48rem)
* @media (min-width: 64rem)

## Rules

* Do not create component variants for base, md and lg unless the component layout itself changes.
* Do not use Figma breakpoint modes as a separate source of truth.
* Do not put colour, radius, border or component state values in the Breakpoint collection unless GitHub explicitly documents them as responsive.
* Do not mix breakpoint modes with theme modes. Dark mode, when added, should use a separate Theme collection.

## Figma guidance

* Designers should apply semantic styles, such as typography/body/default or form/label/typography.
* Designers should switch the parent frame’s Breakpoint mode to preview base, md and lg.
* Designers should not manually choose typography/body/default/base, typography/body/default/md or typography/body/default/lg for normal design work.

