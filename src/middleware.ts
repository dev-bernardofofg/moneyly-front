import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token =
    request.cookies.get('auth_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '') ||
    null;

  const publicRoutes = ['/auth'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  const privateRoutes = [
    '/dashboard',
    '/insights',
    '/categories',
    '/transactions',
    '/initial-config',
  ];
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  if (!token && isPrivateRoute) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && pathname === '/') {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
