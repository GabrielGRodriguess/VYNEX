import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { useFinance } from '../../context/FinanceContext';
import { User, CreditCard, Shield, Zap, LogOut, Key, Headphones, Check, Crown, Info, Sparkles, Activity, Thermometer, ArrowUpRight } from 'lucide-react';
import { PLANS, planService, openFinanceProgress } from '../../services/planService';

export default function AccountPage() {
  const { profile, currentPlan, activeAgents, updatePlan } = useUser();
  const { connections } = useFinance();

  const activeAgentCount = Object.values(activeAgents).filter(Boolean).length;
  const progressStatus = planService.getOpenFinanceStatus(openFinanceProgress);

  const Stat = ({ label, value, limit, icon, color, unit = '' }) => (
    <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 space-y-3 group hover:border-white/10 transition-all relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-10 transition-opacity group-hover:opacity-20 ${color.replace('text-', 'bg-')}`} />
      <div className="flex items-center gap-2 text-slate-500 relative z-10">
        <div className={`p-2 rounded-xl bg-white/5 ${color}`}>
           {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className="relative z-10 flex items-baseline gap-2">
        <p className="text-3xl font-black text-white">{value}{unit}</p>
        {limit && (
           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">/ {limit === Infinity ? '∞' : limit}</p>
        )}
      </div>
      {limit && (
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((value / (limit === Infinity ? value || 1 : limit)) * 100, 100)}%` }}
            className={`h-full ${color.replace('text-', 'bg-')}`}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 px-4">
      {/* Redesigned Header: Content Focused */}
      <div className="relative p-8 md:p-12 rounded-[3rem] border border-white/5 bg-slate-900/40 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-brand-primary/10 via-transparent to-purple-600/5 opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
               <span className="bg-brand-primary text-slate-950 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-brand-primary/20">
                  <Crown size={12} fill="currentColor" /> {currentPlan.name}
               </span>
               <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/10">
                  ID: {profile?.user_id?.split('-')[0]}
               </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
              Seu Plano e <span className="text-brand-primary">Benefícios</span>
            </h1>
            <p className="text-slate-500 text-sm max-w-lg">
              Gerencie sua assinatura, monitore seus limites de inteligência e conecte novas instituições para ampliar sua clareza financeira.
            </p>
          </div>
          <div className="bg-slate-950/50 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-xl flex flex-col items-center gap-4 min-w-[200px]">
             <div className="w-16 h-16 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary shadow-[0_0_30px_rgba(163,255,18,0.2)]">
                <Activity size={32} />
             </div>
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status da Conta</p>
                <p className="text-xl font-black text-white uppercase">Verificado</p>
             </div>
          </div>
        </div>
      </div>

      {/* Usage Metrics - Dashboard Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat 
          label="Bancos Conectados" 
          value={connections.length} 
          limit={currentPlan.maxConnections} 
          icon={<Zap size={18} />} 
          color="text-brand-primary" 
        />
        <Stat 
          label="Agentes Ativos" 
          value={activeAgentCount} 
          limit={currentPlan.maxActiveAgents} 
          icon={<Sparkles size={18} />} 
          color="text-blue-400" 
        />
        <Stat 
          label="Score Vynex" 
          value="782" 
          icon={<Shield size={18} />} 
          color="text-purple-400" 
        />
        <Stat 
          label="Economia Gerada" 
          value="1.2k" 
          unit="R$"
          icon={<CreditCard size={18} />} 
          color="text-amber-500" 
        />
      </div>

      {/* Your Access Section - Simplified & Impactful */}
      <div className="space-y-10">
        <div className="border-b border-white/5 pb-8">
          <h3 className="text-3xl font-black text-white uppercase tracking-tight">Seu acesso</h3>
          <p className="text-slate-500 text-sm mt-2">
            {currentPlan.id === 'FREE' 
              ? 'Você está usando o VYNEX Gratuito' 
              : 'Você é um assinante VYNEX Pro Pass'}
          </p>
        </div>

        <div className="max-w-2xl">
          {/* Pro Pass Card - Always visible as status or upgrade */}
          <div className={`relative p-10 rounded-[3rem] border-2 overflow-hidden transition-all duration-500 ${
            currentPlan.id === 'PRO_PASS' 
              ? 'bg-brand-primary/[0.03] border-brand-primary shadow-[0_0_50px_rgba(163,255,18,0.1)]' 
              : 'bg-slate-900/40 border-white/5 hover:border-white/10'
          }`}>
            {/* Decoration */}
            <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 -mr-32 -mt-32 rounded-full ${
              currentPlan.id === 'PRO_PASS' ? 'bg-brand-primary' : 'bg-blue-500'
            }`} />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-primary font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-1">
                      <Sparkles size={12} /> Pro Pass Early Access
                    </span>
                    {currentPlan.id === 'PRO_PASS' && (
                      <span className="bg-brand-primary text-slate-950 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        Ativo
                      </span>
                    )}
                  </div>
                  <h4 className="text-4xl font-black text-white tracking-tighter uppercase">VYNEX Pro Pass</h4>
                  <p className="text-slate-400 font-bold">R$ 29,90 / mês</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  currentPlan.id === 'PRO_PASS' ? 'bg-brand-primary text-slate-950' : 'bg-white/5 text-slate-500'
                }`}>
                  <Crown size={32} fill={currentPlan.id === 'PRO_PASS' ? 'currentColor' : 'none'} />
                </div>
              </div>

              <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-md">
                {currentPlan.id === 'PRO_PASS' 
                  ? 'Você garantiu seu lugar na próxima fase do VYNEX. Acompanhe abaixo o aquecimento do Open Finance.'
                  : 'Ative o Pro Pass e garanta acesso às conexões bancárias reais quando o Open Finance for liberado.'}
              </p>

              {/* Thermometer Area */}
              <div className="bg-slate-950/50 border border-white/5 rounded-[2rem] p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${
                      progressStatus.label === 'Quente' ? 'bg-orange-500/10 text-orange-500' : 
                      progressStatus.label === 'Morno' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      <Thermometer size={16} />
                    </div>
                    <span className="text-xs font-black text-white uppercase tracking-tight">{progressStatus.title}</span>
                  </div>
                  <span className="text-sm font-black text-brand-primary">{openFinanceProgress}%</span>
                </div>
                
                <div className="h-4 bg-white/5 rounded-full overflow-hidden mb-3 relative">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${openFinanceProgress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full relative ${
                      progressStatus.label === 'Quente' ? 'bg-gradient-to-r from-orange-400 to-red-500' : 
                      progressStatus.label === 'Morno' ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-blue-400 to-brand-primary'
                    }`}
                   >
                     <div className="absolute inset-0 bg-white/20 animate-pulse" />
                   </motion.div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-slate-500">{progressStatus.status}</span>
                  <span className="text-brand-primary/50">Próximo: {progressStatus.next}</span>
                </div>

                <p className="mt-4 text-[11px] text-slate-500 font-medium leading-relaxed italic">
                  * Quando chegar no nível máximo, assinantes Pro Pass recebem acesso às conexões bancárias reais.
                </p>
                
                {openFinanceProgress === 100 && currentPlan.id === 'PRO_PASS' && (
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <button className="w-full py-4 bg-brand-primary text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                      Ativar conexões bancárias <Zap size={16} fill="currentColor" />
                    </button>
                  </div>
                )}
              </div>

              {currentPlan.id !== 'PRO_PASS' && (
                <button 
                  onClick={() => updatePlan('PRO_PASS')}
                  className="w-full py-6 bg-brand-primary text-slate-950 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-brand-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  Ativar Pro Pass — R$ 29,90 <ArrowUpRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security & Multi-Agent Disclaimer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        <div className="glass p-10 border-white/5 flex items-start gap-6 bg-blue-500/[0.02]">
           <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
              <Shield size={24} />
           </div>
           <div className="space-y-2">
              <h4 className="text-sm font-black text-white uppercase tracking-tight">Segurança Open Finance</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">Seus dados bancários são acessados apenas em modo de leitura através de conexões criptografadas de ponta a ponta.</p>
           </div>
        </div>

        <div className="glass p-10 border-white/5 flex items-start gap-6 bg-purple-500/[0.02]">
           <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400">
              <Activity size={24} />
           </div>
           <div className="space-y-2">
              <h4 className="text-sm font-black text-white uppercase tracking-tight">Frequência de Dados</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">Sincronização automática a cada 24h ou sob demanda para usuários Pro e Premium.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

