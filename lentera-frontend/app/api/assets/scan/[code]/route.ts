import { NextResponse } from 'next/server';
import { getServerSupabaseAdmin } from '@/lib/supabase-server';
import { requireAdminAuth } from '@/lib/auth-server';

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const supabase = getServerSupabaseAdmin();
  const { code } = await params;

  const { data, error } = await supabase
    .from('assets')
    .select('*, category:categories(*)')
    .eq('code', code.toUpperCase())
    .single();

  if (error || !data) {
    return NextResponse.json({ status: 'error', message: 'Alat tidak ditemukan' }, { status: 404 });
  }

  const { data: transaction } = await supabase
    .from('transactions')
    .select('student_name, student_class, subject, borrowed_at')
    .eq('asset_id', data.id)
    .is('returned_at', null)
    .order('borrowed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const auth = requireAdminAuth(request);
  const isAdmin = auth.authorized;

  let sanitizedTxn = null;
  if (transaction) {
    if (isAdmin) {
      sanitizedTxn = transaction;
    } else {
      sanitizedTxn = {
        student_name: transaction.student_name ? `${transaction.student_name.slice(0, 3)}***` : 'Mahasiswa',
        subject: transaction.subject || null,
        borrowed_at: transaction.borrowed_at,
      };
    }
  }

  return NextResponse.json({
    status: 'success',
    data: {
      ...data,
      lastTransaction: sanitizedTxn,
    },
  });
}
