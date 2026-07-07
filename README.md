# İş Cibində

Recruitment and employment platform for the Azerbaijani market. Job seekers build profiles, upload CVs, search and apply to vacancies, and track applications. Employers post jobs, manage applications, search candidates, and message them. Admins/moderators verify companies and moderate listings.

Interface language is Azerbaijani (Russian dictionary scaffolded). Built as a **Next.js frontend + Python (FastAPI) backend**, split as two independently deployable services.

## Stack

- **Frontend:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Clerk (auth UI/session) · TanStack Query · React Hook Form · Zod
- **Backend** (`backend/`): FastAPI · SQLAlchemy 2.0 + Alembic · PostgreSQL · Clerk session verification (JWKS) + Backend API · Cloudflare R2 (S3-compatible) presigned uploads
- **Docker** · **GitHub Actions** for both services

## Architecture

```
src/                  Next.js frontend (UI, routing, forms)
  app/                pages, layouts, server actions
  components/         ui/, layout/, jobs/
  lib/
    auth/             getCurrentUser/requireUser/requireRole — call the backend's /me
    jobs/ applications/ companies/ candidates/ candidate/ employer/
    messaging/ notifications/ admin/ content/ dashboard/ uploads/   — thin API-client wrappers,
                      one module per backend router
    api-client.ts     fetch wrapper: attaches the Clerk session token, (de)serializes camelCase <-> snake_case
    validation.ts constants.ts utils.ts env.ts i18n/
  middleware.ts       clerkMiddleware protecting /dashboard and /onboarding

backend/              FastAPI API — owns the database and all business logic
  app/
    main.py           FastAPI app, CORS, router wiring
    models.py         SQLAlchemy ORM models (all entities)
    schemas.py        Pydantic request/response DTOs
    clerk.py          Session-token verification (JWKS) + Clerk Backend API calls
    deps.py           get_current_user / require_roles dependencies
    services/         business logic, one module per domain
    routers/          FastAPI routers, one per domain
  alembic/            migrations
  seed.py             reference data seed (categories, FAQs)
  promote_admin.py    promote a user to admin by email
```

**Auth:** Clerk owns identity and the frontend's session UI. The frontend forwards the signed-in user's
Clerk session token to the backend on every API call; the backend verifies it against Clerk's JWKS and
resolves it to a local `users` row (provisioned just-in-time, backed by a Clerk webhook for eager sync).
Roles: `job_seeker`, `employer`, `moderator`, `admin` — enforced on the backend per-endpoint.

## Getting started

### 1. Backend

```bash
cd backend
python -m venv .venv && . .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # fill in DATABASE_URL, CLERK_SECRET_KEY, CLERK_ISSUER, ...
alembic upgrade head
python seed.py
uvicorn app.main:app --reload --port 8000
```

See [backend/README.md](backend/README.md) for full details.

### 2. Frontend

```bash
pnpm install
cp .env.example .env   # fill in NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, BACKEND_URL
pnpm dev                # http://localhost:3000
```

### 3. Or run everything with Docker Compose

```bash
docker compose up --build
```

Brings up Postgres, the FastAPI backend (`:8000`), and the Next.js frontend (`:3000`). Set
`CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, and `CLERK_ISSUER` in your shell or an `.env`
file next to `docker-compose.yml` before starting.

### 4. Clerk webhook

In the Clerk dashboard, add a webhook to `https://<api-domain>/webhooks/clerk` subscribed to
`user.created`, `user.updated`, `user.deleted`. Copy the signing secret into the backend's
`CLERK_WEBHOOK_SECRET`. Users are also provisioned just-in-time on first authenticated request, so the
app doesn't depend on webhook delivery timing.

### 5. Create an admin

Have the person sign up through the app first, then run on the backend:

```bash
python promote_admin.py you@example.com
```

## Feature status

Implemented and wired end-to-end:

- Auth (Clerk) + onboarding + role-based dashboards
- Job listing with filters/pagination, detail with structured data, apply flow, save jobs
- Employer: post job (RHF + Zod), manage jobs (close/reopen), applications inbox with status pipeline, candidate search + save
- Candidate: application tracking, saved jobs, profile editor, CV upload to R2
- Admin/moderator: job moderation, company verification, user role/suspension management, audit log
- Messaging between employers and candidates (conversations, threads, notifications)
- Notifications on application/job/company/message events
- Marketing + legal pages, dynamic sitemap/robots, SEO metadata, 404
- Health check, Docker build, CI (typecheck + lint + build for both services)

Sensible next steps (schema already supports them): interview scheduling UI (`interviews` table), blog CMS in admin, structured CV builder (`cv_data` JSONB), featured-listing monetization via a local Azerbaijani PSP.

## Notes

- New jobs go live immediately (`active`) so the marketplace is usable; moderators can reject/close from the admin panel.
- Payments are intentionally not included — Stripe is unavailable in Azerbaijan; monetize later through a local PSP.
- This project was authored without a running database/Clerk instance in the build environment; run `pnpm typecheck && pnpm lint && pnpm build` (frontend) and `pip install -r requirements.txt && python -m compileall app` (backend) and expect to resolve minor first-run integration details.
