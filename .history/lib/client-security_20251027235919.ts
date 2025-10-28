// Client-side version of security functions that can run in the browser
// IMPORTANT: This should match the server-side implementation exactly!

export function createSessionTokenClient(userId: number, email: string): string {
  // VULNERABLE: Using a weak, hardcoded JWT secret (must match server)
  const SECRET = 'secret'
  
  // VULNERABLE: Adding expiry but it's not validated
  const tokenPayload = {
    userId,
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  }
  
  // Browser-compatible base64url encoding
  const base64url = (str: string) => {
    return btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }
  
  // Create JWT-like token (matching server implementation)
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64url(JSON.stringify(tokenPayload))
  
  // For educational purposes, we'll use a simple signature that matches the server
  // The server uses HMAC-SHA256, but for simplicity we'll use a hash
  const dataToSign = `${header}.${body}`
  const signature = btoa(dataToSign + SECRET)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
    .substring(0, 43) // JWT signatures are usually 43 chars
  
  return `${header}.${body}.${signature}`
}
