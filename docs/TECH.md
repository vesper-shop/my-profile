# Technology Stack

This document describes the architecture currently used by the repository.

## Overview

The project is a pnpm workspace containing:

- a React 19 SPA built with Vite+
- TanStack Router file-based client routes
- Void file-based Hono routes running on Cloudflare Workers
- Better Auth backed by Cloudflare D1
- Cloudflare static assets
- the `@my-profile/ui` package

## Core runtime

| Technology              | Role                                                        |
| ----------------------- | ----------------------------------------------------------- |
| Vite+                   | Development, build, lint, formatting, and checks            |
| Void + Hono             | Worker routing, auth, environment, and Cloudflare packaging |
| React + TanStack Router | Browser SPA and file-based routes                           |
| Tailwind CSS            | CSS-first styling with the existing project design tokens   |
| Better Auth + D1        | Authentication and persistence in Cloudflare D1             |
| Cloudflare Assets       | Static client files                                         |

Exact versions are recorded in `package.json` and each workspace package manifest.

## Build and routing

`vite.config.ts` installs Void, TanStack Router code generation, React, and Tailwind. Production
creates `dist/client/` for static assets, `dist/ssr/` for the Cloudflare Worker, and a native
Cloudflare Build Output in `.cloudflare/output/v0`. Void scans the
root `routes/` directory; exported handler names supply HTTP methods, and catch-all segments use
`[...name].ts`.

All application Worker handlers live under `/api`. This lets Cloudflare serve matching static assets
and the SPA fallback without invoking the Worker. The sitemap is a static file under `public/`.

Generated files in `.void/`, `dist/`, `.cloudflare/`, and `src/routeTree.gen.ts` are not edited manually.

## Code boundaries

- `src/` contains browser-only state and UI.
- `routes/` and `server/` contain Worker-only transport and application integrations.
- `types/` contains only contracts consumed by both browser and Worker.
- `packages/ui` contains reusable visual, footer, and terminal components.

## Environment strategy

`env.ts` validates runtime values. Local values belong in the gitignored `.env`; resource
bindings belong in the `cloudflare` section of `void.config.ts`; non-sensitive configuration is an
`env.ts` default and credentials are Cloudflare secrets.
Application code reads environment values through Void or Hono context, not `process.env`.

## Commands

```bash
pnpm dev       # Local Void/Vite+ development server
pnpm build     # Production build
pnpm deploy    # Production build and Cloudflare deployment
pnpm check     # Codegen, formatting, lint, and TypeScript checks
pnpm lint      # Codegen and lint
pnpm format    # Formatting
```
