# How to verify everything is working (DB + backend + frontend)

Quick checklist to confirm DB, Supabase (backend), and frontend are all good.

---

## 1. Environment check

- [ ] `.env.local` exists and has:
  - `VITE_SUPABASE_URL=https://xxxxx.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=eyJ...` (long string)
- [ ] No typos; no quotes around values; no spaces around `=`

**How to verify:**  
Run the app (`npm run dev`). If you see a yellow banner **"Read-only archive. Submissions saved locally only"** → env vars are missing or wrong. If there’s no banner and the app loads → env is OK.

---

## 2. Database (Supabase) check

- [ ] You ran `supabase/add-new-columns.sql` in Supabase → SQL Editor (or created the table with all columns from `supabase/setup.sql`).
- [ ] In Supabase → **Table Editor** → `public.ideas` you see columns:  
  `id`, `created_at`, `title`, `description`, `stage`, `primary_reason`, `secondary_reasons`, `reflection`, `is_solo`, `is_tech_heavy`, `status`, **and** `failed_assumptions`, `if_restarted`, `timeline`, `hidden_costs`, `audience_tags`.

**How to verify:**  
Supabase → Table Editor → `ideas` → check that the 5 new columns exist. If they’re there, DB is good.

---

## 3. Backend (Supabase = your backend) check

Supabase is your backend. You’re checking: **can the app read and write to Supabase?**

**Read (load ideas):**

1. Open the app: `npm run dev` → open http://localhost:5173 (or the URL shown).
2. Go to **Archive**.
3. If you have rows in `ideas` in Supabase, they should show in the list (not only mock data).
4. Open browser **DevTools** (F12) → **Console**. You should **not** see: `Read-only archive mode` (if env is set). You should **not** see red errors about Supabase.

**Write (submit an idea):**

1. In the app, go to **Submit**.
2. Fill the form (at least: description 40+ chars, pick **one or more** “What assumption failed?”).
3. Click **Commit to Archive**.
4. You should see “Record Received”.
5. Go to **Archive** — your new entry should appear.
6. In Supabase → **Table Editor** → `ideas` — you should see a **new row** with the same title/description and the new columns filled (e.g. `failed_assumptions`, `if_restarted`, etc.).

**If submit works and the new row appears in Supabase → backend is working.**

---

## 4. Frontend check

- [ ] **Build:** Run `npm run build`. It should finish without errors.
- [ ] **Preview:** Run `npm run preview`. Open the URL (e.g. http://localhost:4173). Click through:
  - **Archive** — list loads, filters/presets work.
  - **Insights** — charts load.
  - **Philosophy** — about page loads.
  - **Submit** — form loads; validation works (e.g. “What assumption failed?” required).
- [ ] **New features:** Submit a record with “What I got wrong”, “If I restarted”, timeline, hidden costs, audience. In Archive, open that record and confirm those sections show (What I got wrong, If I restarted, Timeline, Hidden cost, Useful for).

**If all of that works → frontend is good.**

---

## 5. Quick verification script (manual)

Do this once end-to-end:

| Step | Action | Expected |
|------|--------|----------|
| 1 | `npm run dev` | App starts, no red errors in terminal. |
| 2 | Open app in browser | No “Read-only” banner (if env is set). Archive shows data (from DB or mock). |
| 3 | Submit → fill form → Commit | “Record Received” and new card in Archive. |
| 4 | Supabase → Table Editor → `ideas` | New row with correct title, description, and new columns. |
| 5 | `npm run build` | Build succeeds. |
| 6 | `npm run preview` | Preview works; Archive, Insights, Submit, Philosophy all load. |

If all 6 pass → **DB, backend (Supabase), and frontend are working.**

---

## 6. Common issues

| Problem | What to check |
|--------|----------------|
| “Read-only archive” banner | `.env.local` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Restart dev server after changing env. |
| Archive empty / only mock data | Supabase table name is `ideas` in schema `public`. RLS: if enabled, you need a policy that allows SELECT. |
| Submit doesn’t add row in Supabase | RLS: need policy that allows INSERT. Check browser Console for Supabase errors. |
| “What assumption failed?” validation | In Submit form, select at least one option in that section. |
| New columns missing in DB | Run `supabase/add-new-columns.sql` in Supabase SQL Editor. |

---

## 7. After you deploy (Vercel / Netlify / etc.)

- [ ] In the host dashboard, set **Environment variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (same values as `.env.local`).
- [ ] Redeploy so the build uses these env vars.
- [ ] Open the live site → Archive (should load from Supabase), Submit (should create a row in Supabase).  
Then DB + backend + frontend are verified in production too.
