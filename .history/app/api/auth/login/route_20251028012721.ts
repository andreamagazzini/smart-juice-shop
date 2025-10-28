import { NextRequest, NextResponse } from 'next/server'
import { authenticate, completeChallenge } from '@/lib/server-db'
import { createSessionToken } from '@/lib/security'

// VULNERABLE: Authentication with potential SQL injection
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // VULNERABILITY: Direct authentication without proper escaping
    const user = await authenticate(email, password)
    
    if (user) {
      // Check for challenge completions
      if (user.email === 'admin@juice-shop.com') {
        await completeChallenge(user.id, 'loginAdmin')
      }
      
      // Check for default credentials (admin@admin.com / admin)
      if (email === 'admin@admin.com' && password === 'admin') {
        await completeChallenge(user.id, 'defaultCredentials')
      }
      
      // Check for weak password (admin123)
      if (password === 'admin123') {
        await completeChallenge(user.id, 'weakPassword')
      }

      // Create session token
      const token = createSessionToken(user.id, user.email)
      
      // Return user data (without password)
      const { password: _, ...userWithoutPassword } = user
      
      // Set cookie with session token
      const response = NextResponse.json({
        success: true,
        user: userWithoutPassword,
        message: 'Login successful!'
      })
      
      // VULNERABLE: Weak session cookie settings
      // httpOnly set to false to allow client-side access for session hijacking demo
      response.cookies.set('session', token, {
        httpOnly: false, // VULNERABLE: Not httpOnly allows JS access
        secure: false, // VULNERABLE: Not HTTPS only
        sameSite: 'lax', // Could be stricter
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
      
      return response
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    )
  }
}
