import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function AgentCard({ agent, onToggle }) {
  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className={`glass p-6 border-white/10 relative overflow-hidden group transition-all duration-500 ${
        agent.active 
          ? 'bg-brand-green/[0.05] border-brand-green/40 shadow-[0_0_20px_rgba(163,255,18,0.1)] ring-1 ring-brand-green/20' 
          : 'opacity-70 hover:opacity-100'
      }`}
    >
      {/* Active Glowing Background */}
      {agent.active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-brand-green/5 via-transparent to-transparent pointer-events-none"
        />
      )}

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`text-3xl w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
          agent.active 
            ? 'bg-brand-green/20 border-brand-green/30 shadow-[0_0_15px_rgba(163,255,18,0.3)]' 
            : 'bg-slate-900 border-white/5 shadow-2xl'
        }`}>
          {agent.avatar}
        </div>
        <button
          onClick={() => onToggle(agent.id)}
          className={`w-12 h-6 rounded-full relative transition-all duration-300 shadow-inner ${
            agent.active ? 'bg-brand-green' : 'bg-slate-800'
          }`}
        >
          <motion.div
            animate={{ x: agent.active ? 26 : 4 }}
            className={`w-4 h-4 rounded-full absolute top-1 shadow-md transition-colors ${
              agent.active ? 'bg-slate-950' : 'bg-slate-400'
            }`}
          />
        </button>
      </div>

      <div className="space-y-2 relative z-10">
        <div className="flex items-center gap-2">
          <h3 className={`text-sm font-black uppercase tracking-tight transition-colors ${
            agent.active ? 'text-white' : 'text-slate-400'
          }`}>
            {agent.name}
          </h3>
          {agent.active && (
            <div className="w-1.5 h-1.5 rounded-full bg-brand-green shadow-[0_0_8px_#A3FF12] animate-pulse" />
          )}
        </div>
        <p className={`text-[10px] font-black uppercase tracking-widest leading-tight transition-colors ${
          agent.active ? 'text-brand-green/80' : 'text-slate-500'
        }`}>
          {agent.role}
        </p>
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed pt-2">
          {agent.description}
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-4 relative z-10">
        <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-colors ${
          agent.active ? 'text-brand-green' : 'text-slate-500'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full transition-all ${
            agent.active ? 'bg-brand-green shadow-[0_0_5px_#A3FF12]' : 'bg-slate-700'
          }`} />
          {agent.active ? 'Ativo e Monitorando' : 'Especialista em Pausa'}
        </div>
      </div>
    </motion.div>
  );
}
