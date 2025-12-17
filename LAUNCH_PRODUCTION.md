# 🚀 Lanzar Pagos Reales - Guía Final

## ⚡ Comando Único para Lanzar

```bash
npm run launch:production
```

O ejecuta manualmente:

```bash
./scripts/setup-production.sh && npm run dev
```

## 📋 Checklist Pre-Lanzamiento

### ✅ 1. Configurar Supabase

- [ ] Crear proyecto en https://supabase.com
- [ ] Obtener URL de conexión (Settings → Database)
- [ ] Actualizar `DATABASE_URL` en `.env.local`

### ✅ 2. Configurar Stripe LIVE

- [ ] Activar modo Live en https://dashboard.stripe.com
- [ ] Obtener claves API (pk_live_... y sk_live_...)
- [ ] Crear productos (Plan Básico $9/mes, Premium $29/mes)
- [ ] Configurar webhook: `https://tu-dominio.com/api/stripe/webhook`
- [ ] Actualizar todas las variables en `.env.local`

### ✅ 3. Validar Configuración

```bash
# Validar variables de entorno
node scripts/validate-config.js

# Probar conexiones
node scripts/test-payments.js
```

### ✅ 4. Ejecutar Migraciones

```bash
npx prisma generate
npx prisma migrate deploy
```

### ✅ 5. Verificar Webhooks

1. Ve a Stripe Dashboard → Webhooks
2. Verifica que el endpoint esté activo
3. Prueba enviando un evento de prueba

## 🎯 Comando Final para Lanzar

```bash
# Opción 1: Script automatizado
./scripts/setup-production.sh

# Opción 2: Manual paso a paso
npm install
npx prisma generate
npx prisma migrate deploy
node scripts/validate-config.js
node scripts/test-payments.js
npm run dev
```

## 🔒 Seguridad Final

- ✅ `.env.local` está en `.gitignore`
- ✅ Claves LIVE solo en producción
- ✅ Webhooks con HTTPS
- ✅ Validación de firmas de webhook activa

## 📊 Monitoreo Post-Lanzamiento

1. **Stripe Dashboard:**
   - Monitorea pagos en tiempo real
   - Revisa webhooks recibidos
   - Verifica suscripciones activas

2. **Supabase Dashboard:**
   - Revisa logs de base de datos
   - Monitorea uso de recursos
   - Verifica backups automáticos

3. **Aplicación:**
   - Revisa logs del servidor
   - Monitorea errores en consola
   - Verifica que los webhooks se procesen

## 🆘 Solución de Problemas

### Error: "Invalid API key"
- Verifica que uses claves LIVE (no TEST)
- Asegúrate de que no haya espacios en las claves

### Error: "Webhook signature verification failed"
- Verifica STRIPE_WEBHOOK_SECRET
- Asegúrate de copiar el secret correcto del endpoint

### Error: "Database connection failed"
- Verifica DATABASE_URL de Supabase
- Asegúrate de usar `pgbouncer=true` en la URL

## ✅ Listo para Producción

Una vez completados todos los pasos:

1. ✅ Base de datos conectada a Supabase
2. ✅ Stripe configurado en modo LIVE
3. ✅ Webhooks configurados y funcionando
4. ✅ Validaciones pasadas
5. ✅ Migraciones ejecutadas

**🚀 Tu aplicación está lista para procesar pagos reales!**

---

**Comando final:**
```bash
npm run launch:production
```



