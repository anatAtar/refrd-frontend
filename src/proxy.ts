import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/join',
];

/** Decode the exp claim from a JWT without verifying the signature.
 *  Returns true if the token exists and has not expired. */
function isTokenAlive(token: string | undefined): boolean {
  if (!token) return false;
  try {
    // JWT uses base64url — convert to standard base64 before decoding
    const part = token.split('.')[1];
    const base64 = part
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(part.length / 4) * 4, '=');
    const payload = JSON.parse(atob(base64));
    // exp is in seconds; give a 10s buffer for clock skew
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now() + 10_000;
  } catch {
    return false;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const token    = req.cookies.get('access_token')?.value;
  const alive    = isTokenAlive(token);

  // Unauthenticated (no valid token) hitting a protected page → login
  if (!alive && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Authenticated with a live token hitting a public auth page → feed
  if (alive && isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = '/feed';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public|api/).*)'],
};
