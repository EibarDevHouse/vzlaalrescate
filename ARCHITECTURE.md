# 🏗️ Arquitectura de Vzla Al Rescate

Documento que explica la arquitectura técnica y el flujo de datos de la aplicación.

## 📊 Stack Tecnológico

```
Frontend                   Backend                    Database
┌─────────────────┐       ┌──────────────────┐       ┌──────────────┐
│   Next.js 16    │ ◄────►│   Supabase       │ ◄────►│ PostgreSQL   │
│  - App Router   │       │  - Auth          │       │              │
│  - TypeScript   │       │  - Storage       │       │  Tables:     │
│  - Tailwind CSS │       │  - Real-time DB  │       │  - missing.. │
│  - React 19     │       │  - RLS           │       │  - face_idx  │
└─────────────────┘       │  - Webhooks      │       │  - requests  │
                           └──────────────────┘       │  - reports   │
                                                      └──────────────┘
```

## 🔄 Flujos de Datos Principales

### 1. **Autenticación (Magic Link)**

```
User                   Frontend              Supabase Auth
  │                      │                        │
  ├─ Input email ─────►  │                        │
  │                       │─ signInWithOtp ─────► │
  │                       │                        ├─ Generate OTP
  │                       │                        ├─ Send email
  │ Receive email         │                        │
  │ Click link ────────────────────────────────►  │
  │                                               ├─ Verify token
  │ Redirect to /auth/confirm                    │
  │                       ◄─ verifyOtp ─────────  │
  │                       │   (create session)    │
  │ Authenticated!        │                        │
```

### 2. **Crear Reporte**

```
User (Authenticated)      Frontend          Supabase Storage    Database
  │                         │                      │              │
  ├─ Fill form ──────────►  │                      │              │
  │                         ├─ Validate (Zod)     │              │
  │                         │                      │              │
  ├─ Select photo ────────► │                      │              │
  │ (< 5MB, jpg/png/webp)   ├─ Preview            │              │
  │                         │                      │              │
  ├─ Click submit ────────► │                      │              │
  │                         ├─ Upload to Storage ─► │              │
  │                         │                      ├─ Generate URL│
  │                         │◄─ Public URL ────────┤              │
  │                         │                      │              │
  │                         ├─ Call Server Action                 │
  │                         │  createMissingPerson                │
  │                         │ (foto_url included)  │              │
  │                         ├────────────────────────────────────►│
  │                         │                      │  INSERT row  │
  │                         │                      │  (cedula PK) │
  │                         │◄─ Success ───────────────────────────
  │ Redirect to detail page │                      │              │
```

**RLS Policy**: `missing_persons_insert_authenticated`
- ✅ Solo usuario autenticado puede insertar
- ✅ `reportado_por` debe ser `auth.uid()`

### 3. **Buscar Desaparecidos**

```
User (Any)               Frontend (Server)       Database
  │                         │                      │
  ├─ Visit /buscar ────►    │                      │
  │                         ├─ SearchBar renders   │
  │ Type in search ◄────    │  (Client Component)  │
  │                         │                      │
  ├─ Query matches ──►      │                      │
  │  (url?q=search)         ├─ Full text search   │
  │                         │  ILIKE + trgm index ├─ Query
  │                         │◄─────────────────────┤
  │ See results             │                      │
  │                         ├─ Render grid         │
  │ Click result ───►       │  of MissingPersonCard│
  │                         │                      │
  ├─ View detail page ─────►│                      │
  │  (SSR)                  ├─ Fetch single record├─ Query
  │                         │◄────────────────────┤
  │ See full info           │                      │
```

**RLS Policy**: `missing_persons_select_public`
- ✅ Cualquiera puede leer (anon + authenticated)
- ✅ No hay restricciones

### 4. **Reportar Información Duplicada**

```
User (Authenticated)      Frontend           Database
  │                         │                  │
  ├─ Fill form              │                  │
  ├─ Same cedula ─────────► │                  │
  │                         ├─ createMissingPerson
  │                         │                  │
  │                         ├─────────────────►│
  │                         │                  ├─ UNIQUE violation
  │                         │                  │  (cedula PK)
  │                         │◄─ Error 23505 ───
  │                         │                  │
  │ See alert message       ├─ Show Dialog    │
  │ with 2 options:         │  "Ya existe..."  │
  │ • View existing report  │                  │
  │ • Request access        │                  │
```

## 🗄️ Esquema de Base de Datos

### Tabla: `missing_persons`

```sql
cedula (PK)              -- V-12345678 (UNIQUE)
├─ nombre_completo       -- Requerido
├─ descripcion_fisica    -- Requerido
├─ ultima_ubicacion      -- Requerido
├─ foto_url              -- Requerido (URL de Storage)
│
├─ edad_aprox            -- Opcional
├─ genero                -- Opcional (enum)
├─ color_piel            -- Opcional (enum)
├─ color_cabello         -- Opcional (enum)
├─ color_ojos            -- Opcional (enum)
├─ usa_lentes            -- Opcional (boolean)
├─ estatura_cm           -- Opcional (int)
├─ peso_kg               -- Opcional (int)
│
├─ reportante_nombre     -- Requerido
├─ reportante_telefono   -- Requerido
├─ reportante_relacion   -- Requerido (enum)
│
├─ reportado_por (FK)    -- User ID
├─ estado                -- desaparecido|encontrado_vivo|encontrado_fallecido
├─ search_vector         -- Generated column (full text search)
├─ created_at            -- Timestamp
├─ updated_at            -- Timestamp
```

### Índices
- `search_vector` (GIN) - Full text search en español
- `nombre_trgm` (GIN) - Trigram para búsquedas parciales
- `cedula_trgm` (GIN) - Trigram en cédula
- B-tree en campos físicos (género, colores, edad, estatura, peso)

### Políticas RLS

| Política | Operación | Rol | Condición |
|----------|-----------|-----|-----------|
| `select_public` | SELECT | anon, auth | true (sin restricción) |
| `insert_authenticated` | INSERT | auth | reportado_por = auth.uid() |
| `update_own` | UPDATE | auth | reportado_por = auth.uid() |
| (delete) | DELETE | - | No permitido |

## 🔐 Security Layers

```
1. Network Layer
   └─ HTTPS (Supabase)

2. Authentication
   └─ JWT via Supabase Auth
   └─ Magic Link (email OTP)

3. Authorization (RLS)
   └─ Row Level Security en PostgreSQL
   └─ Policies por tabla

4. Data Validation
   └─ Zod schemas (server + client)
   └─ CHECK constraints en DB

5. File Upload
   └─ Only authenticated users
   └─ Max 5MB
   └─ Only image types (jpg, png, webp)
   └─ Public read (for search view)
```

## 📁 Estructura de Componentes

### UI Components (`/components/ui/`)
Componentes base reutilizables, sin lógica de dominio:
- `Button` - Botones con variantes (primary, secondary, danger, ghost)
- `Input` - Input text con validación y error display
- `Select` - Dropdown con opciones
- `TextArea` - Textarea multilínea
- `Alert` - Notificaciones (success, error, warning, info)

### Domain Components (`/components/missing-person/`)
Componentes específicos de desaparecidos:
- `PhotoUploader` - Upload de fotos con preview y drag-drop
- `MissingPersonForm` - Formulario completo de reporte
- `SearchBar` - Input de búsqueda con debounce
- `SearchResults` - Grid de resultados (Server Component)
- `MissingPersonCard` - Tarjeta individual en listado
- `MissingPersonDetail` - Página completa de detalle

### Layout Components (`/components/layout/`)
- `Navbar` - Navegación mobile-first con menú hamburguesa
- `Footer` - Pie de página

### Auth Components (`/components/auth/`)
- `LoginForm` - Magic link form

## 🔗 Route Groups

```
app/
├─ (auth)/                    # Rutas protegidas
│  ├─ login/page.tsx
│  └─ auth/confirm/route.ts
│
├─ (public)/                  # Rutas públicas
│  ├─ buscar/page.tsx
│  └─ desaparecido/[cedula]/page.tsx
│
├─ reportar/page.tsx          # Protegida (useAuth hook)
├─ page.tsx                   # Home
├─ error.tsx                  # Global error handler
├─ not-found.tsx              # 404 page
└─ layout.tsx                 # Root layout
```

## ⚙️ Key Libraries

```
react-hook-form          - Form state management
@hookform/resolvers      - Connect Zod to react-hook-form
zod                      - Schema validation
@supabase/supabase-js    - Supabase client
@supabase/ssr            - SSR helpers for Supabase
lucide-react             - Icons
tailwind-merge, clsx     - CSS utilities
```

## 🔄 Environment Variables

```
.env.local
├─ NEXT_PUBLIC_SUPABASE_URL       # Public (browser & server)
├─ NEXT_PUBLIC_SUPABASE_ANON_KEY  # Public (browser & server)
└─ SUPABASE_SERVICE_ROLE_KEY      # Private (server only, phase 4+)
```

## 📈 Performance Considerations

### Caching
- Static pages: home, login, 404, error
- Dynamic pages: buscar (with suspense), desaparecido/[cedula] (with ISR)

### Search Optimization
- Full text search (Spanish) via `search_vector`
- Trigram search for typo-tolerant matching
- Indexed on frequently queried columns

### Image Optimization
- Stored in Supabase Storage (CDN-backed)
- Max 5MB enforced client + server
- Public read URLs for search display

## 🚀 Deployment Checklist

- [ ] Database migrations applied on production Supabase
- [ ] Storage bucket `missing-persons-photos` created (public)
- [ ] Environment variables set on hosting platform
- [ ] RLS policies enabled and tested
- [ ] CORS configured for photo uploads
- [ ] Email settings verified (magic link)
- [ ] Domain SSL/TLS configured
- [ ] Monitoring & logging setup (optional)

## 🔮 Future Phases Architecture

### Phase 4: Facial Recognition
```
Photo Upload              AWS Rekognition         Database
  │                            │                   │
  ├─ IndexFaces ────────────►   ├─ Extract face
  │                            │
  │ SearchFacesByImage ────────► ├─ Match faces
  │                            │
  │ Results ◄─────────────────┤
  │   (similarity scores)      │
  │                            │
  ├─ Store face_index ──────────────────────────►
  │   (FaceId, cedula, confidence)
```

### Phase 5: Collaboration
```
access_requests table       abuse_reports table
├─ cedula (FK)              ├─ cedula (FK)
├─ solicitante_id (FK)      ├─ denunciante_id (FK)
├─ mensaje                  ├─ motivo
├─ estado (pending|aprobada|rechazada)  ├─ estado (pending|en_revision|resuelto)
└─ RLS: solicitante + creator can see    └─ RLS: reporter can create, admin reviews
```

---

**Última actualización**: 2026-06-25
