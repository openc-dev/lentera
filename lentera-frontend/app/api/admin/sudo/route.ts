import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: Request) {
  const supabase = getSupabase();
  const body = await request.json();
  const password = (body.password || '').trim();

  const { data: admin } = await supabase
    .from('admins')
    .select('password')
    .eq('email', 'boashadmin@unbo.ac.id')
    .single();

  if (!admin) {
    return NextResponse.json({ status: 'error', message: 'Admin tidak ditemukan' }, { status: 404 });
  }

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    return NextResponse.json({ status: 'error', message: 'Password salah!' }, { status: 401 });
  }

  return NextResponse.json({
    status: 'success',
    message: 'Aksi berhasil dieksekusi!',
    sudo_token: 'sudo_' + Math.random().toString(36).substring(2, 15),
  });
}
