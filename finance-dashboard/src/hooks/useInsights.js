import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';

export function useInsights() {
  const { transactions } = useFinance();

  const insights = useMemo(() => {
    if (!transactions.length) return [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthTxs = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.type === 'expense';
    });

    const latest = transactions[0];
    const generatedInsights = [];

    // 1. INTELLIGENT ALERTS (Priority)
    // Group totals by category for the current month
    const categoryTotals = currentMonthTxs.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

    // Check if latest transaction triggers an alert based on category total
    if (latest && latest.type === 'expense') {
      const totalInCat = categoryTotals[latest.category] || 0;
      
      // Rule: Month Total > 3000 AND Latest > 300
      if (totalInCat > 3000 && Number(latest.amount) > 300) {
        generatedInsights.push({
          id: `alert-cat-${latest.id}`,
          type: 'alert',
          label: 'Alerta Inteligente',
          icon: '⚠️',
          text: `Possível excesso de gastos em "${latest.category}". Este tipo de gasto já representa uma parcela relevante do mês.`,
          color: 'text-amber-500'
        });
      }
      
      // Rule: Specific Establishment (Description) Alert
      const establishmentTxs = currentMonthTxs.filter(t => t.description === latest.description);
      const totalEst = establishmentTxs.reduce((acc, t) => acc + Number(t.amount), 0);
      
      if (totalEst > 2000 && Number(latest.amount) > 200 && generatedInsights.length < 1) {
        generatedInsights.push({
          id: `alert-est-${latest.id}`,
          type: 'alert',
          label: 'Padrão de Consumo',
          icon: '📊',
          text: `Gastos com "${latest.description}" acima do padrão habitual neste mês.`,
          color: 'text-rose-400'
        });
      }
    }

    // 2. CONTEXTUAL FEEDBACK (Secondary)
    if (latest && generatedInsights.length < 2) {
      let contextualText = '';
      let contextualIcon = '💡';
      
      if (latest.type === 'income') {
        contextualText = `Aporte em "${latest.category}" identificado. Sugerimos revisar sua estratégia de capital.`;
      } else {
        contextualText = `Operação em "${latest.category}" processada. Nova despesa em uma categoria já recorrente.`;
      }

      generatedInsights.push({
        id: `context-${latest.id}`,
        type: 'feedback',
        label: 'Feedback Instantâneo',
        icon: contextualIcon,
        text: contextualText,
        color: 'text-blue-400'
      });
    }

    // 3. GLOBAL PATTERNS (Tertiary)
    const foodTotal = categoryTotals['Food'] || 0;
    const totalMonthExpense = currentMonthTxs.reduce((acc, t) => acc + Number(t.amount), 0);
    
    if (foodTotal > totalMonthExpense * 0.4 && totalMonthExpense > 0) {
      generatedInsights.push({
        id: 'global-food',
        type: 'pattern',
        label: 'Análise Mensal',
        icon: '🍎',
        text: 'Gastos com alimentação representam uma parcela elevada do seu orçamento este mês.',
        color: 'text-slate-400'
      });
    }

    const isStable = currentMonthTxs.length >= 3 && currentMonthTxs.slice(0, 3).every(t => t.amount < 150);
    if (isStable && generatedInsights.length < 3) {
      generatedInsights.push({
        id: 'global-stable',
        type: 'pattern',
        label: 'Estabilidade',
        icon: '🛡️',
        text: 'Seu saldo mantém estabilidade e consistência nos últimos registros.',
        color: 'text-brand-green'
      });
    }

    return generatedInsights.slice(0, 3);
  }, [transactions]);

  return insights;
}
