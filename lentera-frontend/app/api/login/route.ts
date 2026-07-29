import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || '').trim();
    const password = (body.password || '').trim();

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: admin } = await supabase
      .from('admins')
      .select('id, name, email, password')
      .eq('email', email)
      .single();

    if (!admin) {
      return NextResponse.json({ status: 'error', message: 'Email atau password salah!' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json({ status: 'error', message: 'Email atau password salah!' }, { status: 401 });
    }

    return NextResponse.json({
      status: 'success',
      token: 'lentera_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now(),
      user: { name: admin.name, email: admin.email },
    });
  } catch {
    return NextResponse.json({ status: 'error', message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
