import { NextResponse } from 'next/server';
import { getServerSupabaseAdmin } from '@/lib/supabase-server';
import { requireAdminAuth } from '@/lib/auth-server';

export async function GET() {
  const supabase = getServerSupabaseAdmin();
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, assets:assets(count)')
    .order('id');

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }

  const data = (categories || []).map(c => ({
    id: c.id,
    name: c.name,
    assets_count: (c.assets as unknown as { count: number }[])?.[0]?.count || 0,
  }));

  return NextResponse.json({ status: 'success', data });
}

export async function POST(request: Request) {
  const auth = requireAdminAuth(request);
  if (!auth.authorized) {
    return auth.response!;
  }

  const supabase = getServerSupabaseAdmin();
  const body = await request.json();

  if (!body.name || !body.name.trim()) {
    return NextResponse.json(
      { status: 'error', message: 'Nama kategori wajib diisi.' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('categories')
    .insert({ name: body.name.trim() })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 400 });
  }

  return NextResponse.json({ status: 'success', data: { ...data, assets_count: 0 } }, { status: 201 });
}
