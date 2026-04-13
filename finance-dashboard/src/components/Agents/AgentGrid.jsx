import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { agentService } from '../../services/agentService';
import { planService } from '../../services/planService';
import { useUser } from '../../context/UserContext';
import AgentCard from './AgentCard';
import { Bot, Sparkles, AlertCircle, Crown } from 'lucide-react';

export default function AgentGrid() {
  const { activeAgents, toggleAgent, currentPlan, setActiveSection } = useUser();
  const [error, setError] = useState(null);
  
  const agents = agentService.getAgents().map(agent => ({
    ...agent,
    active: !!activeAgents[agent.id]
  }));

  const activeCount = agents.filter(a => a.active).length;

  const handleToggle = async (id) => {
    setError(null);
    const agent = agents.find(a => a.id === id);
    
    // If turning ON, check limits
    if (!agent.active) {
      if (!planService.canAddAgent(activeCount, currentPlan.id)) {
        setError(`Seu plano ${currentPlan.name} permite até ${currentPlan.maxActiveAgents} agente(s) ativo(s).`);
        return;
      }
    }

    const success = await toggleAgent(id);
    if (!success) {
      setError("Falha ao salvar preferência. Tente novamente.");
    }
  };

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

        <div className="glass px-6 py-4 border-brand-green/20 flex items-center gap-4 bg-brand-green/5 min-w-[200px]">
           <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center text-brand-green shadow-[0_0_15px_rgba(163,255,18,0.2)]">
              <Sparkles size={20} />
           </div>
           <div>
              <div className="flex items-baseline gap-1">
                <p className="text-white font-black text-sm">{activeCount}</p>
                <p className="text-slate-500 text-[10px] font-bold">/ {currentPlan.maxActiveAgents === Infinity ? '∞' : currentPlan.maxActiveAgents}</p>
              </div>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Agentes Ativos</p>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass p-4 border-rose-500/20 bg-rose-500/5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 text-rose-400">
               <AlertCircle size={18} />
               <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
            </div>
            <button 
              onClick={() => setActiveSection('account')}
              className="flex items-center gap-2 bg-brand-green/10 text-brand-green px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border border-brand-green/20 hover:bg-brand-green/20"
            >
              <Crown size={12} /> Fazer Upgrade
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Novas Especialidades em Treinamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40 grayscale pointer-events-none">
          <div className="glass p-6 border-dashed border-white/10 flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-xl">🏠</div>
              <div>
                <p className="text-white font-black text-xs uppercase text-slate-400">Estratega Imobiliário</p>
                <p className="text-[9px] text-slate-500">Desenvolvimento em curso</p>
              </div>
            </div>
          </div>
          <div className="glass p-6 border-dashed border-white/10 flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-xl">🛡️</div>
              <div>
                <p className="text-white font-black text-xs uppercase text-slate-400">Analista de Risco Global</p>
                <p className="text-[9px] text-slate-500">Aguardando certificação</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

