'use client'

import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [stats, setStats] = useState({
    users: 2,
    orders: 15,
    revenue: 299.50,
    products: 5
  })

  // VULNERABLE: No actual authentication check!
  // This page should only be accessible to admins, but there's no check

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            🔒 Admin Section
          </h1>
          <p className="text-lg text-gray-600">
            Administrative Dashboard - Protected Area
          </p>
          <div className="mt-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg inline-block">
            ⚠️ VULNERABLE: This page should be protected but isn't!
          </div>
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

          {/* Challenge Completion Info */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-semibold">
              ✅ Challenge Complete: You've accessed the admin section without authorization!
            </p>
            <p className="text-green-700 text-sm mt-2">
              This demonstrates broken access control - sensitive information exposed to unauthorized users.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
