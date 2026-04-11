const BASE_URL = 'https://api.pluggy.ai';

const IS_MOCK_MODE = import.meta.env.VITE_USE_MOCK_DATA === 'true';


export async function getConnectToken() {
  if (IS_MOCK_MODE) {
    return 'mock-access-token';
  }

  const clientId = import.meta.env.VITE_PLUGGY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_PLUGGY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Pluggy Client ID ou Secret NÃO ENCONTRADOS no .env!');
    console.log('Verifique se as chaves no .env começam com VITE_');
    throw new Error('Configuração ausente');
  }

  console.log(`Tentando conectar com Client ID: ${clientId.substring(0, 8)}...`);

  try {
    const authResponse = await fetch(`${BASE_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, clientSecret }),
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      throw new Error(errorData.message || 'Falha na autenticação com Pluggy');
    }


    const { apiKey } = await authResponse.json();
    const tokenResponse = await fetch(`${BASE_URL}/connect_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': apiKey },
      body: JSON.stringify({}),
    });

    const { accessToken } = await tokenResponse.json();
    return accessToken;
  } catch (error) {
    console.error('Erro na conexão real:', error);
    throw error;
  }
}


export async function fetchAllData(itemId) {
  if (IS_MOCK_MODE || itemId === 'mock-item') {
    return fetchMockData();
  }

  // Real logic... (simplified here for brevity, keeping existing structure)
  try {
    return await fetchRealData(itemId);
  } catch (e) {
    return fetchMockData();
  }
}

async function fetchRealData(itemId) {
  const clientId = import.meta.env.VITE_PLUGGY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_PLUGGY_CLIENT_SECRET;
  
  const authResponse = await fetch(`${BASE_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, clientSecret }),
  });
  const { apiKey } = await authResponse.json();
  
  const accResponse = await fetch(`${BASE_URL}/accounts?itemId=${itemId}`, { headers: { 'X-API-KEY': apiKey } });
  const { results: accounts } = await accResponse.json();
  
  const mainAccount = accounts[0];
  const txResponse = await fetch(`${BASE_URL}/transactions?accountId=${mainAccount.id}`, { headers: { 'X-API-KEY': apiKey } });
  const { results: transactions } = await txResponse.json();

  return {
    balance: accounts.reduce((acc, curr) => acc + curr.balance, 0),
    transactions: transactions.map(t => ({
      id: t.id,
      type: t.amount > 0 ? 'income' : 'expense',
      amount: Math.abs(t.amount),
      category: t.category || 'Other',
      date: t.date.split('T')[0],
      description: t.description,
      fromBank: true
    }))
  };
}

export function fetchMockData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        balance: 12450.60,
        transactions: [
          { id: 'm1', type: 'expense', amount: 450.00, category: 'Shopping', date: '2026-04-10', description: 'Amazon Digital', fromBank: true },
          { id: 'm2', type: 'income', amount: 5000.00, category: 'Salary', date: '2026-04-05', description: 'Empresa X Salário', fromBank: true },
          { id: 'm3', type: 'expense', amount: 120.50, category: 'Food', date: '2026-04-09', description: 'iFood Brasil', fromBank: true },
          { id: 'm4', type: 'expense', amount: 80.00, category: 'Transport', date: '2026-04-08', description: 'Uber Trip', fromBank: true },
          { id: 'm5', type: 'income', amount: 150.00, category: 'Other', date: '2026-04-07', description: 'Pix Recebido', fromBank: true },
        ]
      });
    }, 1200);
  });
}
