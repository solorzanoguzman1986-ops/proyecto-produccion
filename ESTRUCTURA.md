# Estructura del Proyecto MonetApp

Este documento describe la organización completa de carpetas y archivos del proyecto.

## 📁 Estructura de Carpetas

```
proyecto/
├── app/                          # Aplicación Next.js (App Router)
│   ├── api/                      # API Routes (Backend)
│   │   ├── auth/                 # Autenticación
│   │   │   ├── [...nextauth]/    # NextAuth handler
│   │   │   │   └── route.ts
│   │   │   └── register/         # Registro de usuarios
│   │   │       └── route.ts
│   │   ├── payments/             # Gestión de pagos
│   │   │   └── route.ts
│   │   ├── stripe/               # Integración Stripe
│   │   │   ├── create-checkout/  # Crear sesión de checkout
│   │   │   │   └── route.ts
│   │   │   └── webhook/          # Webhooks de Stripe
│   │   │       └── route.ts
│   │   ├── subscription/         # Gestión de suscripciones
│   │   │   ├── change/           # Cambiar plan
│   │   │   │   └── route.ts
│   │   │   └── route.ts          # Obtener suscripción
│   │   └── user/                 # Gestión de usuario
│   │       ├── change-password/  # Cambiar contraseña
│   │       │   └── route.ts
│   │       └── update/           # Actualizar perfil
│   │           └── route.ts
│   │
│   ├── dashboard/                 # Dashboard del usuario
│   │   ├── page.tsx              # Dashboard principal
│   │   ├── payments/             # Historial de pagos
│   │   │   └── page.tsx
│   │   ├── settings/             # Configuración
│   │   │   └── page.tsx
│   │   └── subscription/         # Gestión de suscripción
│   │       └── page.tsx
│   │
│   ├── login/                     # Página de login
│   │   └── page.tsx
│   │
│   ├── register/                  # Página de registro
│   │   └── page.tsx
│   │
│   ├── globals.css                # Estilos globales
│   ├── layout.tsx                 # Layout principal
│   ├── page.tsx                   # Landing page
│   └── providers.tsx              # Providers (NextAuth)
│
├── components/                    # Componentes reutilizables
│   ├── ui/                        # Componentes UI básicos
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   └── layout/                     # Componentes de layout
│       └── Header.tsx
│
├── lib/                           # Utilidades y librerías
│   ├── prisma.ts                  # Cliente de Prisma
│   ├── stripe.ts                  # Configuración de Stripe
│   └── utils.ts                   # Funciones utilitarias
│
├── constants/                     # Constantes de la aplicación
│   └── plans.ts                   # Planes de suscripción
│
├── types/                         # Tipos TypeScript
│   └── next-auth.d.ts            # Tipos extendidos de NextAuth
│
├── prisma/                        # Prisma ORM
│   └── schema.prisma              # Esquema de base de datos
│
├── .env.example                   # Ejemplo de variables de entorno
├── .eslintrc.json                 # Configuración ESLint
├── .gitignore                     # Archivos ignorados por Git
├── next.config.js                 # Configuración de Next.js
├── package.json                   # Dependencias del proyecto
├── postcss.config.js              # Configuración PostCSS
├── README.md                      # Documentación principal
├── tailwind.config.js             # Configuración Tailwind CSS
└── tsconfig.json                  # Configuración TypeScript
```

## 📂 Descripción de Carpetas

### `/app`
Contiene toda la aplicación Next.js usando el App Router. Cada carpeta puede ser una ruta o contener archivos especiales como `layout.tsx`, `page.tsx`, etc.

### `/app/api`
API Routes de Next.js. Cada subcarpeta representa un endpoint. Los archivos `route.ts` definen los handlers HTTP (GET, POST, PUT, DELETE).

### `/app/dashboard`
Área protegida del usuario autenticado. Contiene todas las páginas del dashboard.

### `/components`
Componentes React reutilizables organizados por categoría:
- `ui/`: Componentes básicos de UI (botones, cards, etc.)
- `layout/`: Componentes de layout (headers, footers, etc.)

### `/lib`
Utilidades y configuraciones compartidas:
- `prisma.ts`: Instancia singleton de Prisma Client
- `stripe.ts`: Configuración y utilidades de Stripe
- `utils.ts`: Funciones helper generales

### `/constants`
Constantes de la aplicación que se usan en múltiples lugares.

### `/types`
Definiciones de tipos TypeScript, especialmente extensiones de tipos de librerías externas.

### `/prisma`
Configuración y esquema de Prisma ORM para la base de datos.

## 🔄 Flujo de Datos

1. **Frontend** (`/app/dashboard`, `/app/login`, etc.)
   - Componentes React que renderizan la UI
   - Llaman a API Routes para obtener datos

2. **API Routes** (`/app/api`)
   - Reciben requests HTTP
   - Validan autenticación
   - Interactúan con la base de datos (Prisma)
   - Interactúan con servicios externos (Stripe)
   - Retornan respuestas JSON

3. **Base de Datos** (PostgreSQL)
   - Gestionada por Prisma
   - Esquema definido en `/prisma/schema.prisma`

4. **Servicios Externos**
   - **Stripe**: Pagos y suscripciones
   - **NextAuth**: Autenticación

## 🎯 Convenciones

- **Rutas**: Usar kebab-case para nombres de carpetas
- **Componentes**: Usar PascalCase para nombres de archivos
- **Utilidades**: Usar camelCase para nombres de funciones
- **Constantes**: Usar UPPER_SNAKE_CASE para constantes
- **API Routes**: Usar `route.ts` como nombre de archivo

## 📝 Notas Importantes

- Los archivos `page.tsx` son las páginas visibles en el navegador
- Los archivos `layout.tsx` definen layouts compartidos
- Los archivos `route.ts` en `/app/api` son endpoints API
- Prisma Client se instancia una vez en `/lib/prisma.ts` para evitar múltiples conexiones
- Los tipos de NextAuth se extienden en `/types/next-auth.d.ts`




