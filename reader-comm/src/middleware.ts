// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// JWT secret key should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Add the paths that should be protected by authentication
const protectedPaths = [
  '/api/book',
  '/api/book/BookbyCategory',
  '/home',
  '/profile',
  // Add more protected paths as needed
];

// Add the paths that should be public (no authentication needed)
const publicPaths = [
  '/api/user/signup',
  '/api/user/sign-in',
  '/',
  '/login',
  '/register',
  // Add more public paths as needed
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is public
  if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
    return NextResponse.next();
  }

  // Check if the path needs protection
  if (protectedPaths.some(protectedPath => path.startsWith(protectedPath))) {
    try {
      // Get the token from the cookies
      const token = request.cookies.get('token')?.value;

      if (!token) {
        // Redirect to login if no token is found
        return NextResponse.redirect(new URL('/login', request.url));
      }

      try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Add user info to headers for route handlers
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('user', JSON.stringify(decoded));

        // Return response with user info in headers
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      } catch (error) {
        // Token is invalid or expired
        const response = NextResponse.redirect(new URL('/login', request.url));
        
        // Clear the invalid token
        response.cookies.delete('token');
        
        return response;
      }
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // For all other routes, proceed normally
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};