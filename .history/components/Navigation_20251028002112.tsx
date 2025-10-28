'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { completeChallenge } from '@/lib/browser-db'

export default function Navigation() {
  const pathname = usePathname()
  const [user, setUser] = useState<{ email: string; isAdmin: boolean } | null>(null)

  useEffect(() => {
    // Check if user is logged in - check session cookie via API
    const checkAuth = async () => {
      try {
        // Call API to get current user from session cookie
        const response = await fetch('/api/auth/current')
        const { user: newUser } = await response.json()
        
        const userData = localStorage.getItem('currentUser')
        const previousUser = userData ? JSON.parse(userData) : null
        
        if (newUser) {
          console.log('✅ User from session:', newUser)
          
          // Check if this is a different user (session hijacking!)
          if (previousUser && previousUser.email !== newUser.email) {
            console.log('🎯 Session hijacking detected!')
            // Mark session hijacking challenge as complete
            await completeChallenge(newUser.isAdmin ? 1 : 2, 'sessionHijacking')
          }
          
          setUser(newUser)
          // Update localStorage to match the session cookie
          localStorage.setItem('currentUser', JSON.stringify(newUser))
          return
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      }
      
      // Fall back to localStorage if no valid session cookie
      const userData = localStorage.getItem('currentUser')
      if (userData) {
        setUser(JSON.parse(userData))
      } else {
        setUser(null)
      }
    }
    
    checkAuth()
    
    // Listen for auth changes
    window.addEventListener('storage', checkAuth)
    
    // Also check on focus (in case session cookie changed)
    const handleFocus = () => checkAuth()
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('storage', checkAuth)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const handleLogout = async () => {
    // Call API to clear server-side session cookie
    await fetch('/api/auth/logout', { method: 'POST' })
    
    // Clear localStorage
    localStorage.removeItem('currentUser')
    localStorage.clear()
    sessionStorage.clear()
    
    // Clear session cookie client-side as well
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';'
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname + ';'
    
    setUser(null)
    
    // Redirect to home
    window.location.href = '/'
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            🍹 Juice Shop
          </Link>

          <div className="flex gap-4 items-center">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg transition ${
                isActive('/') 
                  ? 'bg-blue-600 text-white font-semibold' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <span className="px-4 py-2 text-sm text-gray-700">
                  👤 {user.email}
                  {user.isAdmin && <span className="ml-2 text-red-600">(Admin)</span>}
                </span>
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    className={`px-4 py-2 rounded-lg transition ${
                      isActive('/admin') 
                        ? 'bg-purple-600 text-white font-semibold' 
                        : 'text-purple-700 hover:text-purple-600'
                    }`}
                  >
                    🔒 Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-gray-700 hover:text-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={`px-4 py-2 rounded-lg transition ${
                  isActive('/login') 
                    ? 'bg-blue-600 text-white font-semibold' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Login
              </Link>
            )}
            
            <Link
              href="/challenges"
              className={`px-4 py-2 rounded-lg transition ${
                isActive('/challenges') 
                  ? 'bg-blue-600 text-white font-semibold' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Challenges
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
