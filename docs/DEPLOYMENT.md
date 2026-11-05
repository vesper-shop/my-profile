# Deployment

The application builds with Void/Vite+ and deploys as the `my-profile` Cloudflare Worker.

## Runtime Resources

| Binding  | Type   | Purpose              |
| -------- | ------ | -------------------- |
| `ASSETS` | Assets | Built React SPA      |
| `DB`     | D1     | Better Auth database |

The `cloudflare` section of `void.config.ts` is the source of truth for resource bindings;
`void.lock.json` records the resolved resources and is committed. `env.ts` is the source of truth
for application environment validation: non-sensitive configuration has a default there, and
credentials are stored as remote secrets.

## Domains

`void.config.ts` binds `you-find.me`, `www.you-find.me`, `yiming1234.cn`, and `www.yiming1234.cn`
to the Worker as custom domains. Cloudflare Single Redirects, configured on each zone rather than in
this repository, run before the Worker:

- `www.you-find.me` and `www.yiming1234.cn` redirect (301) to their apex domains.
- On `yiming1234.cn`, `/login`, `/error`, `/oauth/*`, `/api/auth/*`, and the OAuth discovery
  documents redirect (308) to `you-find.me`, so `https://you-find.me/api/auth` stays the only issuer.

## Secrets

Better Auth and the GitHub/Google OAuth credentials are listed in `env.ts`. Local values belong in the
gitignored `.env`; production credentials are uploaded with `void secret put <NAME>`.

Void CLI selects the deployment platform from local `.void/project.json`, not the `target` in
`void.config.ts`, so run `void connect --platform cloudflare` once per checkout before `void secret put`.
Use `void env check --remote` to verify required secret names.

## Commands

```bash
pnpm dev      # local Void/Vite runtime
pnpm check    # codegen, lint, formatting checks, and TypeScript
pnpm build    # production build
pnpm deploy   # build and deploy with `void deploy --platform cloudflare`
```

Workers Builds deploys every push to `refactor` with the same `void deploy` command. Do not run
`pnpm deploy` for a pushed commit: two concurrent deploys supersede each other and the build fails.

## Database Migrations

Better Auth tables are versioned in `db/migrations/` and stored in the `my-profile` D1 database.
`void deploy` checks the Drizzle schema for drift, saves a D1 restore point, and applies pending
migrations before traffic moves. After a schema change, run `void db generate`, review the
migration, and commit it before deploying.

## Worker Size

The Cloudflare free-plan compressed Worker limit is 3 MiB. `pnpm build` does not report the upload
size; Cloudflare rejects an over-limit upload during `pnpm deploy`, before traffic moves, and Void
keeps the previous deployment active.

## Operational Notes

- Production builds use the isolated `.void/build-env`; `.env` is not bundled.
- Static assets, the SPA shell, sitemap, and LLM profile files are served directly by Cloudflare
  Assets. Worker-first routing is limited to `/api/*` and Void's internal routes.
- `nodejs_compat` is enabled in `void.config.ts` for Worker dependencies that require Node compatibility.
