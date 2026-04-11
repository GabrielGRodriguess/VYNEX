import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInsights } from '../hooks/useInsights';

export default function FinancialInsights() {
  const insights = useInsights();

  if (insights.length === 0) return null;

  return (
    <div className="glass p-8 relative overflow-hidden">
      {/* Subtle Background pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green/40 shadow-[0_0_10px_rgba(163,255,18,0.2)]"></span>
            Inteligência VYNEX
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-brand-green animate-pulse"></div>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
              Análise Ativa
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {insights.map((insight, index) => (
              <motion.div 
                key={insight.id}
                layout
                initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`flex items-start gap-5 group py-2 px-4 rounded-2xl transition-all duration-500 ${
                  insight.type === 'alert' 
                    ? 'bg-amber-500/[0.03] border border-amber-500/10' 
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-center text-lg transition-all duration-500 ${
                  insight.type === 'alert' 
                    ? 'grayscale-0 opacity-100 shadow-[0_0_15px_rgba(245,158,11,0.15)] border-amber-500/20' 
                    : 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100'
                }`}>
                  {insight.icon}
                </div>
                
                <div className="flex-1 space-y-1">
                  <span className={`text-[8px] font-black uppercase tracking-tighter block ${
                    insight.type === 'alert' ? 'text-amber-500' : 'text-slate-500'
                  }`}>
                    {insight.label}
                  </span>
                  <p className="text-sm font-medium text-slate-300 leading-snug">
                    {insight.text}
                  </p>
                </div>

                <div className={`mt-2 w-1.5 h-1.5 rounded-full ${insight.color} opacity-30 shadow-[0_0_8px_currentColor]`}></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
