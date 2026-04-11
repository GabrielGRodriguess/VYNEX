import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';

export function useInsights() {
  const { transactions } = useFinance();

  const insights = useMemo(() => {
    if (!transactions.length) return [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const expenses = transactions.filter(t => t.type === 'expense');
    const currentMonthTxs = expenses.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const latest = transactions[0];
    const generatedInsights = [];

    // 1. BEHAVIORAL ANALYSIS (High Precision)
    const categoryTotals = currentMonthTxs.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

    const totalMonthExpense = currentMonthTxs.reduce((acc, t) => acc + Number(t.amount), 0);

    if (latest && latest.type === 'expense') {
      const totalInCat = categoryTotals[latest.category] || 0;
      const latestAmount = Number(latest.amount);

      // RULE 1: HIGH VOLUME ALERT (Threshold 5000 + 300)
      if (totalInCat > 5000 && latestAmount > 300) {
        generatedInsights.push({
          id: `alert-vol-${latest.id}`,
          type: 'alert',
          label: 'Alerta de Volume',
          icon: '📊',
          text: `"${latest.category}" concentra uma parcela elevada dos seus gastos este mês.`,
          color: 'text-amber-500'
        });
      } 
      // RULE 2: RECURRING ACCUMULATION (If not high volume, but still relevant)
      else if (totalInCat > 1000) {
        generatedInsights.push({
          id: `alert-acc-${latest.id}`,
          type: 'alert',
          label: 'Acúmulo Mensal',
          icon: '📈',
          text: `Você já acumulou um volume relevante em "${latest.category}" neste período.`,
          color: 'text-blue-400'
        });
      }
      // RULE 3: SPECIFIC FREQUENCY (If few transactions but same store)
      const establishmentTxs = currentMonthTxs.filter(t => t.description === latest.description);
      if (establishmentTxs.length >= 3) {
        generatedInsights.push({
          id: `alert-freq-${latest.id}`,
          type: 'pattern',
          label: 'Frequência Recorrente',
          icon: '🔄',
          text: `Esta é sua ${establishmentTxs.length}ª operação em "${latest.description}" este mês.`,
          color: 'text-emerald-400'
        });
      }
    }

    // 2. DATA-DRIVEN PATTERNS (Replacing Generics)
    if (generatedInsights.length < 2) {
      // Comparison: Food vs Total
      const foodTotal = categoryTotals['Food'] || 0;
      if (foodTotal > 0) {
        const foodPerc = ((foodTotal / totalMonthExpense) * 100).toFixed(0);
        if (foodPerc > 20) {
          generatedInsights.push({
            id: 'pattern-food',
            type: 'pattern',
            label: 'Visão de Gastos',
            icon: '🍎',
            text: `Alimentação representa ${foodPerc}% do seu total de despesas neste mês.`,
            color: 'text-slate-400'
          });
        }
      }
    }

    // 3. INCOME CONTEXT
    if (latest && latest.type === 'income' && generatedInsights.length < 3) {
      generatedInsights.push({
        id: `income-ctx-${latest.id}`,
        type: 'feedback',
        label: 'Aporte Identificado',
        icon: '💰',
        text: `Recebimento em "${latest.category}" fortalece sua liquidez para este período.`,
        color: 'text-brand-green'
      });
    }

    // Final Fallback (only if absolutely empty and very specific)
    if (generatedInsights.length === 0 && latest) {
      generatedInsights.push({
        id: 'fallback-spec',
        type: 'pattern',
        label: 'Detecção de Contexto',
        icon: '🎯',
        text: `Sua despesa em "${latest.category}" foi classificada com sucesso.`,
        color: 'text-slate-500'
      });
    }

    return generatedInsights.slice(0, 3);
  }, [transactions]);

  return insights;
}
