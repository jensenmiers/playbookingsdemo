import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

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

  // Parse and validate payload
  const body = await req.json();
  const { name, description, location, amenities, photos, hourly_rate, daily_rate, insurance_required, metadata } = body;
  if (!name || !location) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Insert listing
  const { data, error } = await supabase.from('listings').insert([
    {
      owner_id: user.id,
      name,
      description,
      location, // Should be a GeoJSON Point or WKT string
      amenities,
      photos,
      hourly_rate,
      daily_rate,
      insurance_required,
      metadata,
    },
  ]).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ listing: data[0] }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies,
  });

  // Fetch all listings
  const { data, error } = await supabase.from('listings').select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ listings: data }, { status: 200 });
} 