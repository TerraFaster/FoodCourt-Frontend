// middleware.js (in your project root) - Updated for mock auth
import { NextResponse } from 'next/server'

export function middleware(request: { cookies: { get: (arg0: string) => { (): any; new(): any; value: any } }; nextUrl: { pathname: string }; url: string | URL | undefined }) {
  const token = request.cookies.get('auth-token')?.value
  const isAuthPage = request.nextUrl.pathname === '/auth'
  const isProtectedPage = request.nextUrl.pathname === '/adminPanel'

  // Simple mock token validation - just check if it exists and is base64
  const isValidToken = token && token.length > 10
  
  // If user is not authenticated and trying to access protected page
  if (!isValidToken && isProtectedPage) {
    const url = new URL('/auth', request.url)
    // Store the original URL they wanted to visit
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If user is authenticated and on auth page, redirect to admin panel
  if (isValidToken && isAuthPage) {
    return NextResponse.redirect(new URL('/adminPanel', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/adminPanel/:path*', '/auth']
}