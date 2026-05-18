const { createClient } = require('@supabase/supabase-js');
const path = require('path');

for (const envPath of [
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env')
]) {
  require('dotenv').config({ path: envPath, override: false });
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Warning: Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables.');
}

const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');

module.exports = supabase;
