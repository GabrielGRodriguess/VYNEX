/**
 * financialService.js
 * Aggregates data from multiple bank connections and manual transactions.
 */

import { fetchAllData } from './pluggyService';

export const financialService = {
  /**
   * Aggregates total balance and transaction history across all active items.
   * @param {Array} connections - List of connection objects {id, itemId, provider}
   * @param {Array} manualTransactions - Transactions from Supabase
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

    // Sort all transactions by date
    aggregatedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      balance: totalBalance,
      transactions: aggregatedTransactions
    };
  },

  /**
   * Calculates category distribution and trends.
   */
  getAnalytics(transactions) {
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');

    const categories = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

    return {
      totalIncome: income.reduce((acc, t) => acc + Number(t.amount), 0),
      totalExpense: expenses.reduce((acc, t) => acc + Number(t.amount), 0),
      categoryDistribution: categories,
      transactionCount: transactions.length
    };
  }
};
