import crypto from 'node:crypto';
import { NextResponse } from 'next/server';

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: AUTH_SECRET or SUPABASE_SERVICE_ROLE_KEY must be defined in production.');
    }
    return 'lentera-dev-fallback-admin-secret-2026';
  }
  return secret;
}

export interface AdminPayload {
  id: number;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

export function createAdminSessionToken(admin: { id: number; email: string; name: string }, ttlHours = 24): string {
  const secret = getAuthSecret();
  const now = Date.now();
  const payload: AdminPayload = {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    iat: now,
    exp: now + ttlHours * 60 * 60 * 1000,
  };

  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadEncoded)
    .digest('base64url');

  return `lentera_${payloadEncoded}.${signature}`;
}

export function verifyAdminSessionToken(token: string | null | undefined): {
  valid: boolean;
  admin?: AdminPayload;
  error?: string;
} {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token autentikasi tidak ditemukan.' };
  }

  const rawToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
  if (!rawToken) {
    return { valid: false, error: 'Token kosong.' };
  }

  // Enforce strict signed token verification: lentera_<payload>.<signature>
  if (!rawToken.startsWith('lentera_') || !rawToken.includes('.')) {
    return { valid: false, error: 'Format token tidak sah.' };
  }

  const withoutPrefix = rawToken.slice(8);
  const parts = withoutPrefix.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Format token tidak sah.' };
  }

  const [payloadEncoded, signature] = parts;
  const secret = getAuthSecret();
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payloadEncoded)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return { valid: false, error: 'Tanda tangan token tidak sah atau token telah dimanipulasi.' };
  }

  try {
    const payload = JSON.parse(base64UrlDecode(payloadEncoded)) as AdminPayload;
    if (Date.now() > payload.exp) {
      return { valid: false, error: 'Sesi login telah kedaluwarsa. Silakan login kembali.' };
    }
    return { valid: true, admin: payload };
  } catch {
    return { valid: false, error: 'Payload sesi rusak.' };
  }
}

export function requireAdminAuth(request: Request): {
  authorized: boolean;
  admin?: AdminPayload;
  response?: NextResponse;
} {
  const authHeader = request.headers.get('authorization');
  const result = verifyAdminSessionToken(authHeader);

  if (!result.valid) {
    return {
      authorized: false,
      response: NextResponse.json(
        { status: 'error', message: result.error || 'Akses ditolak: Autentikasi admin diperlukan.' },
        { status: 401 }
      ),
    };
  }

  return { authorized: true, admin: result.admin };
}
