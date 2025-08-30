import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Schema for poll creation
const createPollSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string(),
  options: z.array(z.string()).min(2, 'At least 2 options are required'),
});

// POST /api/polls - Create a new poll
export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to create a poll' },
        { status: 401 }
      );
    }
    
    // Parse and validate the request body
    const body = await request.json();
    const validationResult = createPollSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { title, description, options } = validationResult.data;
    
    // Start a transaction
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title,
        description,
        user_id: user.id,
      })
      .select()
      .single();
    
    if (pollError || !poll) {
      return NextResponse.json(
        { error: pollError?.message || 'Failed to create poll' },
        { status: 500 }
      );
    }
    
    // Insert options
    const optionsToInsert = options
      .filter(option => option.trim() !== '')
      .map(option_text => ({
        poll_id: poll.id,
        option_text,
      }));
    
    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsToInsert);
    
    if (optionsError) {
      return NextResponse.json(
        { error: optionsError.message || 'Failed to create poll options' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ data: poll }, { status: 201 });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// GET /api/polls - Get all polls with pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get pagination parameters from query string
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Get polls
    const { data: polls, error: pollsError } = await supabase
      .from('polls')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (pollsError) {
      return NextResponse.json(
        { error: pollsError.message || 'Failed to fetch polls' },
        { status: 500 }
      );
    }
    
    if (!polls || polls.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }
    
    // Get options for all polls
    const pollIds = polls.map(poll => poll.id);
    const { data: options, error: optionsError } = await supabase
      .from('poll_options')
      .select('*')
      .in('poll_id', pollIds);
    
    if (optionsError) {
      return NextResponse.json(
        { error: optionsError.message || 'Failed to fetch poll options' },
        { status: 500 }
      );
    }
    
    // Combine polls with their options
    const pollsWithOptions = polls.map(poll => ({
      ...poll,
      options: options?.filter(option => option.poll_id === poll.id) || [],
    }));
    
    return NextResponse.json({ data: pollsWithOptions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}