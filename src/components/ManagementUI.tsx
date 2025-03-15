'use client'

export default function ManagementUI() {
  return (
    <div className="flex gap-4">
      <button 
        className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
        onClick={() => {
          // Placeholder for future functionality
          console.log('Button clicked!')
        }}
      >
        Action Button
      </button>
    </div>
  )
} 