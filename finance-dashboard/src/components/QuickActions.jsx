import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Database, Zap, BarChart2 } from 'lucide-react';

const actions = [
  {
    id: 'add-transaction',
    icon: Plus,
    color: 'blue',
    label: 'Adicionar transação',
    desc: 'Registre uma entrada, saída ou despesa.',
    cta: 'Adicionar',
    dataId: 'add-transaction-btn',
  },
  {
    id: 'import-statement',
    icon: Database,
    color: 'indigo',
    label: 'Importar extrato',
    desc: 'Envie seu extrato para uma análise mais precisa.',
    cta: 'Importar',
    dataId: 'import-statement-btn',
  },
  {
    id: 'simulate-credit',
    icon: BarChart2,
    color: 'violet',
    label: 'Simular crédito',
    desc: 'Veja parcelas estimadas antes de decidir.',
    cta: 'Simular',
  },
  {
    id: 'quick-analysis',
    icon: Zap,
    color: 'amber',
    label: 'Análise rápida',
    desc: 'Diagnóstico financeiro em segundos.',
    cta: 'Analisar',
  },
];

const colorMap = {
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-100',   icon: 'bg-blue-100 text-blue-600',   btn: 'bg-blue-600 text-white hover:bg-blue-700' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-100', icon: 'bg-indigo-100 text-indigo-600', btn: 'bg-indigo-600 text-white hover:bg-indigo-700' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-100', icon: 'bg-violet-100 text-violet-600', btn: 'bg-violet-600 text-white hover:bg-violet-700' },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-100',  icon: 'bg-amber-100 text-amber-600',  btn: 'bg-amber-500 text-white hover:bg-amber-600' },
};

export default function QuickActions({ onAddTransaction, onImportStatement, onWizard, onSimulateCredit }) {
  const handlers = {
    'add-transaction':  onAddTransaction,
    'import-statement': onImportStatement,
    'simulate-credit':  onSimulateCredit,
    'quick-analysis':   onWizard,
  };

  return (
    <div className="space-y-4">
      <h3 className="section-title">Ações rápidas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {actions.map((action, idx) => {
          const c = colorMap[action.color];
          const Icon = action.icon;
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className={`flex flex-col justify-between gap-6 p-6 rounded-[2rem] border ${c.bg} ${c.border} hover:shadow-lg transition-all duration-300 group`}
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${c.icon} transition-transform group-hover:scale-110`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="text-base font-[900] text-slate-900 leading-tight tracking-tight">{action.label}</h4>
                  <p className="text-[13px] text-slate-500 mt-2 leading-relaxed font-medium">{action.desc}</p>
                </div>
              </div>
              <button
                onClick={handlers[action.id]}
                data-action={action.id}
                className={`w-full h-[48px] sm:h-[52px] rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 ${c.btn} shadow-md`}
              >
                {action.cta}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
