'use client'

import { useState, useEffect } from 'react'
import { completeChallenge } from '@/lib/browser-db'

// Global event to show toast
declare global {
  interface Window {
    showChallengeToast?: (message: string, explanation?: string) => void
  }
}

export default function IoTControlsPage() {
  const [temp, setTemp] = useState(5)
  const [currentTemp, setCurrentTemp] = useState(5)
  const [lighting, setLighting] = useState(75)
  const [lightsOff, setLightsOff] = useState(false)
  const [alarmArmed, setAlarmArmed] = useState(true)
  const [showDisarmDialog, setShowDisarmDialog] = useState(false)
  
  const [disarmUsername, setDisarmUsername] = useState('')
  const [disarmPin, setDisarmPin] = useState('')
  const [disarmError, setDisarmError] = useState('')

  // Gradually adjust current temperature toward target (1 degree every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTemp !== temp) {
        setCurrentTemp(prev => {
          if (prev < temp) return prev + 1
          if (prev > temp) return prev - 1
          return prev
        })
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [currentTemp, temp])

  const handleDisarmSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check for default credentials
    if (disarmUsername === 'admin' && disarmPin === '12345') {
      setAlarmArmed(false)
      setShowDisarmDialog(false)
      setDisarmUsername('')
      setDisarmPin('')
      setDisarmError('')
      
      // Complete challenge
      const completed = await completeChallenge('defaultCredentials')
      if (completed && window.showChallengeToast) {
        window.showChallengeToast(
          'Use Default Credentials',
          'You disarmed the alarm with default IoT credentials! Many IoT devices come with factory-set usernames and passwords that should be changed immediately. Hackers often try these default credentials first.'
        )
      }
    } else {
      setDisarmError('Invalid credentials')
    }
  }

  return (
    <>
      {/* Lights Off Easter Egg */}
      {lightsOff && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="text-center">
            <button
              onClick={() => {
                setLightsOff(false)
                setLighting(75)
              }}
              className="text-6xl hover:scale-110 transition-transform duration-300"
            >
              💡
            </button>
            <p className="text-white mt-4 text-lg">The lights are off!</p>
          </div>
        </div>
      )}

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Temperature Control */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌡️</span>
                <div>
                  <h3 className="font-bold text-gray-800">Shop Temperature</h3>
                  <p className="text-sm text-gray-500">Climate Control</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                Active
              </span>
            </div>
            
            <div className="mb-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Target Temperature</span>
                  <span className="text-2xl font-bold text-blue-600">{temp}°C</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={temp}
                  onChange={(e) => setTemp(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(temp/10)*100}%, #e5e7eb ${(temp/10)*100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0°C</span>
                  <span>10°C</span>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Temperature</span>
                  <span className="text-3xl font-bold text-gray-800">{currentTemp}°C</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Lighting */}
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

          {/* Security System */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔔</span>
                <div>
                  <h3 className="font-bold text-gray-800">Security System</h3>
                  <p className="text-sm text-gray-500">Alarm Status</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                alarmArmed 
                  ? 'bg-red-50 text-red-700' 
                  : 'bg-gray-50 text-gray-700'
              }`}>
                {alarmArmed ? 'Armed' : 'Disarmed'}
              </span>
            </div>
            
            <div className="mb-4">
              <div className={`text-2xl font-bold ${alarmArmed ? 'text-red-600' : 'text-gray-600'}`}>
                {alarmArmed ? '🚨 Armed' : '🔓 Disarmed'}
              </div>
              <p className="text-xs text-gray-500 mt-1">Status</p>
            </div>

            <button 
              onClick={() => {
                if (alarmArmed) {
                  setShowDisarmDialog(true)
                } else {
                  setAlarmArmed(true)
                }
              }}
              className={`w-full px-4 py-2 text-white rounded-lg font-semibold transition ${
                alarmArmed
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {alarmArmed ? 'Disarm' : 'Arm'}
            </button>
          </div>
        </div>

        {/* Disarm Confirmation Dialog */}
        {showDisarmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">🔐 Security Verification Required</h3>
              <p className="text-gray-600 mb-6">
                Enter your credentials to disarm the security system:
              </p>

              <form onSubmit={handleDisarmSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={disarmUsername}
                    onChange={(e) => setDisarmUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    PIN Code
                  </label>
                  <input
                    type="password"
                    value={disarmPin}
                    onChange={(e) => setDisarmPin(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter PIN"
                    required
                  />
                </div>

                {disarmError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {disarmError}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDisarmDialog(false)
                      setDisarmUsername('')
                      setDisarmPin('')
                      setDisarmError('')
                    }}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Disarm
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
    </>
  )
}
