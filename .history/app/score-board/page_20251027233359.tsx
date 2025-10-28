'use client'

import { useEffect, useState } from 'react'
import { getAllProducts, getDB, getCompletedChallenges } from '@/lib/browser-db'
import AdminPanel from '@/components/AdminPanel'

interface Challenge {
  key: string
  name: string
  category: string
  difficulty: number
  description: string
  solved: boolean
}

export default function ScoreBoard() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [completedKeys, setCompletedKeys] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedHint, setExpandedHint] = useState<string | null>(null)

  useEffect(() => {
    loadChallenges()
  }, [])

  const loadChallenges = async () => {
    try {
      const db = await getDB()
      const allChallenges = await db.getAll('challenges')
      setChallenges(allChallenges)
      
      // Get current user's completed challenges (simplified - using userId 1)
      const completed = await getCompletedChallenges(1)
      setCompletedKeys(completed.map(c => c.challengeId))
    } catch (error) {
      console.error('Error loading challenges:', error)
    } finally {
      setLoading(false)
    }
  }

  const isCompleted = (key: string) => completedKeys.includes(key)

  const getDifficultyColor = (difficulty: number) => {
    switch(difficulty) {
      case 1: return 'text-green-600 bg-green-50'
      case 2: return 'text-blue-600 bg-blue-50'
      case 3: return 'text-yellow-600 bg-yellow-50'
      case 4: return 'text-orange-600 bg-orange-50'
      case 5: return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ['', 'Easy', 'Medium', 'Hard', 'Very Hard', 'Expert']
    return labels[difficulty] || difficulty
  }

  // Group challenges by category
  const challengesByCategory = challenges.reduce((acc, challenge) => {
    if (!acc[challenge.category]) {
      acc[challenge.category] = []
    }
    acc[challenge.category].push(challenge)
    return acc
  }, {} as Record<string, Challenge[]>)

  const completedCount = completedKeys.length
  const totalCount = challenges.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
            🎯 Vulnerability Checklist
          </h1>
          <div className="mt-4">
            <div className="max-w-2xl mx-auto bg-white rounded-full p-1 shadow-lg">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full py-2" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-lg text-gray-700 mt-2 font-semibold">
              {completedCount} / {totalCount} completed ({progress}%)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6">
            {Object.entries(challengesByCategory).map(([category, categoryChallenges]) => (
              <div key={category} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                  {category}
                </h2>
                <div className="space-y-3">
                  {categoryChallenges.map((challenge) => {
                    const completed = isCompleted(challenge.key)
                    return (
                      <div
                        key={challenge.key}
                        className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                          completed
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          completed ? 'border-green-500 bg-green-500' : 'border-gray-400'
                        }`}>
                          {completed && <span className="text-white text-sm">✓</span>}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className={`font-semibold text-lg ${completed ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                                {challenge.name}
                              </h3>
                              <p className="text-gray-600 text-sm mt-1">{challenge.description}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(challenge.difficulty)}`}>
                              {getDifficultyLabel(challenge.difficulty)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <AdminPanel />
    </div>
  )
}
