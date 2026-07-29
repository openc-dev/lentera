import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET() {
  const supabase = getSupabase();
  const { data } = await supabase.from('settings').select('key, value');

  if (!data) {
    return NextResponse.json({ qr_interval: 30, form_interval: 15 });
  }

  const settings: Record<string, string> = {};
  for (const row of data) {
    settings[row.key] = row.value;
  }

  return NextResponse.json({
    qr_interval: Number(settings.qr_interval) || 30,
    form_interval: Number(settings.form_interval) || 15,
  });
}

export async function PUT(request: Request) {
  const supabase = getSupabase();
  const body = await request.json();

  if (body.qr_interval !== undefined) {
    await supabase.from('settings').upsert(
      { key: 'qr_interval', value: String(body.qr_interval) },
      { onConflict: 'key' }
    );
  }

  if (body.form_interval !== undefined) {
    await supabase.from('settings').upsert(
      { key: 'form_interval', value: String(body.form_interval) },
      { onConflict: 'key' }
    );
  }

  return NextResponse.json({ status: 'success', message: 'Pengaturan berhasil disimpan' });
}
