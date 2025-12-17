# 🚀 Deploy a Producción - Vercel Dashboard

## 📋 Pasos para Deploy Manual (Recomendado)

### Paso 1: Preparar el Proyecto

El proyecto ya está preparado con:
- ✅ `vercel.json` configurado
- ✅ Build de producción verificado
- ✅ URLs dinámicas (sin localhost hardcodeado)

### Paso 2: Crear Cuenta/Login en Vercel

1. Ve a https://vercel.com
2. Inicia sesión o crea una cuenta
3. Conecta tu repositorio de Git (opcional) o importa el proyecto

### Paso 3: Importar Proyecto

1. En el dashboard de Vercel, click en **"Add New Project"**
2. Selecciona **"Import Git Repository"** o **"Upload"**
3. Si usas Git, conecta tu repositorio
4. Si no, sube los archivos del proyecto

### Paso 4: Configurar Variables de Entorno

En la configuración del proyecto, ve a **Settings → Environment Variables** y agrega:

```
DATABASE_URL = [tu URL de Supabase]
NEXTAUTH_URL = [se configurará después del deploy]
NEXTAUTH_SECRET = [tu secret de NextAuth]
STRIPE_SECRET_KEY = [tu clave LIVE de Stripe]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = [tu clave pública LIVE]
NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID = [price ID del plan básico]
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID = [price ID del plan premium]
STRIPE_WEBHOOK_SECRET = [se configurará después]
```

**⚠️ IMPORTANTE:**
- Marca todas como **Production**
- Usa valores de **LIVE** (no TEST) para Stripe
- `NEXTAUTH_URL` se actualizará después con la URL de producción

### Paso 5: Deploy

1. Click en **"Deploy"**
2. Espera a que se complete el build
3. Copia la URL de producción (ej: `https://tu-proyecto.vercel.app`)

### Paso 6: Actualizar NEXTAUTH_URL

1. Ve a **Settings → Environment Variables**
2. Edita `NEXTAUTH_URL`
3. Cambia el valor a tu URL de producción: `https://tu-proyecto.vercel.app`
4. Guarda y redeploya

### Paso 7: Configurar Webhook de Stripe

1. Ve a https://dashboard.stripe.com/webhooks
2. Edita tu webhook endpoint
3. Actualiza la URL a: `https://tu-proyecto.vercel.app/api/stripe/webhook`
4. Copia el nuevo **Signing Secret**
5. En Vercel, actualiza `STRIPE_WEBHOOK_SECRET` con el nuevo secret
6. Redeploya

### Paso 8: Verificar Deploy

Ejecuta las verificaciones:
```bash
./verificar-deploy.sh
```

O manualmente:
- Abre la URL de producción
- Prueba registro de usuario
- Prueba login
- Prueba checkout de Stripe
- Verifica en Stripe Dashboard
- Verifica en Supabase Dashboard

---

## ✅ Checklist Final

- [ ] Proyecto desplegado en Vercel
- [ ] Variables de entorno configuradas
- [ ] NEXTAUTH_URL actualizado con URL de producción
- [ ] Webhook de Stripe configurado
- [ ] STRIPE_WEBHOOK_SECRET actualizado
- [ ] Aplicación carga correctamente
- [ ] Registro de usuarios funciona
- [ ] Pagos funcionan
- [ ] Webhooks funcionan
- [ ] Datos se guardan en Supabase

---

## 📊 URLs Importantes

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Supabase Dashboard:** https://supabase.com/dashboard

---

**Una vez completado, el sistema estará LISTO PARA USUARIOS REALES**


