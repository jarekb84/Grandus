'use client'

import GameWrapper from '@/features/core/GameWrapper'
import { usePageTitle } from '@/features/shared/hooks/usePageTitle'

export default function Home() {
  usePageTitle('Grandus - An Incremental Game')

  return (
    <main className="min-h-screen p-8 bg-slate-900 text-white">
      <GameWrapper />
    </main>
  )
}
