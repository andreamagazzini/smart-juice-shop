import { prisma } from './db'
import { verifyJWT, extractTokenFromHeader, verifyPassword } from './security'
import { NextRequest } from 'next/server'

export async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = extractTokenFromHeader(authHeader)
  
  if (!token) {
    return null
  }

  const payload = verifyJWT(token)
  if (!payload || !payload.userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId }
  })

  return user
}

export async function requireAuth(request: NextRequest) {
  const user = await getUserFromRequest(request)
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}
