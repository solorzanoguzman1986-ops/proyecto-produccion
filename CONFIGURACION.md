# 🚀 Guía de Configuración Rápida

## ✅ Cambios Realizados

1. **Archivo `.env` creado** con valores por defecto
2. **Endpoint de suscripción corregido** - Ahora retorna `null` en lugar de error 404
3. **Dashboard mejorado** - Maneja correctamente cuando no hay suscripción

## 📋 Pasos para Iniciar el Proyecto

### Opción 1: SQLite (Desarrollo Rápido) ⚡

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar SQLite:**
   - Edita `prisma/schema.prisma` y cambia:
   ```prisma
   datasource db {
     provider = "sqlite"  // Cambia de "postgresql" a "sqlite"
     url      = "file:./dev.db"  // Cambia esta línea
   }
   ```

3. **Actualizar .env:**
   - Edita `.env` y cambia:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

4. **Ejecutar migraciones:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. **Iniciar el servidor:**
```bash
npm run dev
```

6. **Abrir en el navegador:**
```
http://localhost:3000
```

### Opción 2: PostgreSQL (Producción) 🐘

1. **Instalar dependencias:**
```bash
npm install
```

2. **Crear base de datos PostgreSQL:**
```sql
CREATE DATABASE monetizacion_db;
```

3. **Configurar .env:**
   - Edita `.env` y actualiza:
   ```env
   DATABASE_URL="postgresql://usuario:password@localhost:5432/monetizacion_db?schema=public"
   ```

4. **Ejecutar migraciones:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. **Iniciar el servidor:**
```bash
npm run dev
```

## 🔑 Variables de Entorno Importantes

### Ya Configuradas:
- ✅ `NEXTAUTH_SECRET` - Clave secreta generada automáticamente
- ✅ `NEXTAUTH_URL` - URL local por defecto

### Opcionales (para pagos con Stripe):
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Obtener en [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
- `STRIPE_SECRET_KEY` - Obtener en [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
- `NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID` - ID del precio del plan básico
- `NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID` - ID del precio del plan premium

**Nota:** Puedes usar la aplicación sin Stripe para probar registro, login y dashboard.

## 🧪 Probar la Aplicación

1. **Registrar un usuario:**
   - Ve a `http://localhost:3000/register`
   - Completa el formulario
   - Se creará automáticamente con plan "Gratis"

2. **Iniciar sesión:**
   - Ve a `http://localhost:3000/login`
   - Usa las credenciales que acabas de crear

3. **Ver el dashboard:**
   - Después de iniciar sesión, serás redirigido al dashboard
   - Verás tu información y plan actual

## 🔧 Solución de Problemas

### Error: "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### Error: "Database connection failed"
- Verifica que PostgreSQL esté ejecutándose (si usas PostgreSQL)
- Verifica la URL en `.env`
- Para SQLite, asegúrate de que el archivo `dev.db` tenga permisos de escritura

### Error: "NEXTAUTH_SECRET is not set"
- Verifica que el archivo `.env` exista
- Verifica que `NEXTAUTH_SECRET` tenga un valor

### Error al iniciar sesión
- Verifica que la base de datos esté configurada
- Verifica que las migraciones se hayan ejecutado: `npx prisma migrate status`

## 📊 Ver la Base de Datos

### Con Prisma Studio (Recomendado):
```bash
npx prisma studio
```
Se abrirá en `http://localhost:5555`

### Con SQLite directamente:
```bash
sqlite3 prisma/dev.db
```

## 🎯 Próximos Pasos

1. ✅ Proyecto configurado y funcionando
2. ⏭️ Configurar Stripe (opcional) para habilitar pagos
3. ⏭️ Personalizar el diseño y contenido
4. ⏭️ Agregar más funcionalidades según necesites

## 📝 Notas

- El archivo `.env` ya está creado con valores por defecto
- La clave secreta de NextAuth ya está generada
- El endpoint de suscripción ahora maneja correctamente usuarios sin suscripción
- Puedes empezar a usar la aplicación inmediatamente después de configurar la base de datos




