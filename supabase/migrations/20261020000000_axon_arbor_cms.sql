-- Axon Arbor (axonarbor.in) CMS + enquiries.
-- Runs in the shared Supabase project "supabase-charcoal-planet", which hosts
-- several sites, so every object is prefixed axon_arbor_ and access is gated
-- by an Axon Arbor–only admin allowlist.

-- Admin allowlist -----------------------------------------------------------
create table public.axon_arbor_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);
comment on table public.axon_arbor_admins is
  'Axon Arbor admin allowlist. A signed-in user may edit axonarbor.in and read its enquiries only if their id is here.';
alter table public.axon_arbor_admins enable row level security;

create or replace function public.axon_arbor_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.axon_arbor_admins where user_id = auth.uid());
$$;
revoke all on function public.axon_arbor_is_admin() from public;
grant execute on function public.axon_arbor_is_admin() to anon, authenticated;

create policy "axon_arbor_admins admin read" on public.axon_arbor_admins
  for select to authenticated using (public.axon_arbor_is_admin());

-- Site content --------------------------------------------------------------
create table public.axon_arbor_content (
  key text not null check (key ~ '^[a-z][a-z-]*$'),
  status text not null check (status in ('draft', 'published')),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  primary key (key, status)
);
comment on table public.axon_arbor_content is
  'Axon Arbor site content, one row per page key. status=draft is the admin working copy; status=published is what axonarbor.in renders. Rows overlay the defaults in src/content/.';
alter table public.axon_arbor_content enable row level security;

create policy "axon_arbor_content read published" on public.axon_arbor_content
  for select to anon, authenticated using (status = 'published');
create policy "axon_arbor_content admin read all" on public.axon_arbor_content
  for select to authenticated using (public.axon_arbor_is_admin());
create policy "axon_arbor_content admin insert" on public.axon_arbor_content
  for insert to authenticated with check (public.axon_arbor_is_admin());
create policy "axon_arbor_content admin update" on public.axon_arbor_content
  for update to authenticated using (public.axon_arbor_is_admin()) with check (public.axon_arbor_is_admin());
create policy "axon_arbor_content admin delete" on public.axon_arbor_content
  for delete to authenticated using (public.axon_arbor_is_admin());

-- Publish history -------------------------------------------------------------
create table public.axon_arbor_content_versions (
  id bigint generated always as identity primary key,
  published_at timestamptz not null default now(),
  published_by uuid references auth.users (id) on delete set null,
  published_by_email text,
  snapshot jsonb not null
);
comment on table public.axon_arbor_content_versions is
  'Snapshot of every published Axon Arbor page ({ key: data }) taken on each publish, for history and restore.';
alter table public.axon_arbor_content_versions enable row level security;

create policy "axon_arbor_content_versions admin read" on public.axon_arbor_content_versions
  for select to authenticated using (public.axon_arbor_is_admin());
create policy "axon_arbor_content_versions admin insert" on public.axon_arbor_content_versions
  for insert to authenticated with check (public.axon_arbor_is_admin());

create or replace function public.axon_arbor_publish()
returns bigint
language plpgsql
set search_path = ''
as $$
declare
  version_id bigint;
begin
  if not public.axon_arbor_is_admin() then
    raise exception 'not authorized';
  end if;

  insert into public.axon_arbor_content (key, status, data, updated_at, updated_by)
  select d.key, 'published', d.data, now(), auth.uid()
    from public.axon_arbor_content d
   where d.status = 'draft'
  on conflict (key, status) do update
    set data = excluded.data, updated_at = now(), updated_by = excluded.updated_by;

  insert into public.axon_arbor_content_versions (published_by, published_by_email, snapshot)
  select auth.uid(), auth.jwt() ->> 'email', coalesce(jsonb_object_agg(p.key, p.data), '{}'::jsonb)
    from public.axon_arbor_content p
   where p.status = 'published'
  returning id into version_id;

  return version_id;
end;
$$;

create or replace function public.axon_arbor_discard_draft()
returns void
language plpgsql
set search_path = ''
as $$
begin
  if not public.axon_arbor_is_admin() then
    raise exception 'not authorized';
  end if;

  -- Reset the draft to mirror the live site.
  delete from public.axon_arbor_content where status = 'draft';
  insert into public.axon_arbor_content (key, status, data, updated_at, updated_by)
  select p.key, 'draft', p.data, now(), auth.uid()
    from public.axon_arbor_content p
   where p.status = 'published';
end;
$$;

create or replace function public.axon_arbor_restore_version(version_id bigint)
returns void
language plpgsql
set search_path = ''
as $$
declare
  snap jsonb;
begin
  if not public.axon_arbor_is_admin() then
    raise exception 'not authorized';
  end if;

  select v.snapshot into snap from public.axon_arbor_content_versions v where v.id = version_id;
  if snap is null then
    raise exception 'version not found';
  end if;

  -- Restoring loads the old version into the draft; the admin then publishes it.
  delete from public.axon_arbor_content where status = 'draft';
  insert into public.axon_arbor_content (key, status, data, updated_at, updated_by)
  select e.key, 'draft', e.value, now(), auth.uid()
    from jsonb_each(snap) e;
end;
$$;

revoke all on function public.axon_arbor_publish() from public, anon;
revoke all on function public.axon_arbor_discard_draft() from public, anon;
revoke all on function public.axon_arbor_restore_version(bigint) from public, anon;
grant execute on function public.axon_arbor_publish() to authenticated;
grant execute on function public.axon_arbor_discard_draft() to authenticated;
grant execute on function public.axon_arbor_restore_version(bigint) to authenticated;

-- Contact form enquiries ------------------------------------------------------
create table public.axon_arbor_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  organisation text not null check (char_length(organisation) between 1 and 160),
  role text check (role is null or char_length(role) <= 120),
  email text not null check (char_length(email) between 3 and 200),
  phone text check (phone is null or char_length(phone) <= 30),
  message text not null check (char_length(message) between 1 and 4000),
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  notes text check (notes is null or char_length(notes) <= 4000)
);
comment on table public.axon_arbor_submissions is
  'Axon Arbor contact form enquiries. Anyone may insert (status new, no notes); only Axon Arbor admins may read or change them.';
create index axon_arbor_submissions_created_at_idx on public.axon_arbor_submissions (created_at desc);
alter table public.axon_arbor_submissions enable row level security;

create policy "axon_arbor_submissions public insert" on public.axon_arbor_submissions
  for insert to anon, authenticated with check (status = 'new' and notes is null);
create policy "axon_arbor_submissions admin read" on public.axon_arbor_submissions
  for select to authenticated using (public.axon_arbor_is_admin());
create policy "axon_arbor_submissions admin update" on public.axon_arbor_submissions
  for update to authenticated using (public.axon_arbor_is_admin()) with check (public.axon_arbor_is_admin());
create policy "axon_arbor_submissions admin delete" on public.axon_arbor_submissions
  for delete to authenticated using (public.axon_arbor_is_admin());

-- Media bucket ----------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'axon-arbor-media', 'axon-arbor-media', true, 10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']
)
on conflict (id) do nothing;

create policy "axon-arbor-media public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'axon-arbor-media');
create policy "axon-arbor-media admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'axon-arbor-media' and public.axon_arbor_is_admin());
create policy "axon-arbor-media admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'axon-arbor-media' and public.axon_arbor_is_admin())
  with check (bucket_id = 'axon-arbor-media' and public.axon_arbor_is_admin());
create policy "axon-arbor-media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'axon-arbor-media' and public.axon_arbor_is_admin());
