import { NextResponse } from 'next/server';
import { getServerSupabaseAdmin } from '@/lib/supabase-server';
import { generateGatewayToken } from '@/lib/gateway-token';

export async function GET() {
  try {
    const supabase = getServerSupabaseAdmin();

    const { data: settingsData } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'form_interval')
      .maybeSingle();

    let formInterval = 15;
    if (settingsData?.value) {
      try {
        formInterval = Number(JSON.parse(settingsData.value)) || 15;
      } catch {
        formInterval = Number(settingsData.value) || 15;
      }
    }

    const { token: qrToken, expiresAt } = generateGatewayToken(formInterval);

    const expiresAtStr = new Date(expiresAt).toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return NextResponse.json({
      status: 'success',
      data: { qr_token: qrToken, expires_at: expiresAtStr },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menghasilkan token gateway.';
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}
