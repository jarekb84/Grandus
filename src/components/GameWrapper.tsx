import GameCanvas from '@/components/GameCanvas'
import ManagementUI from '@/components/ManagementUI'

export default function GameWrapper() {
  return (
    <div className="flex flex-col gap-8">
      <div className="w-full aspect-[16/9] max-w-4xl mx-auto bg-slate-800 rounded-lg overflow-hidden">
        <GameCanvas />
      </div>
      <div className="max-w-4xl mx-auto w-full">
        <ManagementUI />
      </div>
    </div>
  )
} 