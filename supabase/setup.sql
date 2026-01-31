-- ============================================
-- WhyItStopped — Supabase DB setup
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  title text,
  description text not null,
  reflection text,
  stage text not null,
  primary_reason text not null,
  secondary_reasons text[] not null default '{}',

  is_solo boolean not null default true,
  is_tech_heavy boolean not null default false,
  status text not null default 'pending',

  -- Structured reflection (new fields)
  failed_assumptions text[] not null default '{}',
  if_restarted text,
  timeline jsonb,
  hidden_costs text[] not null default '{}',
  audience_tags text[] not null default '{}'
);

create index if not exists ideas_created_at_idx on public.ideas (created_at desc);

