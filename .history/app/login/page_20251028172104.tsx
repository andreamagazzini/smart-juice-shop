'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completeChallenge } from '@/lib/browser-db'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        // Store user info in localStorage for navigation display
        localStorage.setItem('currentUser', JSON.stringify(data.user))
        
        // Mark challenges as completed if conditions are met
        
        // Check for default credentials (admin@juice-shop.com / admin123)
        if (email === 'admin@juice-shop.com' && password === 'admin123') {
          const completed = await completeChallenge('defaultCredentials')
          if (completed && window.showChallengeToast) {
            window.showChallengeToast(
              'Use Default Credentials',
              'You logged in with the default username and password that came with the system! This is like leaving your WiFi password as "admin/admin" - always change default passwords when setting up any system.'
            )
          }
        }
        
        // Check for weak password (admin123)
        if (password === 'admin123') {
          const completed = await completeChallenge('weakPassword')
          if (completed && window.showChallengeToast) {
            window.showChallengeToast(
              'Use Weak Password',
              'You guessed the password because it was too simple! "admin123" is easy to guess. Good passwords should be long (12+ characters), mix letters, numbers and symbols, and avoid common words or patterns.'
            )
          }
        }
        
        // Trigger storage event to update navigation
        window.dispatchEvent(new Event('storage'))
        
        // Session is now handled via secure cookies (vulnerable!)
        // Cookie is automatically set by the server
        router.push('/')
      } else {
        setError(data.message || 'Login failed')
        setFailedAttempts(prev => prev + 1)
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900">
            🔓 Login
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 font-semibold shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            {loading ? 'Logging in...' : '➜ Login'}
          </button>
        </form>

        {failedAttempts >= 3 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            <p className="font-semibold text-orange-600">Need help? Try these credentials:</p>
            <p className="font-mono">admin@juice-shop.com / admin123</p>
          </div>
        )}

        {failedAttempts >= 5 && (
          <div className="mt-4 text-xs text-gray-500 bg-yellow-50 p-3 rounded">
            <p className="font-semibold">💡 Advanced hint:</p>
            <p>What if the authentication checks the email AND password at the same time?</p>
          </div>
        )}
      </div>
    </div>
  )
}
