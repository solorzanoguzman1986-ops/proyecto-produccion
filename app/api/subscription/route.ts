export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    // Retornar null si no hay suscripción en lugar de error 404
    // Esto permite que el frontend maneje el caso correctamente
    return NextResponse.json(subscription || null)
  } catch (error) {
    console.error('Error al obtener suscripción:', error)
    return NextResponse.json(
      { error: 'Error al obtener suscripción' },
      { status: 500 }
    )
  }
}

