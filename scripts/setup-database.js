const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials');
  console.error('Please ensure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file');
  process.exit(1);
}

// Create Supabase client with service role key for admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('Setting up database...');
  
  try {
    // Read the SQL migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20230101000000_create_polls_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the SQL migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Database setup completed successfully!');
    console.log('Tables created: polls, poll_options, votes');
    console.log('Row Level Security policies applied');
  } catch (error) {
    console.error('Error setting up database:', error.message);
    
    // Check if the error is because tables already exist
    if (error.message.includes('already exists')) {
      console.log('⚠️ Some tables already exist. This is normal if you have run this script before.');
      console.log('If you want to reset the database, you can do so from the Supabase dashboard.');
    } else {
      console.error('Please check your Supabase credentials and permissions.');
      process.exit(1);
    }
  }
}

setupDatabase();