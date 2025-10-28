import { NextRequest, NextResponse } from 'next/server'
import { completeChallenge } from '@/lib/server-db'

export async function POST(request: NextRequest) {
  try {
    const { userId, challengeKey } = await request.json()
    
    if (!userId || !challengeKey) {
      return NextResponse.json(
        { error: 'Missing userId or challengeKey' },
        { status: 400 }
      )
    }
    
    const wasNew = await completeChallenge(userId, challengeKey)
    
    return NextResponse.json({ 
      success: wasNew,
      message: wasNew ? 'Challenge completed!' : 'Challenge already completed'
    })
  } catch (error) {
    console.error('Solve challenge error:', error)
    return NextResponse.json(
      { error: 'Failed to solve challenge' },
      { status: 500 }
    )
  }
}
