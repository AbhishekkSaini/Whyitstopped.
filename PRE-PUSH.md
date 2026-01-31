# Pre-push checklist

- [x] **Build passes** — `npm run build` succeeds
- [ ] **No secrets in repo** — `.env.local` is in `.gitignore` (`.env.*` is ignored); never commit it
- [ ] **Env on host** — After push/deploy, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel/Netlify (if you use Supabase)
- [ ] **Supabase table** — If first deploy with DB: run `supabase/add-new-columns.sql` in Supabase SQL Editor (if you haven’t already)

You’re good to push. Don’t commit `.env.local` — only `.env.example` is safe to commit.
