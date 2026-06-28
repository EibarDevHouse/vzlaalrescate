-- Add support for missing children without national ID (cedula)
-- Uses synthetic cedula format SC-XXXXXXXX to preserve existing PK/FK relationships

-- 1. Relax cedula format constraint to accept synthetic identifiers
alter table public.missing_persons drop constraint cedula_format;
alter table public.missing_persons add constraint cedula_format
  check (cedula ~ '^([VE]-\d{7,8}|SC-\d{8})$');

-- 2. Add columns to track children without ID and flag for admin review
alter table public.missing_persons add column tiene_cedula boolean not null default true;
alter table public.missing_persons add column requiere_revision boolean not null default false;

-- 3. Index for efficient admin dashboard queries
create index missing_persons_requiere_revision_idx on public.missing_persons (requiere_revision)
  where requiere_revision = true;

-- 4. SQL function to find similar missing persons by name using trigram similarity
-- Used to detect potential duplicates when reporting children without cedula
create or replace function find_similar_missing_persons(
  search_name text,
  similarity_threshold float8 default 0.4,
  limit_count int default 3
)
returns table (
  cedula text,
  nombre_completo text,
  ultima_ubicacion text,
  tiene_cedula boolean
) as $$
  select
    mp.cedula,
    mp.nombre_completo,
    mp.ultima_ubicacion,
    mp.tiene_cedula
  from public.missing_persons mp
  where mp.estado = 'desaparecido'
    and similarity(mp.nombre_completo, search_name) > similarity_threshold
  order by similarity(mp.nombre_completo, search_name) desc
  limit limit_count;
$$ language sql stable;
