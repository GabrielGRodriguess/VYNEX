import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Target, Activity } from 'lucide-react';

const fmt = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

export default function SummaryCards() {
  const { analytics } = useFinance();
  const { summary, assessment } = analytics;

  const isNegativeBalance = summary.totalBalance < 0;

  const cards = [
    {
      title: 'Saldo consolidado',
      value: fmt(summary.totalBalance),
      subtext: isNegativeBalance ? 'Déficit identificado' : 'Liquidez disponível',
      positive: !isNegativeBalance,
      icon: Wallet,
      color: isNegativeBalance ? 'rose' : 'blue',
      progress: 100,
    },
    {
      title: 'Renda mensal',
      value: fmt(summary.monthlyIncome),
      subtext: `Consistência: ${(assessment.incomeConsistency * 100).toFixed(0)}%`,
      positive: true,
      icon: TrendingUp,
      color: 'blue',
      progress: assessment.incomeConsistency * 100,
    },
    {
      title: 'Sobra estimada',
      value: fmt(summary.surplus),
      subtext: summary.surplus >= 0 ? 'Potencial de aporte' : 'Déficit operacional',
      positive: summary.surplus >= 0,
      icon: Target,
      color: summary.surplus >= 0 ? 'blue' : 'rose',
      progress: Math.max(0, Math.min((summary.surplus / (summary.monthlyIncome || 1)) * 100, 100)),
    },
    {
      title: 'Comprometimento',
      value: `${(assessment.fixedExpenseRatio * 100).toFixed(1)}%`,
      subtext: assessment.fixedExpenseRatio > 0.6 ? 'Risco elevado' : 'Sob controle',
      positive: assessment.fixedExpenseRatio <= 0.6,
      icon: Activity,
      color: assessment.fixedExpenseRatio > 0.6 ? 'rose' : 'blue',
      progress: Math.max(0, (1 - assessment.fixedExpenseRatio) * 100),
    },
  ];

  const colorMap = {
    blue: { icon: 'bg-blue-50 text-blue-600', bar: 'bg-blue-600', value: 'text-blue-700' },
    rose: { icon: 'bg-rose-50 text-rose-600', bar: 'bg-rose-500', value: 'text-rose-600' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const c = colorMap[card.color];
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="glass flex flex-col justify-between min-h-[160px] sm:min-h-[180px]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl ${c.icon}`}>
                <Icon size={20} />
              </div>
            </div>

            <div className="space-y-1 min-w-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{card.title}</p>
              <h4 className={`text-2xl sm:text-3xl font-[900] ${c.value} tracking-tight truncate`}>{card.value}</h4>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{card.subtext}</p>
            </div>

            <div className="mt-5 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${card.progress}%` }}
                transition={{ duration: 1, delay: 0.4 + idx * 0.1 }}
                className={`h-full rounded-full ${c.bar}`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
