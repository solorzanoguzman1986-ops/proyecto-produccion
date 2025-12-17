# MonetApp - Plataforma de Monetización

Aplicación web completa para monetizar tu negocio con sistema de suscripciones, pagos y gestión de usuarios.

## 🚀 Características

- ✅ Autenticación segura con NextAuth.js
- ✅ Sistema de suscripciones (Gratis, Básico, Premium)
- ✅ Integración con Stripe para pagos
- ✅ Dashboard de usuario completo
- ✅ Historial de pagos
- ✅ Gestión de perfil y configuración
- ✅ UI moderna y responsive con Tailwind CSS
- ✅ Base de datos PostgreSQL con Prisma

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Cuenta de Supabase (recomendado) o PostgreSQL local
- Cuenta de Stripe (para pagos)

## 🛠️ Instalación

### 1. Clonar e instalar dependencias

```bash
cd proyecto
npm install
```

### 2. Configurar Base de Datos

#### Opción A: Supabase (Recomendado para producción) 🚀

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Obtén la URL de conexión en **Settings** → **Database**
4. Actualiza `DATABASE_URL` en `.env` con la URL de Supabase
5. Ejecuta las migraciones:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

**📖 Guía completa:** Ver [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

#### Opción B: PostgreSQL Local

Crea una base de datos PostgreSQL:

```sql
CREATE DATABASE monetizacion_db;
```

### 3. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env` y completa las variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/monetizacion_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-una-clave-secreta-segura-aqui"

# Stripe - Desarrollo (Test Mode)
# Para producción, usa claves LIVE (pk_live_... y sk_live_...)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Stripe Price IDs
NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID="price_..."
```

### 4. Generar Clave Secreta de NextAuth

Puedes generar una clave secreta segura ejecutando:

```bash
openssl rand -base64 32
```

### 5. Configurar Prisma

Ejecuta las migraciones de la base de datos:

```bash
npx prisma migrate dev --name init
```

Esto creará las tablas necesarias en tu base de datos.

### 6. Generar Cliente de Prisma

```bash
npx prisma generate
```

### 7. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔧 Configuración de Stripe

### ⚠️ IMPORTANTE: Modo Test vs Producción

- **Desarrollo:** Usa claves de **Test Mode** (pk_test_... y sk_test_...)
- **Producción:** Usa claves de **Live Mode** (pk_live_... y sk_live_...)

**📖 Guía completa para producción:** Ver [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 1. Crear Productos en Stripe

1. Ve a tu [Dashboard de Stripe](https://dashboard.stripe.com/test/products) (modo Test) o [Live](https://dashboard.stripe.com/products) (modo Live)
2. Crea dos productos:
   - **Plan Básico**: $9/mes (recurrente mensual)
   - **Plan Premium**: $29/mes (recurrente mensual)
3. Copia los **Price IDs** de cada producto
4. Agrega los Price IDs a tu archivo `.env`:
   ```env
   NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID="price_..."
   NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID="price_..."
   ```

### 2. Configurar Webhooks

Para recibir eventos de Stripe (pagos, suscripciones, etc.):

1. Ve a [Webhooks en Stripe](https://dashboard.stripe.com/test/webhooks)
2. Crea un nuevo endpoint webhook
3. URL: `https://tu-dominio.com/api/stripe/webhook`
4. Eventos a escuchar:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copia el **Signing Secret** y agrégalo a `.env` como `STRIPE_WEBHOOK_SECRET`

**Para desarrollo local**, usa [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Esto te dará un webhook secret que puedes usar en desarrollo.

## 📁 Estructura del Proyecto

```
proyecto/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/              # Autenticación
│   │   ├── subscription/      # Gestión de suscripciones
│   │   ├── stripe/            # Integración con Stripe
│   │   ├── payments/          # Historial de pagos
│   │   └── user/              # Gestión de usuario
│   ├── dashboard/             # Dashboard del usuario
│   │   ├── subscription/      # Gestión de suscripciones
│   │   ├── payments/         # Historial de pagos
│   │   └── settings/         # Configuración
│   ├── login/                 # Página de login
│   ├── register/              # Página de registro
│   └── page.tsx               # Landing page
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
└── package.json
```

## 🎯 Funcionalidades

### Para Usuarios

- **Registro y Login**: Sistema de autenticación seguro
- **Dashboard**: Vista general de cuenta y suscripción
- **Gestión de Suscripciones**: Cambiar entre planes
- **Historial de Pagos**: Ver todos los pagos realizados
- **Configuración**: Actualizar perfil y contraseña

### Para Administradores

- Base de datos con todos los usuarios y suscripciones
- Webhooks de Stripe para sincronización automática
- Historial completo de pagos

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación JWT con NextAuth
- Validación de datos con Zod
- Variables de entorno para secretos
- Protección de rutas API

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Agrega las variables de entorno en la configuración
3. Vercel detectará Next.js automáticamente

### Otras Plataformas

- Asegúrate de configurar las variables de entorno
- Ejecuta `npm run build` antes del despliegue
- Configura la base de datos PostgreSQL
- Configura los webhooks de Stripe con la URL de producción

## 📝 Scripts Disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Construir para producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar linter
```

## 🐛 Solución de Problemas

### Error de conexión a la base de datos

- Verifica que PostgreSQL esté ejecutándose
- Revisa la URL de conexión en `.env`
- Asegúrate de que la base de datos exista

### Error con Stripe

- Verifica que las claves API sean correctas
- Asegúrate de usar claves de prueba en desarrollo
- Revisa que los Price IDs sean correctos

### Error de autenticación

- Verifica que `NEXTAUTH_SECRET` esté configurado
- Asegúrate de que `NEXTAUTH_URL` coincida con tu dominio

## 📚 Tecnologías Utilizadas

- **Next.js 14**: Framework React
- **TypeScript**: Tipado estático
- **Prisma**: ORM para base de datos
- **PostgreSQL**: Base de datos
- **NextAuth.js**: Autenticación
- **Stripe**: Pagos y suscripciones
- **Tailwind CSS**: Estilos
- **Zod**: Validación de datos

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📧 Soporte

Para soporte, abre un issue en el repositorio o contacta al equipo de desarrollo.

---

¡Disfruta monetizando tu aplicación! 🎉

