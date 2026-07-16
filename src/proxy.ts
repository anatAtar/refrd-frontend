import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/join',          // invite landing pages
];

const ONBOARDING_PATHS = ['/onboarding'];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasToken = req.cookies.has('access_token');

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isOnboarding = ONBOARDING_PATHS.some((p) => pathname.startsWith(p));

  // Unauthenticated → login
  if (!hasToken && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Authenticated hitting auth pages → feed
  if (hasToken && isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = '/feed';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public|api/).*)'],
};
