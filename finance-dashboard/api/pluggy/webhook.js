import { getSupabaseAdmin } from '../_lib/supabase.js';
import { getPluggyApiKey } from '../_lib/pluggy.js';

export default async function handler(req, res) {
  // 1. PRIMEIRA LINHA LÓGICA: Validação de Método
  // Nada deve ser executado ou importado sensivelmente antes disso.
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Pluggy-Webhook-Secret');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      error: 'Apenas requisições POST são permitidas.'
    });
  }

  // 2. Envolver todo o handler com try/catch para resiliência total
  try {
    // 3. Validação de ambiente obrigatória (DENTRO do handler)
    const requiredEnv = [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'PLUGGY_CLIENT_ID',
      'PLUGGY_CLIENT_SECRET'
    ];
    
    const missingEnv = requiredEnv.filter(key => !process.env[key]);
    
    if (missingEnv.length > 0) {
      console.error('[VYNEX WEBHOOK] Variáveis de ambiente ausentes:', missingEnv.join(', '));
      return res.status(500).json({
        error: "Variáveis de ambiente ausentes",
        missing: missingEnv
      });
    }

    // 4. Inicialização Segura (Lazy Load)
    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      throw new Error('Falha ao inicializar Supabase Admin (URL ou Key inválida).');
    }

    const { event, itemId, data } = req.body || {};
    console.log(`[VYNEX WEBHOOK] Recebido evento ${event} para o item ${itemId}`);

    if (!itemId) {
      return res.status(400).json({ error: 'itemId é obrigatório no payload.' });
    }

    // 5. Identificar o usuário dono desse itemId no Supabase
    const { data: connection, error: connError } = await supabaseAdmin
      .from('bank_connections')
      .select('user_id, provider')
      .eq('itemId', itemId)
      .single();

    if (connError || !connection) {
      console.warn(`[VYNEX WEBHOOK] Conexão ignorada para itemId ${itemId}: Não encontrada no banco local.`);
      // Retornar 200 para evitar que a Pluggy reenvie infinitamente algo que não conhecemos.
      return res.status(200).json({ message: 'Item não encontrado em nossa base local.' });
    }

    const userId = connection.user_id;

    // 6. Processar Eventos Específicos
    if (event === 'transactions/created') {
      const link = data?.createdTransactionsLink;
      if (!link) {
        return res.status(400).json({ error: 'Link de transações ausente no payload.' });
      }

      console.log(`[VYNEX WEBHOOK] Buscando novas transações do link: ${link}`);
      
      const apiKey = await getPluggyApiKey();
      const txResponse = await fetch(link, {
        method: 'GET',
        headers: { 'X-API-KEY': apiKey },
      });

      if (!txResponse.ok) {
        throw new Error('Falha ao buscar transações na API Pluggy');
      }

      const { results: newTransactions } = await txResponse.json();
      console.log(`[VYNEX WEBHOOK] Foram encontradas ${newTransactions?.length} novas transações.`);

      if (newTransactions && newTransactions.length > 0) {
        const transactionsToInsert = newTransactions.map(tx => ({
          user_id: userId,
          type: tx.amount < 0 ? 'expense' : 'income',
          amount: Math.abs(tx.amount),
          category: tx.category || 'Outros',
          description: tx.description,
          date: tx.date.split('T')[0], // YYYY-MM-DD
          from_bank: true,
          preferences: { pluggy_transaction_id: tx.id }
        }));

        const { error: insertError } = await supabaseAdmin
          .from('finance_transactions')
          .insert(transactionsToInsert);

        if (insertError) {
          console.error('[VYNEX WEBHOOK] Erro ao inserir transações:', insertError.message);
        }
      }
    } else if (event === 'item/updated') {
      console.log(`[VYNEX WEBHOOK] O item do usuário ${userId} foi atualizado com sucesso.`);
    }

    return res.status(200).json({ status: 'success', event, itemId });

  } catch (error) {
    console.error('[VYNEX WEBHOOK FATAL]:', error.message);
    return res.status(500).json({
      error: "Erro interno",
      details: error.message
    });
  }
}
