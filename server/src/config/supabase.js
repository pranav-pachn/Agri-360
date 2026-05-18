const { createClient } = require('@supabase/supabase-js');
const path = require('path');

for (const envPath of [
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env')
]) {
  require('dotenv').config({ path: envPath, override: false });
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Warning: Missing Supabase environment variables.',
    {
      hasSupabaseUrl: Boolean(supabaseUrl),
      hasSupabaseKey: Boolean(supabaseKey),
      expected: ['SUPABASE_URL', 'SUPABASE_ANON_KEY'],
      aliasesChecked: ['VITE_SUPABASE_URL', 'SUPABASE_KEY', 'VITE_SUPABASE_ANON_KEY']
    }
  );
}

const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');

module.exports = supabase;
