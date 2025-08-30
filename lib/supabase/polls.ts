// Types for our database schema
export type Poll = {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
};

export type PollOption = {
  id: string;
  poll_id: string;
  option_text: string;
  created_at: string;
  votes_count?: number; // For aggregated results
};

export type Vote = {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string;
  created_at: string;
};

export type PollWithOptions = Poll & {
  options: PollOption[];
};

export type PollWithOptionsAndVotes = PollWithOptions & {
  total_votes: number;
  user_vote?: string; // ID of the option the current user voted for
};

// Client-side functions (for components)
export const clientPollsApi = {
  // Create a new poll with options
  async createPoll(title: string, description: string, options: string[]): Promise<{ data: Poll | null; error: any }> {
    try {
      // Make a fetch request to our API route
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          options: options.filter(option => option.trim() !== ''),
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        return { data: null, error: result.error };
      }
      
      return { data: result.data, error: null };
    } catch (error) {
      console.error('Error creating poll:', error);
      return { data: null, error };
    }
  },
  
  // Get all polls (with pagination)
  async getPolls(page = 1, limit = 10): Promise<{ data: PollWithOptions[] | null; error: any }> {
    try {
      const response = await fetch(`/api/polls?page=${page}&limit=${limit}`);
      const result = await response.json();
      
      if (!response.ok) {
        return { data: null, error: result.error };
      }
      
      return { data: result.data, error: null };
    } catch (error) {
      console.error('Error getting polls:', error);
      return { data: null, error };
    }
  },
  
  // Get a single poll with options and vote counts
  async getPoll(pollId: string): Promise<{ data: PollWithOptionsAndVotes | null; error: any }> {
    try {
      const response = await fetch(`/api/polls/${pollId}`);
      const result = await response.json();
      
      if (!response.ok) {
        return { data: null, error: result.error };
      }
      
      return { data: result.data, error: null };
    } catch (error) {
      console.error('Error getting poll:', error);
      return { data: null, error };
    }
  },
  
  // Vote on a poll
  async vote(pollId: string, optionId: string): Promise<{ data: any; error: any }> {
    try {
      const response = await fetch(`/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          optionId,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        return { data: null, error: result.error };
      }
      
      return { data: result.data, error: null };
    } catch (error) {
      console.error('Error voting on poll:', error);
      return { data: null, error };
    }
  },
};