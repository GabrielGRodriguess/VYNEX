/**
 * financialService.js
 * Aggregates data from multiple bank connections and manual transactions.
 * Includes Layer 2 (Classification) and Layer 3 (Behavioral Intelligence) engines.
 */

import { fetchAllData } from './pluggyService';

export const financialService = {
  /**
   * Aggregates total balance and transaction history across all active items.
   */
  async getAggregatedData(connections, manualTransactions = []) {
    let aggregatedTransactions = [...manualTransactions];
    let totalBalance = manualTransactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + Number(t.amount) : acc - Number(t.amount);
    }, 0);

    const bankResults = await Promise.all(
      connections.map(async (conn) => {
        try {
          return await fetchAllData(conn.itemId);
        } catch (err) {
          console.error(`Failed to fetch data for item ${conn.itemId}:`, err);
          return null;
        }
      })
    );

    bankResults.forEach((res) => {
      if (res) {
        totalBalance += res.balance;
        aggregatedTransactions = [...aggregatedTransactions, ...res.transactions];
      }
    });

    // Layer 2: Automatic Classification
    const classifiedTransactions = this.classifyTransactions(aggregatedTransactions);

    // Sort all transactions by date
    classifiedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      balance: totalBalance,
      transactions: classifiedTransactions
    };
  },

  /**
   * Layer 2: Classification Engine
   * Detects patterns based on transaction descriptions.
   */
  classifyTransactions(transactions) {
    const rules = [
      { category: 'Salário', keywords: ['SALARIO', 'PROVENTOS', 'VENCIMENTOS', 'PAGAMENTO', 'FOLHA'], type: 'income' },
      { category: 'Renda Extras', keywords: ['PIX RECEBIDO', 'TRANSFERENCIA RECEBIDA', 'TED RECEBIDA'], type: 'income' },
      { category: 'Apostas / Risco', keywords: ['BET', 'BETANO', 'CASINO', 'JOGO', 'LOTERIA', 'BELA VISTA', 'GREEN'], type: 'expense' },
      { category: 'Moradia / Fixo', keywords: ['ALUGUEL', 'CONDOMINIO', 'LUZ', 'AGUA', 'INTERNET', 'NETFLIX', 'SPOTIFY'], type: 'expense' },
      { category: 'Transporte', keywords: ['UBER', '99APP', 'POSTO', 'COMBUSTIVEL', 'ESTACIONAMENTO'], type: 'expense' },
      { category: 'Alimentação', keywords: ['IFOOD', 'MCDONALDS', 'RESTAURANTE', 'MERCADO', 'SUPERMERCADO', 'PADARIA'], type: 'expense' }
    ];

    return transactions.map(t => {
      const desc = (t.description || '').toUpperCase();
      const match = rules.find(r => r.keywords.some(k => desc.includes(k)));
      
      return {
        ...t,
        category: match ? match.category : (t.category || 'Outros'),
        type: match ? match.type : (t.type || 'expense'),
        isRisk: match?.category === 'Apostas / Risco',
        isFixed: match?.category === 'Moradia / Fixo'
      };
    });
  },

  /**
   * Layer 3: Behavioral Intelligence Motor
   * Calculates sophisticated metrics for Vynex Score 2.0.
   */
  calculateBehavioralMetrics(transactions) {
    if (!Array.isArray(transactions)) {
      return {
        monthlyIncome: 0,
        monthlyExpense: 0,
        monthlySurplus: 0,
        fixedExpenseRatio: 0,
        riskRatio: 0,
        incomeConsistency: 0,
        riskEvents: 0
      };
    }

    const last30Days = transactions.filter(t => {
      if (!t?.date) return false;
      const date = new Date(t.date);
      const diff = (new Date() - date) / (1000 * 60 * 60 * 24);
      return diff <= 30;
    });

    const income = last30Days.filter(t => t.type === 'income');
    const expenses = last30Days.filter(t => t.type === 'expense');

    const totalIncome = income.reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const totalExpense = expenses.reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const riskExpenses = last30Days.filter(t => t.isRisk).reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const fixedExpenses = last30Days.filter(t => t.isFixed).reduce((acc, t) => acc + Number(t.amount || 0), 0);

    // Consistency check: Frequency of salary/income
    const incomeDays = [...new Set(income.map(t => t.date))].length;
    const incomeConsistency = Math.min(incomeDays / 4, 1); 

    return {
      monthlyIncome: totalIncome,
      monthlyExpense: totalExpense,
      monthlySurplus: totalIncome - totalExpense,
      fixedExpenseRatio: totalIncome > 0 ? fixedExpenses / totalIncome : 0,
      riskRatio: totalExpense > 0 ? riskExpenses / totalExpense : 0,
      incomeConsistency,
      riskEvents: last30Days.filter(t => t.isRisk).length
    };
  },

  /**
   * Calculates category distribution and trends.
   */
  getAnalytics(transactions) {
    try {
      const metrics = this.calculateBehavioralMetrics(transactions || []);
      
      const categories = (transactions || []).reduce((acc, t) => {
        if (t.type === 'expense' && t.category) {
          acc[t.category] = (acc[t.category] || 0) + Number(t.amount || 0);
        }
        return acc;
      }, {});

      return {
        ...metrics,
        totalIncome: metrics.monthlyIncome,
        totalExpense: metrics.monthlyExpense,
        categoryDistribution: categories,
        transactionCount: (transactions || []).length
      };
    } catch (err) {
      console.error("[VYNEX] Error calculating analytics:", err);
      // Fallback safe object
      return {
        monthlyIncome: 0,
        monthlyExpense: 0,
        monthlySurplus: 0,
        totalIncome: 0,
        totalExpense: 0,
        fixedExpenseRatio: 0,
        riskRatio: 0,
        incomeConsistency: 0,
        riskEvents: 0,
        categoryDistribution: {},
        transactionCount: 0
      };
    }
  }
};
