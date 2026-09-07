import crypto from 'node:crypto';

function getGatewaySecret(): string {
  const secret = process.env.GATEWAY_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: GATEWAY_SECRET or SUPABASE_SERVICE_ROLE_KEY must be defined in production.');
    }
    return 'lentera-dev-fallback-gateway-secret-2026';
  }
  return secret;
}

interface TokenPayload {
  exp: number;
  nonce: string;
  type: 'kiosk_gateway';
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

export function generateGatewayToken(ttlMinutes = 15): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
  const payload: TokenPayload = {
    exp: expiresAt,
    nonce: crypto.randomBytes(12).toString('hex'),
    type: 'kiosk_gateway',
  };

  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', getGatewaySecret())
    .update(payloadEncoded)
    .digest('base64url');

  const token = `${payloadEncoded}.${signature}`;
  return { token, expiresAt };
}

export function verifyGatewayToken(token: string | null | undefined): {
  valid: boolean;
  error?: string;
  expiresAt?: number;
} {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token tidak disediakan.' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Format token tidak valid.' };
  }

  const [payloadEncoded, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', getGatewaySecret())
    .update(payloadEncoded)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return { valid: false, error: 'Tanda tangan token tidak sah.' };
  }

  try {
    const payloadJson = base64UrlDecode(payloadEncoded);
    const payload = JSON.parse(payloadJson) as TokenPayload;

    if (payload.type !== 'kiosk_gateway') {
      return { valid: false, error: 'Tipe token tidak sesuai.' };
    }

    if (Date.now() > payload.exp) {
      return { valid: false, error: 'Token QR telah kadaluarsa. Silakan scan ulang.', expiresAt: payload.exp };
    }

    return { valid: true, expiresAt: payload.exp };
  } catch {
    return { valid: false, error: 'Payload token rusak.' };
  }
}
