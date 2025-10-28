import { NextRequest, NextResponse } from 'next/server'
import { searchProducts } from '@/lib/server-db'

// VULNERABLE: Search with SQL injection vulnerabilities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    // VULNERABILITY: Search without proper input validation
    const products = await searchProducts(query)

    // Check for SQL injection patterns in the search query
    const hasSQLInjection = 
      query.includes("' OR") || 
      query.includes(' OR ') || 
      query.includes('1=1') ||
      query.includes("' UNION") ||
      query.includes(' UNION ')

    if (hasSQLInjection) {
      // Log that SQL injection was attempted (for challenge tracking)
      return NextResponse.json({ 
        products,
        sqlInjectionDetected: true,
        message: 'SQL injection pattern detected! Challenge: sqlInjectionSearch'
      })
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
