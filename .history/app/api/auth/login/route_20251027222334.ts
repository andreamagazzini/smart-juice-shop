import { NextRequest, NextResponse } from 'next/server'
import { authenticate, completeChallenge } from '@/lib/server-db'

// VULNERABLE: Authentication with potential SQL injection
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // VULNERABILITY: Direct authentication without proper escaping
    const user = await authenticate(email, password)
    
    if (user) {
      // Check for challenge completions
      if (user.email === 'admin@juice-shop.herokuapp.com') {
        await completeChallenge(user.id, 'loginAdmin')
      }
      
      if (password === 'admin123') {
        await completeChallenge(user.id, 'weakPassword')
      }

      // Check for SQL injection pattern
      if (email.includes("' OR") || email.includes(' OR ') || email.includes('1=1')) {
        await completeChallenge(user.id, 'sqlInjectionLogin')
      }

      // Return user data (without password)
      const { password: _, ...userWithoutPassword } = user
      
      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        message: 'Login successful!'
      })
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
