import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/security'

// API endpoint to get current user from session cookie
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session')?.value
    
    if (!sessionToken) {
      return NextResponse.json({ user: null })
    }
    
    // Decode the token to get the user info
    const payload = verifyJWT(sessionToken)
    
    if (!payload || !payload.userId || !payload.email) {
      return NextResponse.json({ user: null })
    }
    
    return NextResponse.json({
      user: {
        email: payload.email,
        isAdmin: payload.email === 'admin@juice-shop.com'
      }
    })
  } catch (error) {
    console.error('Error getting current user:', error)
    return NextResponse.json({ user: null })
  }
}
