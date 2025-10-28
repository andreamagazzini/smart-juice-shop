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

export default function ChallengesDrawer() {
  const [isOpen, setIsOpen] = useState(false)
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
    
    // Reload challenges when localStorage changes (user logs in/out)
    const handleStorageChange = () => {
      loadChallenges()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleStorageChange)
    }
  }, [])
  
  // Reload challenges when drawer opens
  useEffect(() => {
    if (isOpen) {
      loadChallenges()
    }
  }, [isOpen])

  const loadChallenges = async () => {
    try {
      const db = await getDB()
      const allChallenges = await db.getAll('challenges')
      setChallenges(allChallenges)
      
      // Get completed challenges (global, not per user)
      const keys = await getCompletedChallenges()
      setCompletedKeys(keys)
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

    try {
      const text = await file.text()
      const data = JSON.parse(text)
      await importData(data)
      await loadChallenges()
      setModal({
        isOpen: true,
        title: '✅ Success',
        message: 'Data imported successfully!',
        type: 'info'
      })
    } catch (error) {
      setModal({
        isOpen: true,
        title: '❌ Error',
        message: 'Failed to import data',
        type: 'alert'
      })
    }
    
    setShowImport(false)
  }

  const getChallengeHints = (key: string) => {
    const hints: Record<string, string[]> = {
      'loginAdmin': [
        'Admin login credentials are stored in the user database',
        'Check the Users tab in the admin panel'
      ],
      'sessionHijacking': [
        'Copy a session token from the admin panel Users table',
        'Replace your session cookie in DevTools',
        'Refresh the page'
      ],
      'plaintextPassword': ['Check the admin Users tab', 'Look for password visibility toggles'],
      'defaultCredentials': [
        'Go to IoT Controls (employees and admins)',
        'Try to disarm the security alarm',
        'Look for default IoT credentials online'
      ],
      'sqlInjectionSearch': [
        'Try special characters: ! @ #',
        'Try logic operators: OR, AND',
        'Try words like "all" or "everything"'
      ],
      'storedXss': [
        'Go to Admin panel → Products tab',
        'Edit a product name or description',
        'Try: <img src=x onerror=alert("Your account has been hacked!")>',
        'Visit home page to see it execute'
      ],
      'accessAdminSection': ['Navigate to /admin directly'],
      'exposeSensitiveData': ['Check the Settings tab in the admin panel'],
      'negativeOrder': [
        'Add items to cart and go to checkout',
        'Use browser DevTools to modify prices',
        'Try negative values or $0.01'
      ],
      'defaultIoT': [
        'Access IoT Controls page',
        'Try default credentials: admin:admin, user:user, admin:1234'
      ],
      'insecureIoT': [
        'Access IoT Controls page',
        'Try controlling devices without authentication'
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
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all z-40 hover:scale-105"
      >
        <span className="text-2xl">🎯</span>
      </button>

      {/* Drawer */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex"
          onClick={() => setIsOpen(false)}
        >
          {/* Left side - empty space that closes drawer on click */}
          <div className="flex-1"></div>
          
          {/* Right side - Drawer panel */}
          <div 
            className="h-full w-[800px] bg-gradient-to-br from-purple-50 to-pink-100 overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-br from-purple-50 to-pink-100 z-10 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-800">🎯 Challenges</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 hover:text-gray-800 text-3xl"
                >
                  ×
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="max-w-2xl bg-white rounded-full p-1 shadow-lg">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full py-2 transition-all" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-700 mt-2 font-semibold">
                  {completedCount} / {totalCount} completed ({progress}%)
                </p>
              </div>

              {/* Admin Controls */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition text-sm"
                >
                  🔄 Reset
                </button>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition text-sm"
                >
                  📥 Export
                </button>
                <button
                  onClick={() => setShowImport(!showImport)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition text-sm"
                >
                  📤 Import
                </button>
              </div>

              {showImport && (
                <div className="mt-4">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              )}
            </div>

            {/* Challenges List */}
            {loading ? (
              <div className="text-center p-8">Loading...</div>
            ) : (
              <div className="p-6 space-y-6">
                {Object.entries(challengesByCategory).map(([category, categoryChallenges]) => (
                  <div key={category} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                      {category}
                    </h3>
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
                              <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                completed ? 'border-green-500 bg-green-500' : 'border-gray-400'
                              }`}>
                                {completed && <span className="text-white text-sm">✓</span>}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <h4 className={`font-semibold text-lg ${completed ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                                      {challenge.name}
                                    </h4>
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
                                    <ul className="space-y-2">
                                      {hints.map((hint, idx) => (
                                        <li key={idx} className="text-sm text-yellow-700 flex items-start gap-2">
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
        </div>
      )}

      {/* Modal for alerts/confirmations */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm || closeModal}
      />
    </>
  )
}
