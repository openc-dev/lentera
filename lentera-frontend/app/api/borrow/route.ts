import { NextResponse } from 'next/server';
import { getServerSupabaseAdmin } from '@/lib/supabase-server';
import { verifyGatewayToken } from '@/lib/gateway-token';

export async function POST(request: Request) {
  try {
    const supabase = getServerSupabaseAdmin();
    const body = await request.json();
    const {
      asset_code,
      student_name,
      student_npm,
      student_prodi,
      student_class,
      subject,
      lecturer,
      expected_return_at,
      submission_token,
    } = body;

    if (!asset_code || !student_name || !student_npm) {
      return NextResponse.json(
        { status: 'error', message: 'Data formulir tidak lengkap (Kode alat, nama, dan NPM wajib diisi).' },
        { status: 400 }
      );
    }

    // 1. Verify Gateway Token (Stateless signed token)
    const tokenCheck = verifyGatewayToken(submission_token);
    let isAuthorized = tokenCheck.valid;

    // Legacy fallback check
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

    // 2. Atomic Concurrency Guard:
    // Claim the asset by updating status only IF it is currently 'available'.
    const { data: claimedAsset, error: claimErr } = await supabase
      .from('assets')
      .update({ status: 'borrowed', updated_at: new Date().toISOString() })
      .eq('code', asset_code.toUpperCase().trim())
      .eq('status', 'available')
      .select('id, name, code')
      .maybeSingle();

    if (claimErr || !claimedAsset) {
      const { data: existingAsset } = await supabase
        .from('assets')
        .select('status')
        .eq('code', asset_code.toUpperCase().trim())
        .maybeSingle();

      if (!existingAsset) {
        return NextResponse.json(
          { status: 'error', message: 'Alat tidak ditemukan di sistem Lentera.' },
          { status: 404 }
        );
      }

      const statusMsg = existingAsset.status === 'borrowed'
        ? 'Alat sedang dipinjam oleh mahasiswa lain.'
        : `Alat sedang tidak tersedia (status: ${existingAsset.status}).`;

      return NextResponse.json(
        { status: 'error', message: statusMsg },
        { status: 409 }
      );
    }

    // 3. Record the transaction
    const { data: transaction, error: txnErr } = await supabase
      .from('transactions')
      .insert({
        asset_id: claimedAsset.id,
        student_name: student_name.trim(),
        student_npm: student_npm.trim(),
        student_prodi: (student_prodi || '').trim(),
        student_class: (student_class || '').trim(),
        subject: (subject || '').trim(),
        lecturer: (lecturer || '').trim(),
        expected_return_at: expected_return_at || null,
      })
      .select()
      .single();

    if (txnErr) {
      // Revert asset status if recording transaction failed
      await supabase
        .from('assets')
        .update({ status: 'available', updated_at: new Date().toISOString() })
        .eq('id', claimedAsset.id);

      return NextResponse.json(
        { status: 'error', message: `Gagal mencatat peminjaman: ${txnErr.message}` },
        { status: 400 }
      );
    }

    // Note: We deliberately do NOT wipe gateway_token from settings so other concurrent students can finish.

    return NextResponse.json({ status: 'success', data: transaction }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan pada server peminjaman.';
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}
