import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token =
    request.cookies.get("auth_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "") ||
    null;

  // Rotas públicas que não precisam de verificação
  const publicRoutes = ["/auth"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Rotas privadas que precisam de autenticação
  const privateRoutes = [
    "/dashboard",
    "/categories",
    "/transactions",
    "/initial-config",
  ];
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Se não tem token e está tentando acessar rota privada
  if (!token && isPrivateRoute) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Se tem token e está tentando acessar rota pública
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Se tem token e está na raiz, redireciona para dashboard
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Se não tem token e está na raiz, redireciona para auth
  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
