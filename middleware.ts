import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define protected routes that require authentication
  const protectedRoutes = [
    '/polls/create',
    '/auth/profile',
  ];
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isProtectedRoute) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    // If no session exists, redirect to sign-in page
    if (!session) {
      const redirectUrl = new URL('/auth/sign-in', request.url);
      // Add the original URL as a query parameter to redirect back after login
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/polls/create/:path*',
    '/auth/profile/:path*',
  ],
};