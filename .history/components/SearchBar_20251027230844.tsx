'use client'

import { useState } from 'react'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    
    setHasSearched(true)
    setLoading(true)
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setResults(data.products || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
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
        <div className="mt-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Results:</h3>
          {results.map((product: any, idx: number) => (
            <div key={idx} className="border border-gray-200 rounded p-4 bg-gray-50">
              <h4 className="font-semibold text-lg text-gray-900">{product.name}</h4>
              <p className="text-gray-700">{product.description}</p>
              <p className="text-blue-600 font-semibold">${product.price}</p>
            </div>
          ))}
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
