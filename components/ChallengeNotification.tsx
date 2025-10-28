'use client'

interface Props {
  notification: { message: string; type: 'success' | 'error' } | null
  onClose: () => void
}

export default function ChallengeNotification({ notification, onClose }: Props) {
  if (!notification) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${
        notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4`}>
        <p>{notification.message}</p>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          ✕
        </button>
      </div>
    </div>
  )
}
