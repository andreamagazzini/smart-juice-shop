'use client'

import { useState } from 'react'

export default function SearchBar({ onSearchResults, onClear }: { onSearchResults?: (hasResults: boolean) => void, onClear?: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [cart, setCart] = useState<Array<{product: any, quantity: number}>>([])

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([])
      setHasSearched(false)
      if (onSearchResults) onSearchResults(false)
      if (onClear) onClear()
      return
    }
    
    setHasSearched(true)
    setLoading(true)
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setResults(data.products || [])
      if (onSearchResults) onSearchResults(data.products?.length > 0)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
      if (onSearchResults) onSearchResults(false)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.product.id === product.id)
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search products... (try SQL injection!)"
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 font-semibold shadow-lg transition-all"
        >
          {loading ? 'Searching...' : '🔍 Search'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Search Results:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((product: any, idx: number) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h4>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                </div>
                <button
                  onClick={() => alert('Add to cart feature coming soon!')}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold transition-all"
                >
                  🛒 Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && hasSearched && !loading && (
        <div className="mt-6 text-gray-700 text-center">
          No results found
        </div>
      )}
    </div>
  )
}
