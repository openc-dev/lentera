import { NextResponse } from 'next/server';
import { getServerSupabaseAdmin } from '@/lib/supabase-server';
import { verifyGatewayToken } from '@/lib/gateway-token';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'available';
  const submissionToken = searchParams.get('submission_token');

  if (!submissionToken) {
    return NextResponse.json(
      { status: 'error', message: 'Token sesi diperlukan.' },
      { status: 401 }
    );
  }

  // 1. Check signed HMAC token
  const tokenCheck = verifyGatewayToken(submissionToken);
  let isAuthorized = tokenCheck.valid;

  const supabase = getServerSupabaseAdmin();

  // 2. Legacy fallback
  if (!isAuthorized) {
    try {
      const { data: tokenData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'gateway_token')
        .maybeSingle();

      if (tokenData?.value) {
        const stored = typeof tokenData.value === 'string' ? JSON.parse(tokenData.value) : tokenData.value;
        if (stored?.token === submissionToken && Date.now() < stored.expires_at) {
          isAuthorized = true;
        }
      }
    } catch {
      // ignore
    }
  }

  if (!isAuthorized) {
    return NextResponse.json(
      { status: 'error', message: tokenCheck.error || 'Token tidak valid atau kadaluarsa.' },
      { status: 401 }
    );
  }

  const { data: assets, error } = await supabase
    .from('assets')
    .select('id, code, name, status, category:categories(id, name)')
    .eq('status', status)
    .order('id');

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }

  const options = (assets || []).map((a: Record<string, unknown>) => {
    const cat = a.category as Record<string, unknown> | Record<string, unknown>[];
    const catName = Array.isArray(cat) ? (cat[0]?.name as string) : (cat?.name as string);
    return {
      label: `${a.code} — ${a.name}`,
      value: a.code,
      category: catName || '',
    };
  });

  return NextResponse.json({ status: 'success', data: options });
}
