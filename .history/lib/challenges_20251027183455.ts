import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface Challenge {
  key: string
  name: string
  category: string
  difficulty: number
  description: string
  hints?: string[]
}

export const CHALLENGES: Record<string, Challenge> = {
  loginAdmin: {
    key: 'loginAdmin',
    name: 'Login Admin',
    category: 'Broken Authentication',
    difficulty: 1,
    description: 'Log in with the admin user account'
  },
  weakPassword: {
    key: 'weakPassword',
    name: 'Weak Password',
    category: 'Broken Authentication',
    difficulty: 1,
    description: 'Log in with the admin user account using password "admin123"'
  },
  sqlInjectionLogin: {
    key: 'sqlInjectionLogin',
    name: 'SQL Injection (Login)',
    category: 'Injection',
    difficulty: 3,
    description: 'Log in with a SQL injection attack'
  },
  sqlInjectionSearch: {
    key: 'sqlInjectionSearch',
    name: 'SQL Injection (Search)',
    category: 'Injection',
    difficulty: 3,
    description: 'Extract sensitive data via SQL injection in the search'
  },
  reflectedXss: {
    key: 'reflectedXss',
    name: 'Reflected XSS',
    category: 'XSS',
    difficulty: 2,
    description: 'Perform a reflected XSS attack with <iframe src="javascript:alert(`xss`)">'
  },
  persistedXssFeedback: {
    key: 'persistedXssFeedback',
    name: 'Persisted XSS (Feedback)',
    category: 'XSS',
    difficulty: 4,
    description: 'Perform a persisted XSS attack'
  },
  accessAdminSection: {
    key: 'accessAdminSection',
    name: 'Access Admin Section',
    category: 'Broken Access Control',
    difficulty: 2,
    description: 'Access the administration section'
  },
  negativeOrder: {
    key: 'negativeOrder',
    name: 'Negative Order',
    category: 'Improper Input Validation',
    difficulty: 3,
    description: 'Place an order with a negative total amount'
  },
  bypassPaywall: {
    key: 'bypassPaywall',
    name: 'Bypass Deluxe Membership',
    category: 'Broken Access Control',
    difficulty: 4,
    description: 'Access a deluxe member feature without being a deluxe member'
  }
}

export async function solveChallenge(userId: number, challengeKey: string): Promise<boolean> {
  const challenge = await prisma.challenge.findUnique({
    where: { key: challengeKey }
  })

  if (!challenge) {
    return false
  }

  // Check if already completed
  const existing = await prisma.completedChallenge.findUnique({
    where: {
      userId_challengeId: {
        userId,
        challengeId: challenge.id
      }
    }
  })

  if (existing) {
    return false // Already completed
  }

  // Mark as completed
  await prisma.completedChallenge.create({
    data: {
      userId,
      challengeId: challenge.id
    }
  })

  return true
}

export async function isChallengeSolved(userId: number, challengeKey: string): Promise<boolean> {
  const challenge = await prisma.challenge.findUnique({
    where: { key: challengeKey }
  })

  if (!challenge) {
    return false
  }

  const completed = await prisma.completedChallenge.findUnique({
    where: {
      userId_challengeId: {
        userId,
        challengeId: challenge.id
      }
    }
  })

  return !!completed
}

export async function getUserScore(userId: number): Promise<number> {
  const completed = await prisma.completedChallenge.findMany({
    where: { userId },
    include: { Challenge: true }
  })

  return completed.reduce((sum, cc) => sum + cc.Challenge.difficulty, 0)
}

export async function getLeaderboard() {
  const users = await prisma.completedChallenge.groupBy({
    by: ['userId'],
    _count: { challengeId: true }
  })

  const leaderboard = await Promise.all(
    users.map(async (u) => {
      const user = await prisma.user.findUnique({
        where: { id: u.userId },
        select: { email: true }
      })
      const score = await getUserScore(u.userId)
      return { email: user?.email || 'Unknown', score, challenges: u._count.challengeId }
    })
  )

  return leaderboard.sort((a, b) => b.score - a.score)
}
