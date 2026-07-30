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

const SITE_PASSWORD = process.env.SITE_PASSWORD;

/** Basic-auth gate that fronts the whole site while it's not public yet.
 *  Successful auth is remembered via a cookie so users aren't re-prompted
 *  on every request. */
function checkSiteGate(req: NextRequest): NextResponse | null {
  if (!SITE_PASSWORD) return null;
  if (req.cookies.get('site-access')?.value === SITE_PASSWORD) return null;

  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Basic ')) {
    const [, pwd] = atob(auth.split(' ')[1]).split(':');
    if (pwd === SITE_PASSWORD) {
      const res = NextResponse.next();
      res.cookies.set('site-access', SITE_PASSWORD, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 30,
      });
      return res;
    }
  }

  return new NextResponse('Not available yet', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="DirectRef"' },
  });
}

export function proxy(req: NextRequest) {
  const gateResponse = checkSiteGate(req);
  if (gateResponse) return gateResponse;

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
