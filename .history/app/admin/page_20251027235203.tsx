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

        <div className="max-w-5xl mx-auto">
          {/* Admin Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
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
              <p className="text-3xl font-bold text-blue-600">${stats.revenue}</p>
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

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">User Passwords</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                  <div className="text-sm text-gray-700 space-y-2">
                    <p><strong>admin@juice-shop.com:</strong> admin123</p>
                    <p><strong>user@juice-shop.com:</strong> password123</p>
                  </div>
                  <p className="text-red-600 text-xs mt-2">
                    ⚠️ All passwords stored in plain text (for demo purposes)
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
