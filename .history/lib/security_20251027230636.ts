import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function createJWT(payload: any): string {
  // VULNERABLE: Using a weak, hardcoded JWT secret
  const SECRET = 'secret'
  
  // VULNERABLE: Adding expiry but it's not validated
  const tokenPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  }
  
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url')
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(`${header}.${body}`)
    .digest('base64url')
  
  return `${header}.${body}.${signature}`
}

export function createSessionToken(userId: number, email: string): string {
  return createJWT({ userId, email })
}

export function verifyJWT(token: string): any {
  try {
    // VULNERABLE: Accepting unsigned JWTs
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const body = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
    return body
  } catch {
    return null
  }
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

export function getCurrentUser(token: string): { userId: number; email: string } | null {
  const payload = verifyJWT(token)
  if (!payload || !payload.userId) {
    return null
  }
  return { userId: payload.userId, email: payload.email }
}

// VULNERABLE: Weak session ID generation
export function generateSessionId(): string {
  // VULNERABLE: Predictable session IDs (timestamp-based)
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return Buffer.from(`${timestamp}-${random}`).toString('base64').substring(0, 16)
}
