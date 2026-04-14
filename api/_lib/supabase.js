import { createClient } from '@supabase/supabase-js';

// Função para obter o cliente administrativo do Supabase com verificação de variáveis de ambiente.
// Retorna null se as variáveis não estiverem configuradas, evitando o crash do servidor.
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('[VYNEX] Missing Supabase environment variables! URL or ServiceRoleKey is undefined.');
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
