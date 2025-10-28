'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  show: boolean
  onClose: () => void
}

export default function Toast({ message, show, onClose }: ToastProps) {
  if (!show) return null

  return (
    <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-top-5">
      <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-[500px]">
        <span className="text-2xl">🎉</span>
        <div className="flex-1">
          <p className="font-semibold">Challenge Completed!</p>
          <p className="text-sm text-green-100">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-green-200 text-2xl font-bold leading-none ml-2"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  )
}
