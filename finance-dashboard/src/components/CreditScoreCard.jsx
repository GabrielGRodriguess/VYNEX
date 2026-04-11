import React from 'react';
import { motion } from 'framer-motion';
import { useCreditScore } from '../hooks/useCreditScore';

export default function CreditScoreCard() {
  const { score, status, color, glow, metrics } = useCreditScore();

  return (
    <div className="glass p-8 relative overflow-hidden h-full flex flex-col justify-between">
      {/* Dynamic Background Glow */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[80px] transition-colors duration-1000 ${
        status === 'Premium' ? 'bg-brand-green/20' : 
        status === 'Estável' ? 'bg-amber-500/10' : 'bg-rose-500/10'
      }`}></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">
              Score VYNEX
            </h3>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${status === 'Premium' ? 'bg-brand-green' : status === 'Estável' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>
                Perfil {status}
              </span>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg px-2 py-1">
            <span className="text-[8px] font-black text-slate-400 uppercase">Beta v1.0</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
                className="text-white/5"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="440"
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * score) / 1000 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`${color} drop-shadow-[0_0_8px_currentColor]`}
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-5xl font-black text-white tracking-tighter"
              >
                {score}
              </motion.span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">pontos</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5 relative z-10">
        <div>
          <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Reserva</span>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(metrics.buffer / 400) * 100}%` }}
              className="h-full bg-blue-500"
            ></motion.div>
          </div>
        </div>
        <div>
          <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Liquidez</span>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(metrics.savings / 300) * 100}%` }}
              className="h-full bg-purple-500"
            ></motion.div>
          </div>
        </div>
        <div>
          <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Constância</span>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(metrics.consistency / 300) * 100}%` }}
              className="h-full bg-brand-green"
            ></motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
