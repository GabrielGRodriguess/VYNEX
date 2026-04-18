import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export default function InsightWall({ insights }) {
  if (!insights || insights.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertCircle size={18} className="text-amber-500" />;
      case 'opportunity': return <Zap size={18} className="text-blue-600" />;
      case 'success': return <CheckCircle2 size={18} className="text-blue-600" />;
      default: return null;
    }
  };

  const getColorClass = (type) => {
    switch (type) {
      case 'warning': return 'border-amber-100 bg-amber-50/50';
      case 'opportunity': return 'border-blue-100 bg-blue-50/50';
      case 'success': return 'border-blue-100 bg-blue-50/50';
      default: return 'border-slate-200 bg-white';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="section-title">Principais Achados</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, idx) => (
          <motion.div
            key={insight.id || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 group hover:scale-[1.01] transition-all cursor-pointer ${getColorClass(insight.type)}`}
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                {getIcon(insight.type)}
              </div>
              <p className="text-sm font-bold text-slate-800 leading-relaxed">
                {insight.text}
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Impacto: {insight.impact > 0 ? '+' : ''}{insight.impact} pts no Score
              </span>
              <button className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Ação <ArrowRight size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
