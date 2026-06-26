# 🇻🇪 Vzla Al Rescate

**Plataforma web para reportar y buscar personas desaparecidas tras emergencias en Venezuela.**

Creada con ❤️ para conectar a familias durante crisis humanitarias.

## 🎯 Objetivo

Vzla Al Rescate es una aplicación web mobile-first que permite:

1. **Reportar Desaparecidos**: Crear reportes detallados con foto, descripción física y datos de contacto
2. **Buscar Desaparecidos**: Acceso público a la base de datos con búsqueda por nombre, cédula o descripción
3. **Reconocimiento Facial (Fase 4)**: Buscar por foto para identificar personas inconscientes en centros de ayuda
4. **Conexión Directa**: Contacto inmediato con reportantes para intercambiar información

## 🏗️ Arquitectura

- **Frontend**: Next.js 16 (App Router, TypeScript, Tailwind CSS)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **Autenticación**: Magic Link (OTP por email)
- **Validación**: Zod + react-hook-form
- **IA (futuro)**: AWS Rekognition para reconocimiento facial

## 🚀 Quick Start

### Requisitos previos
- Node.js 18+
- Cuenta en Supabase (gratuita)
- Variables de entorno configuradas en `.env.local`

### Instalación y Setup

1. **Clonar y entrar en la carpeta**
   ```bash
   cd "C:\Users\ejhea\LaDevHouse\VzlaAlRescate"
   ```

2. **Instalar dependencias** (si no lo hiciste)
   ```bash
   npm install
   ```

3. **Configurar base de datos**
   - Ver [SETUP.md](./SETUP.md) para ejecutar las migraciones SQL en Supabase

4. **Verificar variables de entorno**
   ```bash
   # .env.local debe tener:
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
VzlaAlRescate/
├── app/                    # Páginas y rutas (Next.js App Router)
│   ├── (auth)/            # Routes protegidas de autenticación
│   ├── (public)/          # Routes públicas
│   ├── reportar/          # Formulario de reporte
│   └── layout.tsx         # Layout raíz
├── components/            # Componentes React reutilizables
│   ├── ui/               # Componentes base (Button, Input, etc)
│   ├── layout/           # Header, Footer, Navbar
│   ├── auth/             # Formularios de autenticación
│   └── missing-person/   # Componentes específicos de desaparecidos
├── lib/                  # Utilidades y configuración
│   ├── supabase/        # Clientes de Supabase
│   ├── utils/           # Funciones helper
│   └── validations/     # Esquemas Zod
├── hooks/               # React hooks personalizados
├── types/               # TypeScript type definitions
├── supabase/            # Migraciones SQL
└── public/              # Assets estáticos
```

## 🔑 Características Principales

### Fase 1-3: MVP (Actual)
- ✅ Autenticación por magic link (email)
- ✅ Formulario de reporte con fotos
- ✅ Búsqueda pública por texto
- ✅ Ficha detallada de desaparecido
- ✅ RLS (Row Level Security) en Supabase
- ✅ Responsive mobile-first
- ✅ Campos físicos opcionales (edad, género, color piel/cabello/ojos, estatura, peso)

### Fase 4: Reconocimiento Facial
- 🔄 Integración AWS Rekognition
- 🔄 Búsqueda por foto
- 🔄 Indexación automática de rostros

### Fase 5: Colaboración y Moderación
- 🔄 Solicitudes de acceso para agregar info
- 🔄 Sistema de reportes de abuso
- 🔄 Panel de moderación para admins

## 📱 Dispositivos Soportados

- ✅ Móviles (iOS, Android) - **Optimizado**
- ✅ Tablets
- ✅ Desktops

## 🔐 Seguridad

- Autenticación JWT vía Supabase
- Row Level Security (RLS) en PostgreSQL
- Validación server-side con Zod
- Sin almacenamiento de credenciales en cliente
- `SUPABASE_SERVICE_ROLE_KEY` solo en servidor

## 🗄️ Base de Datos

**Tablas principales**:
- `missing_persons` - Reportes de desaparecidos
- `face_index` - Mapeo de rostros (Fase 4)
- `access_requests` - Solicitudes de acceso (Fase 5)
- `abuse_reports` - Reportes de abuso (Fase 5)

**Índices**:
- Full text search en español
- Trigram search para búsquedas flexibles
- Índices en campos físicos para filtros

## 🚢 Deploy

### Vercel (Recomendado)
```bash
vercel deploy
```

### Otras plataformas
- Railway
- Render
- DigitalOcean
- Heroku

## 📖 Documentación

- [SETUP.md](./SETUP.md) - Guía de configuración inicial
- [AGENTS.md](./AGENTS.md) - Instrucciones de desarrollo (Next.js)

## 🤝 Contribuir

Reporta bugs o sugiere features creando un issue en el repositorio.

## 📄 Licencia

MIT - Libre para usar con propósitos humanitarios

---

**Hecho con ❤️ para Venezuela**
