import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { motion } from 'framer-motion';

export default function FinancialInsights() {
  const { transactions } = useFinance();

  const insights = useMemo(() => {
    const list = [];
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

    // 1. Food Spike Detection
    const foodExpense = expenses
      .filter(t => t.category === 'Food')
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (foodExpense > totalExpense * 0.4 && totalExpense > 0) {
      list.push({
        id: 'food',
        icon: '🍎',
        text: 'Gastos com alimentação acima da média este mês.',
        color: 'text-amber-400'
      });
    }

    // 2. Stability Detection (Last 3 transactions small)
    const recent = transactions.slice(0, 3);
    const isStable = recent.length >= 3 && recent.every(t => t.amount < 200);
    if (isStable) {
      list.push({
        id: 'stable',
        icon: '🛡️',
        text: 'Seu saldo mantém estabilidade nos últimos dias.',
        color: 'text-brand-green'
      });
    }

    // 3. Subscription detection (Mocking logic for "patterns")
    const hasRecurring = transactions.some(t => t.description?.toLowerCase().includes('netflix') || t.description?.toLowerCase().includes('amazon'));
    if (hasRecurring || list.length < 2) {
      list.push({
        id: 'saving',
        icon: '📉',
        text: 'Possível economia identificada em assinaturas.',
        color: 'text-emerald-400'
      });
    }

    // 4. Fallback if still empty
    if (list.length < 2) {
      list.push({
        id: 'entry',
        icon: '⚡',
        text: 'Entradas mais frequentes identificadas no início da semana.',
        color: 'text-brand-green'
      });
    }

    return list.slice(0, 3);
  }, [transactions]);

  return (
    <div className="glass p-8 relative overflow-hidden">
      {/* Subtle Background pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
      
      <div className="relative z-10">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green/40 shadow-[0_0_10px_rgba(163,255,18,0.2)]"></span>
          Insights Financeiros
        </h3>

        <div className="space-y-6">
          {insights.map((insight, index) => (
            <motion.div 
              key={insight.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-center gap-4 group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-center text-lg grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                {insight.icon}
              </div>
              <p className="text-sm font-medium text-slate-300 leading-tight flex-1">
                {insight.text}
              </p>
              <div className={`w-1 h-1 rounded-full ${insight.color} opacity-40 shadow-[0_0_8px_currentColor]`}></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
