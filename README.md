# Personal AI Assistant Platform

This monorepo houses the Astra assistant platform — a multimodal AI that lives in WhatsApp, Telegram, and a web dashboard. Astra understands text, voice, and images to coordinate reminders, calendars, social content, and email workflows.

## Monorepo layout

- `apps/api`: Fastify + tRPC backend for messaging webhooks, orchestration, and suite APIs.
- `apps/web`: Next.js dashboard for configuration and analytics.
- `packages/core-assistant`: Conversation orchestration and memory abstractions.
- `packages/integrations`: Typed wrappers around OpenAI, WhatsApp, Telegram, Gmail, Outlook, and Stripe.
- `packages/db`: Prisma schema and client for Postgres.
- `packages/ui`: Shared React component library.
- `packages/utils`: Shared utility helpers.
- `suites/creator`, `suites/email`: Suite-specific automation workflows.

## Getting started

```bash
pnpm install
pnpm dev
```

The command spins up both the API (`localhost:4000`) and the dashboard (`localhost:3000`) via Turborepo.

### Database

Run Prisma commands from the monorepo root:

```bash
pnpm --filter @ai-assistant/db prisma migrate dev --name init
pnpm --filter @ai-assistant/db prisma generate
```

The schema models secure multi-tenant workspaces with memberships, subscriptions, and NextAuth tables. Every row containing user data is scoped by `workspaceId` to avoid cross-tenant access.

### Environment variables

Copy `.env.example` to `.env` in the repo root and fill in the required values. The API honours an `ENV_FILE` override for local development if you need to point at a different env file.

### Useful scripts

- `pnpm lint` — repository-wide linting.
- `pnpm test` — runs Vitest suites across packages and apps.
- `pnpm build` — builds all workspaces.

### Tooling

- **Package manager**: pnpm with Turborepo pipelines.
- **Language**: TypeScript.
- **Testing**: Vitest with jsdom/node environments per package.
- **Styling**: Tailwind CSS + shared UI props.

## Next steps

- Flesh out authentication (Clerk/NextAuth) and billing flows.
- Connect messaging webhooks for WhatsApp and Telegram.
- Implement persistent memory store backed by Postgres/Redis.
- Expand suite orchestration and analytics dashboards.
