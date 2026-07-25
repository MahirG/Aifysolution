-- Qabeza AuthorityOS initial schema.
-- Apply in a dedicated Supabase project, then run Supabase security advisors.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brand_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  audience text not null,
  positioning text,
  tone_rules jsonb not null default '[]'::jsonb,
  banned_phrases jsonb not null default '[]'::jsonb,
  writing_samples jsonb not null default '[]'::jsonb,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.source_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  brand_profile_id uuid references public.brand_profiles(id) on delete set null,
  title text not null,
  source_type text not null check (source_type in ('article','transcript','voice_note','client_lesson','case_study','memo')),
  audience text not null,
  goal text not null check (goal in ('build_trust','generate_leads','launch_offer','educate_market','nurture_buyers')),
  call_to_action text not null,
  source_text text not null,
  status text not null default 'draft' check (status in ('draft','processing','completed','failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_packs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_asset_id uuid not null references public.source_assets(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft','approved','archived')),
  source_summary text not null,
  core_thesis text not null,
  audience_tension text not null,
  claim_ledger jsonb not null default '[]'::jsonb,
  model text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_pack_id uuid not null references public.content_packs(id) on delete cascade,
  type text not null check (type in ('linkedin_post','newsletter','carousel_brief','short_video_script','lead_magnet_outline')),
  title text not null,
  body text not null,
  rationale text,
  call_to_action text,
  position integer not null default 0,
  status text not null default 'draft' check (status in ('draft','approved','published','archived')),
  scheduled_for timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  provider_subscription_id text not null,
  provider_customer_id text,
  product_id text,
  variant_id text,
  plan text not null,
  status text not null,
  renews_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(provider, provider_subscription_id)
);

create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null unique,
  provider text not null,
  event_name text not null,
  payload jsonb not null,
  processed_at timestamptz not null default now()
);

create index if not exists source_assets_user_created_idx on public.source_assets(user_id, created_at desc);
create index if not exists content_packs_user_created_idx on public.content_packs(user_id, created_at desc);
create index if not exists content_items_pack_position_idx on public.content_items(content_pack_id, position);
create index if not exists subscriptions_user_status_idx on public.subscriptions(user_id, status);

alter table public.profiles enable row level security;
alter table public.brand_profiles enable row level security;
alter table public.source_assets enable row level security;
alter table public.content_packs enable row level security;
alter table public.content_items enable row level security;
alter table public.subscriptions enable row level security;
alter table public.webhook_events enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "brand_profiles_select_own" on public.brand_profiles for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "brand_profiles_insert_own" on public.brand_profiles for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "brand_profiles_update_own" on public.brand_profiles for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "brand_profiles_delete_own" on public.brand_profiles for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "source_assets_select_own" on public.source_assets for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "source_assets_insert_own" on public.source_assets for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "source_assets_update_own" on public.source_assets for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "source_assets_delete_own" on public.source_assets for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "content_packs_select_own" on public.content_packs for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "content_packs_insert_own" on public.content_packs for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "content_packs_update_own" on public.content_packs for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "content_items_select_own" on public.content_items for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "content_items_insert_own" on public.content_items for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "content_items_update_own" on public.content_items for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "content_items_delete_own" on public.content_items for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "subscriptions_select_own" on public.subscriptions for select to authenticated
  using ((select auth.uid()) = user_id);

-- webhook_events intentionally has no authenticated or anonymous policies.
-- It is only accessed through the server-side service-role client.

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles, public.brand_profiles, public.source_assets, public.content_packs, public.content_items to authenticated;
grant select on public.subscriptions to authenticated;
