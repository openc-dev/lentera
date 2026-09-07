import { NextResponse } from 'next/server';
import { verifyGatewayToken } from '@/lib/gateway-token';
import { getServerSupabaseAdmin } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { status: 'error', message: 'Token diperlukan untuk validasi akses.' },
      { status: 400 }
    );
  }

  // 1. Verify signed HMAC token
  const check = verifyGatewayToken(token);
  if (check.valid) {
    return NextResponse.json({
      status: 'success',
      data: { submission_token: token },
    });
  }

  // 2. Fallback check for legacy tokens stored in settings (during transition)
  try {
    const supabase = getServerSupabaseAdmin();
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'gateway_token')
      .maybeSingle();

    if (data?.value) {
      const stored = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
      if (stored?.token === token && Date.now() < stored.expires_at) {
        return NextResponse.json({
          status: 'success',
          data: { submission_token: token },
        });
      }
    }
  } catch {
    // Ignore legacy fallback error
  }

  return NextResponse.json(
    { status: 'error', message: check.error || 'Token QR tidak valid atau telah kadaluarsa.' },
    { status: 401 }
  );
}
