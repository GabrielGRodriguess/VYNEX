import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, ArrowDownCircle, Landmark, ShieldCheck, Activity, Target } from 'lucide-react';

export default function SummaryCards() {
  const { analytics } = useFinance();
  const { summary } = analytics;

  const isNegative = summary.totalBalance < 0;

  const cards = [
    {
      title: 'Saldo Consolidado',
      value: summary.totalBalance,
      color: isNegative ? 'text-rose-600' : 'text-blue-600',
      icon: <Wallet size={20} />,
      subtext: isNegative ? 'Déficit identificado' : 'Liquidez disponível',
      progress: 100
    },
    {
      title: 'Renda Mensal',
      value: summary.monthlyIncome,
      color: 'text-blue-600',
      icon: <TrendingUp size={20} />,
      subtext: `Consistência: ${(analytics.assessment.incomeConsistency * 100).toFixed(0)}%`,
      progress: analytics.assessment.incomeConsistency * 100
    },
    {
      title: 'Sobra Estimada',
      value: summary.surplus,
      color: summary.surplus >= 0 ? 'text-blue-600' : 'text-rose-600',
      icon: <Target size={20} />,
      subtext: summary.surplus >= 0 ? 'Potencial de aporte' : 'Déficit operacional',
      progress: Math.max(0, Math.min((summary.surplus / (summary.monthlyIncome || 1)) * 100, 100))
    },
    {
      title: 'Comprometimento',
      value: (analytics.assessment.fixedExpenseRatio * 100).toFixed(1),
      isPercent: true,
      color: analytics.assessment.fixedExpenseRatio > 0.6 ? 'text-rose-600' : 'text-blue-600',
      icon: <Activity size={20} />,
      subtext: analytics.assessment.fixedExpenseRatio > 0.6 ? 'Risco elevado' : 'Sob controle',
      progress: Math.max(0, (1 - analytics.assessment.fixedExpenseRatio) * 100)
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, index) => (
        <motion.div 
          key={card.title} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass relative overflow-hidden group"
        >
          <div className="flex flex-col justify-between h-full relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 sm:p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-600 transition-all">
                {card.icon}
              </div>
            </div>

            <div className="min-w-0 space-y-1">
              <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{card.title}</p>
              <p className={`text-xl sm:text-2xl font-black ${card.color} tracking-tighter truncate origin-left`}>
                {card.isPercent ? `${card.value}%` : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(card.value)}
              </p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest opacity-60 flex items-center gap-1.5">
                <span className={`w-1 h-1 rounded-full ${card.color.replace('text-', 'bg-')}`}></span>
                {card.subtext}
              </p>
            </div>
            
            <div className="mt-5 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${card.progress}%` }}
                 transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                 className={`h-full ${card.color.replace('text-', 'bg-')}`}
               />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
