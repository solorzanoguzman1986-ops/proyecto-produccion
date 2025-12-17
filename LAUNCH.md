# 🚀 Guía de Lanzamiento - Pagos Reales

## ⚡ Configuración Automática Completa

El proyecto está completamente configurado para pagos reales con Supabase y Stripe LIVE.

## 📋 Comando Único de Lanzamiento

```bash
./scripts/launch-production.sh
```

Este comando:
- ✅ Verifica toda la configuración
- ✅ Valida conexión a Supabase
- ✅ Verifica claves de Stripe LIVE
- ✅ Ejecuta migraciones pendientes
- ✅ Te indica si todo está listo

## 🔧 Configuración Paso a Paso

### 1. Configuración Automática Inicial

```bash
# Ejecuta el script de configuración automática
./scripts/auto-setup.sh
```

Este script:
- Crea `.env.local` si no existe
- Instala dependencias
- Genera cliente de Prisma
- Ejecuta migraciones
- Verifica configuración

### 2. Editar Variables de Entorno

Edita `.env.local` y reemplaza los placeholders:

```env
# Supabase
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.[TU-PROJECT].supabase.co:5432/postgres?pgbouncer=true"

# Stripe LIVE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 3. Ejecutar Pruebas

```bash
# Ejecutar pruebas automatizadas
./scripts/test-payments.sh
```

### 4. Lanzar Aplicación

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run start
```

## 🎯 Flujo Completo de Pago Real

### Backend (Automático)

1. **Creación de Checkout** (`/api/stripe/create-checkout`)
   - Crea o obtiene customer en Stripe
   - Crea sesión de checkout
   - Retorna sessionId

2. **Webhooks** (`/api/stripe/webhook`)
   - `checkout.session.completed` → Actualiza suscripción
   - `customer.subscription.updated` → Sincroniza estado
   - `customer.subscription.deleted` → Cancela suscripción
   - `invoice.payment_succeeded` → Registra pago exitoso
   - `invoice.payment_failed` → Registra pago fallido

3. **Base de Datos**
   - Usuarios en tabla `User`
   - Suscripciones en tabla `Subscription`
   - Pagos en tabla `Payment`

### Frontend (Automático)

1. Usuario selecciona plan en `/dashboard/subscription`
2. Redirige a Stripe Checkout
3. Usuario completa pago
4. Redirige a `/dashboard?success=subscription-created`
5. Dashboard muestra suscripción activa

## 🔒 Seguridad Implementada

- ✅ Variables de entorno protegidas (`.gitignore`)
- ✅ Claves secretas solo en servidor
- ✅ Validación de webhooks con firma
- ✅ Autenticación con NextAuth
- ✅ Políticas de seguridad en Supabase (opcional)

## 📊 Monitoreo

### Stripe Dashboard
- Ve a https://dashboard.stripe.com
- Revisa **Payments** para ver pagos
- Revisa **Subscriptions** para ver suscripciones
- Revisa **Webhooks** para ver eventos

### Supabase Dashboard
- Ve a https://supabase.com/dashboard
- Revisa **Table Editor** para ver datos
- Revisa **Logs** para ver errores

## 🧪 Pruebas

### Prueba Manual

1. Registra usuario: `/register`
2. Inicia sesión: `/login`
3. Ve a suscripciones: `/dashboard/subscription`
4. Selecciona plan
5. Usa tarjeta real (pagos reales)

### Prueba Automatizada

```bash
./scripts/test-payments.sh
```

## ⚠️ Importante

- **Pagos Reales:** Estás en modo LIVE, las transacciones son reales
- **Webhooks:** Asegúrate de configurar la URL correcta en Stripe
- **Backups:** Configura backups regulares en Supabase
- **Monitoreo:** Revisa pagos y suscripciones regularmente

## 🆘 Solución de Problemas

### Error: "Invalid API key"
- Verifica que uses claves LIVE (pk_live_, sk_live_)
- No uses claves de Test mode

### Error: "Webhook signature verification failed"
- Verifica STRIPE_WEBHOOK_SECRET
- Asegúrate de copiar el secret correcto

### Error: "Database connection failed"
- Verifica DATABASE_URL
- Verifica que Supabase esté activo

## ✅ Checklist Final

- [ ] `.env.local` configurado con valores reales
- [ ] Supabase conectado y migraciones ejecutadas
- [ ] Stripe en modo LIVE
- [ ] Productos creados en Stripe
- [ ] Webhooks configurados
- [ ] Pruebas ejecutadas
- [ ] Aplicación funcionando

---

**¡Listo para procesar pagos reales!** 🎉

