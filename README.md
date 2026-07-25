# Qabeza AuthorityOS

A production-oriented Next.js foundation for a human-first AI content and lead-generation operating system for B2B consultants, agency founders, and expert-led teams.

## Product promise

Turn one original source—an article, transcript, founder memo, case study, voice-note transcript, or client lesson—into:

- five LinkedIn posts
- one newsletter
- one carousel brief
- three short-video scripts
- one lead-magnet outline
- a source-grounded claim ledger

The system explicitly instructs the model not to invent evidence, statistics, client stories, quotations, or factual claims.

## Included in this foundation

- Next.js App Router + TypeScript
- responsive marketing homepage and pricing page
- Supabase email/password authentication
- protected dashboard
- source-material composer
- structured AI output through Vercel AI SDK
- PostgreSQL schema with row-level security
- Lemon Squeezy custom checkout endpoint
- signed, idempotent Lemon Squeezy webhook route
- subscription persistence
- health endpoint
- accessible loading, empty, success, and error states

## Important status

This repository is a strong implementation foundation, not a completed commercial launch. External accounts, environment variables, legal documents, billing products, production email, rate limiting, usage metering, monitoring, full test coverage, and a security review are still required before public release.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Create a Supabase project and apply:

```text
supabase/migrations/202607250001_initial.sql
```

Run Supabase security advisors after applying the migration.

4. Configure Supabase Auth:

- Site URL: your production domain
- Redirect URL: `https://YOUR_DOMAIN/auth/callback`
- For local development: `http://localhost:3000/auth/callback`

5. Configure AI access:

On Vercel, enable AI Gateway and use OIDC. For local development:

```bash
vercel link
vercel env pull
```

Set `AI_MODEL` only when overriding the default.

6. Create Lemon Squeezy subscription products and variants, then copy their IDs into `.env.local`.

7. Register a webhook:

```text
https://YOUR_DOMAIN/api/webhooks/lemonsqueezy
```

Use the same signing secret as `LEMONSQUEEZY_WEBHOOK_SECRET`.

Recommended events:

- subscription_created
- subscription_updated
- subscription_cancelled
- subscription_resumed
- subscription_expired
- subscription_paused
- subscription_unpaused

8. Run:

```bash
npm run dev
```

## Production hardening still required

- user-level generation quotas and plan enforcement
- Redis-backed rate limiting
- audit logging for sensitive actions
- background jobs for long generations
- content editing, versioning, approval, and export
- audio transcription and URL ingestion
- billing portal link
- cancellation and entitlement reconciliation
- usage analytics
- structured logging and Sentry
- transactional email
- Playwright end-to-end tests
- accessibility audit
- privacy policy, terms, AI disclosure, refund policy, and DPA review
- deletion/export workflow
- abuse and prompt-injection testing
- confidential-data warnings and optional redaction

## Architecture notes

- Server Components are used by default.
- Supabase sessions are cookie-based through `@supabase/ssr`.
- Authorization uses row ownership in RLS; user-editable metadata is never used for access control.
- Service-role access is isolated to webhook processing.
- Lemon Squeezy webhook signatures are verified with HMAC SHA-256 and stored idempotently.
- AI output is validated against a Zod schema before persistence.
