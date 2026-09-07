import { NextResponse } from 'next/server';
import { getServerSupabaseAdmin } from '@/lib/supabase-server';
import { verifyGatewayToken } from '@/lib/gateway-token';

export async function POST(request: Request) {
  try {
    const supabase = getServerSupabaseAdmin();
    const body = await request.json();
    const { asset_code, student_npm, submission_token } = body;

    if (!asset_code || !student_npm) {
      return NextResponse.json(
        { status: 'error', message: 'Data tidak lengkap (Kode alat dan NPM wajib diisi).' },
        { status: 400 }
      );
    }

    // 1. Verify Gateway Token
    const tokenCheck = verifyGatewayToken(submission_token);
    let isAuthorized = tokenCheck.valid;

    if (!isAuthorized && submission_token) {
      const { data: tokenData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'gateway_token')
        .maybeSingle();

      if (tokenData?.value) {
        try {
          const stored = typeof tokenData.value === 'string' ? JSON.parse(tokenData.value) : tokenData.value;
          if (stored?.token === submission_token && (!stored.expires_at || Date.now() < stored.expires_at)) {
            isAuthorized = true;
          }
        } catch {
          // ignore
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { status: 'error', message: tokenCheck.error || 'Sesi QR telah kadaluarsa atau tidak valid. Silakan scan ulang.' },
        { status: 401 }
      );
    }

    // 2. Find the asset
    const { data: asset } = await supabase
      .from('assets')
      .select('id, status')
      .eq('code', asset_code.toUpperCase().trim())
      .maybeSingle();

    if (!asset) {
      return NextResponse.json(
        { status: 'error', message: 'Alat tidak ditemukan di sistem Lentera.' },
        { status: 404 }
      );
    }

    // 3. Find active transaction matching the asset and student NPM
    const { data: txn } = await supabase
      .from('transactions')
      .select('id')
      .eq('asset_id', asset.id)
      .eq('student_npm', student_npm.trim())
      .is('returned_at', null)
      .order('borrowed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!txn) {
      return NextResponse.json(
        { status: 'error', message: 'Data peminjaman aktif untuk alat dan NPM tersebut tidak ditemukan.' },
        { status: 404 }
      );
    }

    // 4. Mark transaction returned
    const { data: transaction, error: txnErr } = await supabase
      .from('transactions')
      .update({ returned_at: new Date().toISOString() })
      .eq('id', txn.id)
      .select()
      .single();

    if (txnErr) {
      return NextResponse.json({ status: 'error', message: txnErr.message }, { status: 400 });
    }

    // 5. Update asset status to available
    await supabase
      .from('assets')
      .update({ status: 'available', updated_at: new Date().toISOString() })
      .eq('id', asset.id);

    // Note: Do not erase gateway_token from settings

    return NextResponse.json({ status: 'success', data: transaction });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan pada server pengembalian.';
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}
