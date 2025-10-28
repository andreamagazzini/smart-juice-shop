// Client-side version of security functions that can run in the browser
// Using Web APIs instead of Node.js modules

export function createJWTClient(payload: any): string {
  // VULNERABLE: Using a weak, hardcoded JWT secret
  const SECRET = 'secret'
  
  // VULNERABLE: Adding expiry but it's not validated
  const tokenPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  }
  
  // Browser-compatible base64url encoding
  const base64url = (str: string) => {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }
  
  // Simple HMAC-SHA256 for browser
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64url(JSON.stringify(tokenPayload))
  
  // For simplicity, we'll create a pseudo-signature
  // In real JWT, this would be HMAC-SHA256 of header+body
  const signature = btoa(`${header}.${body}`).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  
  return `${header}.${body}.${signature}`
}

export function createSessionTokenClient(userId: number, email: string): string {
  return createJWTClient({ userId, email })
}

