'use client'

interface ToastProps {
  message: string
  explanation?: string
  show: boolean
  onClose: () => void
}

export default function Toast({ message, explanation, show, onClose }: ToastProps) {
  if (!show) return null

  return (
    <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-top-5">
      <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-start gap-3 min-w-[350px] max-w-[600px]">
        <span className="text-2xl flex-shrink-0">🎉</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base mb-1">Challenge Completed!</p>
          <p className="text-sm text-green-100 font-semibold mb-2">{message}</p>
          {explanation && (
            <p className="text-xs text-green-50 leading-relaxed border-t border-green-500 pt-2 mt-2">
              {explanation}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-green-200 text-2xl font-bold leading-none flex-shrink-0"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  )
}
