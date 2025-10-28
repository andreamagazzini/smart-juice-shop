'use client'

import { useEffect, useState } from 'react'
import { getAllProducts, getDB, getCompletedChallenges, resetDatabase, exportData, importData } from '@/lib/browser-db'
import Modal from '@/components/Modal'

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
  const [modal, setModal] = useState<{isOpen: boolean, title: string, message: string, onConfirm?: () => void, type?: 'alert' | 'confirm' | 'info'}>({
    isOpen: false,
    title: '',
    message: ''
  })

  useEffect(() => {
    loadChallenges()
  }, [])

  const loadChallenges = async () => {
    try {
      const db = await getDB()
      const allChallenges = await db.getAll('challenges')
      setChallenges(allChallenges)
      
      // Get current user ID from localStorage or default to 1
      const currentUserStr = localStorage.getItem('currentUser')
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null
      const userId = currentUser ? currentUser.id : 1
      
      // Get current user's completed challenges
      const completed = await getCompletedChallenges(userId)
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

  const handleReset = () => {
    setModal({
      isOpen: true,
      title: '⚠️ Reset All Data',
      message: 'Are you sure you want to reset all data? This cannot be undone!',
      type: 'confirm',
      onConfirm: async () => {
        await resetDatabase()
      }
    })
  }

  const closeModal = () => {
    setModal({ isOpen: false, title: '', message: '' })
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
    
    setModal({
      isOpen: true,
      title: '📥 Import Data',
      message: 'Replace current data with imported data?',
      type: 'confirm',
      onConfirm: async () => {
        await importData(data)
        setModal({
          isOpen: true,
          title: '✅ Success',
          message: 'Data imported successfully!',
          type: 'alert',
          onConfirm: () => {
            window.location.reload()
          }
        })
      }
    })
  }

  const getChallengeHints = (key: string) => {
    const hints: Record<string, string[]> = {
      'loginAdmin': [
        'Admin login credentials are stored in the user database',
        'Check the Users tab in the admin panel'
      ],
      'sessionHijacking': [
        'Go to /admin page and click Users tab',
        'Copy the session token from another user',
        'Replace your session cookie in DevTools (Application → Cookies)',
        'Refresh the page - you should now be logged in as that user!'
      ],
      'plaintextPassword': [
        'Check the admin page Users tab',
        'Look for password visibility toggles'
      ],
      'defaultCredentials': [
        'Go to IoT Controls page (employees and admins)',
        'Try to disarm the security alarm',
        'Look for default IoT credentials online'
      ],
      'sqlInjectionSearch': [
        'In the search bar, try special characters: ! or @ or #',
        'Or try: OR or AND (logic operators)',
        'Or search for: "all" or "everything"'
      ],
      'storedXss': [
        'Go to Admin panel → Products tab',
        'Edit a product name or description with malicious code',
        'Try: <img src=x onerror=alert("Your account has been hacked!")>',
        'The code will execute when anyone views the product on the home page'
      ],
      'accessAdminSection': [
        'Try accessing /admin directly in the URL'
      ],
      'exposeSensitiveData': [
        'Database credentials are in the Settings tab of the admin panel'
      ],
      'negativeOrder': [
        'Add items to cart',
        'Open DevTools → Console',
        'View cart: localStorage.getItem("cart")',
        'Modify prices: Copy the JSON, change "price" values to 0',
        'Save: localStorage.setItem("cart", \'[your modified JSON]\')',
        'Reload page and go to checkout'
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

          {/* Admin Controls */}
          <div className="flex justify-center gap-3 mt-6">
            <div className="relative group">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition"
                title="Reset all progress - clears completed challenges and user data"
              >
                🔄 Reset
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Clears all progress and starts fresh
              </div>
            </div>
            
            <div className="relative group">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
                title="Export your progress as a JSON file"
              >
                📥 Export
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Download your progress as JSON
              </div>
            </div>
            
            <div className="relative group">
              <button
                onClick={() => setShowImport(!showImport)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
                title="Import previously exported progress"
              >
                📤 Import
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Load previously exported progress
              </div>
            </div>
          </div>

          {showImport && (
            <div className="mt-4 max-w-md mx-auto">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select JSON file to import:
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
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

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm || closeModal}
      />
    </div>
  )
}
