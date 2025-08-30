import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/polls/[id] - Get a single poll with options and vote counts
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pollId = params.id;
    const supabase = await createClient();
    
    // Get the current user (if logged in)
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    // Get the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('id', pollId)
      .single();
    
    if (pollError) {
      return NextResponse.json(
        { error: pollError.message || 'Poll not found' },
        { status: pollError.code === 'PGRST116' ? 404 : 500 }
      );
    }
    
    // Get options with vote counts
    const { data: optionsWithVotes, error: optionsError } = await supabase
      .from('poll_options')
      .select(`
        id,
        poll_id,
        option_text,
        created_at,
        votes:votes(count)
      `)
      .eq('poll_id', pollId);
    
    if (optionsError) {
      return NextResponse.json(
        { error: optionsError.message || 'Failed to fetch poll options' },
        { status: 500 }
      );
    }
    
    // Process options to include vote count
    const options = optionsWithVotes.map(option => ({
      ...option,
      votes_count: option.votes?.[0]?.count || 0,
    }));
    
    // Get total votes
    const { count: totalVotes, error: countError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('poll_id', pollId);
    
    if (countError) {
      return NextResponse.json(
        { error: countError.message || 'Failed to count votes' },
        { status: 500 }
      );
    }
    
    // Get user's vote if logged in
    let userVote = null;
    if (userId) {
      const { data: vote, error: voteError } = await supabase
        .from('votes')
        .select('option_id')
        .eq('poll_id', pollId)
        .eq('user_id', userId)
        .single();
      
      if (!voteError && vote) {
        userVote = vote.option_id;
      }
    }
    
    return NextResponse.json({
      data: {
        ...poll,
        options,
        total_votes: totalVotes || 0,
        user_vote: userVote,
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching poll:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// DELETE /api/polls/[id] - Delete a poll (only by the owner)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pollId = params.id;
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to delete a poll' },
        { status: 401 }
      );
    }
    
    // Check if the user is the owner of the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('user_id')
      .eq('id', pollId)
      .single();
    
    if (pollError) {
      return NextResponse.json(
        { error: pollError.message || 'Poll not found' },
        { status: pollError.code === 'PGRST116' ? 404 : 500 }
      );
    }
    
    if (poll.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own polls' },
        { status: 403 }
      );
    }
    
    // Delete the poll (cascade will handle options and votes)
    const { error: deleteError } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId);
    
    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message || 'Failed to delete poll' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting poll:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}