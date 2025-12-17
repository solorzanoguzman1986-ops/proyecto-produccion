# 🎯 COMANDO FINAL PARA LANZAR PAGOS REALES

## ⚡ Comando Único

```bash
npm run launch:production
```

## 📋 O Pasos Manuales

### 1. Primera vez (solo una vez)

```bash
# Instalar dependencias
npm install

# Crear .env.local (si no existe)
cp .env.production.example .env.local

# Editar .env.local con tus valores reales
# - DATABASE_URL de Supabase
# - Claves de Stripe LIVE
# - Price IDs de Stripe
```

### 2. Configurar y Lanzar

```bash
# Opción A: Automático (recomendado)
npm run setup:production

# Opción B: Manual
npx prisma generate
npx prisma migrate deploy
npm run validate
npm run test:payments
npm run dev
```

## ✅ Validaciones Incluidas

El script `setup:production` automáticamente:

1. ✅ Verifica que `.env.local` exista
2. ✅ Valida todas las variables de entorno
3. ✅ Verifica conexión a Supabase
4. ✅ Ejecuta migraciones de base de datos
5. ✅ Valida configuración de Stripe
6. ✅ Verifica que esté en modo LIVE

## 🔍 Verificar Antes de Lanzar

```bash
# Validar configuración
npm run validate

# Probar conexiones
npm run test:payments

# Ver base de datos
npm run db:studio
```

## 🚀 Lanzar

```bash
npm run launch:production
```

O simplemente:

```bash
npm run dev
```

## 📊 Monitoreo

Una vez lanzado, monitorea:

1. **Stripe Dashboard:** Pagos y webhooks
2. **Supabase Dashboard:** Base de datos y logs
3. **Consola del servidor:** Errores y logs

---

**🎉 ¡Listo para procesar pagos reales!**
