import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function ScoreGaugeCard({ score }) {
  const { value, label, trend } = score;

  const getScoreColor = (val) => {
    if (val >= 800) return '#2563EB'; // Brand Blue
    if (val >= 600) return '#3b82f6'; // Light Blue
    if (val >= 400) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
  };

  const color = getScoreColor(value);

  return (
    <div className="glass relative overflow-hidden group">
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* Gauge */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="10"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeDasharray={364}
              initial={{ strokeDashoffset: 364 }}
              animate={{ strokeDashoffset: 364 - (364 * value) / 1000 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-900">{value}</span>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Score Vynex</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span 
              className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
              style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}
            >
              {label}
            </span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {trend === 'up' ? <TrendingUp size={12} className="text-blue-600" /> : 
               trend === 'down' ? <TrendingDown size={12} className="text-rose-500" /> : 
               <Minus size={12} />}
              <span>Tendência</span>
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Diagnóstico de Saúde</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            {value >= 800 ? "Sua gestão financeira é exemplar. Você possui alta capacidade de investimento e baixo risco." :
             value >= 600 ? "Seu perfil é equilibrado, mas existem oportunidades pontuais de otimização de gastos." :
             "Atenção: seu comprometimento financeiro está elevado. Recomendamos revisar gastos fixos imediatamente."}
          </p>
        </div>

        <button className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all">
          <Shield size={20} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
}
