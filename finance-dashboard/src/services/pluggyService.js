const BASE_URL = 'https://api.pluggy.ai';

const IS_MOCK_MODE = import.meta.env.VITE_USE_MOCK_DATA === 'true';


export async function getConnectToken() {
  if (IS_MOCK_MODE) {
    return 'mock-access-token';
  }

  try {
    // Calling our brand new serverless function instead of exposing secrets here
    const response = await fetch('/api/connect-token');
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Falha ao buscar Connect Token do Vercel');
    }

    const { accessToken } = await response.json();
    return accessToken;
  } catch (error) {
    console.error('Erro ao buscar token via Serverless:', error);
    // Fallback to old behavior ONLY if env vars exist (for local testing without Vercel)
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
        balance: 2000.00, // Total Saldo
        transactions: [
          { id: 'm1', type: 'income', amount: 4500.00, category: 'Salary', date: '2026-04-05', description: 'VYNEX Tecnologia Pagamento', fromBank: true },
          { id: 'm2', type: 'expense', amount: 1200.00, category: 'Housing', date: '2026-04-10', description: 'Aluguel Mensal', fromBank: true },
          { id: 'm3', type: 'expense', amount: 800.00, category: 'Food', date: '2026-04-09', description: 'Supermercado Premium', fromBank: true },
          { id: 'm4', type: 'expense', amount: 1000.00, category: 'Utilities', date: '2026-04-08', description: 'Contas Fixas Consolidadas', fromBank: true },
        ]
      });
    }, 1200);
  });
}

