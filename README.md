# WhyItStopped

An open research archive documenting why real software and startup projects stop — without hindsight bias.

---

## Run locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Create `.env.local` with Supabase credentials if you want to persist data:
   ```bash
   cp .env.example .env.local
   ```
   Then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`.  
   Without these, the app runs in **read-only mode** (submissions saved locally only).
3. Run the app:
   ```bash
   npm run dev
   ```

---

## Before you publish

| Step | Status | Notes |
|------|--------|--------|
| **1. Build** | Run `npm run build` | Fix any TypeScript/build errors. |
| **2. Env vars** | Set in your host (Vercel, Netlify, etc.) | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` if you use Supabase. |
| **3. Supabase table** | Create/update `ideas` table | See [Supabase setup](#supabase-setup) below. |
| **4. Test preview** | Run `npm run preview` | Open the built app locally before deploying. |

---

## Publish (deploy)

1. **Build**
   ```bash
   npm run build
   ```
   Output is in `dist/`.

2. **Deploy** the `dist/` folder to:
   - **Vercel:** Connect repo, set env vars, deploy.
   - **Netlify:** Connect repo, build command `npm run build`, publish directory `dist`, set env vars.
   - **Other:** Serve the `dist/` folder as static files; ensure env vars are set for the build if you use Supabase.

3. **Environment variables** (on your hosting dashboard):
   - `VITE_SUPABASE_URL` — your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — your Supabase anon/public key  

   If you leave these empty, the site still works in read-only mode.

---

## Supabase setup (DB part)

1. Go to [Supabase](https://supabase.com) → your project → **SQL Editor**.
2. Open the file **`supabase/setup.sql`** in this repo.
3. Copy the **Option A** block (the `create table if not exists public.ideas ...` part) and run it.
4. If you already had an `ideas` table, use **Option B** in that file (the `alter table ... add column` lines) instead.

That creates the `ideas` table with all columns the app needs (including `failed_assumptions`, `if_restarted`, `timeline`, `hidden_costs`, `audience_tags`). After that, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` and the app will read/write to this table.

---

## What’s done vs pending

**Done**

- Archive list with filters, presets, Related, Random, My list, Read next  
- Submit form with: description, stage, reason, reflection, **failed assumptions** (required), **if I restarted**, **timeline**, **hidden costs**, **audience tags**  
- Insights dashboard (charts)  
- Read-only mode when Supabase env is missing (no crash)  
- Case-file style UI, “The Truth” emphasis, diagnostic tags  

**Pending (optional before publish)**

- Supabase: create/update `ideas` table and columns (see above)  
- Env vars on hosting (only if you want DB persistence)  
- Moderation: entries are stored with `status: 'pending'`; you can later add a way to approve/reject and show only `published` in the archive  

You can publish without Supabase (read-only + local submissions) or with Supabase (full persistence) once the table and env vars are set.
