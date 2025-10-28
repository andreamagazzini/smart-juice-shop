'use client'

import { useEffect, useState } from 'react'
import { getAllProducts, getDB, getCompletedChallenges, resetDatabase, exportData, importData } from '@/lib/browser-db'

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
  const [showImport, setShowImport] = useState(false)

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

  const handleReset = async () => {
    if (confirm('⚠️ Are you sure you want to reset all data? This cannot be undone!')) {
      await resetDatabase()
    }
  }

  const handleExport = async () => {
    const data = await exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    // Trigger download
    const a = document.createElement('a')
    a.href = url
    a.download = `juice-shop-data-${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const data = JSON.parse(text)
    
    if (confirm('Replace current data with imported data?')) {
      await importData(data)
      alert('Data imported successfully!')
      window.location.reload()
    }
  }

  const getChallengeHints = (key: string) => {
    const hints: Record<string, string[]> = {
      'loginAdmin': [
        'Try logging in with: admin@juice-shop.com / admin123',
        'Or use SQL injection bypass with special characters in email field'
      ],
      'sessionHijacking': [
        'Go to /admin page and click Users tab',
        'Copy the session token from another user',
        'Replace your session cookie in DevTools (Application → Cookies)',
        'Refresh the page - you should now be logged in as that user!'
      ],
      'sqlInjectionLogin': [
        'In the email field, try: " OR "',
        'Email: test OR true',
        'Password: anything',
        'The app checks if email contains boolean operators'
      ],
      'sqlInjectionSearch': [
        'In the search bar, try special characters: ! or @ or #',
        'Or try: OR or AND (logic operators)',
        'Or search for: "all" or "everything"',
        'Any of these will bypass the search filter!'
      ],
      'reflectedXss': [
        'Use the search function and enter HTML/JavaScript',
        'Try: <script>alert("XSS")</script>',
        'Or: <iframe src="javascript:alert(1)">'
      ],
      'persistedXssFeedback': [
        'Find a feedback or comment section',
        'Enter malicious script that will be stored',
        'Other users will see your script when they load the page'
      ],
      'accessAdminSection': [
        'Try accessing /admin directly in the URL (navigate to: http://localhost:3000/admin)',
        'No authentication required - just go to the URL!',
        'This demonstrates broken access control vulnerability'
      ],
      'negativeOrder': [
        'Add items to cart',
        'In DevTools, try modifying the quantity to negative',
        'Or change the price calculation to be negative'
      ],
      'bypassPaywall': [
        'Some features require premium membership',
        'Try bypassing the check in browser DevTools',
        'Or find a way to get admin privileges'
      ]
    }
    return hints[key] || ['Keep exploring!']
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
                    const isExpanded = expandedHint === challenge.key
                    const hints = getChallengeHints(challenge.key)
                    
                    return (
                      <div
                        key={challenge.key}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          completed
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
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
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(challenge.difficulty)}`}>
                                  {getDifficultyLabel(challenge.difficulty)}
                                </span>
                                <button
                                  onClick={() => setExpandedHint(isExpanded ? null : challenge.key)}
                                  className="px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                  {isExpanded ? 'Hide Hint' : '💡 Hint'}
                                </button>
                              </div>
                            </div>
                            
                            {isExpanded && (
                              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <h4 className="font-semibold text-yellow-800 mb-2">📚 How to Complete:</h4>
                                <ul className="space-y-2 text-sm text-yellow-700">
                                  {hints.map((hint, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="text-yellow-600">•</span>
                                      <span>{hint}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
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
