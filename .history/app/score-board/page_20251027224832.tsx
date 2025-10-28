'use client'

import { useEffect, useState } from 'react'
import AdminPanel from '@/components/AdminPanel'

interface LeaderboardEntry {
  email: string
  score: number
  challenges: number
}

export default function ScoreBoard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/challenges/leaderboard')
      const data = await response.json()
      setLeaderboard(data)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center mb-8 text-gray-800">
          🏆 Score Board
        </h1>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Rank</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Challenges</th>
                    <th className="px-6 py-4 text-left">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaderboard.map((entry, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4">{entry.email}</td>
                      <td className="px-6 py-4">{entry.challenges}</td>
                      <td className="px-6 py-4 font-semibold text-green-600">
                        {entry.score} ⭐
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-xl p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Available Challenges</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Broken Authentication</h3>
                  <p className="text-sm text-gray-700">Login Admin, Weak Passwords</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-gray-800">SQL Injection</h3>
                  <p className="text-sm text-gray-700">Login, Search</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-800">XSS</h3>
                  <p className="text-sm text-gray-700">Reflected, Stored</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Broken Access Control</h3>
                  <p className="text-sm text-gray-700">Admin Section, Bypass Paywall</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <AdminPanel />
    </div>
  )
}
