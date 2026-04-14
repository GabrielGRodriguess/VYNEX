// api/_lib/pluggy.js
// Utilitário para autenticação centralizada com a API da Pluggy

export async function getPluggyApiKey() {
  const clientId = process.env.PLUGGY_CLIENT_ID;
  const clientSecret = process.env.PLUGGY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Configuração ausente (PLUGGY_CLIENT_ID / PLUGGY_CLIENT_SECRET)');
  }

  const authResponse = await fetch('https://api.pluggy.ai/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, clientSecret }),
  });

  if (!authResponse.ok) {
    const errorData = await authResponse.json();
    throw new Error(`Falha na autenticação Pluggy: ${JSON.stringify(errorData)}`);
  }

  const { apiKey } = await authResponse.json();
  return apiKey;
}
