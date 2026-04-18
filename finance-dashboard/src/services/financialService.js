import { fetchAllData } from './pluggyService';
import { SOURCE_TYPES, INITIAL_ANALYSIS_REPORT } from '../constants/models';
import { CATEGORIES } from '../constants/categories';

export const financialService = {
  /**
   * Pipeline Step 1: Normalization
   * Converts raw data from any source into the VynexTransaction model.
   */
  normalizeInputData(rawData, source = SOURCE_TYPES.MANUAL) {
    if (!Array.isArray(rawData)) rawData = [rawData];

    return rawData.map(item => {
      // Basic mapping based on common fields
      return {
        id: item.id || Math.random().toString(36).substr(2, 9),
        userId: item.user_id || item.userId,
        source: source,
        sourceMetadata: {
          externalId: item.itemId || item.id,
          confidence: source === SOURCE_TYPES.PLUGGY ? 1 : 0.8
        },
        date: item.date || new Date().toISOString().split('T')[0],
        amount: Number(item.amount || 0),
        type: item.type || (item.amount > 0 ? 'income' : 'expense'),
        description: item.description || 'Sem descrição',
        category: item.category || 'Outros',
        isRisk: item.isRisk || false,
        isFixed: item.isFixed || false,
        tags: item.tags || [],
        fromBank: source === SOURCE_TYPES.PLUGGY || !!item.from_bank,
        createdAt: item.created_at || item.createdAt || item.date || new Date().toISOString()
      };
    });
  },

  /**
   * Pipeline Step 2: Analysis Report Generation
   * Derives intelligence from a list of normalized transactions.
   */
  generateAnalysisReport(transactions) {
    if (!transactions || transactions.length === 0) return INITIAL_ANALYSIS_REPORT;

    try {
      const metrics = this.calculateBehavioralMetrics(transactions);
      
      const categoryBreakdown = transactions.reduce((acc, t) => {
        if (t.type === 'expense') {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
        }
        return acc;
      }, {});

      // Score Engine (Simple implementation for Phase 1)
      const scoreValue = this.calculateScore(metrics);
      
      return {
        summary: {
          totalBalance: transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0),
          monthlyIncome: metrics.monthlyIncome,
          monthlyExpense: metrics.monthlyExpense,
          surplus: metrics.monthlySurplus
        },
        score: {
          value: scoreValue,
          label: scoreValue > 800 ? 'Excelente' : scoreValue > 600 ? 'Bom' : 'Regular',
          trend: 'stable'
        },
        assessment: {
          riskRatio: metrics.riskRatio,
          fixedExpenseRatio: metrics.fixedExpenseRatio,
          incomeConsistency: metrics.incomeConsistency
        },
        categoryBreakdown,
        insights: this.generateInsights(metrics, transactions)
      };
    } catch (err) {
      console.error("[VYNEX] generateAnalysisReport error:", err);
      return INITIAL_ANALYSIS_REPORT;
    }
  },

  calculateScore(metrics) {
    let score = 500; // Base score
    score += (metrics.monthlySurplus > 0 ? 100 : -100);
    score -= (metrics.riskRatio * 500);
    score += (metrics.incomeConsistency * 200);
    return Math.max(0, Math.min(1000, Math.round(score)));
  },

  generateInsights(metrics, transactions) {
    const insights = [];
    if (metrics.riskRatio > 0.2) {
      insights.push({
        id: 'risk-high',
        type: 'warning',
        text: 'Seu volume de gastos de risco está acima do recomendado para seu perfil.',
        impact: -15
      });
    }
    if (metrics.monthlySurplus > 0) {
      insights.push({
        id: 'surplus-positive',
        type: 'success',
        text: 'Parabéns! Você encerrou o período com saldo positivo disponível.',
        impact: 10
      });
    }
    return insights;
  },

  /**
   * Compatibility Methods (Legacy)
   */
  async getAggregatedData(connections, manualTransactions = []) {
    let aggregatedTransactions = this.normalizeInputData(manualTransactions, SOURCE_TYPES.MANUAL);
    let totalBalance = manualTransactions.reduce((acc, t) => t.type === 'income' ? acc + Number(t.amount) : acc - Number(t.amount), 0);

    const bankResults = await Promise.all(
      connections.map(async (conn) => {
        try {
          const res = await fetchAllData(conn.itemId);
          if (res) {
            totalBalance += res.balance;
            return this.normalizeInputData(res.transactions, SOURCE_TYPES.PLUGGY);
          }
          return [];
        } catch (err) {
          return [];
        }
      })
    );

    bankResults.forEach(txs => {
      aggregatedTransactions = [...aggregatedTransactions, ...txs];
    });

    const classified = this.classifyTransactions(aggregatedTransactions);
    classified.sort((a, b) => new Date(b.date) - new Date(a.date));

    return { balance: totalBalance, transactions: classified };
  },

  classifyTransactions(transactions) {
    const rules = Object.values(CATEGORIES).filter(c => c.keywords.length > 0);

    return transactions.map(t => {
      const desc = (t.description || '').toUpperCase();
      const match = rules.find(r => r.keywords.some(k => desc.includes(k)));
      
      return {
        ...t,
        category: match ? match.id : (t.category || CATEGORIES.OTHER.id),
        type: match ? match.type : (t.type || 'expense'),
        isRisk: match ? !!match.isRisk : !!t.isRisk,
        isFixed: match ? !!match.isFixed : !!t.isFixed
      };
    });
  },

  calculateBehavioralMetrics(transactions) {
    const last30Days = transactions.filter(t => {
      const diff = (new Date() - new Date(t.date)) / (1000 * 60 * 60 * 24);
      return diff <= 30;
    });

    const income = last30Days.filter(t => t.type === 'income');
    const expenses = last30Days.filter(t => t.type === 'expense');

    const totalIncome = income.reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);
    const riskExpenses = last30Days.filter(t => t.isRisk).reduce((acc, t) => acc + t.amount, 0);
    const fixedExpenses = last30Days.filter(t => t.isFixed).reduce((acc, t) => acc + t.amount, 0);

    const incomeDays = [...new Set(income.map(t => t.date))].length;

    return {
      monthlyIncome: totalIncome,
      monthlyExpense: totalExpense,
      monthlySurplus: totalIncome - totalExpense,
      fixedExpenseRatio: totalIncome > 0 ? fixedExpenses / totalIncome : 0,
      riskRatio: totalExpense > 0 ? riskExpenses / totalExpense : 0,
      incomeConsistency: Math.min(incomeDays / 4, 1),
      riskEvents: last30Days.filter(t => t.isRisk).length
    };
  },

  getAnalytics(transactions) {
    const report = this.generateAnalysisReport(transactions);
    return {
      ...report.summary,
      ...report.assessment,
      categoryDistribution: report.categoryBreakdown,
      transactionCount: transactions.length
    };
  }
};

