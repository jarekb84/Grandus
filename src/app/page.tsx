'use client'

import GameWrapper from '@/components/game/GameWrapper/GameWrapper'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function Home() {
  usePageTitle('Grandus - An Incremental Game')

  return (
    <main className="min-h-screen p-8 bg-slate-900 text-white">
      <GameWrapper />
    </main>
  )
}
