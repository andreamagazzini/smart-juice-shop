// Server-side mock database for API routes
// This simulates the browser storage in a server-compatible way

interface User {
  id: number
  email: string
  password: string
  role: string
  isAdmin: boolean
  createdAt: string
}

interface Product {
  id: number
  name: string
  description?: string
  price: number
  image?: string
  deletedAt?: string
}

interface CompletedChallenge {
  userId: number
  challengeId: string
  completedAt: string
}

// In-memory database (persists only during server runtime)
let inMemoryDB = {
  users: [
    {
      id: 1,
      email: 'admin@juice-shop.herokuapp.com',
      password: 'admin123',
      role: 'admin',
      isAdmin: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      email: 'user@juice-shop.herokuapp.com',
      password: 'password123',
      role: 'customer',
      isAdmin: false,
      createdAt: new Date().toISOString()
    }
  ] as User[],
  products: [
    { id: 1, name: 'Orange Juice', description: 'Fresh orange juice', price: 2.99 },
    { id: 2, name: 'Apple Juice', description: 'Crisp apple juice', price: 3.49 },
    { id: 3, name: 'Mango Juice', description: 'Tropical mango juice', price: 4.99 },
    { id: 4, name: 'Tomato Juice', description: 'Savory tomato juice', price: 3.79 },
    { id: 5, name: 'Carrot Juice', description: 'Healthy carrot juice', price: 3.99 }
  ] as Product[],
  completedChallenges: [] as CompletedChallenge[]
}

export async function searchProducts(query: string): Promise<any[]> {
  const products = inMemoryDB.products
  
  // VULNERABILITY: SQL-like injection through string matching
  if (query.includes(' OR ')) {
    return products // SQL injection!
  }
  if (query.includes("' OR '1'='1")) {
    return products // Classic SQL injection
  }
  
  return products.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(query.toLowerCase())
    const descMatch = p.description?.toLowerCase().includes(query.toLowerCase())
    return nameMatch || descMatch
  })
}

export async function authenticate(email: string, password: string): Promise<any | null> {
  const users = inMemoryDB.users
  
  // VULNERABILITY: SQL-like query with direct string match
  // Can be exploited with: ' OR '1'='1
  for (const user of users) {
    if (user.email === email && user.password === password) {
      return user
    }
  }
  
  // Also check for SQL injection pattern in email field
  if (email.includes("' OR") || email.includes(' OR ')) {
    // Return first admin user - SQL injection successful!
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

export async function completeChallenge(userId: number, challengeKey: string): Promise<boolean> {
  // Check if already completed
  const existing = inMemoryDB.completedChallenges.find(
    c => c.userId === userId && c.challengeId === challengeKey
  )
  
  if (existing) {
    return false // Already completed
  }
  
  // Mark as completed
  inMemoryDB.completedChallenges.push({
    userId,
    challengeId: challengeKey,
    completedAt: new Date().toISOString()
  })
  
  return true
}

export async function getUserScore(userId: number): Promise<number> {
  const completed = inMemoryDB.completedChallenges.filter(c => c.userId === userId)
  // Simple scoring - 10 points per challenge
  return completed.length * 10
}

export async function getLeaderboardData() {
  const users = inMemoryDB.users
  const completedChallenges = inMemoryDB.completedChallenges
  
  return Promise.all(
    users.map(async (user) => {
      const score = await getUserScore(user.id)
      const userCompleted = completedChallenges.filter(c => c.userId === user.id)
      
      return {
        email: user.email,
        score,
        challenges: userCompleted.length
      }
    })
  )
}
