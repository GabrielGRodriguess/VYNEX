import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { motion } from 'framer-motion';

export default function SummaryCards() {
  const { balance, getIncome, getExpense } = useFinance();

  const cards = [
    {
      title: 'Saldo Total',
      value: balance,
      color: 'text-blue-600',
      bg: 'bg-blue-50/50',
      icon: '💰'
    },
    {
      title: 'Receitas',
      value: getIncome(),
      color: 'text-emerald-600',
      bg: 'bg-emerald-50/50',
      icon: '📈'
    },
    {
      title: 'Despesas',
      value: getExpense(),
      color: 'text-rose-600',
      bg: 'bg-rose-50/50',
      icon: '📉'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div 
          key={card.title} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className={`glass p-6 ${card.bg} relative overflow-hidden group`}
        >
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{card.title}</p>
              <p className={`text-3xl font-black ${card.color}`}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.value)}
              </p>
            </div>
            <div className="text-2xl grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
              {card.icon}
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 text-8xl pointer-events-none group-hover:opacity-10 transition-opacity">
            {card.icon}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

