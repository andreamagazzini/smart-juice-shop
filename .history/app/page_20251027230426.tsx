'use client'

import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import ChallengeNotification from '@/components/ChallengeNotification'

export default function Home() {
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            🍹 Next.js Juice Shop
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            An intentionally insecure application for security training
          </p>
        </div>

        <ChallengeNotification notification={notification} onClose={() => setNotification(null)} />

        <div className="max-w-4xl mx-auto">
          <SearchBar />
        </div>

        <div className="mt-12 max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-3">🔓</div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">Login Challenges</h3>
            <p className="text-gray-600 text-sm">Try logging in or bypass authentication with injection attacks</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">Search Injection</h3>
            <p className="text-gray-600 text-sm">Search products and exploit search vulnerabilities</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">View Scoreboard</h3>
            <p className="text-gray-600 text-sm">Track your progress on completed challenges</p>
          </div>
        </div>
      </div>
    </div>
  )
}
