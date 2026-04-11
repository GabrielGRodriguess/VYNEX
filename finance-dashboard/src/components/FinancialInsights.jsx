import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinancialInsights() {
  const { transactions } = useFinance();

  const insights = useMemo(() => {
    const list = [];
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

    // 1. DYNAMIC INSIGHT: Most Recent Activity
    if (transactions.length > 0) {
      const latest = transactions[0];
      let dynamicText = '';
      let dynamicIcon = '🔔';
      let dynamicColor = 'text-blue-400';

      if (latest.type === 'income') {
        dynamicText = `Aporte identificado (${latest.category}). Sugerimos revisar sua estratégia de investimentos.`;
        dynamicIcon = '💰';
      } else {
        switch (latest.category) {
          case 'Food':
            dynamicText = 'Sua última refeição foi registrada. Mantenha o foco no orçamento semanal.';
            dynamicIcon = '🍽️';
            break;
          case 'Shopping':
            dynamicText = 'Compra processada. Verifique se este volume está dentro do seu limite mensal.';
            dynamicIcon = '🛍️';
            break;
          case 'Transport':
            dynamicText = 'Gasto com mobilidade identificado. Considere otimizar rotas frequentes.';
            dynamicIcon = '🚗';
            break;
          default:
            dynamicText = `Operação em ${latest.category} registrada com sucesso na rede VYNEX.`;
            dynamicIcon = '✅';
        }
      }

      list.push({
        id: `dynamic-${latest.id}`,
        icon: dynamicIcon,
        text: dynamicText,
        color: dynamicColor,
        isNew: true
      });
    }

    // 2. GLOBAL INSIGHT: Food Spike Detection
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

    // 3. GLOBAL INSIGHT: Stability Detection
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

    // 4. Default / Subscriptions
    if (list.length < 3) {
      list.push({
        id: 'saving',
        icon: '📉',
        text: 'Possível economia identificada em assinaturas recorrentes.',
        color: 'text-emerald-400'
      });
    }

    return list.slice(0, 3);
  }, [transactions]);

  return (
    <div className="glass p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green/40 shadow-[0_0_10px_rgba(163,255,18,0.2)]"></span>
            Insights Financeiros
          </h3>
          <span className="text-[8px] font-black text-brand-green/50 uppercase tracking-widest bg-brand-green/5 px-2 py-0.5 rounded-full border border-brand-green/10">
            Real-Time Engine
          </span>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {insights.map((insight, index) => (
              <motion.div 
                key={insight.id}
                layout
                initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`flex items-center gap-5 group py-1 ${insight.isNew ? 'border-l-2 border-blue-500/30 pl-4 -ml-4' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-center text-lg transition-all duration-500 ${insight.isNew ? 'grayscale-0 opacity-100 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100'}`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  {insight.isNew && (
                    <span className="text-[8px] font-black text-blue-400 uppercase tracking-tighter mb-1 block">Feedback Instantâneo</span>
                  )}
                  <p className="text-sm font-medium text-slate-300 leading-tight">
                    {insight.text}
                  </p>
                </div>
                <div className={`w-1 h-1 rounded-full ${insight.color} opacity-40 shadow-[0_0_8px_currentColor]`}></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
