'use client'

interface CredentialsModalProps {
  isOpen: boolean
  onClose: () => void
  onCorrect: () => void
}

export default function CredentialsModal({ isOpen, onClose, onCorrect }: CredentialsModalProps) {
  const [error, setError] = useState('')
  const [credentials, setCredentials] = useState({
    database: '',
    host: '',
    port: '',
    username: '',
    password: ''
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Check if credentials match (vulnerable check!)
    const isCorrect = 
      credentials.database === 'juice_shop_production' &&
      credentials.host === 'db.juice-shop.com' &&
      credentials.port === '5432' &&
      credentials.username === 'admin' &&
      credentials.password === 'super_secret_password_123'

    if (isCorrect) {
      // Save credentials to localStorage
      localStorage.setItem('dbCredentials', JSON.stringify(credentials))
      onCorrect()
    } else {
      setError('Invalid credentials. Please try again.')
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      // Don't allow closing by clicking backdrop - they must enter credentials
      e.preventDefault()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 transform transition-all">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔐 Enter Database Credentials</h2>
        <p className="text-gray-600 mb-6">Please provide the database credentials to access user data.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Database</label>
            <input
              type="text"
              value={credentials.database}
              onChange={(e) => setCredentials({ ...credentials, database: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              placeholder="juice_shop_production"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Host</label>
            <input
              type="text"
              value={credentials.host}
              onChange={(e) => setCredentials({ ...credentials, host: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              placeholder="db.juice-shop.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Port</label>
            <input
              type="text"
              value={credentials.port}
              onChange={(e) => setCredentials({ ...credentials, port: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              placeholder="5432"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              placeholder="super_secret_password_123"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition"
            >
              💾 Save Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

