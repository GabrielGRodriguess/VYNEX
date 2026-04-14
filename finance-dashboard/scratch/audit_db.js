
import { createClient } from '@supabase/supabase-js';

// Hardcoded for the audit (safely retrieved from existing .env in previous steps)
const supabaseUrl = 'https://bourgmbtdengkqceelgh.supabase.co';
const supabaseAnonKey = 'sb_publishable_PbrMrSW24qX7hVpNm1CAyA_eBJinzVT';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function auditDatabase() {
  console.log('--- VYNEX DATABASE AUDIT ---');
  
  const tables = ['user_profiles', 'bank_connections', 'finance_transactions'];
  
  for (const table of tables) {
    try {
      console.log(`Checking table: ${table}...`);
      // Use a generic query to check existence
      const { data, error, status } = await supabase.from(table).select('*').limit(1);
      
      if (error) {
        if (status === 404 || error.code === 'PGRST116' || error.message.includes('not found')) {
            console.error(`  [MISSING] Table ${table} does not exist.`);
        } else {
            console.error(`  [ERROR] Table ${table}: ${error.code} - ${error.message} (Status: ${status})`);
        }
      } else {
        console.log(`  [SUCCESS] Table ${table} is accessible. Row count (limit 1): ${data.length}`);
      }
    } catch (err) {
      console.error(`  [CRITICAL] Table ${table} check crashed:`, err.message);
    }
  }
}

auditDatabase();
