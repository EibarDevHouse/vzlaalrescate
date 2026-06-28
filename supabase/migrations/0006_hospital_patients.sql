-- Hospital patients directory / listings feature
-- Patients loaded directly via CSV in Supabase UI, state updated via /admin panel

create table public.hospital_patients (
  id uuid primary key default gen_random_uuid(),
  nombre_completo text not null,
  edad int check (edad >= 0 and edad <= 120),
  cedula text,
  hospital text not null,
  estado text not null default 'hospitalizado'
    check (estado in ('hospitalizado', 'dado_de_alta', 'fallecido')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Reuse existing set_updated_at trigger from missing_persons
create trigger hospital_patients_updated_at
  before update on public.hospital_patients
  for each row execute function set_updated_at();

-- Trigram indexes for flexible search
create index hospital_patients_nombre_trgm_idx on public.hospital_patients using gin (nombre_completo gin_trgm_ops);
create index hospital_patients_hospital_trgm_idx on public.hospital_patients using gin (hospital gin_trgm_ops);

-- Fast filtering by state
create index hospital_patients_estado_idx on public.hospital_patients (estado);

-- Row-level security
alter table public.hospital_patients enable row level security;

-- Public read access for everyone
create policy hospital_patients_select_public on public.hospital_patients
  for select to anon, authenticated using (true);

-- No direct insert/update/delete policies for anon/authenticated
-- Initial data loaded directly via Supabase UI, state updates go through /admin server actions with checkIsAdmin()
