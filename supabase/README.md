# Supabase Database Setup for Polling App

## Overview

This directory contains the database schema and migrations for the Polling App. The application uses Supabase as its backend database and authentication provider.

## Database Schema

The database schema consists of the following tables:

1. **polls** - Stores information about each poll
   - `id` - UUID primary key
   - `title` - Poll title
   - `description` - Poll description
   - `user_id` - Foreign key to auth.users
   - `created_at` - Timestamp
   - `updated_at` - Timestamp
   - `is_active` - Boolean flag

2. **poll_options** - Stores options for each poll
   - `id` - UUID primary key
   - `poll_id` - Foreign key to polls
   - `option_text` - Text of the option
   - `created_at` - Timestamp

3. **votes** - Stores user votes on poll options
   - `id` - UUID primary key
   - `poll_id` - Foreign key to polls
   - `option_id` - Foreign key to poll_options
   - `user_id` - Foreign key to auth.users
   - `created_at` - Timestamp

## Row Level Security (RLS) Policies

The schema includes RLS policies to ensure data security:

- Anyone can view active polls and their options
- Only authenticated users can vote
- Users can only vote once per poll (but can change their vote)
- Only poll creators can edit or delete their polls
- Only poll creators can view their inactive polls

## Setup Instructions

### Prerequisites

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Set up environment variables in your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Applying Migrations

You can apply the migrations in one of two ways:

#### Option 1: Using the Supabase CLI

1. Install the Supabase CLI: `npm install -g supabase`
2. Login to Supabase: `supabase login`
3. Link your project: `supabase link --project-ref your-project-ref`
4. Apply migrations: `supabase db push`

#### Option 2: Using the Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `migrations/20230101000000_create_polls_schema.sql`
4. Paste into the SQL Editor and run the query

## Testing the Schema

After applying the migrations, you can test the schema by:

1. Creating a user account in your application
2. Creating a poll with options
3. Voting on a poll
4. Viewing poll results

## Troubleshooting

If you encounter issues with the database schema:

1. Check the Supabase logs in your project dashboard
2. Verify that RLS policies are correctly applied
3. Ensure your application is using the correct Supabase credentials