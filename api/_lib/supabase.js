import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('[VYNEX] Missing Supabase environment variables (URL/ServiceRoleKey)');
}

// O Service Role Key permite ignorar as políticas de RLS (Row Level Security)
// Útil para processos em background como webhooks da Pluggy.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
