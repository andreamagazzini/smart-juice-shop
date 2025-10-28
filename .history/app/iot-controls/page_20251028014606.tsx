'use client'

import { useState } from 'react'

export default function IoTControlsPage() {
  const [temp, setTemp] = useState(5)
  const [lighting, setLighting] = useState(75)
  const [lock, setLock] = useState(true)
  const [dispenser, setDispenser] = useState(45)
  const [inventory, setInventory] = useState(12)
  
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            🏪 Smart Juice Shop IoT Control
          </h1>
          <p className="text-lg text-gray-600">
            Control and monitor shop devices
          </p>
        </div>

        {message && (
          <div className={`max-w-2xl mx-auto mb-6 p-4 rounded-lg ${
            message.includes('✅') ? 'bg-green-50 border-2 border-green-300' :
            message.includes('⚠️') ? 'bg-yellow-50 border-2 border-yellow-300' :
            'bg-red-50 border-2 border-red-300'
          }`}>
            <p className="text-center text-gray-800 font-semibold">{message}</p>
          </div>
        )}

        {/* IoT Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {devices.map((device) => (
            <div
              key={device.id}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{getDeviceIcon(device.type)}</span>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{device.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{device.type}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(device.status)}`}>
                  {device.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-2xl font-bold text-indigo-600">{device.value}</p>
                <p className="text-xs text-gray-500 mt-1">Current Reading</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-red-700 font-semibold">🔓 Vulnerability:</p>
                <p className="text-xs text-red-600">{device.vulnerability}</p>
              </div>

              <button
                onClick={() => handleControlDevice(device)}
                className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-semibold transition-all"
              >
                Control Device
              </button>
            </div>
          ))}
        </div>

        {/* Credentials Modal */}
        {showCredentialsModal && selectedDevice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCredentialsModal(false)}>
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">🔐 Device Authentication</h3>
              <p className="text-gray-600 mb-6">Enter credentials for {selectedDevice.name}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    placeholder="admin"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-semibold"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
