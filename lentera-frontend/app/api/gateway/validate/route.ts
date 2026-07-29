import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: Request) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ status: 'error', message: 'Token required' }, { status: 400 });
  }

  const { data } = await supabase.from('settings').select('value').eq('key', 'gateway_token').single();

  if (!data) {
    return NextResponse.json({ status: 'error', message: 'Token tidak ditemukan' }, { status: 401 });
  }

  const stored = JSON.parse(data.value);
  const isValid = stored.token === token && Date.now() < stored.expires_at;

  if (!isValid) {
    return NextResponse.json({ status: 'error', message: 'Token tidak valid atau kadaluarsa' }, { status: 401 });
  }

  await supabase.from('settings').update({ value: JSON.stringify({ token: '', expires_at: 0 }) }).eq('key', 'gateway_token');

  return NextResponse.json({
    status: 'success',
    data: { submission_token: token },
  });
}
