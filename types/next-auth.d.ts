import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      subscription?: {
        id: string
        plan: string
        status: string
        currentPeriodEnd: Date | null
        cancelAtPeriodEnd: boolean
      } | null
    }
  }

  interface User {
    id: string
    subscription?: {
      id: string
      plan: string
      status: string
      currentPeriodEnd: Date | null
      cancelAtPeriodEnd: boolean
    } | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    subscription?: {
      id: string
      plan: string
      status: string
      currentPeriodEnd: Date | null
      cancelAtPeriodEnd: boolean
    } | null
  }
}

