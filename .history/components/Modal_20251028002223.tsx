'use client'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  type?: 'alert' | 'confirm' | 'info'
}

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  type = 'alert'
}: ModalProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    if (type === 'alert') {
      onClose()
    } else {
      onClose()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 transform transition-all">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className={`flex gap-3 ${type === 'confirm' ? 'justify-between' : 'justify-end'}`}>
          {type === 'confirm' && (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition"
            >
              {cancelLabel}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              type === 'confirm' || title.includes('⚠️')
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
