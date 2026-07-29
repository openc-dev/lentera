import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET() {
  const supabase = getSupabase();
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
  const supabase = getSupabase();
  const body = await request.json();
  const { data, error } = await supabase
    .from('categories')
    .insert({ name: body.name })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 400 });
  }

  return NextResponse.json({ status: 'success', data: { ...data, assets_count: 0 } }, { status: 201 });
}
