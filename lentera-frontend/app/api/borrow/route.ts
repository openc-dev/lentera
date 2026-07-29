import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const supabase = getSupabase();
  const body = await request.json();
  const { asset_id, student_name, student_class, subject, submission_token } = body;

  if (!asset_id || !student_name) {
    return NextResponse.json({ status: 'error', message: 'Data tidak lengkap' }, { status: 400 });
  }

  const { data: tokenData } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'gateway_token')
    .single();

  if (!tokenData) {
    return NextResponse.json({ status: 'error', message: 'Token tidak valid' }, { status: 401 });
  }

  const stored = JSON.parse(tokenData.value);
  if (stored.token !== submission_token) {
    return NextResponse.json({ status: 'error', message: 'Token tidak valid' }, { status: 401 });
  }

  const { data: transaction, error: txnErr } = await supabase
    .from('transactions')
    .insert({ asset_id: Number(asset_id), student_name, student_class, subject })
    .select()
    .single();

  if (txnErr) {
    return NextResponse.json({ status: 'error', message: txnErr.message }, { status: 400 });
  }

  await supabase
    .from('assets')
    .update({ status: 'borrowed', updated_at: new Date().toISOString() })
    .eq('id', asset_id);

  return NextResponse.json({ status: 'success', data: transaction }, { status: 201 });
}
