import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const isAuthPage = request.nextUrl.pathname === '/sign-up-login-screen';
  const isPublicPage = request.nextUrl.pathname === '/' || isAuthPage;

  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL('/sign-up-login-screen', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)'],
};
