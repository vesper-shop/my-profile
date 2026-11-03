# Database

The application uses Cloudflare D1. `void.config.ts` declares the `DB` binding with
`migrations_dir: "./db/migrations"`; Void wires Better Auth to it automatically. Omitting
`database` selects D1.

## Local development

Void provides a local D1 database during `pnpm dev`. Apply committed migrations locally with
`void db migrate`.

## Production

`void deploy` provisions the `my-profile` D1 database, records it in `void.lock.json`, saves a
restore point, and applies pending migrations before activating the new Worker.

## Schema ownership

Better Auth owns the authentication models (`user`, `session`, `account`, `verification`) and the
OAuth provider models (`jwks`, `oauthClient`, `oauthResource`, `oauthClientResource`,
`oauthConsent`, `oauthAccessToken`, `oauthRefreshToken`, `oauthClientAssertion`).

Its history is not preserved: `db/migrations/` holds one
initial migration that creates every table, seeds the owner user with their GitHub and Google
accounts, and registers the first-party OAuth clients. Client
secrets are stored as SHA-256 hashes, never in plain text. To change the schema or a client, edit
that migration and rebuild the database instead of stacking new migrations.

Void generates its Better Auth integration under `.void/`; that directory is ignored and must not
be edited manually. The matching SQL lives in `db/migrations/`. After a schema change, run
`void db generate`, review the migration, and commit it.
