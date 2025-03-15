'use client'

interface ButtonProps {
  onClick: () => void
  disabled?: boolean
  label: string
}

export default function Button({ onClick, disabled, label }: ButtonProps) {
  return (
    <button 
      className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
} 