# ⚡ Inicio Rápido - Supabase + Pagos Reales

## 🎯 Configuración en 3 Pasos

### Paso 1: Supabase (5 minutos)

1. **Crear proyecto en Supabase:**
   - Ve a https://supabase.com
   - Crea cuenta → Nuevo proyecto
   - Anota el nombre y región

2. **Obtener URL de conexión:**
   - Settings → Database → Connection string
   - Selecciona "URI" y copia

3. **Actualizar `.env`:**
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"
   ```

4. **Ejecutar migraciones:**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

✅ **Verificar:** `npx prisma studio` (debe abrir el navegador)

---

### Paso 2: Stripe Live (10 minutos)

1. **Activar modo Live:**
   - https://dashboard.stripe.com
   - Toggle "Test mode" → "Live mode" (arriba a la derecha)

2. **Obtener claves:**
   - Developers → API keys
   - Copia `Publishable key` (pk_live_...)
   - Copia `Secret key` (sk_live_...)

3. **Crear productos:**
   - Products → Add product
   - **Plan Básico:** $9.00 USD, Recurring (Monthly)
   - **Plan Premium:** $29.00 USD, Recurring (Monthly)
   - Copia los **Price IDs** (price_...)

4. **Configurar webhook:**
   - Developers → Webhooks → Add endpoint
   - URL: `https://tu-dominio.com/api/stripe/webhook`
   - Eventos:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copia el **Signing secret** (whsec_...)

5. **Actualizar `.env`:**
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
   STRIPE_SECRET_KEY="sk_live_..."
   NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID="price_..."
   NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID="price_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

---

### Paso 3: Verificar (2 minutos)

```bash
# Verificar conexión
npx prisma db pull

# Iniciar aplicación
npm run dev
```

Abre: http://localhost:3000

---

## 📋 Checklist Final

- [ ] Supabase configurado
- [ ] Migraciones ejecutadas
- [ ] Stripe en modo Live
- [ ] Productos creados
- [ ] Webhooks configurados
- [ ] Variables de entorno actualizadas
- [ ] Aplicación funcionando

---

## 🆘 Problemas Comunes

**Error: "Connection timeout"**
- Verifica la contraseña en DATABASE_URL
- Usa `pgbouncer=true` en la URL

**Error: "Invalid API key"**
- Verifica que uses claves LIVE (pk_live_, sk_live_)
- No uses claves de Test mode

**Error: "Webhook failed"**
- Verifica que la URL del webhook sea accesible
- Asegúrate de copiar el secret correcto

---

## 📚 Documentación Completa

- **Guía detallada:** [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Migración rápida:** [MIGRACION_SUPABASE.md](./MIGRACION_SUPABASE.md)

---

¡Listo para producción! 🚀



