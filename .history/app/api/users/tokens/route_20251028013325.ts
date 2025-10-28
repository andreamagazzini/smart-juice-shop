import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken } from '@/lib/security'

// VULNERABLE: This endpoint exposes session tokens without proper authorization
// Using in-memory server data for users
const serverUsers = [
  { id: 1, email: 'admin@juice-shop.com', password: 'admin123', role: 'admin' },
  { id: 6, email: 'admin@admin.com', password: 'admin', role: 'admin' },
  { id: 7, email: 'employee@juice-shop.com', password: 'employee123', role: 'employee' },
  { id: 8, email: 'worker@juice-shop.com', password: 'worker', role: 'employee' },
  { id: 3, email: 'john.doe@email.com', password: 'MyPass123!', role: 'customer' },
  { id: 4, email: 'sarah.smith@email.com', password: 'securePass456', role: 'customer' },
  { id: 5, email: 'michael.jones@email.com', password: 'mypassword', role: 'customer' }
]

export async function GET() {
  try {
    // Generate session tokens for each user
    const usersWithTokens = serverUsers.map(user => ({
      id: user.id,
      email: user.email,
      sessionToken: createSessionToken(user.id, user.email)
    }))
    
    return NextResponse.json({ users: usersWithTokens })
  } catch (error) {
    console.error('Error fetching user tokens:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user tokens' },
      { status: 500 }
    )
  }
}
