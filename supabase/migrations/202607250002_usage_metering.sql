create table if not exists public.usage_months (
  user_id uuid not null references auth.users(id) on delete cascade,
  period_start date not null,
  source_projects_used integer not null default 0 check (source_projects_used >= 0),
  generated_assets_used integer not null default 0 check (generated_assets_used >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, period_start)
);

alter table public.usage_months enable row level security;

create policy "usage_months_select_own" on public.usage_months
  for select to authenticated
  using ((select auth.uid()) = user_id);

grant select on public.usage_months to authenticated;
grant select, insert, update on public.usage_months to service_role;

create or replace function public.reserve_monthly_usage(
  p_user_id uuid,
  p_period_start date,
  p_source_limit integer,
  p_asset_limit integer,
  p_asset_reservation integer
)
returns table (
  allowed boolean,
  source_projects_used integer,
  generated_assets_used integer
)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.usage_months (user_id, period_start)
  values (p_user_id, p_period_start)
  on conflict (user_id, period_start) do nothing;

  return query
  with updated as (
    update public.usage_months as usage
    set source_projects_used = usage.source_projects_used + 1,
        generated_assets_used = usage.generated_assets_used + p_asset_reservation,
        updated_at = now()
    where usage.user_id = p_user_id
      and usage.period_start = p_period_start
      and usage.source_projects_used < p_source_limit
      and usage.generated_assets_used + p_asset_reservation <= p_asset_limit
    returning usage.source_projects_used, usage.generated_assets_used
  )
  select true, updated.source_projects_used, updated.generated_assets_used
  from updated
  union all
  select false, usage.source_projects_used, usage.generated_assets_used
  from public.usage_months as usage
  where usage.user_id = p_user_id
    and usage.period_start = p_period_start
    and not exists (select 1 from updated)
  limit 1;
end;
$$;

create or replace function public.release_monthly_usage(
  p_user_id uuid,
  p_period_start date,
  p_asset_reservation integer
)
returns void
language sql
security invoker
set search_path = ''
as $$
  update public.usage_months
  set source_projects_used = greatest(source_projects_used - 1, 0),
      generated_assets_used = greatest(generated_assets_used - p_asset_reservation, 0),
      updated_at = now()
  where user_id = p_user_id
    and period_start = p_period_start;
$$;

revoke all on function public.reserve_monthly_usage(uuid, date, integer, integer, integer) from public, anon, authenticated;
revoke all on function public.release_monthly_usage(uuid, date, integer) from public, anon, authenticated;
grant execute on function public.reserve_monthly_usage(uuid, date, integer, integer, integer) to service_role;
grant execute on function public.release_monthly_usage(uuid, date, integer) to service_role;
