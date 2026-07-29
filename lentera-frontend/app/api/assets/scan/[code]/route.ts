import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const supabase = getSupabase();
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

  return NextResponse.json({
    status: 'success',
    data: {
      ...data,
      lastTransaction: transaction || null,
    },
  });
}
