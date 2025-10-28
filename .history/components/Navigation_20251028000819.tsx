'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [user, setUser] = useState<{ email: string; isAdmin: boolean } | null>(null)

  useEffect(() => {
    // Check if user is logged in - prioritize session cookie over localStorage
    const checkAuth = () => {
      // First, check the session cookie
      const sessionCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('session='))
      
      console.log('🔍 Checking session cookie:', sessionCookie)
      
      if (sessionCookie) {
        const token = sessionCookie.split('=')[1]
        console.log('📦 Token from cookie:', token.substring(0, 50) + '...')
        try {
          // Decode the token to get the current user
          const parts = token.split('.')
          console.log('🔢 Token parts:', parts.length)
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
            console.log('✅ Decoded payload:', payload)
            // If the token is valid and has user info, use that
            if (payload.userId && payload.email) {
              const user = {
                email: payload.email,
                isAdmin: payload.email === 'admin@juice-shop.com'
              }
              console.log('👤 Setting user to:', user)
              setUser(user)
              
              // Update localStorage to match the session cookie
              localStorage.setItem('currentUser', JSON.stringify(user))
              return
            }
          }
        } catch (e) {
          console.error('❌ Error parsing session token:', e)
        }
      }
      
      // Fall back to localStorage if no valid session cookie
      const userData = localStorage.getItem('currentUser')
      console.log('📋 Fallback to localStorage:', userData)
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

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
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
