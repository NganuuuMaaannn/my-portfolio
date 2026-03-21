create extension if not exists pgcrypto;

create or replace function public.set_student_portfolio_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.student_portfolios (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  portfolio_slug text not null unique,
  owner_name text not null,
  headline text not null,
  intro text not null,
  about_bio text not null,
  about_image text not null default '/Sample.png',
  role_title text not null,
  specialty text not null,
  contact_message text not null,
  is_published boolean not null default true,
  hero_stats jsonb not null default '[]'::jsonb,
  capabilities jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  certificates jsonb not null default '[]'::jsonb,
  contact_methods jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint student_portfolios_slug_format
    check (portfolio_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint student_portfolios_slug_length
    check (char_length(portfolio_slug) between 3 and 60)
);

alter table public.student_portfolios
  add column if not exists about_image text not null default '/Sample.png';

create index if not exists student_portfolios_owner_id_idx
  on public.student_portfolios (owner_id);

create index if not exists student_portfolios_public_slug_idx
  on public.student_portfolios (portfolio_slug, is_published);

drop trigger if exists set_student_portfolios_updated_at on public.student_portfolios;

create trigger set_student_portfolios_updated_at
before update on public.student_portfolios
for each row
execute function public.set_student_portfolio_updated_at();

do $$
begin
  if not exists (
    select 1
    from pg_publication publication
    join pg_publication_rel publication_relation
      on publication_relation.prpubid = publication.oid
    join pg_class relation
      on relation.oid = publication_relation.prrelid
    join pg_namespace namespace
      on namespace.oid = relation.relnamespace
    where publication.pubname = 'supabase_realtime'
      and namespace.nspname = 'public'
      and relation.relname = 'student_portfolios'
  ) then
    alter publication supabase_realtime add table public.student_portfolios;
  end if;
exception
  when undefined_object then
    raise notice 'supabase_realtime publication was not found. Enable Realtime for public.student_portfolios in the Supabase dashboard.';
end;
$$;

alter table public.student_portfolios enable row level security;

drop policy if exists "Published portfolios are readable" on public.student_portfolios;
create policy "Published portfolios are readable"
on public.student_portfolios
for select
using (
  is_published = true
  or auth.uid() = owner_id
);

drop policy if exists "Owners can insert their portfolio" on public.student_portfolios;
create policy "Owners can insert their portfolio"
on public.student_portfolios
for insert
to authenticated
with check (auth.uid() = owner_id);

drop policy if exists "Owners can update their portfolio" on public.student_portfolios;
create policy "Owners can update their portfolio"
on public.student_portfolios
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "Owners can delete their portfolio" on public.student_portfolios;
create policy "Owners can delete their portfolio"
on public.student_portfolios
for delete
to authenticated
using (auth.uid() = owner_id);
