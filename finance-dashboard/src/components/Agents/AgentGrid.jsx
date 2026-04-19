import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { agentService } from '../../services/agentService';
import { planService } from '../../services/planService';
import { useUser } from '../../context/UserContext';
import AgentCard from './AgentCard';
import { Bot, Sparkles, AlertCircle, Crown } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Alert from '../Common/Alert';

export default function AgentGrid() {
  const { activeAgents, toggleAgent, currentPlan, role, isPremium, isAdmin } = useUser();
  const toast = useToast();
  
  const agents = agentService.getAgents().map(agent => ({
    ...agent,
    active: !!activeAgents[agent.id]
  }));

  const activeCount = agents.filter(a => a.active).length;
  const maxAgents = currentPlan.maxActiveAgents;

  const handleToggle = async (id) => {
    const agent = agents.find(a => a.id === id);
    
    // If turning ON, check limits
    if (!agent.active) {
      if (!planService.canAddAgent(activeCount, currentPlan.id, role)) {
        toast.info(
          'Limite do Plano', 
          'No plano gratuito você pode ativar até 2 agentes. Ative o VYNEX Pro Pass para liberar acesso ilimitado.'
        );
        return;
      }
    }

    const success = await toggleAgent(id);
    if (!success) {
      toast.error('Erro no Sistema', 'Não foi possível atualizar o status do agente no banco de dados.');
    } else {
      const newState = !agent.active;
      if (newState) {
        toast.success('Agente Ativado', `${agent.name} agora faz parte do seu time ativo.`);
      } else {
        toast.info('Agente em Pausa', `${agent.name} foi removido do time de monitoramento.`);
      }
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-primary">
            <Bot size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Time de Especialistas IA</span>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
            Gerencie seu <span className="text-brand-primary">Dream Team</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-md">
            Selecione quais especialistas devem monitorar sua vida financeira e gerar insights em tempo real.
          </p>
        </div>

        <div className="glass px-6 py-4 border-brand-primary/20 flex items-center gap-4 bg-brand-primary/5 min-w-[220px] transition-all hover:bg-brand-primary/10">
           <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary shadow-[0_0_15px_rgba(163,255,18,0.2)]">
              <Crown size={20} />
           </div>
           <div>
              <div className="flex items-baseline gap-1">
                <p className="text-white font-black text-xl leading-none">{activeCount}</p>
                <p className="text-slate-500 text-[10px] font-bold">/ {maxAgents === Infinity ? '∞' : maxAgents}</p>
              </div>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Especialistas Ativos</p>
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

