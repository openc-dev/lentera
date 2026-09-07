import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Edge guard for administrative API routes
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/sudo') {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer lentera_') || !authHeader.includes('.')) {
      return NextResponse.json(
        { status: 'error', message: 'Akses ditolak: Autentikasi admin diperlukan.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*'],
};
