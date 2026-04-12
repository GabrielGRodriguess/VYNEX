import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { motion } from 'framer-motion';

export default function SummaryCards() {
  const { balance, getIncome, getExpense } = useFinance();

  const isNegative = balance < 0;

  const cards = [
    {
      title: 'Patrimônio sob gestão',
      value: balance,
      color: isNegative ? 'text-rose-500' : 'text-brand-green',
      glow: isNegative ? 'shadow-rose-500/20' : 'shadow-brand-green/20',
      icon: isNegative ? '⚠️' : '🛡️',
      subtext: isNegative ? 'Ação recomendada' : 'Excelente liquidez'
    },
    {
      title: 'Entradas (mês)',
      value: getIncome(),
      color: 'text-emerald-400',
      glow: 'shadow-emerald-500/10',
      icon: '📈'
    },
    {
      title: 'Saídas (mês)',
      value: getExpense(),
      color: 'text-rose-500',
      glow: 'shadow-rose-500/10',
      icon: '📉'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {cards.map((card, index) => (
        <motion.div 
          key={card.title} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className={`glass p-6 relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${card.glow}`}
        >
          {/* Background Glow */}
          <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 transition-opacity group-hover:opacity-20 ${
            index === 0 ? (isNegative ? 'bg-rose-500' : 'bg-brand-green') : index === 1 ? 'bg-emerald-500' : 'bg-rose-500'
          }`}></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{card.title}</p>
              <p className={`text-2xl font-black ${card.color} tracking-tight`}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.value)}
              </p>
              {card.subtext && (
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1.5 opacity-60">
                  • {card.subtext}
                </p>
              )}
            </div>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-white/5 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
              <span className="text-xl">{card.icon}</span>
            </div>
          </div>
          
          {/* Mini progress line or indicator */}
          <div className="mt-4 w-full h-1 bg-slate-800/50 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: '100%' }}
               transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
               className={`h-full ${
                 index === 0 ? (isNegative ? 'bg-rose-600' : 'bg-neon-gradient') : index === 1 ? 'bg-emerald-500' : 'bg-rose-500'
               }`}
             />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
