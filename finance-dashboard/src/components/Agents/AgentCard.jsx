import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function AgentCard({ agent, onToggle }) {
  return (
    <motion.div
      layout
      className={`glass p-6 border-white/10 relative overflow-hidden group transition-all ${
        agent.active ? 'bg-brand-green/[0.03] border-brand-green/20' : 'opacity-60'
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="text-3xl bg-slate-900 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl">
          {agent.avatar}
        </div>
        <button
          onClick={() => onToggle(agent.id)}
          className={`w-12 h-6 rounded-full relative transition-all ${
            agent.active ? 'bg-brand-green' : 'bg-slate-800'
          }`}
        >
          <motion.div
            animate={{ x: agent.active ? 24 : 4 }}
            className="w-4 h-4 rounded-full bg-slate-950 absolute top-1 shadow-md"
          />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black text-white uppercase tracking-tight">{agent.name}</h3>
          {agent.active && (
            <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
          )}
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">
          {agent.role}
        </p>
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed pt-2">
          {agent.description}
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500">
          <div className={`w-1.5 h-1.5 rounded-full ${agent.active ? 'bg-brand-green' : 'bg-slate-700'}`} />
          {agent.active ? 'Ativo' : 'Pausado'}
        </div>
      </div>
    </motion.div>
  );
}
