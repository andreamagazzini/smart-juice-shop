'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [user, setUser] = useState<{ email: string; isAdmin: boolean } | null>(null)

  useEffect(() => {
    // Check if user is logged in (simplified - using localStorage)
    const checkAuth = () => {
      // In a real app, this would check the session cookie
      // For now, we'll use a simple approach
      const userData = localStorage.getItem('currentUser')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
    
    checkAuth()
    
    // Listen for auth changes
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
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

          <div className="flex gap-6">
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
