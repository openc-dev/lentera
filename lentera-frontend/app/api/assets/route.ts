import { NextResponse } from 'next/server';
import { getServerSupabaseAdmin } from '@/lib/supabase-server';
import { requireAdminAuth } from '@/lib/auth-server';

export async function GET(request: Request) {
  const supabase = getServerSupabaseAdmin();

  const { data: assets, error } = await supabase
    .from('assets')
    .select('*, category:categories(*)')
    .order('id');

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }

  const result = assets || [];
  const borrowedIds = result.filter(a => a.status === 'borrowed').map(a => a.id);

  if (borrowedIds.length > 0) {
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .in('asset_id', borrowedIds)
      .is('returned_at', null);

    // Check if requester is an authenticated administrator
    const auth = requireAdminAuth(request);
    const isAdmin = auth.authorized;

    if (transactions) {
      for (const asset of result) {
        if (asset.status === 'borrowed') {
          const txn = transactions.find(t => t.asset_id === asset.id);
          if (txn) {
            if (isAdmin) {
              (asset as Record<string, unknown>).lastTransaction = txn;
            } else {
              // Sanitize PII for public requests
              (asset as Record<string, unknown>).lastTransaction = {
                borrowed_at: txn.borrowed_at,
                student_name: txn.student_name ? `${txn.student_name.slice(0, 3)}***` : 'Mahasiswa',
              };
            }
          } else {
            (asset as Record<string, unknown>).lastTransaction = null;
          }
        }
      }
    }
  }

  return NextResponse.json({ status: 'success', data: result });
}

export async function POST(request: Request) {
  // Admin authentication guard
  const auth = requireAdminAuth(request);
  if (!auth.authorized) {
    return auth.response!;
  }

  const supabase = getServerSupabaseAdmin();
  const body = await request.json();

  if (!body.name || !body.code || !body.category_id) {
    return NextResponse.json(
      { status: 'error', message: 'Nama, kode, dan kategori alat wajib diisi.' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('assets')
    .insert({
      name: body.name.trim(),
      code: body.code.toUpperCase().trim(),
      category_id: Number(body.category_id),
      status: 'available',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 400 });
  }

  return NextResponse.json({ status: 'success', data }, { status: 201 });
}
