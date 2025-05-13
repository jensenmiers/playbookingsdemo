import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// POST: Create or update an availability slot (owner only)
export async function POST(req: NextRequest) {
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies,
  });

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { listing_id, start, end } = body;
  if (!listing_id || !start || !end) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Insert new availability slot
  const { data, error } = await supabase.from('availability').insert([
    {
      listing_id,
      start,
      end,
    },
  ]).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ availability: data[0] }, { status: 201 });
}

// GET: Fetch availability for a given listingId
export async function GET(req: NextRequest) {
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies,
  });

  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get('listingId');
  if (!listingId) {
    return NextResponse.json({ error: 'Missing listingId parameter' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('listing_id', listingId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ availability: data }, { status: 200 });
} 