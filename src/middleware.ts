import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { COOKIE_NAME, LOCALES, DEFAULT_LOCALE } from '@/lib/locale/config';

// Helper function to detect locale from Accept-Language header
function detectLocaleFromRequest(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  
  if (!acceptLanguage) return DEFAULT_LOCALE;
  
  const languages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase());
  
  for (const lang of languages) {
    if (lang.startsWith('uk') || lang.startsWith('ua')) {
      return 'uk';
    }
    if (lang.startsWith('en')) {
      return 'en';
    }
  }
  
  return DEFAULT_LOCALE;
}

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
      signal: AbortSignal.timeout(5000) // 5 seconds timeout
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.isAuthenticated === true;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Check for locale cookie and set if missing
  const existingLocaleCookie = request.cookies.get(COOKIE_NAME)?.value;
  
  if (!existingLocaleCookie || !LOCALES.includes(existingLocaleCookie as any)) {
    const detectedLocale = detectLocaleFromRequest(request);
    response.cookies.set(COOKIE_NAME, detectedLocale, {
      path: '/',
      maxAge: 31536000, // 1 year
      sameSite: 'lax',
      httpOnly: false // Allow client-side access
    });
  }

  // Handle authentication logic
  const token = request.cookies.get('auth-token')?.value;
  const isAuthPage = request.nextUrl.pathname === '/auth';
  const isProtectedPage = request.nextUrl.pathname.startsWith('/adminPanel');

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 
                  (request.nextUrl.origin.includes('localhost') 
                    ? 'http://localhost:3000' 
                    : request.nextUrl.origin);

  if (!token) {
    if (isProtectedPage) {
      const url = new URL('/auth', request.url);
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  } else {
    if (isProtectedPage || isAuthPage) {
      const isValidToken = await validateTokenWithAPI(token, baseURL);

      if (!isValidToken) {
        if (isProtectedPage) {
          const url = new URL('/auth', request.url);
          url.searchParams.set('redirect', request.nextUrl.pathname);
          const redirectResponse = NextResponse.redirect(url);
          return clearAuthCookie(redirectResponse);
        }
        
        if (isAuthPage) {
          return clearAuthCookie(response);
        }
      } else {
        if (isAuthPage) {
          const redirectTo = request.nextUrl.searchParams.get('redirect') || '/';
          const url = new URL(redirectTo, request.url);
          return NextResponse.redirect(url);
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - Next.js internals
    // - Static files
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ]
};