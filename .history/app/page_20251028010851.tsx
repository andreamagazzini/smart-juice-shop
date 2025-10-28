'use client'

import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import ChallengeNotification from '@/components/ChallengeNotification'
import ProductGrid from '@/components/ProductGrid'

export default function Home() {
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setHasSearched(false)
      return
    }
    
    setIsSearching(true)
    setHasSearched(true)
    
    // VULNERABLE: Reflected XSS - storing query for display without escaping
    setSearchQuery(query)
    
    // Check for XSS payloads
    if (query.includes('<script>') || query.includes('<img') || query.includes('onerror=')) {
      const userId = parseInt(localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).id : '1')
      const { completeChallenge } = await import('@/lib/browser-db')
      await completeChallenge(userId, 'reflectedXss')
    }
    
    // Check for SQL injection patterns
    if (query.includes("' OR") || query.includes(' OR ') || query.includes('1=1') || query.includes('UNION') || query.includes('#')) {
      const userId = parseInt(localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).id : '1')
      const { completeChallenge } = await import('@/lib/browser-db')
      await completeChallenge(userId, 'sqlInjectionSearch')
    }
    
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSearchResults(data.products || [])
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            🍹 Juice Shop
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            An intentionally insecure application for security training
          </p>
        </div>

        <ChallengeNotification notification={notification} onClose={() => setNotification(null)} />

        <div className="max-w-7xl mx-auto space-y-8">
          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} loading={isSearching} />
          
          {/* VULNERABLE: Reflected XSS - showing search query without escaping */}
          {hasSearched && searchQuery && (
            <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
              <p className="text-gray-700">
                Results for: <span dangerouslySetInnerHTML={{ __html: searchQuery }} />
              </p>
            </div>
          )}
          
          {/* Show products or search results */}
          <ProductGrid searchResults={searchResults} hasSearched={hasSearched} />
        </div>
      </div>
    </div>
  )
}
