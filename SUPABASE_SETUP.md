# 🚀 Configuración de Supabase y Pagos Reales

Esta guía te ayudará a configurar Supabase como base de datos y preparar el proyecto para pagos reales con Stripe.

## 📋 Paso 1: Configurar Supabase

### 1.1 Crear cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota el nombre del proyecto y la región

### 1.2 Obtener la URL de conexión

1. En el dashboard de Supabase, ve a **Settings** → **Database**
2. Busca la sección **Connection string**
3. Selecciona **URI** y copia la cadena de conexión
4. La URL se verá así:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### 1.3 Configurar variables de entorno

Actualiza tu archivo `.env` con la URL de Supabase:

```env
# Base de datos Supabase
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.[TU-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# O si prefieres la conexión directa (sin pgbouncer):
# DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.[TU-PROJECT-REF].supabase.co:5432/postgres"
```

**Nota importante:** 
- Reemplaza `[TU-PASSWORD]` con la contraseña de tu base de datos
- Reemplaza `[TU-PROJECT-REF]` con la referencia de tu proyecto
- La opción con `pgbouncer=true` es recomendada para conexiones desde servidores serverless

### 1.4 Ejecutar migraciones en Supabase

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# O para desarrollo:
npx prisma migrate dev --name init
```

### 1.5 Verificar la conexión

```bash
# Verificar que Prisma puede conectarse
npx prisma db pull

# Abrir Prisma Studio para ver los datos
npx prisma studio
```

## 💳 Paso 2: Configurar Stripe para Pagos Reales

### 2.1 Activar modo Live en Stripe

1. Ve a [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Asegúrate de estar en **modo Live** (no Test mode)
3. Ve a **Developers** → **API keys**

### 2.2 Obtener claves de producción

1. En modo **Live**, copia las siguientes claves:
   - **Publishable key** (empieza con `pk_live_...`)
   - **Secret key** (empieza con `sk_live_...`)

2. **⚠️ IMPORTANTE:** Nunca compartas tu Secret key públicamente

### 2.3 Crear productos y precios en Stripe

1. Ve a **Products** en el dashboard de Stripe
2. Crea dos productos:

   **Producto 1: Plan Básico**
   - Nombre: "Plan Básico"
   - Precio: $9.00 USD
   - Facturación: Recurrente (mensual)
   - Copia el **Price ID** (empieza con `price_...`)

   **Producto 2: Plan Premium**
   - Nombre: "Plan Premium"
   - Precio: $29.00 USD
   - Facturación: Recurrente (mensual)
   - Copia el **Price ID** (empieza con `price_...`)

### 2.4 Configurar Webhooks en Stripe

1. Ve a **Developers** → **Webhooks**
2. Click en **Add endpoint**
3. URL del endpoint: `https://tu-dominio.com/api/stripe/webhook`
4. Selecciona los siguientes eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copia el **Signing secret** (empieza con `whsec_...`)

### 2.5 Actualizar variables de entorno

Actualiza tu archivo `.env` con las claves de producción:

```env
# Stripe - Modo Producción (LIVE)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."

# Stripe - Price IDs (de los productos que creaste)
NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID="price_..."

# Stripe - Webhook Secret
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## 🔒 Paso 3: Configuración de Seguridad

### 3.1 Variables de entorno en producción

Si despliegas en Vercel, Netlify u otra plataforma:

1. Ve a la configuración del proyecto
2. Agrega todas las variables de `.env` en la sección de **Environment Variables**
3. **NUNCA** subas el archivo `.env` a Git

### 3.2 Verificar .gitignore

Asegúrate de que `.gitignore` incluya:

```
.env
.env.local
.env*.local
```

### 3.3 Configurar NextAuth para producción

Actualiza `NEXTAUTH_URL` en producción:

```env
# Desarrollo
NEXTAUTH_URL="http://localhost:3000"

# Producción
NEXTAUTH_URL="https://tu-dominio.com"
```

## 🧪 Paso 4: Probar la Configuración

### 4.1 Probar conexión a Supabase

```bash
# Verificar conexión
npx prisma db pull

# Si funciona, verás el esquema de tu base de datos
```

### 4.2 Probar Stripe (con tarjeta de prueba)

Aunque estés en modo Live, puedes usar tarjetas de prueba de Stripe:

- **Tarjeta exitosa:** `4242 4242 4242 4242`
- **CVV:** Cualquier 3 dígitos
- **Fecha:** Cualquier fecha futura
- **ZIP:** Cualquier código postal

**⚠️ IMPORTANTE:** En modo Live, estas tarjetas de prueba funcionan, pero no procesarán pagos reales.

### 4.3 Verificar webhooks

1. En el dashboard de Stripe, ve a **Webhooks**
2. Click en tu endpoint
3. Verifica que los eventos se estén recibiendo correctamente
4. Revisa los logs para asegurarte de que no hay errores

## 📊 Paso 5: Monitoreo y Mantenimiento

### 5.1 Monitorear pagos en Stripe

- Ve a **Payments** en el dashboard para ver todos los pagos
- Revisa **Subscriptions** para ver las suscripciones activas
- Configura alertas por email para pagos fallidos

### 5.2 Monitorear base de datos en Supabase

- Ve al dashboard de Supabase
- Revisa **Table Editor** para ver los datos
- Usa **SQL Editor** para consultas personalizadas
- Revisa **Logs** para errores de conexión

## 🚨 Solución de Problemas

### Error: "Connection timeout" con Supabase

- Verifica que la URL de conexión sea correcta
- Asegúrate de usar `pgbouncer=true` en la URL
- Verifica que tu IP esté permitida en Supabase (Settings → Database → Connection pooling)

### Error: "Invalid API key" en Stripe

- Verifica que estés usando claves de **modo Live** (no Test)
- Asegúrate de que las claves no tengan espacios extra
- Verifica que estés en el modo correcto en el dashboard de Stripe

### Error: "Webhook signature verification failed"

- Verifica que `STRIPE_WEBHOOK_SECRET` sea correcto
- Asegúrate de copiar el secret del endpoint correcto
- Verifica que la URL del webhook sea accesible públicamente

### Error: "Database connection failed"

- Verifica la contraseña en la URL de Supabase
- Asegúrate de que el proyecto de Supabase esté activo
- Verifica que no haya límites de conexión alcanzados

## ✅ Checklist Final

- [ ] Supabase configurado y conectado
- [ ] Migraciones ejecutadas en Supabase
- [ ] Stripe en modo Live
- [ ] Productos y precios creados en Stripe
- [ ] Webhooks configurados en Stripe
- [ ] Variables de entorno actualizadas
- [ ] `.env` no está en Git
- [ ] Pruebas realizadas con tarjetas de prueba
- [ ] Webhooks funcionando correctamente
- [ ] Monitoreo configurado

## 🎯 Próximos Pasos

1. **Desplegar a producción** (Vercel, Netlify, etc.)
2. **Configurar dominio personalizado**
3. **Configurar SSL/HTTPS** (automático en Vercel/Netlify)
4. **Configurar backups** de la base de datos en Supabase
5. **Configurar alertas** para pagos fallidos

---

**⚠️ RECORDATORIO IMPORTANTE:**

- Nunca uses claves de prueba en producción
- Nunca compartas tus claves secretas
- Siempre usa HTTPS en producción
- Configura backups regulares de tu base de datos
- Monitorea los pagos y suscripciones regularmente



