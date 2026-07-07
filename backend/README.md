# İş Cibində API

FastAPI backend for İş Cibində. Owns the Postgres database (SQLAlchemy + Alembic),
verifies Clerk session tokens, and exposes the REST API the Next.js frontend consumes.

## Stack

- **FastAPI** + **Uvicorn**
- **SQLAlchemy 2.0** (sync) + **Alembic** migrations
- **PostgreSQL** (psycopg 3 driver)
- **Clerk** session verification (PyJWT + JWKS) and Backend API calls (httpx) for
  user email lookup and `publicMetadata` sync; **svix** verifies the Clerk webhook
- **boto3** for Cloudflare R2 (S3-compatible) presigned uploads

## Getting started

### 1. Install

```bash
python -m venv .venv
. .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment

Copy `.env.example` to `.env` and fill in:

- `DATABASE_URL` — same Postgres instance the frontend uses (or a fresh one)
- `CLERK_SECRET_KEY`, `CLERK_ISSUER` (Clerk Dashboard → API Keys → Advanced → Frontend API URL)
- `CLERK_WEBHOOK_SECRET` — from the Clerk webhook (see below)
- `FRONTEND_ORIGIN` — used for CORS, e.g. `http://localhost:3000`
- R2 credentials (optional locally; uploads are disabled without them)

### 3. Database

```bash
alembic upgrade head   # create all tables
python seed.py         # seed job categories + FAQs
```

### 4. Run

```bash
uvicorn app.main:app --reload --port 8000   # http://localhost:8000
```

Interactive API docs at `http://localhost:8000/docs`.

### 5. Clerk webhook

In the Clerk dashboard, add a webhook to `https://<api-domain>/webhooks/clerk`
subscribed to `user.created`, `user.updated`, `user.deleted`. Copy the signing
secret into `CLERK_WEBHOOK_SECRET`. Users are also provisioned just-in-time on
first authenticated request, so the app doesn't depend on webhook delivery timing.

### 6. Create an admin

Have the person sign up through the app first, then:

```bash
python promote_admin.py you@example.com
```

### 7. Tests

```bash
pip install -r requirements-dev.txt
pytest -q
```

Unit tests live in `tests/` and run without a live database or Clerk instance
(`tests/conftest.py` sets dummy config env vars; the SQLAlchemy engine is lazy).
They cover slug/id generation, upload validation, and an app-wiring smoke test
(all routers register, literal routes precede parametric ones).

## Architecture

```
app/
  main.py         FastAPI app, CORS, router wiring
  config.py       pydantic-settings environment config
  database.py     SQLAlchemy engine/session, declarative Base
  models.py       ORM models (mirrors the previous Drizzle schema.ts 1:1)
  schemas.py      Pydantic request/response DTOs
  clerk.py        Session-token verification (JWKS) + Clerk Backend API calls
  deps.py         get_current_user / require_roles FastAPI dependencies
  utils.py        slugify, id generation
  services/       business logic, one module per domain (mirrors the old lib/*/service.ts)
  routers/        FastAPI routers, one per domain — thin, call into services/
alembic/          migrations (hand-authored initial schema in versions/0001_initial_schema.py)
seed.py           reference data seed (categories, FAQs)
promote_admin.py  promote a user to admin by email
```

**Auth:** the frontend attaches the signed-in user's Clerk session token as
`Authorization: Bearer <token>`. This API verifies it locally against Clerk's
JWKS (no per-request network call) and resolves it to a local `users` row,
creating it just-in-time on first sight (calling the Clerk Backend API for the
user's email if needed). Role checks (`job_seeker`, `employer`, `moderator`,
`admin`) are enforced per-endpoint via the `require_roles(...)` dependency.
