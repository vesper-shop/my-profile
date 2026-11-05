# Design System

This document records the design already used by `my-profile`. Feature work does not replace the
global theme or font stack.

## Source of Truth

- `src/styles/tokens.css` defines semantic color, radius, and Tailwind theme mappings.
- `src/styles/globals.css` defines the existing Inter, Fira Code, Noto Sans SC, and Newsreader stacks.
- `.dark` on the root element switches modes through `next-themes`.

Application components consume semantic utilities such as `bg-card`, `bg-muted`,
`text-muted-foreground`, `border-border`, and `text-foreground`. Feature code must not introduce a
parallel palette or replace the global fonts.

## Principles

1. Use existing semantic tokens; no feature-local theme.
2. Prefer borders and surface contrast over decorative shadows.
3. Keep actions quiet until they are available.
4. Preserve keyboard access, visible focus, labels, and reduced-motion-friendly behavior.
