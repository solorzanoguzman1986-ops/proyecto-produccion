# 🚀 DEPLOY AUTOMATIZADO A PRODUCCIÓN

## ✅ Estado: LISTO PARA DEPLOY

El proyecto está completamente preparado para deploy a producción.

---

## 📋 Proceso de Deploy Automatizado

### Opción A: Deploy con Vercel CLI (Recomendado)

Si tienes Vercel CLI instalado:

```bash
# 1. Configurar variables de entorno
./scripts/configurar-variables-vercel.sh

# 2. Ejecutar deploy
./scripts/deploy-vercel.sh

# 3. Después de configurar webhook de Stripe, redeploy
./scripts/redeploy-final.sh

# 4. Verificar deploy
./scripts/verificar-produccion.sh
```

### Opción B: Deploy Manual con Vercel Dashboard

1. **Ve a:** https://vercel.com
2. **Login/Crear cuenta**
3. **Add New Project → Import Git Repository**
4. **Selecciona tu repositorio**
5. **Configura variables de entorno** (ver `variables-vercel.txt`)
6. **Deploy**
7. **Copia la URL de producción**
8. **Actualiza `NEXTAUTH_URL`** con la URL de producción
9. **Configura webhook de Stripe** (ver abajo)
10. **Actualiza `STRIPE_WEBHOOK_SECRET`**
11. **Redeploy**

---

## ⚙️ Configuración de Variables de Entorno

### Variables Requeridas

Todas estas variables deben configurarse en Vercel Dashboard o usando Vercel CLI:

1. **DATABASE_URL** - URL de conexión de Supabase
2. **NEXTAUTH_SECRET** - Clave secreta de NextAuth
3. **STRIPE_SECRET_KEY** - Clave secreta LIVE de Stripe (sk_live_...)
4. **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY** - Clave pública LIVE (pk_live_...)
5. **NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID** - Price ID del plan básico
6. **NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID** - Price ID del plan premium
7. **STRIPE_WEBHOOK_SECRET** - Secret del webhook (se actualiza después)
8. **NEXTAUTH_URL** - URL de producción (se actualiza después del deploy)

### Usando Vercel CLI

```bash
# Leer valor de .env.local y configurar
echo "valor" | vercel env add DATABASE_URL production
echo "valor" | vercel env add NEXTAUTH_SECRET production
# ... (repetir para cada variable)
```

---

## 🔗 Configuración de Webhook de Stripe

### Después del Primer Deploy

Una vez tengas la URL de producción (ej: `https://tu-proyecto.vercel.app`):

1. **Ve a:** https://dashboard.stripe.com/webhooks
2. **Edita tu webhook endpoint** o crea uno nuevo
3. **URL del webhook:** `https://tu-proyecto.vercel.app/api/stripe/webhook`
4. **Eventos a escuchar:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. **Copia el Signing Secret** (whsec_...)
6. **Actualiza en Vercel:**
   ```bash
   echo "whsec_..." | vercel env add STRIPE_WEBHOOK_SECRET production
   ```
7. **Redeploy:**
   ```bash
   vercel --prod
   ```

---

## ✅ Verificación Post-Deploy

### Verificación Automática

```bash
./scripts/verificar-produccion.sh
```

### Verificación Manual

1. **Frontend:**
   - Abre la URL de producción
   - Verifica que la página carga correctamente

2. **Registro/Login:**
   - Prueba crear una cuenta
   - Prueba iniciar sesión

3. **Pagos:**
   - Prueba el flujo de checkout
   - Usa una tarjeta de prueba de Stripe
   - Verifica que la suscripción se crea

4. **Webhooks:**
   - Ve a Stripe Dashboard → Webhooks
   - Verifica que los eventos se reciben
   - Verifica que no hay errores

5. **Base de Datos:**
   - Ve a Supabase Dashboard
   - Verifica que los datos se guardan correctamente
   - Verifica que las suscripciones se crean

---

## 📊 Monitoreo

### Dashboards

- **Vercel:** https://vercel.com/dashboard
- **Stripe:** https://dashboard.stripe.com
- **Supabase:** https://supabase.com/dashboard

### Logs

- **Vercel Logs:** Disponibles en Vercel Dashboard → Project → Logs
- **Stripe Logs:** Disponibles en Stripe Dashboard → Webhooks → [Tu webhook] → Logs
- **Supabase Logs:** Disponibles en Supabase Dashboard → Logs

---

## 🔄 Redeploy

Si necesitas hacer cambios y redeployar:

```bash
# Después de hacer cambios en el código
npm run build

# Deploy
vercel --prod
```

---

## 🆘 Solución de Problemas

### Build Falla

```bash
# Verificar errores localmente
npm run build

# Si hay errores, corregirlos antes de deployar
```

### Variables de Entorno No Funcionan

1. Verifica que las variables estén configuradas en Vercel
2. Verifica que estén marcadas como "Production"
3. Redeploy después de agregar/modificar variables

### Webhooks No Funcionan

1. Verifica que la URL del webhook sea correcta
2. Verifica que `STRIPE_WEBHOOK_SECRET` esté actualizado
3. Verifica los logs en Stripe Dashboard
4. Verifica que el endpoint `/api/stripe/webhook` esté accesible

---

## ✅ CONFIRMACIÓN FINAL

Una vez completado el deploy y las verificaciones:

**✅ DEPLOY COMPLETADO — SISTEMA OPERANDO EN PRODUCCIÓN**

- ✅ Aplicación desplegada en Vercel
- ✅ Variables de entorno configuradas
- ✅ Webhook de Stripe configurado
- ✅ Sistema verificado y funcionando

---

**El sistema está listo para recibir usuarios reales y procesar pagos reales.**

