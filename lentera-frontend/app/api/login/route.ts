import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getServerSupabaseAdmin } from '@/lib/supabase-server';
import { createAdminSessionToken } from '@/lib/auth-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || '').trim();
    const password = (body.password || '').trim();

    if (!email || !password) {
      return NextResponse.json(
        { status: 'error', message: 'Email dan password wajib diisi.' },
        { status: 400 }
      );
    }

    const supabase = getServerSupabaseAdmin();
    const { data: admin, error } = await supabase
      .from('admins')
      .select('id, name, email, password')
      .eq('email', email)
      .single();

    if (error || !admin) {
      return NextResponse.json(
        { status: 'error', message: 'Email atau password salah!' },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json(
        { status: 'error', message: 'Email atau password salah!' },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
    });

    return NextResponse.json({
      status: 'success',
      token,
      user: { id: admin.id, name: admin.name, email: admin.email },
    });
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Terjadi kesalahan server.' },
      { status: 500 }
    );
  }
}
