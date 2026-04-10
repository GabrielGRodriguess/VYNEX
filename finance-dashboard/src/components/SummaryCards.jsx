import React from 'react';
import { useFinance } from '../context/FinanceContext';

export default function SummaryCards() {
  const { balance, getIncome, getExpense } = useFinance();

  const cards = [
    {
      title: 'Saldo Total',
      value: balance,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Receitas',
      value: getIncome(),
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Despesas',
      value: getExpense(),
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => (
        <div key={card.title} className={`glass p-6 ${card.bg}`}>
          <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
          <p className={`text-2xl font-bold ${card.color}`}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.value)}
          </p>
        </div>
      ))}
    </div>
  );
}
