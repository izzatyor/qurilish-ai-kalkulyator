'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth-context'

export function HistoryLink() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <Link href="/tarix" className="text-foreground/80 transition-colors hover:text-foreground">
      Mening smetalarim
    </Link>
  )
}
