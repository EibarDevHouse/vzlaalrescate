-- =========================================================
-- Table: missing_pets (lost pets during emergencies)
-- =========================================================
create table public.missing_pets (
  id uuid primary key default gen_random_uuid(),

  -- Pet info
  nombre text not null check (length(trim(nombre)) > 0),
  especie text not null check (especie in ('perro', 'gato', 'otro')),
  raza text,
  color text not null check (length(trim(color)) > 0),
  descripcion_fisica text,
  foto_url text not null,
  zona_extravio text not null check (length(trim(zona_extravio)) > 0),

  -- Owner info
  dueño_nombre text not null check (length(trim(dueño_nombre)) > 0),
  dueño_telefono text not null check (length(trim(dueño_telefono)) > 0),

  -- Metadata
  reportado_por uuid not null references auth.users(id) on delete set null,
  estado text not null default 'desaparecido'
    check (estado in ('desaparecido', 'encontrado')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Full text search vector in Spanish
  search_vector tsvector
);

-- Indices for search and filtering
create index idx_missing_pets_search_vector
  on public.missing_pets using gin (search_vector);

create index idx_missing_pets_nombre_trgm
  on public.missing_pets using gin (nombre gin_trgm_ops);

create index idx_missing_pets_especie_trgm
  on public.missing_pets using gin (especie gin_trgm_ops);

create index idx_missing_pets_estado
  on public.missing_pets (estado);

create index idx_missing_pets_created_at
  on public.missing_pets (created_at desc);

-- Function to update search_vector
create or replace function public.update_missing_pets_search_vector()
returns trigger as $$
begin
  new.search_vector := to_tsvector('spanish',
    coalesce(new.nombre, '') || ' ' ||
    coalesce(new.especie, '') || ' ' ||
    coalesce(new.raza, '') || ' ' ||
    coalesce(new.color, '') || ' ' ||
    coalesce(new.zona_extravio, '')
  );
  return new;
end;
$$ language plpgsql;

-- Trigger for search_vector updates
create trigger trg_missing_pets_search_vector
  before insert or update on public.missing_pets
  for each row execute function public.update_missing_pets_search_vector();

-- Trigger for updated_at (reuse existing function)
create trigger trg_missing_pets_updated_at
  before update on public.missing_pets
  for each row execute function public.set_updated_at();

-- =========================================================
-- RLS (Row Level Security) Policies
-- =========================================================
alter table public.missing_pets enable row level security;

-- Anyone can read (public search)
create policy "missing_pets_select_public"
  on public.missing_pets
  for select
  to anon, authenticated
  using (true);

-- Only authenticated users can insert
create policy "missing_pets_insert_authenticated"
  on public.missing_pets
  for insert
  to authenticated
  with check (reportado_por = auth.uid());

-- Only the reporter can update their own pet
create policy "missing_pets_update_own"
  on public.missing_pets
  for update
  to authenticated
  using (reportado_por = auth.uid())
  with check (reportado_por = auth.uid());
