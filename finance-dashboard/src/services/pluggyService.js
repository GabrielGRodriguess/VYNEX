// Pluggy Frontend Service: Unified API layer
// Calls serverless functions to protect secrets

const IS_MOCK_MODE = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export async function getConnectToken() {
  if (IS_MOCK_MODE) return 'mock-access-token';
  
  try {
    const response = await fetch('/api/connect-token');
    if (!response.ok) throw new Error('Falha ao buscar Connect Token');
    const { accessToken } = await response.json();
    return accessToken;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function fetchAllData(itemId) {
  if (IS_MOCK_MODE || itemId === 'mock-item') {
    return fetchMockData();
  }

  try {
    // 1. Fetch Accounts
    const accResponse = await fetch(`/api/accounts?itemId=${itemId}`);
    if (!accResponse.ok) throw new Error('Erro ao buscar contas');
    const { results: accounts } = await accResponse.json();

    if (accounts.length === 0) throw new Error('Nenhuma conta encontrada');

    // 2. Fetch Transactions for the first account
    const mainAccount = accounts[0];
    const txResponse = await fetch(`/api/transactions?accountId=${mainAccount.id}`);
    if (!txResponse.ok) throw new Error('Erro ao buscar transações');
    const { results: transactions } = await txResponse.json();

    return {
      balance: accounts.reduce((acc, curr) => acc + curr.balance, 0),
      transactions: transactions.map(t => ({
        id: t.id,
        type: t.amount > 0 ? 'income' : 'expense',
        amount: Math.abs(t.amount),
        category: t.category || 'Outros',
        date: t.date.split('T')[0],
        description: t.description,
        fromBank: true
      }))
    };
  } catch (err) {
    console.error('Erro na integração real:', err);
    throw err;
  }
}

export function fetchMockData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        balance: 5742.80,
        transactions: [
          { id: 'm1', type: 'income', amount: 5200.00, category: 'Salário', date: '2026-04-05', description: 'VYNEX TECNOLOGIA - SALARIO', fromBank: true },
          { id: 'm2', type: 'expense', amount: 1500.00, category: 'Moradia / Fixo', date: '2026-04-10', description: 'ALUGUEL APTO 102', fromBank: true },
          { id: 'm3', type: 'expense', amount: 89.90, category: 'Moradia / Fixo', date: '2026-04-11', description: 'NETFLIX ASSINATURA', fromBank: true },
          { id: 'm4', type: 'expense', amount: 450.00, category: 'Apostas / Risco', date: '2026-04-12', description: 'BETANO CASINO ONLINE', fromBank: true },
          { id: 'm5', type: 'expense', amount: 120.50, category: 'Transporte', date: '2026-04-12', description: 'UBER RIDE', fromBank: true },
          { id: 'm6', type: 'expense', amount: 320.00, category: 'Alimentação', date: '2026-04-09', description: 'IFOOD MARKET', fromBank: true },
          { id: 'm7', type: 'income', amount: 1200.00, category: 'Renda Extras', date: '2026-04-02', description: 'PIX RECEBIDO - FREELANCE', fromBank: true },
          { id: 'm8', type: 'expense', amount: 200.00, category: 'Apostas / Risco', date: '2026-04-13', description: 'GREEN BET PLATAFORMA', fromBank: true },
        ]
      });
    }, 1200);
  });
}
