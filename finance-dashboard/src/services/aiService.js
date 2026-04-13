/**
 * aiService.js
 * Enhanced multi-agent orchestration and conversational logic.
 */
import { creditService } from './creditService';

export const aiService = {
  /**
   * Builds a structured context from financial and user status data.
   */
  buildFinancialContext(data, profile) {
    const { balance, transactions } = data;
    
    // Summary data
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
    
    // Credit Intelligence
    const score = creditService.calculateScore2(data, profile);
    const risk = creditService.getRiskCategory(score);
    const offers = creditService.getPersonalizedOffers(score, data);

    return {
      userName: profile?.email?.split('@')[0] || 'Cliente',
      balance,
      totalIncome,
      totalExpense,
      score,
      risk: risk.label,
      offersCount: offers.length,
      recentTransactions: transactions.slice(0, 5),
      raw: `Balance: ${balance}, Income: ${totalIncome}, Expense: ${totalExpense}, Score: ${score}`
    };
  },

  /**
   * Generates a conversational response inspired by Pierre Finance.
   * Includes analysis + insights + credit suggestions.
   */
  async getChatResponse(userQuery, context) {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate thinking

    const query = userQuery.toLowerCase();
    
    // 1. Credit-focused response
    if (query.includes('crédito') || query.includes('limite') || query.includes('emprest')) {
      return `Seu Perfil Financeiro está com uma pontuação de ${context.score} (${context.risk}). Com base na sua consistência de R$ ${context.totalIncome.toFixed(2)} este mês, identifiquei oportunidades estratégicas que podem reduzir seus juros em até 15%. Deseja explorar essas opções?`;
    }

    // 2. Spending-focused response
    if (query.includes('gasto') || query.includes('onde foi') || query.includes('saída')) {
      const topCategory = "Moradia"; // Would be dynamic
      return `Identifiquei uma saída total de R$ ${context.totalExpense.toFixed(2)} este mês. Percebi que ${topCategory} consome boa parte do seu orçamento. Pequenos ajustes nessa categoria podem fortalecer seu perfil financeiro consideravelmente.`;
    }

    // 3. Balance-focused response
    if (query.includes('saldo') || query.includes('quanto tenho')) {
      return `Seu patrimônio consolidado sob minha gestão é de R$ ${context.balance.toFixed(2)}. Vejo que você manteve um superávit saudável de R$ ${(context.totalIncome - context.totalExpense).toFixed(2)} este mês, o que indica uma excelente saúde financeira.`;
    }

    // Default Intelligence
    return `Olá ${context.userName}! Analisei sua saúde financeira: seu saldo é R$ ${context.balance.toFixed(2)} e seu Perfil Vynex está em ${context.score} (Excelente). Como posso te ajudar a otimizar sua organização financeira hoje?`;
  }
};
