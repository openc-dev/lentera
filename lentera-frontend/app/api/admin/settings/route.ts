import { NextResponse } from 'next/server';
import { getServerSupabaseAdmin } from '@/lib/supabase-server';
import { requireAdminAuth } from '@/lib/auth-server';

export async function GET() {
  const supabase = getServerSupabaseAdmin();
  const { data } = await supabase.from('settings').select('key, value');

  if (!data) {
    return NextResponse.json({ qr_interval: 30, form_interval: 15 });
  }

  const settings: Record<string, string> = {};
  for (const row of data) {
    settings[row.key] = typeof row.value === 'string' ? row.value : JSON.stringify(row.value);
  }

  return NextResponse.json({
    qr_interval: Number(settings.qr_interval) || 30,
    form_interval: Number(settings.form_interval) || 15,
  });
}

export async function PUT(request: Request) {
  const auth = requireAdminAuth(request);
  if (!auth.authorized) {
    return auth.response!;
  }

  const supabase = getServerSupabaseAdmin();
  const body = await request.json();

  if (body.qr_interval !== undefined) {
    await supabase.from('settings').upsert(
      { key: 'qr_interval', value: JSON.stringify(Number(body.qr_interval)) },
      { onConflict: 'key' }
    );
  }

  if (body.form_interval !== undefined) {
    await supabase.from('settings').upsert(
      { key: 'form_interval', value: JSON.stringify(Number(body.form_interval)) },
      { onConflict: 'key' }
    );
  }

  return NextResponse.json({ status: 'success', message: 'Pengaturan berhasil disimpan' });
}
