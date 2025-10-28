'use client'

import { useEffect, useState } from 'react'
import { completeChallenge, getDB } from '@/lib/browser-db'
import Modal from '@/components/Modal'
import CredentialsModal from '@/components/CredentialsModal'

interface Tab {
  name: string
  label: string
}

interface UserDisplay {
  id: number
  email: string
  password: string
  sessionToken: string
  role: string
  address: string
  phone: string
  createdAt: string
  lastLogin: string
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    revenue: 0,
    products: 0
  })
  const [users, setUsers] = useState<UserDisplay[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [showCredentialsModal, setShowCredentialsModal] = useState(false)
  const [hasCredentials, setHasCredentials] = useState(false)
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set())

  // VULNERABLE: No actual authentication check!
  // This page should only be accessible to admins, but there's no check

  useEffect(() => {
    // Check if credentials are already saved
    const savedCredentials = localStorage.getItem('dbCredentials')
    if (savedCredentials) {
      setHasCredentials(true)
    }

    // Cleanup old user@juice-shop.com
    const cleanupOldUser = async () => {
      try {
        const db = await getDB()
        await db.delete('users', 'user@juice-shop.com')
      } catch (e) {
        // User doesn't exist, that's fine
      }
    }
    cleanupOldUser()

    // Mark challenge as completed when page loads
    const markChallenge = async () => {
      try {
        const completed = await completeChallenge('accessAdminSection')
        if (completed && window.showChallengeToast) {
          window.showChallengeToast(
            'Access Admin Section',
            'You accessed the admin area just by typing the URL! Real websites should check if you\'re actually an admin before showing sensitive information. It\'s like having a "Staff Only" door that anyone can walk through.'
          )
        }
      } catch (error) {
        console.error('Error completing challenge:', error)
      }
    }
    
    markChallenge()
  }, [])

  // Load stats from IndexedDB and API
  useEffect(() => {
    const loadStats = async () => {
      try {
        const db = await getDB()
        
        // Get products count from IndexedDB
        const productsCount = await db.count('products')
        
        // Get users count from API (since users are displayed from API)
        const response = await fetch('/api/users/tokens')
        const { users: apiUsers } = await response.json()
        const usersCount = apiUsers?.length || 0
        
        // Get orders from IndexedDB
        const allOrders = await db.getAll('orders')
        const ordersCount = allOrders.length
        
        // Calculate revenue from orders
        const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0)
        
        setStats({
          users: usersCount,
          orders: ordersCount,
          revenue: totalRevenue,
          products: productsCount
        })
        
        // Also set orders for the Orders tab
        setOrders(allOrders)
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }
    
    loadStats()
    
    // Reload stats when tab changes
    if (activeTab === 'overview' || activeTab === 'orders') {
      loadStats()
    }
  }, [activeTab])

  const togglePasswordVisibility = async (userId: number, userRole: string) => {
    const newVisible = new Set(visiblePasswords)
    if (newVisible.has(userId)) {
      newVisible.delete(userId)
    } else {
      newVisible.add(userId)
      
      // Only complete challenge if viewing admin password
      if (userRole === 'admin') {
        try {
          const completed = await completeChallenge('plaintextPassword')
          if (completed && window.showChallengeToast) {
            window.showChallengeToast(
              'View Plaintext Passwords',
              'You found passwords stored as readable text! Passwords should be scrambled (hashed) so that even if someone steals them, they can\'t read them. It\'s like writing down your safe combination next to the safe.'
            )
          }
        } catch (error) {
          console.error('Error completing challenge:', error)
        }
      }
    }
    setVisiblePasswords(newVisible)
  }

  // Fetch users when viewing Users tab
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const db = await getDB()
        const allUsers = await db.getAll('users')
        
        // Fetch session tokens from server API
        const response = await fetch('/api/users/tokens')
        const { users: usersWithTokens } = await response.json()
        
        const fakeAddresses = [
          '123 Admin Street, San Francisco, CA 94102',
          '456 User Avenue, New York, NY 10001',
          '789 Oak Lane, Los Angeles, CA 90001',
          '321 Elm Road, Chicago, IL 60601',
          '654 Pine Street, Houston, TX 77001'
        ]
        const fakePhones = [
          '+1-555-0101',
          '+1-555-0202',
          '+1-555-0303',
          '+1-555-0404',
          '+1-555-0505'
        ]
        
        // Fake password hashes (bcrypt-style)
        const fakePasswordHashes = [
          '$2b$10$N9qo8uLOickgx2ZMRZoMye', // admin (will show plaintext instead)
          '$2b$10$xGKjb5C1zQ.XB/VVKZfVg.', // employee
          '$2b$10$yHLx8dP2wR.YC/WWLagWh.', // worker
          '$2b$10$zIMy9eQ3xS.ZD/XXMbhXi.', // john
          '$2b$10$aJNz0fR4yT.AE/YYNciYj.', // sarah
          '$2b$10$bKOa1gS5zU.BF/ZZOdjZk.'  // michael
        ]
        
        // Create users from API tokens (they're server-side, not in IndexedDB)
        const users: UserDisplay[] = usersWithTokens.map((tokenInfo: any, index: number) => {
          // Find corresponding user from allUsers (browser DB) or use API data
          const dbUser = allUsers.find(u => u.id === tokenInfo.id)
          
          return {
            id: tokenInfo.id,
            email: dbUser?.email || tokenInfo.email,
            password: dbUser?.password || fakePasswordHashes[index] || '$2b$10$encrypted',
            sessionToken: tokenInfo.sessionToken,
            role: tokenInfo.role || dbUser?.role || 'customer',
            address: fakeAddresses[index] || '123 Main St',
            phone: fakePhones[index] || '+1-555-0000',
            createdAt: dbUser?.createdAt || new Date().toISOString(),
            lastLogin: '2024-01-15'
          }
        })
        
        setUsers(users)
      } catch (error) {
        console.error('Error fetching users:', error)
        // Fallback to fake users if database fails
        setUsers(getFakeUsers())
      }
    }

    if (activeTab === 'users') {
      fetchUsers()
    }
  }, [activeTab])

  const handleTabChange = (tabName: string) => {
    // If switching to users tab and no credentials, show modal
    if (tabName === 'users' && !hasCredentials) {
      setShowCredentialsModal(true)
      // Don't actually switch tabs yet
      return
    }
    setActiveTab(tabName)
  }

  const handleCredentialsCorrect = () => {
    setShowCredentialsModal(false)
    setHasCredentials(true)
    setActiveTab('users')
  }

  // Fallback fake users if database is empty
  const getFakeUsers = (): UserDisplay[] => [
    { 
      id: 1, 
      email: 'admin@juice-shop.com', 
      password: 'admin123',
      sessionToken: 'fallback-token',
      role: 'admin', 
      address: '100 Default Lane, San Francisco, CA 94102', 
      phone: '+1-555-0000', 
      createdAt: '2023-01-01', 
      lastLogin: '2024-01-15' 
    },
    { 
      id: 3, 
      email: 'john.doe@email.com', 
      password: 'MyPass123!',
      sessionToken: 'fallback-token',
      role: 'customer', 
      address: '789 Oak Lane, Los Angeles, CA 90001', 
      phone: '+1-555-0303', 
      createdAt: '2023-05-10', 
      lastLogin: '2024-01-13' 
    },
    { 
      id: 4, 
      email: 'sarah.smith@email.com', 
      password: 'securePass456',
      sessionToken: 'fallback-token',
      role: 'customer', 
      address: '321 Elm Road, Chicago, IL 60601', 
      phone: '+1-555-0404', 
      createdAt: '2023-07-25', 
      lastLogin: '2024-01-12' 
    },
    { 
      id: 5, 
      email: 'michael.jones@email.com', 
      password: 'mypassword',
      sessionToken: 'fallback-token',
      role: 'customer', 
      address: '654 Pine Street, Houston, TX 77001', 
      phone: '+1-555-0505', 
      createdAt: '2023-09-08', 
      lastLogin: '2024-01-11' 
    }
  ]

  const tabs: Tab[] = [
    { name: 'overview', label: '📊 Overview' },
    { name: 'users', label: '👥 Users' },
    { name: 'products', label: '🛍️ Products' },
    { name: 'orders', label: '📦 Orders' },
    { name: 'settings', label: '⚙️ Settings' }
  ]
  
  // Load products when viewing Products tab
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const db = await getDB()
        const allProducts = await db.getAll('products')
        setProducts(allProducts)
      } catch (error) {
        console.error('Error loading products:', error)
      }
    }
    
    if (activeTab === 'products') {
      loadProducts()
    }
  }, [activeTab])
  
  const handleSaveProduct = async () => {
    if (!editingProduct) return
    
    try {
      const db = await getDB()
      await db.put('products', editingProduct)
      
      // Check if product contains XSS payload
      const hasXSS = (editingProduct.name && (editingProduct.name.includes('<script>') || editingProduct.name.includes('<img') || editingProduct.name.includes('onerror='))) ||
                     (editingProduct.description && (editingProduct.description.includes('<script>') || editingProduct.description.includes('<img') || editingProduct.description.includes('onerror=')))
      
      if (hasXSS) {
        const completed = await completeChallenge('storedXss')
        if (completed && window.showChallengeToast) {
          window.showChallengeToast(
            'Stored XSS',
            'You injected malicious code into the product database! This code will now execute for everyone who views this product. Stored XSS is more dangerous than reflected XSS because the attack persists and affects all users.'
          )
        }
      }
      
      // Reload products
      const allProducts = await db.getAll('products')
      setProducts(allProducts)
      setEditingProduct(null)
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

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
                  onClick={() => handleTabChange(tab.name)}
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
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Session Token</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">{user.email}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {visiblePasswords.has(user.id) ? (
                              <span className="text-xs font-mono text-red-600 font-semibold">
                                {user.role === 'admin' ? 'admin123' : user.password}
                              </span>
                            ) : (
                              <span className="text-xs font-mono text-gray-400">••••••••••</span>
                            )}
                            <button
                              onClick={() => togglePasswordVisibility(user.id, user.role)}
                              className="text-gray-500 hover:text-gray-700 transition text-lg"
                              title={visiblePasswords.has(user.id) ? 'Hide password' : 'Show password'}
                            >
                              {visiblePasswords.has(user.id) ? '👁️' : '🔒'}
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-red-600 bg-red-50 px-2 py-1 rounded">
                              {user.sessionToken.substring(0, 30)}...
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(user.sessionToken)
                                setShowModal(true)
                              }}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              📋 Copy
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin' 
                              ? 'bg-red-100 text-red-700' 
                              : user.role === 'employee'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
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

          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🛍️ Products</h2>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                    {editingProduct?.id === product.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                          <textarea
                            value={editingProduct.description || ''}
                            onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Price ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveProduct}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingProduct(null)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                          <p className="text-xl font-bold text-blue-600 mt-2">${product.price}</p>
                        </div>
                        <button
                          onClick={() => setEditingProduct({...product})}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                        >
                          ✏️ Edit
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📦 Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800">{order.userId ? `User ID: ${order.userId}` : 'Guest'}</p>
                          <p className="text-sm text-gray-600">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">${order.total.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">Order #{order.id}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
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
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Database Credentials</h3>
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
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">API Keys</h3>
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

              {/* Sensitive Information */}
              
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="📋 Token Copied"
        message="Session token copied! Replace your session cookie in DevTools (Application → Cookies) with this token, then refresh the page."
        type="alert"
        onConfirm={() => setShowModal(false)}
      />

      <CredentialsModal
        isOpen={showCredentialsModal}
        onClose={() => setShowCredentialsModal(false)}
        onCorrect={handleCredentialsCorrect}
      />
    </div>
  )
}
