'use client'

import { useEffect, useState } from 'react'
import { completeChallenge, getDB } from '@/lib/browser-db'

interface Tab {
  name: string
  label: string
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats] = useState({
    users: 2,
    orders: 15,
    revenue: 299.50,
    products: 5
  })

  // VULNERABLE: No actual authentication check!
  // This page should only be accessible to admins, but there's no check

  useEffect(() => {
    // Mark challenge as completed when page loads
    const markChallenge = async () => {
      try {
        await completeChallenge(1, 'accessAdminSection')
        console.log('✅ Admin section access challenge completed!')
      } catch (error) {
        console.error('Error completing challenge:', error)
      }
    }
    
    markChallenge()
  }, [])

  const tabs: Tab[] = [
    { name: 'overview', label: '📊 Overview' },
    { name: 'users', label: '👥 Users' },
    { name: 'orders', label: '📦 Orders' },
    { name: 'settings', label: '⚙️ Settings' }
  ]

  const users = [
    { id: 1, email: 'admin@juice-shop.com', password: 'admin123', role: 'admin', address: '123 Admin Street, San Francisco, CA 94102', phone: '+1-555-0101', createdAt: '2023-01-15', lastLogin: '2024-01-15' },
    { id: 2, email: 'user@juice-shop.com', password: 'password123', role: 'customer', address: '456 User Avenue, New York, NY 10001', phone: '+1-555-0202', createdAt: '2023-03-20', lastLogin: '2024-01-14' },
    { id: 3, email: 'john.doe@email.com', password: 'MyPass123!', role: 'customer', address: '789 Oak Lane, Los Angeles, CA 90001', phone: '+1-555-0303', createdAt: '2023-05-10', lastLogin: '2024-01-13' },
    { id: 4, email: 'sarah.smith@email.com', password: 'securePass456', role: 'customer', address: '321 Elm Road, Chicago, IL 60601', phone: '+1-555-0404', createdAt: '2023-07-25', lastLogin: '2024-01-12' },
    { id: 5, email: 'michael.jones@email.com', password: 'mypassword', role: 'customer', address: '654 Pine Street, Houston, TX 77001', phone: '+1-555-0505', createdAt: '2023-09-08', lastLogin: '2024-01-11' }
  ]

  const orders = [
    { id: 1, email: 'user@juice-shop.com', total: 15.98, items: 3, date: '2024-01-15', status: 'delivered' },
    { id: 2, email: 'john.doe@email.com', total: 8.47, items: 2, date: '2024-01-14', status: 'shipped' },
    { id: 3, email: 'sarah.smith@email.com', total: 22.95, items: 4, date: '2024-01-13', status: 'pending' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            🔒 Admin Section
          </h1>
          <p className="text-lg text-gray-600">
            Administrative Dashboard
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-xl p-2 mb-6">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex-1 py-3 rounded-xl transition-all font-semibold ${
                    activeTab === tab.name
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="text-3xl mb-2">👥</div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.users}</p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="text-3xl mb-2">📦</div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.orders}</p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="text-3xl mb-2">💰</div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-3xl font-bold text-blue-600">${stats.revenue.toFixed(2)}</p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="text-3xl mb-2">🛍️</div>
                  <p className="text-sm text-gray-600">Products</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.products}</p>
                </div>
              </div>

              {/* Sensitive Information */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
                  🔐 Sensitive Data
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Database Credentials</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                      <pre className="text-sm text-gray-700">
{`Database: juice_shop_production
Host: db.juice-shop.com
Port: 5432
Username: admin
Password: super_secret_password_123`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">API Keys</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                      <pre className="text-sm text-gray-700">
{`Payment Gateway: pk_live_51xxxxx_xxxxx
Email Service: SG.xxxxx
Analytics: UA-xxxxx`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">👥 Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Password</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">{user.email}</td>
                        <td className="px-4 py-3 text-sm font-mono text-red-600">{user.password}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{user.address}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{user.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📦 Orders</h2>
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">{order.email}</p>
                        <p className="text-sm text-gray-600">{order.date} • {order.items} items</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">${order.total}</p>
                        <p className="text-sm text-gray-600 capitalize">{order.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">⚙️ Settings</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">System Configuration</h3>
                  <p className="text-sm text-gray-600">Environment: Production</p>
                  <p className="text-sm text-gray-600">Debug Mode: Enabled</p>
                  <p className="text-sm text-gray-600">Version: 2.0.1</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Security Settings</h3>
                  <p className="text-sm text-gray-600">2FA: Disabled</p>
                  <p className="text-sm text-gray-600">Password Hashing: Plain Text</p>
                  <p className="text-sm text-gray-600">Session Timeout: None</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
