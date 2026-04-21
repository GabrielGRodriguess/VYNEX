import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, TrendingDown, Minus, HelpCircle, Zap } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const scoreDescriptions = {
  high:    'Sua gestão financeira está saudável. Você tem boa margem de crédito e baixo risco de inadimplência.',
  medium:  'Seu perfil está equilibrado, mas ainda existem oportunidades para melhorar sua chance de aprovação.',
  low:     'Atenção: seu comprometimento está elevado. Recomendamos revisar gastos fixos antes de contratar crédito.',
  empty:   'Ainda não temos dados suficientes para gerar seu Score VYNEX. Comece registrando suas movimentações.'
};

export default function FinancialHealthCard({ score }) {
  const { transactions } = useFinance();
  const hasNoData = transactions.length === 0;
  
  const { value, label, trend } = score;

  const getColor = (val) => {
    if (hasNoData) return { stroke: '#E2E8F0', text: 'text-slate-400', badge: 'bg-slate-50 text-slate-500 border-slate-200' };
    if (val >= 800) return { stroke: '#2563EB', text: 'text-blue-600', badge: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (val >= 600) return { stroke: '#7c3aed', text: 'text-violet-600', badge: 'bg-violet-50 text-violet-700 border-violet-200' };
    if (val >= 400) return { stroke: '#d97706', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { stroke: '#e11d48', text: 'text-rose-600', badge: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const { stroke, text, badge } = getColor(value);
  const desc = hasNoData ? scoreDescriptions.empty : (value >= 800 ? scoreDescriptions.high : value >= 600 ? scoreDescriptions.medium : scoreDescriptions.low);
  const dashArray = 2 * Math.PI * 58;
  const dashOffset = dashArray - (dashArray * (hasNoData ? 0 : value)) / 1000;

  return (
    <div className="glass relative overflow-hidden group">
      {/* Subtle top accent */}
      {!hasNoData && (
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: `linear-gradient(90deg, ${stroke}, transparent)` }} />
      )}

      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 pt-2">
        {/* Gauge */}
        <div className="relative shrink-0 w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="58" fill="none" stroke="#F8FAFF" strokeWidth="10" />
            <motion.circle
              cx="64" cy="64" r="58"
              fill="none"
              stroke={stroke}
              strokeWidth="10"
              strokeDasharray={dashArray}
              initial={{ strokeDashoffset: dashArray }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-black tracking-tighter ${hasNoData ? 'text-slate-200' : 'text-slate-900'}`}>
              {hasNoData ? '---' : value}
            </span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Score VYNEX</span>
          </div>
        </div>

        {/* Text Info */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${badge}`}>
              {hasNoData ? 'Aguardando Dados' : label}
            </span>
            {!hasNoData && (
              <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${text}`}>
                {trend === 'up' ? <TrendingUp size={12} /> : trend === 'down' ? <TrendingDown size={12} /> : <Minus size={12} />}
                Tendência
              </span>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-[900] text-slate-900 tracking-tight">Saúde Financeira</h3>
            <p className="text-[15px] text-slate-500 leading-relaxed max-w-md font-medium">{desc}</p>
          </div>

          {hasNoData && (
            <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
              Como funciona o Score? <ArrowRight size={12} />
            </button>
          )}
        </div>

        <button
          title="Entender análise"
          className="hidden md:flex shrink-0 p-3.5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
        >
          <Zap size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
        </button>
      </div>
    </div>
  );
}
