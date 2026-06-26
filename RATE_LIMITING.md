# 🛡️ Rate Limiting y Seguridad en Producción

Este documento explica cómo proteger la app de abuso cuando mucha gente intenta acceder simultáneamente.

## 🔍 El Problema

Cuando hay una emergencia (terremoto), miles de personas accederán simultáneamente. Sin protección:
- ❌ El servidor se sobrecarga
- ❌ El email service se abruma enviando magic links
- ❌ Usuarios legítimos no pueden acceder

## ✅ Soluciones Implementadas

### 1. **Client-Side (Frontend)**
Ya está implementado en `LoginForm.tsx`:

```typescript
// Detecta rate limit error de Supabase
if (signInError.message.includes("rate limit")) {
  // Muestra countdown de 60 segundos
  setRetryAfter(60);
  // Deshabilita el formulario
}
```

**Beneficios**:
- ✅ Evita múltiples clics accidentales
- ✅ Muestra feedback visual al usuario
- ✅ Mejora experiencia UX

### 2. **Supabase Auth (Server-Side)**
Supabase ya tiene rate limiting nativo:

```
- 4 intentos por hora por dirección IP
- 1 enlace válido a la vez por email
- Enlace válido por 24 horas
```

**Ver configuración en Supabase**:
1. Ve a `Authentication → Providers → Email`
2. Busca "Rate limiting"
3. Verifica los límites

---

## 📊 Niveles de Protección

### Nivel 1: Basic (Implementado ✅)
- Límites de Supabase Auth (4/hora)
- Countdown en UI (60 segundos)
- Mensajes claros al usuario

### Nivel 2: Advanced (Para producción)
- IP-based rate limiting a nivel de CDN
- User-based rate limiting (autenticados)
- Analytics dashboard

### Nivel 3: Enterprise (Escalas grandes)
- Load balancing
- Geographic rate limiting
- DDoS protection (Cloudflare, AWS Shield)

---

## 🚀 Configuración para Producción

### A. Supabase Rate Limit Settings

En el dashboard de Supabase, ve a:
**Authentication → Providers → Email**

Configura:
```
Max attempts per hour per email: 5
Max attempts per hour per IP: 10
OTP token lifetime: 24 hours
```

### B. Vercel / Hosting Rate Limiting

Si usas Vercel, agrega middleware para rate limiting:

```typescript
// middleware.ts (ejemplo)
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"),
});

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/login") {
    const ip = request.ip || "127.0.0.1";
    const { success } = await ratelimit.limit(ip);
    
    if (!success) {
      return new NextResponse("Rate limited", { status: 429 });
    }
  }
}
```

Requiere:
- Upstash Redis (gratuito hasta 10k requests)
- Variable env: `UPSTASH_REDIS_REST_URL`

### C. Cloudflare (Recomendado)

Si usas Cloudflare como DNS:

1. Ve a **Security → WAF**
2. **Create rule**
3. **Rate limiting rule**:
   ```
   Field: IP Address
   Rate: 10 requests per 60 seconds
   Action: Challenge or Block
   ```

### D. Environment Variables

Agrega a tu `.env.local` (producción):
```env
# Upstash Redis (opcional, para rate limiting avanzado)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# Cloudflare (si lo usas)
CLOUDFLARE_ZONE_ID=xxx
CLOUDFLARE_API_TOKEN=xxx
```

---

## 📈 Monitoreo y Analytics

### Ver en Supabase
1. **Authentication → Users** - Ver intentos fallidos
2. **Database → Logs** - Queries y errores
3. **Analytics** - Traffic patterns

### Alertas Recomendadas
Configura alertas para:
- ❌ 100+ failed login attempts en 10 minutos
- ❌ Spike de tráfico > 3x normal
- ❌ Errores de rate limiting

---

## 💡 Best Practices

### Para Emergencias (Alto Tráfico)
1. **Aumenta límites temporalmente** (si es posible)
   ```sql
   -- En Supabase (requiere acceso a SQL)
   -- Esto es solo ejemplo, no es recomendado hacerlo en prod
   ```

2. **Comunica a usuarios**
   ```
   "Si tienes problemas para acceder, intenta más tarde. 
   Estamos recibiendo mucho tráfico por la emergencia."
   ```

3. **Monitorea constantemente**
   - Revisa logs cada 15 minutos
   - Prepara team de soporte

### Para Evitar Abuso
1. **Valida emails en formato válido** ✅ (ya implementado)
2. **Deshabilita botón después de envío** ✅ (ya implementado)
3. **Usa CAPTCHA en login** (opcional, agrega fricción)
   - reCAPTCHA v3 (invisible)
   - hCaptcha (privacy-friendly)

### Implementar CAPTCHA (Futuro)
```typescript
// Ejemplo (no implementado todavía)
import { verify } from "@hcaptcha/js-api-bindings";

const { success } = await verify(token, process.env.HCAPTCHA_SECRET);
if (!success) {
  return { error: "Captcha failed" };
}
```

---

## 🧪 Testing de Rate Limiting

### Test Local
```bash
# Ejecuta 6 requests en 1 minuto
for i in {1..6}; do
  curl -X POST http://localhost:3000/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}'
  sleep 10
done

# El 5to request debería fallar con "rate limit exceeded"
```

### Test en Producción
1. Usa **Apache JMeter** o **k6** para load testing
2. Simula 1000 usuarios simultáneos
3. Monitorea CPU, memoria, errores
4. Verifica que rate limiting bloquee requests

---

## 🎯 Checklist para Producción

- [ ] Supabase rate limiting configurado
- [ ] Email magic link limits revisados
- [ ] Frontend countdown implementado ✅
- [ ] Mensajes de error traducidos
- [ ] Monitoring alerts configuradas
- [ ] Backup Redis (si usas Upstash)
- [ ] CDN/Cloudflare configurado
- [ ] Load testing realizado
- [ ] Runbook de escalamiento listo
- [ ] Support team capacitado

---

## 📞 Soporte

Si experimentas issues:
1. Revisa logs en Supabase dashboard
2. Verifica IP si está bloqueada
3. Contacta a Supabase support si el rate limiting es muy restrictivo

**Importante**: En emergencias, es preferible más tráfico que usuarios bloqueados.
