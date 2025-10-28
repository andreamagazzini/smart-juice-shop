import { NextRequest, NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  // Clear session cookie
  response.cookies.set('session', '', {
    expires: new Date(0),
    path: '/',
    httpOnly: false,
    secure: false,
    sameSite: 'lax'
  })
  
  return response
}
