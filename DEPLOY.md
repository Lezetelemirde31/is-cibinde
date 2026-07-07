# Deployment Guide — İş Cibində

The app is two services plus two managed clouds:

| Part | Where | Cost |
|------|-------|------|
| Database (Postgres) | **Neon** | already set up ✅ |
| Auth | **Clerk** | already set up ✅ |
| Backend (FastAPI) | **Render** (Docker) | free tier |
| Frontend (Next.js) | **Vercel** | free tier |

Because the frontend talks to the backend **server-to-server** (never from the
browser), there are no CORS headaches in normal use.

---

## Step 0 — Put the code on GitHub

```bash
git add -A
git commit -m "Deploy-ready full stack"
# create an empty repo at github.com/<you>/is-cibinde, then:
git remote add origin https://github.com/<you>/is-cibinde.git
git branch -M main
git push -u origin main
```

`.env` files are gitignored, so your secrets are **not** pushed.

---

## Step 1 — Deploy the backend to Render (do this first)

1. https://render.com → sign up → **New + → Blueprint** → connect your GitHub repo.
2. Render reads `render.yaml` and proposes the `iscibinde-api` service.
3. Set the 4 secret env vars when prompted:
   - `DATABASE_URL` — your Neon string (must start with `postgresql+psycopg://`)
   - `CLERK_SECRET_KEY` — `sk_test_...`
   - `CLERK_ISSUER` — `https://<your-app>.clerk.accounts.dev`
   - `FRONTEND_ORIGIN` — put a placeholder for now (e.g. `http://localhost:3000`); update after Step 2
4. Deploy. On boot it runs `alembic upgrade head` automatically. When live you'll
   get a URL like `https://iscibinde-api.onrender.com`. Open `/health` to confirm.
5. (Once) seed reference data — in the Render service **Shell** tab:
   `python seed.py`

> Free tier note: the service sleeps after ~15 min idle and takes ~30s to wake on
> the next request. Fine for a demo; upgrade the plan to keep it always-on.

---

## Step 2 — Deploy the frontend to Vercel

1. https://vercel.com → sign up → **Add New → Project** → import the same repo.
2. Framework preset: **Next.js** (auto-detected). Root directory: repo root.
3. Add Environment Variables:
   - `BACKEND_URL` = your Render URL, e.g. `https://iscibinde-api.onrender.com`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_test_...`
   - `CLERK_SECRET_KEY` = `sk_test_...`
   - `NEXT_PUBLIC_SITE_URL` = your Vercel URL (e.g. `https://iscibinde.vercel.app`)
4. Deploy. You'll get a public URL — that's your live site.

---

## Step 3 — Wire the two together

1. Back in **Render**, set `FRONTEND_ORIGIN` to your real Vercel URL and redeploy.
2. In **Clerk dashboard**, add your Vercel domain under the allowed origins /
   paths if prompted (test instances usually accept any domain automatically).

Done — share the Vercel URL. 🎉

---

## Going to real production later

- Create a **Clerk production instance** (custom domain, `pk_live_`/`sk_live_`
  keys) and set the Clerk webhook to `https://<render-url>/webhooks/clerk`.
- Add **Cloudflare R2** credentials on the backend to enable CV/logo uploads.
- Point a **custom domain** at Vercel and update `NEXT_PUBLIC_SITE_URL`.
