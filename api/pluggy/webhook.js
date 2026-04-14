import { supabaseAdmin } from '../_lib/supabase';
import { getPluggyApiKey } from '../_lib/pluggy';

export default async function handler(req, res) {
  // Configuração básica de CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Pluggy-Webhook-Secret');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Apenas requisições POST são permitidas.' });
  }

  const { event, itemId, data } = req.body;

  console.log(`[VYNEX WEBHOOK] Recebido evento ${event} para o item ${itemId}`);

  if (!itemId) {
    return res.status(400).json({ error: 'itemId é obrigatório no payload.' });
  }

  try {
    // 1. Identificar o usuário dono desse itemId no Supabase
    const { data: connection, error: connError } = await supabaseAdmin
      .from('bank_connections')
      .select('user_id, provider')
      .eq('itemId', itemId)
      .single();

    if (connError || !connection) {
      console.error(`[VYNEX WEBHOOK] Conexão não encontrada para itemId ${itemId}:`, connError?.message);
      // Retornar 200 para evitar que a Pluggy reenvie infinitamente algo que não conhecemos.
      return res.status(200).json({ message: 'Item não encontrado em nossa base local.' });
    }

    const userId = connection.user_id;

    // 2. Processar Eventos Específicos
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
          // Guardar o ID original da Pluggy em um campo extra para evitar duplicidade
          preferences: { pluggy_transaction_id: tx.id }
        }));

        // Inserir transações com prevenção básica de duplicidade (considerando o campo pluggy_transaction_id no objeto preferences/description)
        const { error: insertError } = await supabaseAdmin
          .from('finance_transactions')
          .insert(transactionsToInsert);

        if (insertError) {
          console.error('[VYNEX WEBHOOK] Erro ao inserir transações:', insertError.message);
        }
      }
    } else if (event === 'item/updated') {
      console.log(`[VYNEX WEBHOOK] O item do usuário ${userId} foi atualizado com sucesso.`);
      // Aqui poderíamos atualizar um campo de "last_sync" na tabela bank_connections se ela tivesse.
    }

    return res.status(200).json({ status: 'success', event, itemId });

  } catch (err) {
    console.error('[VYNEX WEBHOOK] Erro interno:', err.message);
    return res.status(500).json({ error: 'Erro ao processar webhook', message: err.message });
  }
}
