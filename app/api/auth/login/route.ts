import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken } from '@/lib/security'

// Note: This is a server-side API route, but we're keeping it simple
// In a real app, authentication would happen server-side with a real database
// For this educational app, the actual auth logic is client-side in browser-db

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Simple server-side validation - actual auth happens client-side
    // This just creates the session token after client validates credentials
    
    // Create session token (we trust client has validated credentials)
    const token = createSessionToken(1, email)
    
    // Set cookie with session token
    const response = NextResponse.json({
      success: true,
      user: { email, id: 1 },
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
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    )
  }
}
