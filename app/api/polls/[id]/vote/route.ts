import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/polls/[id]/vote - Vote on a poll
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pollId = params.id;
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to vote' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    const { optionId } = body;
    
    if (!optionId) {
      return NextResponse.json(
        { error: 'Option ID is required' },
        { status: 400 }
      );
    }
    
    // Check if user has already voted on this poll
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('user_id', user.id)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
      return NextResponse.json(
        { error: checkError.message || 'Failed to check existing vote' },
        { status: 500 }
      );
    }
    
    let result;
    
    if (existingVote) {
      // Update existing vote
      const { data, error } = await supabase
        .from('votes')
        .update({ option_id: optionId })
        .eq('id', existingVote.id)
        .select();
      
      if (error) {
        return NextResponse.json(
          { error: error.message || 'Failed to update vote' },
          { status: 500 }
        );
      }
      
      result = { data, updated: true };
    } else {
      // Create new vote
      const { data, error } = await supabase
        .from('votes')
        .insert({
          poll_id: pollId,
          option_id: optionId,
          user_id: user.id,
        })
        .select();
      
      if (error) {
        return NextResponse.json(
          { error: error.message || 'Failed to create vote' },
          { status: 500 }
        );
      }
      
      result = { data, updated: false };
    }
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error voting on poll:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}