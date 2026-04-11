// Vercel Serverless Function: Fetch Account Transactions
// Location: /api/transactions.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { accountId } = req.query;
  if (!accountId) return res.status(400).json({ error: 'accountId é obrigatório' });

  const clientId = process.env.PLUGGY_CLIENT_ID;
  const clientSecret = process.env.PLUGGY_CLIENT_SECRET;

  try {
    // 1. Auth Handshake
    const authResponse = await fetch('https://api.pluggy.ai/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, clientSecret }),
    });
    const { apiKey } = await authResponse.json();

    // 2. Fetch Transactions (limiting to 50 for performance)
    const txResponse = await fetch(`https://api.pluggy.ai/transactions?accountId=${accountId}&pageSize=50`, {
      method: 'GET',
      headers: { 'X-API-KEY': apiKey },
    });

    if (!txResponse.ok) {
      const errorData = await txResponse.json();
      return res.status(txResponse.status).json(errorData);
    }

    const data = await txResponse.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar transações', details: err.message });
  }
}
