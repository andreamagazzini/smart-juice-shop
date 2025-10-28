'use client'

import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import ChallengeNotification from '@/components/ChallengeNotification'
import ProductGrid from '@/components/ProductGrid'

export default function Home() {
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            🍹 Juice Shop
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            An intentionally insecure application for security training
          </p>
        </div>

        <ChallengeNotification notification={notification} onClose={() => setNotification(null)} />

        <div className="max-w-7xl mx-auto space-y-8">
          {/* Search Bar */}
          <SearchBar />
          
          {/* Products Grid */}
          <ProductGrid />
        </div>
      </div>
    </div>
  )
}
