import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Zap, CheckCircle2, ArrowRight, TrendingDown, Star } from 'lucide-react';

const TYPE_MAP = {
  warning: {
    icon: AlertCircle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    iconBg: 'bg-amber-100',
    badgeLabel: 'Atenção',
    badgeClass: 'bg-amber-100 text-amber-700',
  },
  opportunity: {
    icon: Zap,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconBg: 'bg-blue-100',
    badgeLabel: 'Oportunidade',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
  success: {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-100',
    badgeLabel: 'Positivo',
    badgeClass: 'bg-emerald-100 text-emerald-700',
  },
  default: {
    icon: Star,
    color: 'text-slate-500',
    bg: 'bg-slate-50',
    border: 'border-slate-100',
    iconBg: 'bg-slate-100',
    badgeLabel: 'Insight',
    badgeClass: 'bg-slate-100 text-slate-600',
  },
};

export default function InsightWall({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="section-title">Principais achados</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, idx) => {
          const t = TYPE_MAP[insight.type] || TYPE_MAP.default;
          const Icon = t.icon;

          return (
            <motion.div
              key={insight.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 group
                hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer
                ${t.bg} ${t.border}`}
            >
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${t.iconBg}`}>
                  <Icon size={16} className={t.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">{insight.text}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${t.badgeClass}`}>
                    {t.badgeLabel}
                  </span>
                  {insight.impact !== undefined && (
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      {insight.impact > 0 ? `+${insight.impact}` : insight.impact} pts
                    </span>
                  )}
                </div>
                <button className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Ação <ArrowRight size={11} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
