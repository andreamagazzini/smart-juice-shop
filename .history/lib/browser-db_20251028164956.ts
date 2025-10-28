// Browser-based database using IndexedDB
import { openDB, DBSchema, IDBPDatabase } from 'idb'

// Database Schema
interface JuiceShopDBSchema extends DBSchema {
  users: {
    key: string
    value: {
      id: number
      email: string
      password: string
      role: string
      isAdmin: boolean
      createdAt: string
    }
  }
  products: {
    key: number
    value: {
      id: number
      name: string
      description?: string
      price: number
      image?: string
      deletedAt?: string
    }
  }
  baskets: {
    key: number
    value: {
      id: number
      userId: number
      createdAt: string
      updatedAt: string
      items: any[]
    }
  }
  orders: {
    key: number
    value: {
      id: number
      userId: number
      totalPrice: number
      createdAt: string
    }
  }
  reviews: {
    key: number
    value: {
      id: number
      productId: number
      rating: number
      comment?: string
      createdAt: string
    }
  }
  challenges: {
    key: string
    value: {
      key: string
      name: string
      category: string
      difficulty: number
      description: string
      solved: boolean
      hints?: string
    }
  }
  completedChallenges: {
    key: string // "userId-challengeId"
    value: {
      userId: number
      challengeId: string
      completedAt: string
    }
  }
}

let dbInstance: IDBPDatabase<JuiceShopDBSchema> | null = null

export async function getDB() {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<JuiceShopDBSchema>('juice-shop-db', 1, {
    upgrade(db) {
      // Users store
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'email' })
      }
      
      // Products store
      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: 'id', autoIncrement: true })
      }
      
      // Baskets store
      if (!db.objectStoreNames.contains('baskets')) {
        db.createObjectStore('baskets', { keyPath: 'id', autoIncrement: true })
      }
      
      // Orders store
      if (!db.objectStoreNames.contains('orders')) {
        db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true })
      }
      
      // Reviews store
      if (!db.objectStoreNames.contains('reviews')) {
        db.createObjectStore('reviews', { keyPath: 'id', autoIncrement: true })
      }
      
      // Challenges store
      if (!db.objectStoreNames.contains('challenges')) {
        db.createObjectStore('challenges', { keyPath: 'key' })
      }
      
      // Completed challenges store
      if (!db.objectStoreNames.contains('completedChallenges')) {
        db.createObjectStore('completedChallenges', { keyPath: 'id', autoIncrement: true })
      }
    }
  })

  // Seed initial data if empty
  const hasUsers = await dbInstance.count('users')
  const hasProducts = await dbInstance.count('products')
  
  // Always remove persistedXss challenge if it exists
  try {
    const persistedXss = await dbInstance.get('challenges', 'persistedXss')
    if (persistedXss) {
      await dbInstance.delete('challenges', 'persistedXss')
    }
  } catch (e) {
    // Challenge doesn't exist, that's fine
  }
  
  if (hasUsers === 0 || hasProducts === 0) {
    await seedDatabase(dbInstance)
  } else {
    // Database exists, update challenges in case new ones were added
    await updateChallenges(dbInstance)
  }

  return dbInstance
}

// Seed initial data
async function seedDatabase(db: IDBPDatabase<JuiceShopDBSchema>) {
  // Check if already seeded
  const productCount = await db.count('products')
  if (productCount > 0) {
    // Check if we need to remove the old user
    try {
      await db.delete('users', 'user@juice-shop.com')
    } catch (e) {
      // User doesn't exist, that's fine
    }
    return // Already seeded, don't add more
  }
  
  // Users - Default credentials user (admin@admin.com / admin)
  await db.put('users', {
    id: 1,
    email: 'admin@admin.com',
    password: 'admin',
    role: 'admin',
    isAdmin: true,
    createdAt: new Date().toISOString()
  })

  // Products
  const products = [
    { id: 1, name: 'Orange Juice', description: 'Fresh orange juice', price: 2.99 },
    { id: 2, name: 'Apple Juice', description: 'Crisp apple juice', price: 3.49 },
    { id: 3, name: 'Mango Juice', description: 'Tropical mango juice', price: 4.99 },
    { id: 4, name: 'Tomato Juice', description: 'Savory tomato juice', price: 3.79 },
    { id: 5, name: 'Carrot Juice', description: 'Healthy carrot juice', price: 3.99 }
  ]

  for (const product of products) {
    await db.put('products', product)
  }

  // Challenges - Organized by OWASP Top 10 Categories (9 total)
  const challenges = [
    // A01:2021 – Broken Access Control (Risk #1)
    { key: 'accessAdminSection', name: 'Access Admin Section', category: 'Broken Access Control', difficulty: 1, description: 'Access the administration section without authorization', solved: false },
    { key: 'exposeSensitiveData', name: 'View Other Users\' Data', category: 'Broken Access Control', difficulty: 2, description: 'Access sensitive user data by entering database credentials', solved: false },
    
    // A02:2021 – Cryptographic Failures (Risk #2)  
    { key: 'plaintextPassword', name: 'View Plaintext Passwords', category: 'Cryptographic Failures', difficulty: 2, description: 'Find a password stored in plain text', solved: false },
    
    // A03:2021 – Injection (Risk #3)
    { key: 'sqlInjectionSearch', name: 'SQL Injection (Search)', category: 'Injection', difficulty: 3, description: 'Extract data via SQL injection in search', solved: false },
    { key: 'reflectedXss', name: 'Reflected XSS', category: 'Injection', difficulty: 1, description: 'Perform a reflected XSS attack in search', solved: false },
    
    // A05:2021 – Security Misconfiguration (Risk #5)
    { key: 'defaultCredentials', name: 'Use Default Credentials', category: 'Security Misconfiguration', difficulty: 1, description: 'Log in using default credentials', solved: false },
    
    // A07:2021 – Identification and Authentication Failures (Risk #7)
    { key: 'sessionHijacking', name: 'Session Hijacking', category: 'Authentication Failures', difficulty: 3, description: 'Hijack another user\'s session token', solved: false },
    { key: 'weakPassword', name: 'Use Weak Password', category: 'Authentication Failures', difficulty: 1, description: 'Log in using a weak password', solved: false },
    
    // Others
    { key: 'negativeOrder', name: 'Manipulate Price', category: 'Improper Input Validation', difficulty: 3, description: 'Place an order with manipulated price', solved: false }
  ]

  for (const challenge of challenges) {
    await db.put('challenges', challenge)
  }
}

// Update challenges when they're added to the code
async function updateChallenges(db: IDBPDatabase<JuiceShopDBSchema>) {
  // Check if we need to remove persistedXss challenge
  try {
    const existingChallenge = await db.get('challenges', 'persistedXss')
    if (existingChallenge) {
      await db.delete('challenges', 'persistedXss')
    }
  } catch (e) {
    // Challenge doesn't exist, that's fine
  }
}

// VULNERABLE: SQL-like query in browser
export async function searchProducts(query: string): Promise<any[]> {
  const db = await getDB()
  const products = await db.getAll('products')
  
  // VULNERABILITY: SQL-like injection through string matching
  // Student can exploit with: ' OR '1'='1
  return products.filter(p => {
    // Simulating SQL LIKE query
    const nameMatch = p.name.toLowerCase().includes(query.toLowerCase())
    const descMatch = p.description?.toLowerCase().includes(query.toLowerCase())
    
    // VULNERABLE: Direct SQL-like string evaluation
    // If query contains SQL operators, we'll parse them!
    if (query.includes(' OR ')) {
      return true // SQL injection!
    }
    if (query.includes("' OR '1'='1")) {
      return true // Classic SQL injection
    }
    
    return nameMatch || descMatch
  })
}

// VULNERABLE: Authentication with direct password comparison
export async function authenticate(email: string, password: string): Promise<any | null> {
  const db = await getDB()
  
  // VULNERABILITY: SQL-like query with direct string match
  // Can be exploited with: ' OR '1'='1
  const users = await db.getAll('users')
  
  for (const user of users) {
    // Vulnerable: string interpolation pattern
    if (user.email === email && user.password === password) {
      return user
    }
  }
  
  // Also check for SQL injection pattern in email field
  if (email.includes("' OR") || email.includes(' OR ')) {
    // Return first user (admin) - SQL injection successful!
    const admin = users.find(u => u.isAdmin)
    if (admin) return admin
  }
  
  // Check for SQL injection in email with 1=1 pattern
  if (email.includes('1') && email.includes('=')) {
    const admin = users.find(u => u.isAdmin)
    if (admin) return admin
  }
  
  return null
}

export async function resetDatabase() {
  const db = await getDB()
  
  // Clear ALL challenges and reseed them (to remove old ones like persistedXss)
  const allChallenges = await db.getAll('challenges')
  for (const challenge of allChallenges) {
    await db.delete('challenges', challenge.key)
  }
  
  // Reseed challenges with the correct list (10 total)
  const challenges = [
    { key: 'accessAdminSection', name: 'Access Admin Section', category: 'Broken Access Control', difficulty: 2, description: 'Access the administration section without authorization', solved: false },
    { key: 'exposeSensitiveData', name: 'View Other Users\' Data', category: 'Broken Access Control', difficulty: 2, description: 'Access sensitive user data by entering database credentials', solved: false },
    { key: 'plaintextPassword', name: 'View Plaintext Passwords', category: 'Cryptographic Failures', difficulty: 1, description: 'Find a password stored in plain text', solved: false },
    { key: 'sqlInjectionSearch', name: 'SQL Injection (Search)', category: 'Injection', difficulty: 3, description: 'Extract data via SQL injection in search', solved: false },
    { key: 'reflectedXss', name: 'Reflected XSS', category: 'Injection', difficulty: 2, description: 'Perform a reflected XSS attack in search', solved: false },
    { key: 'defaultCredentials', name: 'Use Default Credentials', category: 'Security Misconfiguration', difficulty: 1, description: 'Log in using default credentials', solved: false },
    { key: 'sessionHijacking', name: 'Session Hijacking', category: 'Authentication Failures', difficulty: 2, description: 'Hijack another user\'s session token', solved: false },
    { key: 'negativeOrder', name: 'Manipulate Price', category: 'Improper Input Validation', difficulty: 3, description: 'Place an order with manipulated price', solved: false },
    { key: 'weakPassword', name: 'Use Weak Password', category: 'Authentication Failures', difficulty: 1, description: 'Log in using a weak password', solved: false }
  ]
  
  for (const challenge of challenges) {
    await db.put('challenges', challenge)
  }
  
  // Clear completed challenges
  const completedChallenges = await db.getAll('completedChallenges')
  for (const challenge of completedChallenges) {
    await db.delete('completedChallenges', challenge.id)
  }
  
  // Clear baskets
  const baskets = await db.getAll('baskets')
  for (const basket of baskets) {
    await db.delete('baskets', basket.id)
  }
  
  // Clear orders
  const orders = await db.getAll('orders')
  for (const order of orders) {
    await db.delete('orders', order.id)
  }
  
  // Clear reviews
  const reviews = await db.getAll('reviews')
  for (const review of reviews) {
    await db.delete('reviews', review.id)
  }
  
  // Clear all users and reseed
  const allUsers = await db.getAll('users')
  for (const user of allUsers) {
    await db.delete('users', user.email)
  }
  
  // Reseed users
  await db.put('users', {
    id: 1,
    email: 'admin@juice-shop.com',
    password: 'admin123',
    role: 'admin',
    isAdmin: true,
    createdAt: new Date().toISOString()
  })
  
  // Clear localStorage (user session data) - do this first
  localStorage.removeItem('currentUser')
  localStorage.clear()
  sessionStorage.clear()
  
  // Clear session cookie by setting it to expire in the past
  // Try multiple variations to ensure it's cleared
  document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';'
  document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname + ';'
  
  // Small delay to ensure everything is cleared, then reload
  setTimeout(() => {
    window.location.reload()
  }, 200)
}

export async function getAllProducts() {
  const db = await getDB()
  return db.getAll('products')
}

export async function getUser(email: string) {
  const db = await getDB()
  return db.get('users', email)
}

export async function getCompletedChallenges() {
  const db = await getDB()
  const all = await db.getAll('completedChallenges')
  // Remove duplicates - get unique challenge keys
  const uniqueKeys = new Set(all.map(c => c.challengeId))
  return Array.from(uniqueKeys)
}

export async function completeChallenge(challengeKey: string) {
  const db = await getDB()
  
  // Check if already completed
  const existing = await getCompletedChallenges()
  const alreadyCompleted = existing.includes(challengeKey)
  
  if (alreadyCompleted) {
    return false // Already completed
  }
  
  // Mark as completed (use 0 as a placeholder userId since it's global now)
  await db.add('completedChallenges', {
    userId: 0,
    challengeId: challengeKey,
    completedAt: new Date().toISOString()
  })
  
  return true
}

export async function getUserScore(userId: number): Promise<number> {
  const db = await getDB()
  const challenges = await db.getAll('challenges')
  const completed = await getCompletedChallenges(userId)
  
  const challengeMap = new Map(challenges.map(c => [c.key, c]))
  return completed.reduce((sum, cc) => {
    const challenge = challengeMap.get(cc.challengeId)
    return sum + (challenge?.difficulty || 0)
  }, 0)
}

export async function exportData(): Promise<any> {
  const db = await getDB()
  return {
    users: await db.getAll('users'),
    products: await db.getAll('products'),
    completedChallenges: await db.getAll('completedChallenges'),
    challenges: await db.getAll('challenges'),
    exportDate: new Date().toISOString()
  }
}

export async function importData(data: any): Promise<void> {
  const db = await getDB()
  
  // Clear existing data
  await db.clear('users')
  await db.clear('products')
  await db.clear('completedChallenges')
  await db.clear('challenges')
  
  // Import new data
  if (data.users) {
    for (const user of data.users) {
      await db.put('users', user)
    }
  }
  
  if (data.products) {
    for (const product of data.products) {
      await db.put('products', product)
    }
  }
  
  if (data.completedChallenges) {
    for (const cc of data.completedChallenges) {
      await db.add('completedChallenges', cc)
    }
  }
  
  if (data.challenges) {
    for (const challenge of data.challenges) {
      await db.put('challenges', challenge)
    }
  }
}
