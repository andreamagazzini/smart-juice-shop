import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return empty array since leaderboard is handled client-side
    return NextResponse.json([])
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}
