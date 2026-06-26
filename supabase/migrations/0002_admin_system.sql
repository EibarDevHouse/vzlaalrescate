-- =========================================================
-- Table: admin_users (for Phase 5 - Admin/Moderation)
-- =========================================================
create table public.admin_users (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),

  constraint unique_admin_user unique (user_id)
);

create index idx_admin_users_user_id on public.admin_users (user_id);

alter table public.admin_users enable row level security;

-- Only service role (backend) can access admin_users
create policy "admin_users_no_direct_access"
  on public.admin_users
  for all
  to anon, authenticated
  using (false);

-- =========================================================
-- Add created_at to access_requests if not present
-- Add created_at to abuse_reports if not present
-- =========================================================

-- Update access_requests created_at trigger
create trigger trg_access_requests_created_at
  after insert on public.access_requests
  for each row execute function public.set_updated_at();

-- Update abuse_reports created_at trigger
create trigger trg_abuse_reports_created_at
  after insert on public.abuse_reports
  for each row execute function public.set_updated_at();
