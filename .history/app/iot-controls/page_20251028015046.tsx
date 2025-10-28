'use client'

import { useState } from 'react'

export default function IoTControlsPage() {
  const [temp, setTemp] = useState(5)
  const [lighting, setLighting] = useState(75)
  const [lock, setLock] = useState(true)
  const [dispenser, setDispenser] = useState(45)
  const [inventory, setInventory] = useState(12)
  const [lightsOff, setLightsOff] = useState(false)
  
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [showCredentialsModal, setShowCredentialsModal] = useState(false)
  const [deviceRequiringAuth, setDeviceRequiringAuth] = useState<string | null>(null)
  const [authenticated, setAuthenticated] = useState(false)

  const handleTempChange = () => {
    if (authenticated || !credentials.username) {
      setTemp(temp === 5 ? 3 : 5)
    } else {
      setDeviceRequiringAuth('temp')
      setShowCredentialsModal(true)
    }
  }

  const handleLockToggle = () => {
    if (authenticated || !credentials.username) {
      setLock(!lock)
    } else {
      setDeviceRequiringAuth('lock')
      setShowCredentialsModal(true)
    }
  }

  const handleCredentialsSubmit = () => {
    const defaultUsers = [
      { username: 'admin', password: 'admin' },
      { username: 'user', password: 'user' },
      { username: 'admin', password: '1234' }
    ]

    const isValid = defaultUsers.some(
      u => u.username === credentials.username && u.password === credentials.password
    )

    if (isValid) {
      setAuthenticated(true)
      setShowCredentialsModal(false)
      if (deviceRequiringAuth === 'temp') {
        setTemp(temp === 5 ? 3 : 5)
      } else if (deviceRequiringAuth === 'lock') {
        setLock(!lock)
      }
      setCredentials({ username: '', password: '' })
      setDeviceRequiringAuth(null)
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Shop Control Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor and control shop devices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Temperature Control */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌡️</span>
                <div>
                  <h3 className="font-bold text-gray-800">Cold Storage</h3>
                  <p className="text-sm text-gray-500">Temperature Control</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                Active
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-blue-600">{temp}°C</span>
                <span className="text-gray-500 text-sm">Target</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Current: {temp}°C</p>
            </div>

            <button
              onClick={handleTempChange}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
            >
              Adjust Temperature
            </button>
          </div>

          {/* Smart Lighting */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">💡</span>
                <div>
                  <h3 className="font-bold text-gray-800">Main Lighting</h3>
                  <p className="text-sm text-gray-500">Smart Lighting</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                On
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lighting}
                  onChange={(e) => setLighting(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-yellow-500 w-16">{lighting}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Brightness level</p>
            </div>

            <button
              onClick={() => {
                if (lighting === 0) {
                  setLighting(75)
                  setLightsOff(false)
                } else {
                  setLighting(0)
                  setTimeout(() => setLightsOff(true), 500)
                }
              }}
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold transition"
            >
              {lighting === 0 ? 'Turn On' : 'Turn Off'}
            </button>
          </div>

          {/* Smart Lock */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔒</span>
                <div>
                  <h3 className="font-bold text-gray-800">Front Door</h3>
                  <p className="text-sm text-gray-500">Smart Lock</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                lock ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
              }`}>
                {lock ? 'Locked' : 'Unlocked'}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="text-2xl font-bold text-gray-800">
                {lock ? '🔒 Locked' : '🔓 Unlocked'}
              </div>
              <p className="text-xs text-gray-500 mt-1">Status</p>
            </div>

            <button
              onClick={handleLockToggle}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition"
            >
              {lock ? 'Unlock' : 'Lock'}
            </button>
          </div>

          {/* Juice Dispenser */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🥤</span>
                <div>
                  <h3 className="font-bold text-gray-800">Dispenser Unit</h3>
                  <p className="text-sm text-gray-500">Orange Juice</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                Operational
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-orange-600">{dispenser}%</span>
                <span className="text-gray-500 text-sm">Capacity</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Dispense rate</p>
            </div>

            <button
              onClick={() => setDispenser(Math.max(0, dispenser - 10))}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold transition"
            >
              Dispense Juice
            </button>
          </div>

          {/* Inventory Sensor */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📊</span>
                <div>
                  <h3 className="font-bold text-gray-800">Inventory Sensor</h3>
                  <p className="text-sm text-gray-500">Orange Juice</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                Monitoring
              </span>
            </div>
            
            <div className="mb-4">
              <div className="text-4xl font-bold text-green-600">{inventory}</div>
              <p className="text-xs text-gray-500 mt-1">Bottles in stock</p>
            </div>

            <button
              onClick={() => setInventory(inventory + 12)}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
            >
              Stock Refill
            </button>
          </div>

          {/* Placeholder */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔔</span>
                <div>
                  <h3 className="font-bold text-gray-800">Security System</h3>
                  <p className="text-sm text-gray-500">Alarm Status</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-semibold">
                Disarmed
              </span>
            </div>
            
            <div className="mb-4">
              <div className="text-2xl font-bold text-gray-600">Arm</div>
              <p className="text-xs text-gray-500 mt-1">System</p>
            </div>

            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold transition">
              Configure
            </button>
          </div>
        </div>

        {/* Credentials Modal */}
        {showCredentialsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCredentialsModal(false)}>
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Device Authentication Required</h3>
              <p className="text-gray-600 mb-6">Please enter your credentials</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    placeholder="Username"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    placeholder="Password"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCredentialsModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCredentialsSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Authenticate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
