import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get('pd_session')?.value;
  const session = await decrypt(cookie || '');

  // specific paths that don't require auth
  if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {
     if (session) {
         return NextResponse.redirect(new URL('/', request.url));
     }
     return NextResponse.next();
  }

  // Protected routes (everything else)
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
