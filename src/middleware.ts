import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper function to clear auth cookie
function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.set('auth-token', '', {
    expires: new Date(0),
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  return response;
}

// Helper function to validate token with API
async function validateTokenWithAPI(token: string, baseURL: string): Promise<boolean> {
  try {
    const response = await fetch(`${baseURL}/api/admin/Auth/checkAuth`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000) // 5 seconds timeout
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.isAuthenticated === true;
  } catch (error) {
    // If API is unreachable or times out, assume token is invalid
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const isAuthPage = request.nextUrl.pathname === '/auth';
  const isProtectedPage = request.nextUrl.pathname.startsWith('/adminPanel');

  // Get base URL for API calls
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 
                  (request.nextUrl.origin.includes('localhost') 
                    ? 'http://localhost:3000' 
                    : request.nextUrl.origin);

  // If no token exists
  if (!token) {
    if (isProtectedPage) {
      const url = new URL('/auth', request.url);
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // If token exists, validate it with the API (only for protected pages or auth page)
  if (isProtectedPage || isAuthPage) {
    const isValidToken = await validateTokenWithAPI(token, baseURL);

    if (!isValidToken) {
      // Token is invalid, clear it and handle redirect
      if (isProtectedPage) {
        const url = new URL('/auth', request.url);
        url.searchParams.set('redirect', request.nextUrl.pathname);
        const response = NextResponse.redirect(url);
        return clearAuthCookie(response);
      }
      
      if (isAuthPage) {
        // Clear invalid token but stay on auth page
        const response = NextResponse.next();
        return clearAuthCookie(response);
      }
    } else {
      // Token is valid
      if (isAuthPage) {
        // Redirect authenticated users away from auth page
        const redirectTo = request.nextUrl.searchParams.get('redirect') || '/';
        return NextResponse.redirect(new URL(redirectTo, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/adminPanel/:path*', 
    '/auth',
    // Add any other protected routes here
  ]
};