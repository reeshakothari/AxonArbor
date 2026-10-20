-- Axon Arbor (axonarbor.in) CMS + enquiries.
-- Runs in the shared Supabase project "supabase-charcoal-planet", which hosts
-- several sites, so every object is prefixed axon_arbor_.
--
-- Admins do not use Supabase Auth: the Next.js server checks the admin
-- username/password from its environment and talks to the database with the
-- project's secret (service role) key. The public (anon) role may only read
-- published content and submit the contact form.

-- Site content --------------------------------------------------------------
create table public.axon_arbor_content (
  key text not null check (key ~ '^[a-z][a-z-]*$'),
  status text not null check (status in ('draft', 'published')),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (key, status)
);
comment on table public.axon_arbor_content is
  'Axon Arbor site content, one row per page key. status=draft is the admin working copy; status=published is what axonarbor.in renders. Rows overlay the defaults in src/content/.';
alter table public.axon_arbor_content enable row level security;

create policy "axon_arbor_content read published" on public.axon_arbor_content
  for select to anon, authenticated using (status = 'published');

-- Publish history -------------------------------------------------------------
create table public.axon_arbor_content_versions (
  id bigint generated always as identity primary key,
  published_at timestamptz not null default now(),
  published_by text,
  snapshot jsonb not null
);
comment on table public.axon_arbor_content_versions is
  'Snapshot of every published Axon Arbor page ({ key: data }) taken on each publish, for history and restore. Server-only.';
alter table public.axon_arbor_content_versions enable row level security;

-- Publishing, discarding and restoring are atomic database functions that only
-- the server (service role) may call.
create or replace function public.axon_arbor_publish(publisher text default null)
returns bigint
language plpgsql
set search_path = ''
as $$
declare
  version_id bigint;
begin
  insert into public.axon_arbor_content (key, status, data, updated_at)
  select d.key, 'published', d.data, now()
    from public.axon_arbor_content d
   where d.status = 'draft'
  on conflict (key, status) do update
    set data = excluded.data, updated_at = now();

  insert into public.axon_arbor_content_versions (published_by, snapshot)
  select publisher, coalesce(jsonb_object_agg(p.key, p.data), '{}'::jsonb)
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
  -- Reset the draft to mirror the live site.
  delete from public.axon_arbor_content where status = 'draft';
  insert into public.axon_arbor_content (key, status, data, updated_at)
  select p.key, 'draft', p.data, now()
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
  select v.snapshot into snap from public.axon_arbor_content_versions v where v.id = version_id;
  if snap is null then
    raise exception 'version not found';
  end if;

  -- Restoring loads the old version into the draft; the admin then publishes it.
  delete from public.axon_arbor_content where status = 'draft';
  insert into public.axon_arbor_content (key, status, data, updated_at)
  select e.key, 'draft', e.value, now()
    from jsonb_each(snap) e;
end;
$$;

revoke all on function public.axon_arbor_publish(text) from public, anon, authenticated;
revoke all on function public.axon_arbor_discard_draft() from public, anon, authenticated;
revoke all on function public.axon_arbor_restore_version(bigint) from public, anon, authenticated;
grant execute on function public.axon_arbor_publish(text) to service_role;
grant execute on function public.axon_arbor_discard_draft() to service_role;
grant execute on function public.axon_arbor_restore_version(bigint) to service_role;

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
  'Axon Arbor contact form enquiries. The public may only insert (status new, no notes); the admin dashboard reads and manages them server-side.';
create index axon_arbor_submissions_created_at_idx on public.axon_arbor_submissions (created_at desc);
alter table public.axon_arbor_submissions enable row level security;

create policy "axon_arbor_submissions public insert" on public.axon_arbor_submissions
  for insert to anon, authenticated with check (status = 'new' and notes is null);

-- Media bucket ----------------------------------------------------------------
-- Public read; uploads go through short-lived signed URLs issued by the server.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'axon-arbor-media', 'axon-arbor-media', true, 10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']
)
on conflict (id) do nothing;

create policy "axon-arbor-media public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'axon-arbor-media');
