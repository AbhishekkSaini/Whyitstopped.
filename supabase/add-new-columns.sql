
alter table public.ideas add column if not exists failed_assumptions text[] not null default '{}';
alter table public.ideas add column if not exists if_restarted text;
alter table public.ideas add column if not exists timeline jsonb;
alter table public.ideas add column if not exists hidden_costs text[] not null default '{}';
alter table public.ideas add column if not exists audience_tags text[] not null default '{}';
