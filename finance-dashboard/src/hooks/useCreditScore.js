import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';

export function useCreditScore() {
  const { transactions, balance, getIncome, getExpense } = useFinance();

  const creditData = useMemo(() => {
    if (!transactions.length) return { score: 0, status: 'Incompleto', color: 'text-slate-500' };

    const totalIncome = getIncome();
    const totalExpense = getExpense();
    
    // 1. Financial Buffer (Stability) - Up to 400 pts
    // Calculation: How many months of expense can the current balance cover?
    const avgMonthlyExpense = totalExpense / (transactions.length > 30 ? 3 : 1) || 1;
    const monthsCovered = balance / avgMonthlyExpense;
    const bufferScore = Math.min(400, monthsCovered * 100);

    // 2. Savings Rate (Reliability) - Up to 300 pts
    // Calculation: % of income that is saved
    const savingsRate = totalIncome > 0 ? (totalIncome - totalExpense) / totalIncome : 0;
    const savingsScore = Math.max(0, Math.min(300, savingsRate * 500));

    // 3. Consistency (Activity) - Up to 300 pts
    // Calculation: Volume of transactions and income regularities
    const incomeCount = transactions.filter(t => t.type === 'income').length;
    const consistencyScore = Math.min(300, incomeCount * 50);

    const finalScore = Math.round(bufferScore + savingsScore + consistencyScore);

    let status = 'Estável';
    let color = 'text-brand-green';
    let glow = 'shadow-brand-green/20';

    if (finalScore < 400) {
      status = 'Limitante';
      color = 'text-rose-500';
      glow = 'shadow-rose-500/20';
    } else if (finalScore < 750) {
      status = 'Estável';
      color = 'text-amber-500';
      glow = 'shadow-amber-500/20';
    } else {
      status = 'Premium';
      color = 'text-brand-green';
      glow = 'shadow-brand-green/20';
    }

    return {
      score: finalScore,
      status,
      color,
      glow,
      metrics: {
        buffer: Math.round(bufferScore),
        savings: Math.round(savingsScore),
        consistency: Math.round(consistencyScore)
      }
    };
  }, [transactions, balance, getIncome, getExpense]);

  return creditData;
}
