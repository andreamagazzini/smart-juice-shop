import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/browser-db'
import { createSessionToken } from '@/lib/security'

// VULNERABLE: This endpoint exposes session tokens without proper authorization
export async function GET() {
  try {
    const db = await getDB()
    const users = await db.getAll('users')
    
    // Generate session tokens for each user
    const usersWithTokens = users.map(user => ({
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
