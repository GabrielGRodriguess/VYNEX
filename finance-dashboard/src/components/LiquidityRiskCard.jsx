import React from 'react';
import { motion } from 'framer-motion';
import { Activity, HelpCircle, ArrowRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const RISK_LEVELS = [
  { max: 0.4,  label: 'Baixo',  color: 'blue',   desc: 'Você tem boa folga no orçamento. Sua margem para pagar contas e parcelas está confortável.' },
  { max: 0.65, label: 'Médio',  color: 'amber',  desc: 'Atenção: sua folga está reduzindo. Considere revisar gastos antes de assumir novos compromissos.' },
  { max: 1,    label: 'Alto',   color: 'rose',   desc: 'Sua margem está comprometida. Recomendamos reduzir gastos fixos antes de contratar crédito.' },
];

const colorMap = {
  blue:  { bar: 'bg-blue-600',  badge: 'bg-blue-50 text-blue-700 border-blue-200',  track: 'bg-blue-50' },
  amber: { bar: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200', track: 'bg-amber-50' },
  rose:  { bar: 'bg-rose-500',  badge: 'bg-rose-50 text-rose-700 border-rose-200',  track: 'bg-rose-50' },
};

export default function LiquidityRiskCard({ fixedExpenseRatio = 0 }) {
  const { transactions } = useFinance();
  const hasNoData = transactions.length === 0;
  
  const pct = Math.min(Math.round(fixedExpenseRatio * 100), 100);
  const level = RISK_LEVELS.find(l => fixedExpenseRatio <= l.max) || RISK_LEVELS[RISK_LEVELS.length - 1];
  const c = colorMap[level.color];

  return (
    <div className="glass flex flex-col justify-between gap-6 min-h-[220px]">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Activity size={20} />
            </div>
            <div>
              <h4 className="text-lg font-[900] text-slate-900 tracking-tight">Risco de Liquidez</h4>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Capacidade de Pagamento</p>
            </div>
          </div>
          {!hasNoData && (
            <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${c.badge}`}>
              {level.label}
            </span>
          )}
        </div>

        {hasNoData ? (
          <div className="pt-2">
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              O NEX ainda não conhece seu comportamento. Adicione transações para calcular seu risco.
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-500 leading-relaxed">{level.desc}</p>
        )}
      </div>

      {hasNoData ? (
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center justify-between group cursor-pointer hover:bg-blue-100 transition-colors">
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Registrar agora</span>
          <ArrowRight size={12} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comprometimento</span>
            <span className="text-sm font-black text-slate-800">{pct}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${c.bar}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
