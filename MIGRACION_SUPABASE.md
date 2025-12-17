# 🔄 Guía Rápida: Migración a Supabase y Pagos Reales

## 🎯 Resumen

Esta guía te ayudará a migrar tu base de datos a Supabase y configurar pagos reales con Stripe en menos de 30 minutos.

## ⚡ Pasos Rápidos

### 1. Configurar Supabase (10 min)

```bash
# 1. Crear cuenta en https://supabase.com
# 2. Crear nuevo proyecto
# 3. Ir a Settings → Database → Connection string
# 4. Copiar la URL de conexión
```

Actualiza `.env`:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"
```

Ejecuta migraciones:
```bash
npx prisma generate
npx prisma migrate deploy
```

### 2. Configurar Stripe Live (15 min)

1. **Activar modo Live:**
   - Ve a https://dashboard.stripe.com
   - Cambia de "Test mode" a "Live mode" (toggle en la parte superior)

2. **Obtener claves:**
   - Developers → API keys
   - Copia `Publishable key` (pk_live_...)
   - Copia `Secret key` (sk_live_...)

3. **Crear productos:**
   - Products → Add product
   - Plan Básico: $9/mes, recurrente
   - Plan Premium: $29/mes, recurrente
   - Copia los Price IDs

4. **Configurar webhook:**
   - Developers → Webhooks → Add endpoint
   - URL: `https://tu-dominio.com/api/stripe/webhook`
   - Eventos: checkout.session.completed, customer.subscription.*, invoice.payment.*
   - Copia el Signing secret

Actualiza `.env`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 3. Verificar (5 min)

```bash
# Verificar conexión a Supabase
npx prisma db pull

# Ver tablas creadas
npx prisma studio

# Probar la aplicación
npm run dev
```

## ✅ Checklist

- [ ] Proyecto creado en Supabase
- [ ] URL de conexión configurada en `.env`
- [ ] Migraciones ejecutadas
- [ ] Stripe en modo Live
- [ ] Productos creados en Stripe
- [ ] Webhooks configurados
- [ ] Variables de entorno actualizadas
- [ ] Pruebas realizadas

## 📚 Documentación Completa

- **Supabase y Producción:** [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Configuración General:** [CONFIGURACION.md](./CONFIGURACION.md)

## 🆘 Problemas Comunes

**Error de conexión a Supabase:**
- Verifica la contraseña en la URL
- Asegúrate de usar `pgbouncer=true` en la URL
- Verifica que el proyecto esté activo

**Error con Stripe:**
- Verifica que estés en modo Live (no Test)
- Asegúrate de que las claves sean correctas
- Verifica que los webhooks estén configurados

## 🚀 Desplegar a Producción

1. **Vercel/Netlify:**
   - Agrega todas las variables de `.env` en la configuración del proyecto
   - Configura `NEXTAUTH_URL` con tu dominio real

2. **Actualizar webhook de Stripe:**
   - Cambia la URL del webhook a tu dominio de producción

¡Listo! Tu aplicación está configurada para producción. 🎉



