# Setup - Vzla Al Rescate

Este archivo explica cómo configurar la base de datos en Supabase para que la aplicación funcione.

## 1. Crear el esquema de base de datos

El archivo `supabase/migrations/0001_init.sql` contiene todas las tablas y políticas RLS necesarias.

**Para ejecutar la migración en Supabase:**

### Opción A: SQL Editor en Supabase Dashboard
1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Dirígete a **SQL Editor** (o **SQL** en el menú)
3. Crea una nueva query
4. Copia TODO el contenido del archivo `supabase/migrations/0001_init.sql`
5. Pégalo en el editor
6. Haz clic en **Ejecutar** o presiona `Ctrl+Enter`

### Opción B: Supabase CLI (Recomendado)
```bash
# Asegúrate de estar en la carpeta del proyecto
cd "C:\Users\ejhea\LaDevHouse\VzlaAlRescate"

# Login a Supabase (si no lo has hecho)
npx supabase login

# Link tu proyecto
npx supabase link --project-ref YOUR_PROJECT_ID

# Ejecuta la migración
npx supabase db push
```

Reemplaza `YOUR_PROJECT_ID` con el ID de tu proyecto Supabase (lo encuentras en Settings → API → Project ID).

## 2. Crear el bucket de Storage

Si la migración no creó automáticamente el bucket `missing-persons-photos`, créalo manualmente:

1. Ve a **Storage** en el Dashboard de Supabase
2. Crea un nuevo bucket con el nombre: `missing-persons-photos`
3. Marca como **Public** (para que se puedan ver las fotos)

## 3. Variables de entorno

Verifica que tu archivo `.env.local` tenga estas variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## 4. Ejecutar la app

```bash
npm run dev
```

La app estará disponible en `http://localhost:3000`

## 5. Probar las funciones

### Login
1. Ve a `http://localhost:3000/login`
2. Ingresa tu correo
3. Deberías recibir un magic link por email
4. Haz clic en el enlace para confirmar

### Reportar
1. Después de login, ve a `/reportar`
2. Completa el formulario
3. La foto se subirá a Storage y el reporte se creará en la base de datos

### Buscar
1. Ve a `http://localhost:3000/buscar` (sin login requerido)
2. Busca por nombre, cédula o descripción
3. Haz clic en un resultado para ver los detalles

## 6. Troubleshooting

### "Política de RLS rechazó la solicitud"
- Asegúrate de estar autenticado (login) si intentas crear un reporte
- Las búsquedas deben funcionar sin login

### "Error: Bucket 'missing-persons-photos' no existe"
- Crea el bucket manualmente en Storage (ver paso 2)
- O edita `supabase/migrations/0001_init.sql` para que el bucket sea creado automáticamente

### "Error: NEXT_PUBLIC_SUPABASE_URL no está definida"
- Verifica que tu `.env.local` tenga las 3 variables
- Reinicia `npm run dev` después de cambiar `.env.local`

## 7. Fases futuras

### Fase 4: Reconocimiento facial (AWS Rekognition)
Se agregará la búsqueda por foto usando AWS Rekognition. Necesitarás:
- Cuenta de AWS
- Access Key y Secret Key de AWS
- Una Rekognition Collection creada

### Fase 5: Solicitudes de acceso y reportes de abuso
Se permitirá que otros usuarios soliciten acceso para agregar información a reportes existentes.

## Preguntas o problemas?

Si tienes dudas o encuentras bugs, reporta en el repositorio o contacta al equipo.
