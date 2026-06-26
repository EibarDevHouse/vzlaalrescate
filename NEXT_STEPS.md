# 📋 Próximos Pasos - Vzla Al Rescate

¡La aplicación está lista para empezar! Aquí te explico qué hacer ahora.

## ✅ Lo que ya está hecho

- ✅ Proyecto Next.js configurado con TypeScript y Tailwind CSS
- ✅ Estructura de carpetas completa
- ✅ Componentes UI listos (Button, Input, Select, TextArea, Alert)
- ✅ Clientes de Supabase (browser y server)
- ✅ Validaciones con Zod
- ✅ Esquema SQL completo para la base de datos
- ✅ Páginas y rutas:
  - Home (landing page)
  - Login (autenticación por magic link)
  - Reportar desaparecido (formulario completo)
  - Buscar desaparecidos (con buscador)
  - Detalle de desaparecido
- ✅ Componentes para fotos (uploader, preview)
- ✅ RLS (Row Level Security) configurado
- ✅ Mobile-first responsive design

## 🔧 Pasos obligatorios antes de usar la app

### 1. **Configurar la base de datos en Supabase**

Lee el archivo [SETUP.md](./SETUP.md) para ejecutar las migraciones SQL:

```bash
# Opción A: SQL Editor en Dashboard de Supabase
# Copia y pega el contenido de supabase/migrations/0001_init.sql

# Opción B: Supabase CLI (recomendado)
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_ID
npx supabase db push
```

### 2. **Crear el bucket de Storage** (si no se creó automáticamente)

1. Ve a Storage en Supabase
2. Crea un bucket llamado `missing-persons-photos`
3. Márcalo como **Public**

### 3. **Verificar variables de entorno**

Confirma que `.env.local` tenga estas 3 líneas:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🚀 Ejecutar la app

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

## 🧪 Testing Manual

### Test 1: Login
1. Ve a http://localhost:3000/login
2. Ingresa tu correo real
3. Revisa tu email (incluye spam)
4. Haz clic en el enlace magic link
5. Deberías ser redirigido a `/reportar` con sesión activa

### Test 2: Reportar
1. Completa el formulario
2. Intenta con datos incompletos → debe mostrar errores
3. Intenta subir una foto >5MB → debe rechazarla
4. Completa todo correctamente
5. Haz clic en "Publicar Reporte"
6. Si todo funciona, serás redirigido a la ficha del desaparecido

### Test 3: Buscar
1. Ve a http://localhost:3000/buscar (sin login)
2. Busca por el nombre del desaparecido que reportaste
3. Deberías ver la tarjeta con la foto
4. Haz clic para ver detalles
5. Verifica que puedas ver el teléfono del reportante

### Test 4: Cédula Duplicada
1. Intenta reportar a la misma persona (misma cédula)
2. Deberías ver un mensaje amigable en lugar de un error

## 📱 Testing en Mobile

```bash
# En otra terminal, obtén tu IP local
ipconfig getifaddr en0  # Mac/Linux
ipconfig  # Windows (busca "IPv4 Address")

# Accede desde tu teléfono a:
# http://YOUR_IP:3000
```

## 🐛 Troubleshooting

### Error: "NEXT_PUBLIC_SUPABASE_URL" no definida
- Reinicia `npm run dev` después de crear `.env.local`

### Error: "Tabla 'missing_persons' no existe"
- Ejecuta la migración SQL en Supabase (ver paso 1 arriba)

### Error: "Bucket 'missing-persons-photos' no existe"
- Crear el bucket manualmente en Storage (ver paso 2)

### Las fotos no se suben
- Verifica que el bucket sea **Public**
- Revisa en Supabase → Storage → missing-persons-photos

### El login no funciona
- Verifica que el email sea válido
- Revisa spam en tu bandeja de entrada
- Comprueba que SUPABASE_URL y ANON_KEY sean correctas

## 📈 Próximas fases

### Fase 4: Reconocimiento Facial (AWS Rekognition)
Cuando estés listo:
- Crea una cuenta en AWS
- Configura Access Key y Secret Key
- Crea una Rekognition Collection
- Agrega credenciales a `.env.local`

### Fase 5: Solicitudes de Acceso y Reportes de Abuso
El esquema SQL ya soporta estas tablas:
- `access_requests` - Para solicitar acceso a reportes
- `abuse_reports` - Para reportar información falsa

Solo necesita UI y lógica para:
- Crear solicitudes
- Aprobar/rechazar como creador del reporte
- Ver reportes de abuso en un panel admin

## 💡 Tips de Desarrollo

### Generar tipos de Supabase
```bash
npx supabase gen types typescript > types/database.types.ts
```

### Estructura de componentes
- `/components/ui/` → Componentes reutilizables
- `/components/missing-person/` → Específicos del dominio
- `/components/layout/` → Header, footer, navbar

### Agregar una nueva página
1. Crea carpeta en `app/`
2. Agrega `page.tsx`
3. Si requiere autenticación, colócala en `(auth)/`
4. Si es pública, colócala en `(public)/`

### Server Actions vs Route Handlers
- **Server Actions** (`actions.ts`): Para operaciones simples
- **Route Handlers** (`route.ts`): Para APIs complejas o webhooks

## 📞 Soporte

Si encuentras problemas:
1. Revisa [SETUP.md](./SETUP.md)
2. Verifica [README.md](./README.md)
3. Revisa la consola del navegador (F12)
4. Revisa los logs de Supabase en el dashboard

## 🎉 ¡Listo!

La aplicación está lista para uso. Ahora puedes:
- Reportar desaparecidos
- Buscar en la base de datos
- Compartir con otros
- Expandir la app con nuevas fases

**¡Gracias por usar Vzla Al Rescate! ❤️**
