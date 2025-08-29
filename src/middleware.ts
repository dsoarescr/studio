import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const limiter = new RateLimiterMemory({
  points: 10, // Número de requisições
  duration: 1, // Por segundo
});

export async function middleware(request: NextRequest) {
  // Ignora requisições de assets estáticos
  if (
    request.nextUrl.pathname.startsWith('/static/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/public/')
  ) {
    return NextResponse.next();
  }

  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
    await limiter.consume(ip);
  } catch (error) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // Headers de segurança
  const response = NextResponse.next();
  const headers = response.headers;

  // Security Headers
  headers.set('X-DNS-Prefetch-Control', 'on');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Content Security Policy
  headers.set(
    'Content-Security-Policy',
    `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self';
    connect-src 'self' https:;
    media-src 'self';
    object-src 'none';
    frame-ancestors 'self';
  `
      .replace(/\s+/g, ' ')
      .trim()
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ (API routes)
     * 2. /_next/ (Next.js internals)
     * 3. /static/ (static files)
     * 4. /public/ (public files)
     * 5. all root files (e.g. /favicon.ico)
     */
    '/((?!api|_next|static|public|[\\w-]+\\.\\w+).*)',
  ],
};
