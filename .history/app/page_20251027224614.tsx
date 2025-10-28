'use client'

import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import ChallengeNotification from '@/components/ChallengeNotification'

export default function Home() {
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center mb-2 text-gray-800">
          💧 Next.js Juice Shop
        </h1>
        <p className="text-center text-gray-600 mb-8">
          An intentionally insecure application for security training
        </p>

        <ChallengeNotification notification={notification} onClose={() => setNotification(null)} />

        <div className="max-w-4xl mx-auto">
          <SearchBar />
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Getting Started</h2>
            <div className="space-y-4 text-gray-700">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-lg">1. Login Challenges</h3>
                <p>Try logging in or use SQL injection to bypass authentication!</p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg">2. Search Injection</h3>
                <p>Search for products and try SQL injection techniques</p>
              </div>
              
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-lg">3. View Scoreboard</h3>
                <p>Navigate to the scoreboard to track your progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
