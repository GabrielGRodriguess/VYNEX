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
      return `Seu VYNEX Score está em ${context.score} (${context.risk}). Com base na sua movimentação de R$ ${context.totalIncome.toFixed(2)} este mês, identifiquei ${context.offersCount} ofertas pré-aprovadas para você. Gostaria de ver os detalhes?`;
    }

    // 2. Spending-focused response
    if (query.includes('gasto') || query.includes('onde foi') || query.includes('saída')) {
      const topCategory = "Moradia"; // Would be dynamic
      return `Você gastou R$ ${context.totalExpense.toFixed(2)} este mês. O maior peso foi em ${topCategory}. Economizar 10% nessa categoria poderia aumentar seu score em 40 pontos.`;
    }

    // 3. Balance-focused response
    if (query.includes('saldo') || query.includes('quanto tenho')) {
      return `Seu saldo consolidado é de R$ ${context.balance.toFixed(2)}. Vejo que você teve um superávit de R$ ${(context.totalIncome - context.totalExpense).toFixed(2)} este mês. Isso te qualifica para taxas de crédito exclusivas.`;
    }

    // Default Intelligence
    return `Olá ${context.userName}! Analisei suas finanças: seu saldo é R$ ${context.balance.toFixed(2)} e seu Vynex Score de ${context.score} está excelente. Alguma dúvida sobre seus gastos ou quer ver quanto liberamos de crédito para você hoje?`;
  }
};
