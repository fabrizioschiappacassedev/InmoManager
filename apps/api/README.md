# InmoManager

Real estate management system for one agency (single tenant, multiple branches).
Core: property inventory, sale/rent listings, and tracking where each listing is
published (Instagram, Argenprop, Inmobusqueda, MercadoLibre, ...).

## Structure
- pnpm workspace + Turborepo. Apps in `apps/`, shared code in `packages/`.
- `apps/web`: Next.js (App Router) + Tailwind + shadcn/ui
- `apps/api`: NestJS (CommonJS) + TypeORM + PostgreSQL
- Only the API talks to the database. The web app never imports TypeORM.

## Commands
- `pnpm dev`: web (:3000) and api (:3001)
- `docker compose up -d db`: start Postgres
- Migrations (from apps/api): `pnpm migration:generate src/migrations/Name`, then `pnpm migration:run`
- API tests: Jest. Web tests: Vitest.

## Conventions
- TypeScript strict. Package scope `@inmomanager/*`.
- One Nest module per domain: `apps/api/src/modules/<name>`.
- DTOs use class-validator; endpoints documented with @nestjs/swagger.
- List endpoints are paginated and return `{ items, meta }`.

## Database rules (details in @docs/database.md)
- Single tenant: NO agencyId columns. One agency per deployment.
- All entities extend BaseEntity (uuid id, createdAt, updatedAt, deletedAt).
- Money: bigint in minor units (cents) with the `bigintToNumber` transformer, plus a currency column. Never floats.
- Enums are `varchar` + TypeScript union types, never native Postgres enums.
- `synchronize` is always false. Every schema change goes through a migration.
- Never edit a migration that has already been run; create a new one.
- Files are stored as storage keys, never full URLs.
- Credentials for platform accounts are encrypted at the application level, never stored plain.

## Don't
- Don't add dependencies without asking.
- Don't commit `.env` files.
- Don't put property/listing/publication columns on the wrong entity: see the three-level model in docs/database.md.

@docs/database.md