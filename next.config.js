/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Evitar que Prisma intente conectarse durante el build
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
  // No intentar pre-renderizar rutas API
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig

