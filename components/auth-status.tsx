'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth-context'

export function AuthStatus() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return <span className="h-8 w-20 animate-pulse border border-border" aria-hidden="true" />
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
        <button
          onClick={() => signOut()}
          className="border border-foreground px-4 py-1.5 font-heading text-sm font-medium transition-colors hover:bg-foreground hover:text-primary-foreground"
        >
          Chiqish
        </button>
      </div>
    )
  }

  return (
    <Link
      href="/kirish"
      className="border border-foreground px-4 py-1.5 font-heading text-sm font-medium transition-colors hover:bg-foreground hover:text-primary-foreground"
    >
      Kirish
    </Link>
  )
}
