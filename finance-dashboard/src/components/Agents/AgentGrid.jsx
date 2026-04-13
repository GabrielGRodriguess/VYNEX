import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { agentService } from '../../services/agentService';
import AgentCard from './AgentCard';
import { Bot, Sparkles } from 'lucide-react';

export default function AgentGrid() {
  const [agents, setAgents] = useState(agentService.getAgents());

  const handleToggle = (id) => {
    agentService.toggleAgent(id);
    setAgents([...agentService.getAgents()]);
  };

  const activeCount = agents.filter(a => a.active).length;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-green">
            <Bot size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sistema Multi-Agente</span>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
            Gerencie sua <span className="text-brand-green">Inteligência</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-md">
            Ative ou silencie agentes específicos para personalizar como a VYNEX cuida do seu dinheiro.
          </p>
        </div>

        <div className="glass px-6 py-4 border-brand-green/20 flex items-center gap-4 bg-brand-green/5">
           <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center text-brand-green shadow-[0_0_15px_rgba(163,255,18,0.2)]">
              <Sparkles size={20} />
           </div>
           <div>
              <p className="text-white font-black text-sm">{activeCount} Agentes Ativos</p>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Processamento em tempo real</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => (
          <AgentCard 
            key={agent.id} 
            agent={agent} 
            onToggle={handleToggle} 
          />
        ))}
      </div>

      {/* Suggested Agents Placeholder */}
      <div className="pt-12 space-y-6">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Agentes Sugeridos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40 grayscale pointer-events-none">
          <div className="glass p-6 border-dashed border-white/10 flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-xl">🏠</div>
              <div>
                <p className="text-white font-black text-xs uppercase">Estratega de Investimentos</p>
                <p className="text-[9px] text-slate-500">Em breve</p>
              </div>
            </div>
          </div>
          <div className="glass p-6 border-dashed border-white/10 flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-xl">🛡️</div>
              <div>
                <p className="text-white font-black text-xs uppercase">Seguro & Patrimônio</p>
                <p className="text-[9px] text-slate-500">Em breve</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
