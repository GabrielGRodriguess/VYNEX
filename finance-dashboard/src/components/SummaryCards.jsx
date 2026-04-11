import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { motion } from 'framer-motion';

export default function SummaryCards() {
  const { balance, getIncome, getExpense } = useFinance();

  const cards = [
    {
      title: 'Saldo VYNEX',
      value: balance,
      color: 'text-neon',
      glow: 'shadow-brand-green/10',
      icon: '💎'
    },
    {
      title: 'Entradas',
      value: getIncome(),
      color: 'text-emerald-400',
      glow: 'shadow-emerald-500/10',
      icon: '↗️'
    },
    {
      title: 'Saídas',
      value: getExpense(),
      color: 'text-rose-500',
      glow: 'shadow-rose-500/10',
      icon: '↘️'
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
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
          className={`glass p-8 relative overflow-hidden group shadow-2xl ${card.glow}`}
        >
          {/* Background Glow */}
          <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 transition-opacity group-hover:opacity-20 ${index === 0 ? 'bg-brand-green' : index === 1 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{card.title}</p>
              <p className={`text-3xl font-black ${card.color} tracking-tight`}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.value)}
              </p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-white/5 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
              <span className="text-xl">{card.icon}</span>
            </div>
          </div>
          
          {/* Mini progress line or indicator */}
          <div className="mt-6 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: '100%' }}
               transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
               className={`h-full ${index === 0 ? 'bg-neon-gradient' : index === 1 ? 'bg-emerald-500' : 'bg-rose-500'}`}
             />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
