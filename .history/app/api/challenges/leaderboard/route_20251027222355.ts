import { NextResponse } from 'next/server'
import { getLeaderboardData } from '@/lib/server-db'

export async function GET() {
  try {
    const leaderboard = await getLeaderboardData()
    
    return NextResponse.json(
      leaderboard.sort((a, b) => b.score - a.score)
    )
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}
