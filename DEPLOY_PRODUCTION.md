# 🚀 Guía de Deploy a Producción - Vercel

## 📋 Pasos para Desplegar

### 1. Instalar Vercel CLI (si no está instalado)

```bash
npm i -g vercel
```

### 2. Login en Vercel

```bash
vercel login
```

### 3. Configurar Variables de Entorno

Desde el dashboard de Vercel o usando CLI:

```bash
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add STRIPE_SECRET_KEY production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID production
vercel env add NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID production
vercel env add STRIPE_WEBHOOK_SECRET production
```

### 4. Desplegar

```bash
vercel --prod
```

### 5. Configurar Webhooks de Stripe

Una vez tengas la URL de producción:
1. Ve a Stripe Dashboard → Webhooks
2. Actualiza la URL del webhook a: `https://tu-dominio.vercel.app/api/stripe/webhook`
3. Copia el nuevo webhook secret
4. Actualiza `STRIPE_WEBHOOK_SECRET` en Vercel

### 6. Actualizar NEXTAUTH_URL

En Vercel, actualiza `NEXTAUTH_URL` con tu dominio de producción.

---

## ✅ Checklist Post-Deploy

- [ ] Aplicación carga correctamente
- [ ] Registro de usuarios funciona
- [ ] Login funciona
- [ ] Checkout de Stripe funciona
- [ ] Webhooks de Stripe funcionan
- [ ] Datos se guardan en Supabase
- [ ] Suscripciones se crean correctamente

---

## 📊 Monitoreo

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Supabase Dashboard:** https://supabase.com/dashboard


