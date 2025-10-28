'use client'

import { useState } from 'react'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products... (try SQL injection!)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
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

      {results.length === 0 && query && !loading && (
        <div className="mt-6 text-gray-700 text-center">
          No results found
        </div>
      )}
    </div>
  )
}
