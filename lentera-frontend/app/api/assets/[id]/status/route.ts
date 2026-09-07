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
  const status = body.status;

  if (!['available', 'borrowed', 'maintenance'].includes(status)) {
    return NextResponse.json({ status: 'error', message: 'Status tidak valid' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('assets')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 400 });
  }

  return NextResponse.json({ status: 'success', data });
}
