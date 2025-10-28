import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken } from '@/lib/security'

// VULNERABLE: This endpoint exposes session tokens without proper authorization
// Using in-memory server data for users
const serverUsers = [
  { id: 1, email: 'admin@juice-shop.com', password: 'admin123', role: 'admin' },
  { id: 2, email: 'user@juice-shop.com', password: 'password123', role: 'customer' }
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
