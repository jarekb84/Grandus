'use client'

import React, { JSX } from 'react';
import GameWrapper from '@/features/core/GameWrapper'
import { usePageTitle } from '@/features/shared/hooks/usePageTitle'

function Home(): JSX.Element {
  usePageTitle('Grandus - An Incremental Game')

  return (
    <main className="min-h-screen p-8 bg-slate-900 text-white">
      <GameWrapper />
    </main>
  );
}

export default Home;
