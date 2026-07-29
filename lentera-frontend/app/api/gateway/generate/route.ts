import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  const supabase = getSupabase();
  const qrToken = Math.random().toString(36).substring(2, 12);
  const expiresAt = Date.now() + 15 * 60 * 1000;

  await supabase.from('settings').upsert(
    { key: 'gateway_token', value: JSON.stringify({ token: qrToken, expires_at: expiresAt }) },
    { onConflict: 'key' }
  );

  const expiresAtStr = new Date(expiresAt).toLocaleString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return NextResponse.json({
    status: 'success',
    data: { qr_token: qrToken, expires_at: expiresAtStr },
  });
}
