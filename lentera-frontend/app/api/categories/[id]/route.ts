import { NextResponse } from 'next/server';
import { getServerSupabaseAdmin } from '@/lib/supabase-server';
import { requireAdminAuth } from '@/lib/auth-server';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdminAuth(request);
  if (!auth.authorized) {
    return auth.response!;
  }

  const supabase = getServerSupabaseAdmin();
  const { id } = await params;
  const body = await request.json();

  if (!body.name || !body.name.trim()) {
    return NextResponse.json(
      { status: 'error', message: 'Nama kategori wajib diisi.' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('categories')
    .update({ name: body.name.trim() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 400 });
  }

  return NextResponse.json({ status: 'success', data });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdminAuth(request);
  if (!auth.authorized) {
    return auth.response!;
  }

  const supabase = getServerSupabaseAdmin();
  const { id } = await params;
  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 400 });
  }

  return NextResponse.json({ status: 'success', message: 'Kategori berhasil dihapus' });
}
