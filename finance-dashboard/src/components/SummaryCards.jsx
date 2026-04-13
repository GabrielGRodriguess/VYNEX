import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, ArrowDownCircle, Landmark, ShieldCheck, Activity, Target } from 'lucide-react';

export default function SummaryCards() {
  const { balance, analytics, connections } = useFinance();
  const { currentPlan } = useUser();

  const isNegative = balance < 0;

  const cards = [
    {
      title: 'Patrimônio Consolidado',
      value: balance,
      color: isNegative ? 'text-rose-500' : 'text-brand-green',
      glow: isNegative ? 'shadow-rose-500/20' : 'shadow-brand-green/20',
      icon: <Wallet size={20} />,
      subtext: isNegative ? 'Ação recomendada' : 'Liquidez imediata',
      progress: 100
    },
    {
      title: 'Renda Real Identificada',
      value: analytics.monthlyIncome || 0,
      color: 'text-emerald-400',
      glow: 'shadow-emerald-500/10',
      icon: <TrendingUp size={20} />,
      subtext: `Consistência: ${(analytics.incomeConsistency * 100).toFixed(0)}%`,
      progress: analytics.incomeConsistency * 100
    },
    {
      title: 'Sobra do Mês Estimada',
      value: analytics.monthlySurplus || 0,
      color: analytics.monthlySurplus >= 0 ? 'text-blue-400' : 'text-rose-500',
      glow: 'shadow-blue-500/10',
      icon: <Target size={20} />,
      subtext: analytics.monthlySurplus >= 0 ? 'Capacidade de aporte' : 'Déficit operacional',
      progress: Math.max(0, Math.min((analytics.monthlySurplus / (analytics.monthlyIncome || 1)) * 100, 100))
    },
    {
      title: 'Comprometimento Fixo',
      value: (analytics.fixedExpenseRatio * 100).toFixed(1),
      isPercent: true,
      color: analytics.fixedExpenseRatio > 0.6 ? 'text-rose-400' : 'text-purple-400',
      glow: 'shadow-purple-500/10',
      icon: <Activity size={20} />,
      subtext: analytics.fixedExpenseRatio > 0.6 ? 'Risco de liquidez' : 'Gasto sob controle',
      progress: (1 - analytics.fixedExpenseRatio) * 100
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
      {cards.map((card, index) => (
        <motion.div 
          key={card.title} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className={`glass p-5 sm:p-7 relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.3)] ${card.glow} border border-white/5`}
        >
          {/* Background Glow */}
          <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 transition-opacity group-hover:opacity-20 ${
            index === 0 ? 'bg-brand-green' : index === 1 ? 'bg-emerald-500' : index === 2 ? 'bg-blue-500' : 'bg-purple-500'
          }`}></div>
          
          <div className="flex flex-col justify-between h-full relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 sm:p-3 bg-slate-800/50 rounded-2xl border border-white/5 text-slate-400 group-hover:text-white transition-all transform group-hover:scale-110">
                {card.icon}
              </div>
              {card.isPercent && (
                <span className="text-[10px] font-black bg-white/5 border border-white/10 px-3 py-1 rounded-full text-slate-500">
                   KPI
                </span>
              )}
            </div>

            <div className="min-w-0 space-y-1">
              <p className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{card.title}</p>
              <p className={`text-xl sm:text-2xl font-black ${card.color} tracking-tighter truncate transition-all group-hover:scale-[1.02] origin-left`}>
                {card.isPercent ? `${card.value}%` : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(card.value)}
              </p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest opacity-60 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-current"></span>
                {card.subtext}
              </p>
            </div>
            
            {/* Intel Progress bar */}
            <div className="mt-5 w-full h-1 bg-white/5 rounded-full overflow-hidden">
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
