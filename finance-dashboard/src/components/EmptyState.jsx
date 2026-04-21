import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, LayoutDashboard, UserCheck } from 'lucide-react';
import NexMascot from './NexMascot';

const cards = [
  {
    icon: ShieldCheck,
    color: 'blue',
    title: 'Segurança nível bancário',
    desc: 'Seus dados são protegidos com o mesmo padrão dos grandes bancos.',
  },
  {
    icon: Zap,
    color: 'violet',
    title: 'Inteligência 24h',
    desc: 'Nossos agentes analisam seu dinheiro enquanto você dorme.',
  },
  {
    icon: LayoutDashboard,
    color: 'indigo',
    title: 'Dashboard inteligente',
    desc: 'Uma visão consolidada de todo o seu patrimônio em um só lugar.',
  },
  {
    icon: UserCheck,
    color: 'amber',
    title: 'Você no controle',
    desc: 'Decisões baseadas em dados reais, não em palpites.',
  },
];

const colorMap = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   border: 'border-blue-100'  },
  violet: { bg: 'bg-violet-50', icon: 'text-violet-600', border: 'border-violet-100' },
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' },
  amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  border: 'border-amber-100' },
};

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl w-full space-y-10"
      >
        {/* Hero */}
        <div className="flex flex-col items-center text-center gap-6">
          <NexMascot mood="happy" size={100} />
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Traga clareza para sua{' '}
              <span className="text-blue-600">vida financeira</span>
            </h1>
            <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
              Enquanto a conexão automática com bancos está em fase de liberação, você pode usar o VYNEX normalmente adicionando transações ou importando seu extrato.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => document.getElementById('add-transaction-btn')?.click()}
            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition-all"
          >
            + Adicionar transação
          </button>
          <button
            onClick={() => document.getElementById('import-statement-btn')?.click()}
            className="w-full sm:w-auto border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-blue-300 hover:text-blue-700 transition-all"
          >
            Importar extrato
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, idx) => {
            const c = colorMap[card.color];
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`p-5 rounded-2xl border ${c.border} ${c.bg} space-y-3`}
              >
                <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center border ${c.border} ${c.icon}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{card.title}</h4>
                  <p className="text-[12px] text-slate-500 leading-relaxed mt-1">{card.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
