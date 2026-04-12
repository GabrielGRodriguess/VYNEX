import { createClient } from '@supabase/supabase-js';

// Initialize Supabase from process.env (Vercel)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

export default async function handler(req, res) {
  // CORS Setup
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const leadData = req.body;

  try {
    // 1. Save to Supabase
    const { data: savedLead, error: dbError } = await supabase
      .from('leads')
      .insert([
        {
          nome: leadData.nome,
          telefone: leadData.telefone,
          renda: leadData.renda,
          tipo_vinculo: leadData.tipo_vinculo,
          possui_consignado: leadData.possui_consignado,
          status_margem: leadData.status_margem,
          fez_portabilidade: leadData.fez_portabilidade,
          interesse_produto: leadData.interesse_produto,
          tipo_lead: leadData.tipo_lead,
          produto_recomendado: leadData.produto_recomendado,
          score_vynex: leadData.score_vynex,
          valor_estimado: leadData.valor_estimado,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (dbError) throw dbError;

    // 2. Notify Operator via Telegram (if configured)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const message = `
🔥 *Novo Lead VYNEX*
👤 *Nome:* ${leadData.nome}
📱 *Zap:* ${leadData.telefone}
💼 *Vínculo:* ${leadData.tipo_vinculo}
🎯 *Prod. Rec:* ${leadData.produto_recomendado}
📊 *Tipo Lead:* ${leadData.tipo_lead}
🏆 *Score:* ${leadData.score_vynex}
💰 *Valor Est.:* ${leadData.valor_estimado}
      `;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
    }

    return res.status(200).json({ success: true, leadId: savedLead[0]?.id });

  } catch (err) {
    console.error('Lead Error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
