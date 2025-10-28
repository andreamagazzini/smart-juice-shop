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
      setSearchQuery('')
      return
    }
    
    setIsSearching(true)
    setHasSearched(true)
    
    // Store query for display
    setSearchQuery(query)
    
    // Check for SQL injection patterns
    const hasSQLInjection = query.includes("' OR") || 
                           query.includes(' OR ') || 
                           query.toUpperCase().includes(' OR') ||
                           query.includes('1=1') || 
                           query.includes('1 = 1')
    
    if (hasSQLInjection) {
      const { completeChallenge } = await import('@/lib/browser-db')
      const completed = await completeChallenge('sqlInjectionSearch')
      if (completed && window.showChallengeToast) {
        window.showChallengeToast(
          'SQL Injection (Search)',
          'You used SQL injection to reveal hidden VIP products! By injecting database commands like "OR 1=1", you bypassed the security filter. The search should have validated and sanitized your input first. Real attacks could steal entire databases this way!'
        )
      }
    }
    
    try {
      // Search directly from IndexedDB instead of API
      const { searchProducts } = await import('@/lib/browser-db')
      const results = await searchProducts(query)
      setSearchResults(results)
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
          
          {/* Show products or search results */}
          <ProductGrid searchResults={searchResults} hasSearched={hasSearched} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  )
}
