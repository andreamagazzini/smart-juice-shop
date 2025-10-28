'use client'

import { useState } from 'react'

interface IoTDevice {
  id: string
  name: string
  type: 'temperature' | 'lighting' | 'lock' | 'dispenser' | 'inventory'
  status: string
  value: number | string
  vulnerability: string
}

export default function IoTControlsPage() {
  const [devices, setDevices] = useState<IoTDevice[]>([
    {
      id: 'temp-1',
      name: 'Cold Storage Unit 1',
      type: 'temperature',
      status: 'active',
      value: 5,
      vulnerability: 'Default password admin:admin'
    },
    {
      id: 'light-1',
      name: 'Main Shop Lighting',
      type: 'lighting',
      status: 'on',
      value: '75%',
      vulnerability: 'No encryption on commands'
    },
    {
      id: 'lock-1',
      name: 'Front Door Lock',
      type: 'lock',
      status: 'locked',
      value: 'enabled',
      vulnerability: 'Default PIN: 1234'
    },
    {
      id: 'dispenser-1',
      name: 'Orange Juice Dispenser',
      type: 'dispenser',
      status: 'operational',
      value: '45%',
      vulnerability: 'Unencrypted communication'
    },
    {
      id: 'inventory-1',
      name: 'Orange Juice Stock Sensor',
      type: 'inventory',
      status: 'monitoring',
      value: '12 bottles',
      vulnerability: 'Web interface accessible without auth'
    }
  ])

  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null)
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [showCredentialsModal, setShowCredentialsModal] = useState(false)
  const [message, setMessage] = useState('')

  const handleControlDevice = (device: IoTDevice) => {
    setSelectedDevice(device)
    
    // Check if device requires authentication
    if (device.type === 'temperature' || device.type === 'lock') {
      setShowCredentialsModal(true)
    } else {
      // No auth required - VULNERABLE!
      setMessage(`⚠️ Device ${device.name} controlled without authentication!`)
      setTimeout(() => setMessage(''), 3000)
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
      setMessage(`✅ Access granted to ${selectedDevice?.name}`)
      setShowCredentialsModal(false)
      setCredentials({ username: '', password: '' })
    } else {
      setMessage('❌ Invalid credentials')
    }
    
    setTimeout(() => setMessage(''), 3000)
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'temperature': return '🌡️'
      case 'lighting': return '💡'
      case 'lock': return '🔒'
      case 'dispenser': return '🥤'
      case 'inventory': return '📊'
      default: return '🔌'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'on':
      case 'operational':
      case 'monitoring':
        return 'text-green-600 bg-green-50'
      case 'locked':
      case 'enabled':
        return 'text-blue-600 bg-blue-50'
      case 'off':
      case 'disabled':
        return 'text-gray-600 bg-gray-50'
      default:
        return 'text-yellow-600 bg-yellow-50'
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
