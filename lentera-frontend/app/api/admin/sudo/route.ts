import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getServerSupabaseAdmin } from '@/lib/supabase-server';
import { requireAdminAuth } from '@/lib/auth-server';

export async function POST(request: Request) {
  try {
    // 1. Enforce that caller is an already authenticated administrator
    const auth = requireAdminAuth(request);
    if (!auth.authorized) {
      return auth.response!;
    }

    const supabase = getServerSupabaseAdmin();
    const body = await request.json();
    const password = (body.password || '').trim();

    if (!password) {
      return NextResponse.json(
        { status: 'error', message: 'Password sudo wajib diisi.' },
        { status: 400 }
      );
    }

    const targetEmail = auth.admin!.email;

    const { data: admin } = await supabase
      .from('admins')
      .select('id, email, password')
      .eq('email', targetEmail)
      .maybeSingle();

    if (!admin) {
      return NextResponse.json(
        { status: 'error', message: 'Akun admin tidak ditemukan.' },
        { status: 404 }
      );
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json(
        { status: 'error', message: 'Password sudo salah!' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'Aksi sudo berhasil diverifikasi!',
      sudo_token: 'sudo_' + Math.random().toString(36).substring(2, 15),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan pada server sudo.';
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}
