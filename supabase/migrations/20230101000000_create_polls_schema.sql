-- Create polls table
CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- Create poll options table
CREATE TABLE poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(poll_id, user_id) -- Ensure one vote per user per poll
);

-- Create indexes for performance
CREATE INDEX idx_polls_user_id ON polls(user_id);
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_option_id ON votes(option_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_polls_updated_at
BEFORE UPDATE ON polls
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Create RLS policies
-- Enable RLS on all tables
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Polls policies
-- Users can view all active polls
CREATE POLICY "Anyone can view active polls" 
  ON polls FOR SELECT 
  USING (is_active = true);

-- Users can view their own inactive polls
CREATE POLICY "Users can view their own inactive polls" 
  ON polls FOR SELECT 
  USING (auth.uid() = user_id AND is_active = false);

-- Users can insert their own polls
CREATE POLICY "Users can insert their own polls" 
  ON polls FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own polls
CREATE POLICY "Users can update their own polls" 
  ON polls FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own polls
CREATE POLICY "Users can delete their own polls" 
  ON polls FOR DELETE 
  USING (auth.uid() = user_id);

-- Poll options policies
-- Anyone can view poll options for active polls
CREATE POLICY "Anyone can view poll options for active polls" 
  ON poll_options FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM polls 
    WHERE polls.id = poll_options.poll_id AND polls.is_active = true
  ));

-- Users can view options for their own inactive polls
CREATE POLICY "Users can view options for their own inactive polls" 
  ON poll_options FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM polls 
    WHERE polls.id = poll_options.poll_id 
    AND polls.user_id = auth.uid() 
    AND polls.is_active = false
  ));

-- Users can insert options for their own polls
CREATE POLICY "Users can insert options for their own polls" 
  ON poll_options FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM polls 
    WHERE polls.id = poll_options.poll_id 
    AND polls.user_id = auth.uid()
  ));

-- Users can update options for their own polls
CREATE POLICY "Users can update options for their own polls" 
  ON poll_options FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM polls 
    WHERE polls.id = poll_options.poll_id 
    AND polls.user_id = auth.uid()
  ));

-- Users can delete options for their own polls
CREATE POLICY "Users can delete options for their own polls" 
  ON poll_options FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM polls 
    WHERE polls.id = poll_options.poll_id 
    AND polls.user_id = auth.uid()
  ));

-- Votes policies
-- Anyone can view vote counts for active polls
CREATE POLICY "Anyone can view votes for active polls" 
  ON votes FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM polls 
    WHERE polls.id = votes.poll_id 
    AND polls.is_active = true
  ));

-- Users can view votes for their own inactive polls
CREATE POLICY "Users can view votes for their own inactive polls" 
  ON votes FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM polls 
    WHERE polls.id = votes.poll_id 
    AND polls.user_id = auth.uid() 
    AND polls.is_active = false
  ));

-- Users can insert their own votes
CREATE POLICY "Users can insert their own votes" 
  ON votes FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM polls 
    WHERE polls.id = votes.poll_id 
    AND polls.is_active = true
  ));

-- Users can update their own votes
CREATE POLICY "Users can update their own votes" 
  ON votes FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own votes
CREATE POLICY "Users can delete their own votes" 
  ON votes FOR DELETE 
  USING (auth.uid() = user_id);