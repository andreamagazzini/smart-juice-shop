'use client'

import { useState } from 'react'
import { resetDatabase, exportData, importData } from '@/lib/browser-db'

export default function AdminPanel() {
  const [showImport, setShowImport] = useState(false)
  const [exportDataUrl, setExportDataUrl] = useState<string | null>(null)

  const handleReset = async () => {
    if (confirm('⚠️ Are you sure you want to reset all data? This cannot be undone!')) {
      await resetDatabase()
    }
  }

  const handleExport = async () => {
    const data = await exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    setExportDataUrl(url)
    
    // Trigger download
    const a = document.createElement('a')
    a.href = url
    a.download = `juice-shop-data-${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const data = JSON.parse(text)
    
    if (confirm('Replace current data with imported data?')) {
      await importData(data)
      alert('Data imported successfully!')
      window.location.reload()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        🔧 Admin Controls
      </h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition"
          >
            🔄 Reset All Data
          </button>
          
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            📥 Export Progress
          </button>
          
          <button
            onClick={() => setShowImport(!showImport)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
          >
            📤 Import Progress
          </button>
        </div>

        {showImport && (
          <div className="border-t pt-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select JSON file to import:
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-600 space-y-2">
        <p><strong>Reset:</strong> Clears all progress and starts fresh</p>
        <p><strong>Export:</strong> Download your progress as JSON</p>
        <p><strong>Import:</strong> Load previously exported progress</p>
      </div>
    </div>
  )
}

