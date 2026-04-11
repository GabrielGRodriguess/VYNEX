// Vercel Serverless Function: Fetch Bank Accounts
// Location: /api/accounts.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { itemId } = req.query;
  if (!itemId) return res.status(400).json({ error: 'itemId é obrigatório' });

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

    // 2. Fetch Accounts
    const accResponse = await fetch(`https://api.pluggy.ai/accounts?itemId=${itemId}`, {
      method: 'GET',
      headers: { 'X-API-KEY': apiKey },
    });

    if (!accResponse.ok) {
      const errorData = await accResponse.json();
      return res.status(accResponse.status).json(errorData);
    }

    const data = await accResponse.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar contas', details: err.message });
  }
}
