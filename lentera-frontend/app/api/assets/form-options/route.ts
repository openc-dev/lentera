import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(request: Request) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'available';
  const submissionToken = searchParams.get('submission_token');

  if (!submissionToken) {
    return NextResponse.json({ status: 'error', message: 'Token diperlukan' }, { status: 401 });
  }

  const { data: tokenData } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'gateway_token')
    .single();

  if (!tokenData) {
    return NextResponse.json({ status: 'error', message: 'Token tidak valid' }, { status: 401 });
  }

  const stored = JSON.parse(tokenData.value);
  if (stored.token !== submissionToken) {
    return NextResponse.json({ status: 'error', message: 'Token tidak valid' }, { status: 401 });
  }

  const { data: assets } = await supabase
    .from('assets')
    .select('id, code, name, status, category:categories(id, name)')
    .eq('status', status)
    .order('id');

  const options = (assets || []).map((a: Record<string, unknown>) => {
    const cat = a.category as Record<string, unknown> | Record<string, unknown>[];
    const catName = Array.isArray(cat) ? (cat[0]?.name as string) : (cat?.name as string);
    return {
      label: `${a.code} — ${a.name}`,
      value: String(a.id),
      category: catName || '',
    };
  });

  return NextResponse.json({ status: 'success', data: options });
}
