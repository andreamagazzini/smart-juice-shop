'use client'

import { useState } from 'react'

export default function SearchBar({ onSearch, loading }: { onSearch: (query: string) => void, loading: boolean }) {
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    onSearch(query)
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
    </div>
  )
}
