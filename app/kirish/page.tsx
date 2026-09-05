'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ruler } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { DimensionDivider } from '@/components/dimension-divider'

type Mode = 'kirish' | 'royxat'

export default function KirishPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('kirish')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)

    if (mode === 'kirish') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (error) {
        setError(
          error.message === 'Invalid login credentials'
            ? 'Email yoki parol noto‘g‘ri.'
            : error.message,
        )
        return
      }
      router.push('/')
      router.refresh()
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      setLoading(false)
      if (error) {
        setError(error.message === 'User already registered' ? 'Bu email allaqachon ro‘yxatdan o‘tgan.' : error.message)
        return
      }
      setInfo('Ro‘yxatdan o‘tdingiz! Emailingizni tasdiqlab, so‘ng kiring.')
      setMode('kirish')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">
      <Link href="/" className="mb-10 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center border border-foreground text-wood">
          <Ruler className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="font-heading text-base font-semibold tracking-tight">Smeta AI</span>
      </Link>

      <div className="w-full max-w-sm border border-foreground">
        <div className="grid grid-cols-2 border-b border-foreground">
          <button
            type="button"
            onClick={() => {
              setMode('kirish')
              setError(null)
              setInfo(null)
            }}
            className={`py-3 font-heading text-sm font-medium transition-colors ${
              mode === 'kirish' ? 'bg-foreground text-primary-foreground' : 'hover:bg-secondary'
            }`}
          >
            Kirish
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('royxat')
              setError(null)
              setInfo(null)
            }}
            className={`border-l border-foreground py-3 font-heading text-sm font-medium transition-colors ${
              mode === 'royxat' ? 'bg-foreground text-primary-foreground' : 'hover:bg-secondary'
            }`}
          >
            Ro‘yxatdan o‘tish
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-b-2 border-foreground bg-transparent py-1.5 outline-none focus:border-accent"
              placeholder="siz@misol.uz"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm">
              Parol
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'kirish' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-b-2 border-foreground bg-transparent py-1.5 outline-none focus:border-accent"
              placeholder="Kamida 6 belgi"
            />
          </div>

          {error && (
            <p className="border border-accent bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>
          )}
          {info && (
            <p className="border border-foreground bg-secondary px-3 py-2 text-sm text-foreground">{info}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex h-11 items-center justify-center bg-accent px-6 font-heading text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#d4551f] disabled:opacity-60"
          >
            {loading ? 'Yuborilmoqda…' : mode === 'kirish' ? 'Kirish' : 'Ro‘yxatdan o‘tish'}
          </button>
        </form>
      </div>

      <div className="mt-10 w-full max-w-sm">
        <DimensionDivider label="Xavfsiz kirish" note="Supabase Auth" />
      </div>
    </main>
  )
}
