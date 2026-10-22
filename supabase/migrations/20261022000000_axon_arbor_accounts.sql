-- Axon Arbor phase 2: consultant and company accounts.
-- Shared project: everything is prefixed axon_arbor_. Accounts do not use
-- Supabase Auth; the Next.js server hashes passwords (scrypt) and manages
-- sessions itself, using the secret key. RLS is on with no policies, so the
-- public (anon) key cannot read or write any of these tables.

create table public.axon_arbor_accounts (
  id uuid primary key default gen_random_uuid(),
  email text not null check (char_length(email) between 3 and 200),
  password_hash text not null,
  role text not null check (role in ('consultant', 'company')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by text,
  review_note text check (review_note is null or char_length(review_note) <= 1000),
  last_login_at timestamptz
);
comment on table public.axon_arbor_accounts is
  'Axon Arbor platform logins for consultants and companies. Server-only (no RLS policies). Companies start pending until an admin approves them.';
create unique index axon_arbor_accounts_email_key on public.axon_arbor_accounts (lower(email));
alter table public.axon_arbor_accounts enable row level security;

create table public.axon_arbor_consultant_profiles (
  account_id uuid primary key references public.axon_arbor_accounts (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 120),
  phone text check (phone is null or char_length(phone) <= 30),
  city text check (city is null or char_length(city) <= 80),
  expertise text[] not null default '{}' check (cardinality(expertise) <= 3),
  years_experience int check (years_experience is null or years_experience between 0 and 60),
  industries text check (industries is null or char_length(industries) <= 300),
  delivery_mode text check (delivery_mode is null or delivery_mode in ('In person', 'Online', 'Both')),
  languages text check (languages is null or char_length(languages) <= 200),
  bio text check (bio is null or char_length(bio) <= 600),
  linkedin_url text check (linkedin_url is null or char_length(linkedin_url) <= 300),
  certifications text check (certifications is null or char_length(certifications) <= 300),
  notable_clients text check (notable_clients is null or char_length(notable_clients) <= 300),
  day_rate_band text check (day_rate_band is null or char_length(day_rate_band) <= 60),
  availability text check (availability is null or char_length(availability) <= 120),
  photo_url text check (photo_url is null or char_length(photo_url) <= 500),
  consent boolean not null default false,
  profile_status text not null default 'draft'
    check (profile_status in ('draft', 'pending', 'live', 'changes_requested', 'removal_requested', 'removed')),
  submitted_at timestamptz,
  reviewed_at timestamptz,
  review_note text check (review_note is null or char_length(review_note) <= 1000),
  updated_at timestamptz not null default now()
);
comment on table public.axon_arbor_consultant_profiles is
  'Consultant profiles. Fields mirror the consultant Excel template. A profile is only visible to companies once an admin sets profile_status = live.';
alter table public.axon_arbor_consultant_profiles enable row level security;

create table public.axon_arbor_company_profiles (
  account_id uuid primary key references public.axon_arbor_accounts (id) on delete cascade,
  company_name text not null check (char_length(company_name) between 1 and 160),
  website text check (website is null or char_length(website) <= 300),
  industry text check (industry is null or char_length(industry) <= 120),
  city text check (city is null or char_length(city) <= 80),
  employee_count text check (employee_count is null or char_length(employee_count) <= 40),
  contact_name text not null check (char_length(contact_name) between 1 and 120),
  contact_role text check (contact_role is null or char_length(contact_role) <= 120),
  phone text check (phone is null or char_length(phone) <= 30),
  email_domain text not null check (char_length(email_domain) <= 200),
  updated_at timestamptz not null default now()
);
comment on table public.axon_arbor_company_profiles is
  'Company details captured at sign-up (work email domains only). Server-only.';
alter table public.axon_arbor_company_profiles enable row level security;
