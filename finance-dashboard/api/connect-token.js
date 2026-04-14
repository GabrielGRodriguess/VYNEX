// Vercel Serverless Function: Pluggy Connect Token Generation
// Location: /api/connect-token.js

export default async function handler(req, res) {
  // Configuração de CORS para permitir chamadas do frontend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const clientId = process.env.PLUGGY_CLIENT_ID;
  const clientSecret = process.env.PLUGGY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ 
      error: 'Configuração ausente no servidor (PLUGGY_CLIENT_ID / PLUGGY_CLIENT_SECRET)' 
    });
  }

  try {
    // 1. Gerar API Key (Autenticação)
    const authResponse = await fetch('https://api.pluggy.ai/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, clientSecret }),
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      return res.status(authResponse.status).json({ 
        error: 'Falha na autenticação com Pluggy', 
        details: errorData 
      });
    }

    const { apiKey } = await authResponse.json();

    // 2. Gerar Connect Token
    const tokenResponse = await fetch('https://api.pluggy.ai/connect_token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey 
      },
      body: JSON.stringify({}),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      return res.status(tokenResponse.status).json({ 
        error: 'Falha ao gerar connect_token', 
        details: errorData 
      });
    }

    const data = await tokenResponse.json();

    // 3. Retornar Connect Token para o Frontend
    return res.status(200).json(data);

  } catch (err) {
    console.error('Erro na função serverless:', err);
    return res.status(500).json({ error: 'Erro interno no servidor', message: err.message });
  }
}
