import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; 

import { auth } from '@/auth'; 

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  const session = await auth(); 

  const isLoggedIn = !!session?.user;
  const userRole = session?.user?.role;

  const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
  const isOnUsersPage = nextUrl.pathname.startsWith('/dashboard/users');


  if (isOnUsersPage) {
    if (!isLoggedIn || userRole !== 'admin') {
      console.log(`ACCESS DENIED: User role '${userRole}' tried to access /dashboard/users. Redirecting to /dashboard.`);
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
    return NextResponse.next();
  } 
  else if (isOnDashboard) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
    return NextResponse.next();
  }
  else if (isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }
  return NextResponse.next();
}


export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};