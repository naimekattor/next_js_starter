import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse, NextFetchEvent } from 'next/server';

const authPaths = ['/login', '/signup', '/forgot-password', '/reset-password'];

/**
 * NextAuth Middleware handler instance
 */
const authMiddleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. Redirect authenticated users away from public auth forms to the dashboard
    if (authPaths.includes(path) && token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // 2. Protect Admin panel from unauthorized users (Role-Based Access Control)
    if (path.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Let any anonymous user view public auth forms
        if (authPaths.includes(path)) {
          return true;
        }
        
        // Guard all other matched paths (dashboard, profile, admin)
        return !!token;
      },
    },
  }
);

// Define match rules for route matching
export const config = {
  matcher: [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/admin/:path*',
  ],
};

/**
 * Route Proxy (Formerly Middleware) - Next.js 16 Standard
 * 
 * WHO SHOULD USE IT: Routing pipeline.
 * WHEN TO MODIFY: Adding new private path groups or changing authorization rules (RBAC rules).
 */
export function proxy(request: Request, event: NextFetchEvent) {
  // Delegate the request execution to next-auth's middleware handler
  return authMiddleware(request as unknown as NextRequestWithAuth, event);
}
