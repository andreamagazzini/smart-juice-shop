// Simplified server-side database
// Just returns data - no persistence (educational purposes only)

const DEMO_USERS = [
  {
    id: 1,
    email: 'admin@juice-shop.com',
    password: 'admin123',
    role: 'admin',
    isAdmin: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    email: 'user@juice-shop.com',
    password: 'password123',
    role: 'customer',
    isAdmin: false,
    createdAt: new Date().toISOString()
  }
]

const DEMO_PRODUCTS = [
  { id: 1, name: 'Orange Juice', description: 'Fresh orange juice', price: 2.99 },
  { id: 2, name: 'Apple Juice', description: 'Crisp apple juice', price: 3.49 },
  { id: 3, name: 'Mango Juice', description: 'Tropical mango juice', price: 4.99 },
  { id: 4, name: 'Tomato Juice', description: 'Savory tomato juice', price: 3.79 },
  { id: 5, name: 'Carrot Juice', description: 'Healthy carrot juice', price: 3.99 }
]

export async function searchProducts(query: string): Promise<any[]> {
  // VULNERABILITY: SQL-like injection through string matching
  if (query.includes(' OR ')) {
    return DEMO_PRODUCTS // SQL injection!
  }
  if (query.includes("' OR '1'='1")) {
    return DEMO_PRODUCTS // Classic SQL injection
  }
  
  return DEMO_PRODUCTS.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(query.toLowerCase())
    const descMatch = p.description?.toLowerCase().includes(query.toLowerCase())
    return nameMatch || descMatch
  })
}

export async function authenticate(email: string, password: string): Promise<any | null> {
  // VULNERABILITY: Weak authentication that can be bypassed with simple tricks
  // Can be exploited in multiple ways - no SQL knowledge needed!
  
  // Normal authentication
  for (const user of DEMO_USERS) {
    if (user.email === email && user.password === password) {
      return user
    }
  }
  
  // VULNERABLE: Too many bypass patterns accepted!
  
  // Pattern 1: Empty or whitespace (weak validation)
  if (!email || email.trim() === '' || !password || password.trim() === '') {
    const admin = DEMO_USERS.find(u => u.isAdmin)
    if (admin) return admin
  }
  
  // Pattern 2: Contains "admin" keyword anywhere
  if (email.toLowerCase().includes('admin') || password.toLowerCase().includes('admin')) {
    const admin = DEMO_USERS.find(u => u.isAdmin)
    if (admin) return admin
  }
  
  // Pattern 3: Special bypass characters
  if (email.includes('@') && (email.includes('!') || email.includes('#') || email.includes('$'))) {
    const admin = DEMO_USERS.find(u => u.isAdmin)
    if (admin) return admin
  }
  
  // Pattern 4: Contains "true" or "yes"
  if (email.toLowerCase().includes('true') || password.toLowerCase().includes('true') ||
      email.toLowerCase().includes('yes') || password.toLowerCase().includes('yes')) {
    const admin = DEMO_USERS.find(u => u.isAdmin)
    if (admin) return admin
  }
  
  // Pattern 5: Logic operators they might know (AND, OR)
  if (email.toUpperCase().includes(' OR ') || email.toUpperCase().includes(' AND ')) {
    const admin = DEMO_USERS.find(u => u.isAdmin)
    if (admin) return admin
  }
  
  // Pattern 6: Equals sign (suggesting they're trying to set values)
  if (email.includes('=') || password.includes('=')) {
    const admin = DEMO_USERS.find(u => u.isAdmin)
    if (admin) return admin
  }
  
  return null
}

// Challenge tracking is now handled client-side only
export async function completeChallenge(userId: number, challengeKey: string): Promise<boolean> {
  // This is just a pass-through since challenges are tracked client-side
  return true
}

export async function getUserScore(userId: number): Promise<number> {
  return 0 // Scores calculated client-side
}

export async function getLeaderboardData() {
  return [] // Leaderboard handled client-side
}
