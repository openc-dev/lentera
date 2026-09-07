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
  const updates: Record<string, unknown> = {};

  if (body.name) updates.name = body.name.trim();
  if (body.code) updates.code = body.code.toUpperCase().trim();
  if (body.category_id) updates.category_id = Number(body.category_id);
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('assets')
    .update(updates)
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
  const { error } = await supabase.from('assets').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 400 });
  }

  return NextResponse.json({ status: 'success', message: 'Alat berhasil dihapus' });
}
