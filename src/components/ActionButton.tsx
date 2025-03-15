'use client'

interface ActionButtonProps {
  onClick: () => void
  disabled?: boolean
}

export default function ActionButton({ onClick, disabled }: ActionButtonProps) {
  return (
    <button 
      className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
    >
      Gather Stone
    </button>
  )
} 