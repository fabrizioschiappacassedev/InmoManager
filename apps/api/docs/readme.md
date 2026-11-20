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
- Schema-First / Type-Driven Development
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

## Development Methodology: Schema-First + TDD (NestJS/Next.js Monorepo)

You must strictly follow a Schema-First and Test-Driven Development (TDD) workflow across this Turborepo workspace. Do not write application or UI logic until schemas and tests are established.

### Monorepo Invariants
- **Architecture:** Only `apps/api` (NestJS) connects to PostgreSQL via TypeORM. `apps/web` (Next.js) must never import TypeORM or query the database directly; it communicates exclusively via HTTP/REST to the API.
- **Shared Contracts:** Shared schemas, DTOs, or TypeScript types meant for both frontend and backend must be defined in an appropriate workspace package under `packages/` before consumption.

### Step-by-Step Workflow

#### Phase 1: Schema-First Definition (The Contract)
1. **Define Database & DTOs:** Create/modify TypeORM entities in `apps/api` or shared types in `packages/`. Define precise NestJS DTOs (using `class-validator`/`class-transformer`) for API request/response payloads.
2. **Expose to Web:** Ensure the frontend (`apps/web`) has access to the type definitions (e.g., via a shared package or auto-generated clients).
3. **Review:** Present the complete schema/type changes to the user. **Stop and wait for explicit approval** before writing any application logic.

#### Phase 2: Test-Driven Development (TDD)
1. **Write the Tests First:** Once schemas are approved, write Jest tests *before* writing the actual implementation.
   - For backend: Write NestJS service unit tests.
   - For frontend: Do not write tests.
2. **Verify Failure (Red):** Run or simulate the tests to confirm they fail strictly due to missing implementation code, not compilation/syntax errors.
3. **Implement Minimum Code (Green):** Write the minimal NestJS service logic code required to make the tests pass.
4. **Refactor:** Clean up, handle edge cases, and optimize while keeping the Jest suite green.

## Publishing strategy
Manual first: staff mark a listing as published and paste the link. Automation
comes later, one platform at a time, behind a common interface
(publish / update / unpublish) run by a job queue with retries. Integration
options per portal are unverified; confirm with the client before building.

## Build status
- [ ] BaseEntity, Address, bigintToNumber, initial migration
- [ ] agency_settings + branches (+ seed, public endpoint)
- [ ] users + auth + user_branches
- [ ] contacts
- [ ] properties + property_media
- [ ] listings
- [ ] platforms + platform_accounts + publications (manual)

## Open questions
- Co-owners: a property currently has a single owner. Add a join table if needed.
- Roles beyond admin/agent.
- Whether tenants/contracts/payments are in scope later.

@docs/database.md