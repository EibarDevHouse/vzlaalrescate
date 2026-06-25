-- Enable extensions
create extension if not exists pg_trgm;
create extension if not exists unaccent;

-- =========================================================
-- Table: missing_persons (main table for missing people)
-- =========================================================
create table public.missing_persons (
  cedula text primary key
    constraint cedula_format check (cedula ~ '^[VE]-\d{7,8}$'),

  -- Basic info
  nombre_completo text not null check (length(trim(nombre_completo)) > 0),
  descripcion_fisica text not null check (length(trim(descripcion_fisica)) > 0),
  ultima_ubicacion text not null check (length(trim(ultima_ubicacion)) > 0),
  foto_url text not null,

  -- Physical characteristics (optional, for filtering)
  edad_aprox int check (edad_aprox >= 0 and edad_aprox <= 120),
  genero text check (genero in ('masculino', 'femenino', 'otro')),
  color_piel text check (color_piel in ('clara', 'trigueña', 'morena', 'negra')),
  color_cabello text check (color_cabello in ('negro', 'castaño', 'rubio', 'canoso', 'pelirrojo', 'calvo')),
  color_ojos text check (color_ojos in ('marrones', 'negros', 'verdes', 'azules', 'grises', 'miel')),
  usa_lentes boolean,
  estatura_cm int check (estatura_cm >= 30 and estatura_cm <= 250),
  peso_kg int check (peso_kg >= 1 and peso_kg <= 300),

  -- Reporter info
  reportante_nombre text not null check (length(trim(reportante_nombre)) > 0),
  reportante_telefono text not null check (length(trim(reportante_telefono)) > 0),
  reportante_relacion text not null check (length(trim(reportante_relacion)) > 0),

  -- Metadata
  reportado_por uuid not null references auth.users(id) on delete set null,
  estado text not null default 'desaparecido'
    check (estado in ('desaparecido', 'encontrado_vivo', 'encontrado_fallecido')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Full text search vector in Spanish
  search_vector tsvector generated always as (
    to_tsvector('spanish',
      coalesce(nombre_completo, '') || ' ' ||
      coalesce(descripcion_fisica, '') || ' ' ||
      coalesce(ultima_ubicacion, '')
    )
  ) stored
);

-- Indices for search and filtering
create index idx_missing_persons_search_vector
  on public.missing_persons using gin (search_vector);

create index idx_missing_persons_nombre_trgm
  on public.missing_persons using gin (nombre_completo gin_trgm_ops);

create index idx_missing_persons_cedula_trgm
  on public.missing_persons using gin (cedula gin_trgm_ops);

create index idx_missing_persons_created_at
  on public.missing_persons (created_at desc);

create index idx_missing_persons_genero
  on public.missing_persons (genero);

create index idx_missing_persons_color_piel
  on public.missing_persons (color_piel);

create index idx_missing_persons_color_cabello
  on public.missing_persons (color_cabello);

create index idx_missing_persons_color_ojos
  on public.missing_persons (color_ojos);

create index idx_missing_persons_edad
  on public.missing_persons (edad_aprox);

create index idx_missing_persons_estatura
  on public.missing_persons (estatura_cm);

create index idx_missing_persons_peso
  on public.missing_persons (peso_kg);

-- Trigger for updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_missing_persons_updated_at
  before update on public.missing_persons
  for each row execute function public.set_updated_at();

-- =========================================================
-- RLS (Row Level Security) Policies
-- =========================================================
alter table public.missing_persons enable row level security;

-- Anyone can read (public search)
create policy "missing_persons_select_public"
  on public.missing_persons
  for select
  to anon, authenticated
  using (true);

-- Only authenticated users can insert
create policy "missing_persons_insert_authenticated"
  on public.missing_persons
  for insert
  to authenticated
  with check (reportado_por = auth.uid());

-- Only the reporter can update their own report
create policy "missing_persons_update_own"
  on public.missing_persons
  for update
  to authenticated
  using (reportado_por = auth.uid())
  with check (reportado_por = auth.uid());

-- Delete not allowed via API (maintain historical records)
-- admins can delete via management API later

-- =========================================================
-- Table: face_index (for Phase 4 - AWS Rekognition)
-- Maps AWS Rekognition FaceId to cedula
-- =========================================================
create table public.face_index (
  face_id text primary key,
  cedula text not null references public.missing_persons(cedula) on delete cascade,
  collection_id text not null default 'vzla-al-rescate-faces',
  confidence numeric(5,2),
  created_at timestamptz not null default now(),

  constraint unique_cedula_face unique (cedula, face_id)
);

create index idx_face_index_cedula on public.face_index (cedula);

alter table public.face_index enable row level security;

-- Only backend (service role) can access this table
create policy "face_index_no_client_access"
  on public.face_index
  for all
  to anon, authenticated
  using (false);

-- =========================================================
-- Table: access_requests (for Phase 5 - collaborative editing)
-- =========================================================
create table public.access_requests (
  id uuid default gen_random_uuid() primary key,
  cedula text not null references public.missing_persons(cedula) on delete cascade,
  solicitante_id uuid not null references auth.users(id) on delete cascade,
  mensaje text,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'aprobada', 'rechazada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint unique_access_request unique (cedula, solicitante_id)
);

create index idx_access_requests_cedula on public.access_requests (cedula);
create index idx_access_requests_solicitante on public.access_requests (solicitante_id);
create index idx_access_requests_estado on public.access_requests (estado);

alter table public.access_requests enable row level security;

create trigger trg_access_requests_updated_at
  before update on public.access_requests
  for each row execute function public.set_updated_at();

-- Only solicitante and the report creator can see access requests
create policy "access_requests_select"
  on public.access_requests
  for select
  to authenticated
  using (
    solicitante_id = auth.uid() or
    cedula in (
      select cedula from public.missing_persons
      where reportado_por = auth.uid()
    )
  );

create policy "access_requests_insert"
  on public.access_requests
  for insert
  to authenticated
  with check (solicitante_id = auth.uid());

-- Only the report creator can update access_requests
create policy "access_requests_update"
  on public.access_requests
  for update
  to authenticated
  using (
    cedula in (
      select cedula from public.missing_persons
      where reportado_por = auth.uid()
    )
  )
  with check (
    cedula in (
      select cedula from public.missing_persons
      where reportado_por = auth.uid()
    )
  );

-- =========================================================
-- Table: abuse_reports (for Phase 5 - moderation queue)
-- =========================================================
create table public.abuse_reports (
  id uuid default gen_random_uuid() primary key,
  cedula text not null references public.missing_persons(cedula) on delete cascade,
  denunciante_id uuid not null references auth.users(id) on delete set null,
  motivo text not null check (length(trim(motivo)) > 0),
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'en_revision', 'resuelto')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_abuse_reports_cedula on public.abuse_reports (cedula);
create index idx_abuse_reports_estado on public.abuse_reports (estado);

alter table public.abuse_reports enable row level security;

create trigger trg_abuse_reports_updated_at
  before update on public.abuse_reports
  for each row execute function public.set_updated_at();

-- Only authenticated users can insert abuse reports
create policy "abuse_reports_insert"
  on public.abuse_reports
  for insert
  to authenticated
  with check (denunciante_id = auth.uid());

-- Users can see their own reports; admins see all (future: check admin role)
create policy "abuse_reports_select"
  on public.abuse_reports
  for select
  to authenticated
  using (denunciante_id = auth.uid());

-- =========================================================
-- Storage: Bucket for missing person photos
-- =========================================================
insert into storage.buckets (id, name, public)
values ('missing-persons-photos', 'missing-persons-photos', true)
on conflict (id) do nothing;

-- Allow anyone to read photos (public search)
create policy "photos_select_public"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'missing-persons-photos');

-- Only authenticated users can upload
create policy "photos_insert_authenticated"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'missing-persons-photos');

-- Only the uploader can update/delete their photos
create policy "photos_update_own"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'missing-persons-photos' and owner = auth.uid());

create policy "photos_delete_own"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'missing-persons-photos' and owner = auth.uid());
