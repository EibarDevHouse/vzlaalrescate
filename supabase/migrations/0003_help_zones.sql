-- =========================================================
-- Table: help_zones (zones needing urgent supplies)
-- =========================================================
create table public.help_zones (
  id uuid primary key default gen_random_uuid(),

  -- Zone info
  zona text not null check (length(trim(zona)) > 0),
  insumos_necesarios text[] not null,
  descripcion text,
  foto_url text,

  -- Coordinator info
  responsable_nombre text not null check (length(trim(responsable_nombre)) > 0),
  responsable_telefono text not null check (length(trim(responsable_telefono)) > 0),

  -- Metadata
  reportado_por uuid not null references auth.users(id) on delete set null,
  estado text not null default 'activa'
    check (estado in ('activa', 'atendida', 'cerrada')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Full text search vector in Spanish
  search_vector tsvector
);

-- Indices for search and filtering
create index idx_help_zones_search_vector
  on public.help_zones using gin (search_vector);

create index idx_help_zones_zona_trgm
  on public.help_zones using gin (zona gin_trgm_ops);

create index idx_help_zones_estado
  on public.help_zones (estado);

create index idx_help_zones_created_at
  on public.help_zones (created_at desc);

-- Function to update search_vector
create or replace function public.update_help_zones_search_vector()
returns trigger as $$
begin
  new.search_vector := to_tsvector('spanish',
    coalesce(new.zona, '') || ' ' ||
    coalesce(new.descripcion, '') || ' ' ||
    array_to_string(new.insumos_necesarios, ' ')
  );
  return new;
end;
$$ language plpgsql;

-- Trigger for search_vector updates
create trigger trg_help_zones_search_vector
  before insert or update on public.help_zones
  for each row execute function public.update_help_zones_search_vector();

-- Trigger for updated_at (reuse existing function)
create trigger trg_help_zones_updated_at
  before update on public.help_zones
  for each row execute function public.set_updated_at();

-- =========================================================
-- RLS (Row Level Security) Policies
-- =========================================================
alter table public.help_zones enable row level security;

-- Anyone can read (public search)
create policy "help_zones_select_public"
  on public.help_zones
  for select
  to anon, authenticated
  using (true);

-- Only authenticated users can insert
create policy "help_zones_insert_authenticated"
  on public.help_zones
  for insert
  to authenticated
  with check (reportado_por = auth.uid());

-- Only the reporter can update their own zone
create policy "help_zones_update_own"
  on public.help_zones
  for update
  to authenticated
  using (reportado_por = auth.uid())
  with check (reportado_por = auth.uid());
