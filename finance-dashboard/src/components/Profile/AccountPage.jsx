import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { useFinance } from '../../context/FinanceContext';
import { User, CreditCard, Shield, Zap, LogOut, Key, Headphones, Check, Crown, Info, Sparkles, Activity } from 'lucide-react';
import { PLANS } from '../../services/planService';

export default function AccountPage() {
  const { profile, currentPlan, activeAgents, updatePlan } = useUser();
  const { connections } = useFinance();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const activeAgentCount = Object.values(activeAgents).filter(Boolean).length;

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
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-brand-green/10 via-transparent to-purple-600/5 opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
               <span className="bg-brand-green text-slate-950 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-brand-green/20">
                  <Crown size={12} fill="currentColor" /> {currentPlan.name}
               </span>
               <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/10">
                  ID: {profile?.user_id?.split('-')[0]}
               </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
              Seu Plano e <span className="text-brand-green">Benefícios</span>
            </h1>
            <p className="text-slate-500 text-sm max-w-lg">
              Gerencie sua assinatura, monitore seus limites de inteligência e conecte novas instituições para ampliar sua clareza financeira.
            </p>
          </div>
          <div className="bg-slate-950/50 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-xl flex flex-col items-center gap-4 min-w-[200px]">
             <div className="w-16 h-16 rounded-2xl bg-brand-green/20 flex items-center justify-center text-brand-green shadow-[0_0_30px_rgba(163,255,18,0.2)]">
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
          color="text-brand-green" 
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

      {/* Plans Comparison - Polished & Commercial */}
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-3">
             <h3 className="text-3xl font-black text-white uppercase tracking-tight">Comparativo de Inteligência</h3>
             <p className="text-slate-500 text-sm">Escolha o nível de processamento que sua vida financeira exige.</p>
          </div>
          
          <div className="flex p-1.5 bg-slate-900 rounded-2xl border border-white/10 self-start md:self-auto">
             <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase transition-all tracking-widest ${billingCycle === 'monthly' ? 'bg-slate-800 text-brand-green shadow-xl' : 'text-slate-500'}`}
             >Mensal</button>
             <button 
                onClick={() => setBillingCycle('annual')}
                className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase transition-all tracking-widest ${billingCycle === 'annual' ? 'bg-slate-800 text-brand-green shadow-xl' : 'text-slate-500'}`}
             >Anual <span className="ml-1 text-[9px] bg-brand-green/20 text-brand-green px-2 py-0.5 rounded-full">-20%</span></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {Object.values(PLANS).map((plan) => (
            <motion.div 
              key={plan.id}
              whileHover={{ y: -8 }}
              className={`glass p-10 relative overflow-hidden flex flex-col group transition-all duration-500 ${
                currentPlan.id === plan.id.toLowerCase() 
                ? 'border-brand-green/40 bg-brand-green/[0.02] ring-1 ring-brand-green/20' 
                : 'border-white/5 hover:border-white/20'
              }`}
            >
              {currentPlan.id === plan.id.toLowerCase() && (
                <div className="absolute top-6 right-6 bg-brand-green text-slate-950 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl shadow-brand-green/20">
                  Ativo Agora
                </div>
              )}
              
              <div className="space-y-8 flex-1 relative z-10">
                <div className="space-y-2">
                  <h4 className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em]">{plan.name}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white tracking-tighter">R$ {billingCycle === 'monthly' ? plan.price : Math.floor(plan.price * 0.8)}</span>
                    <span className="text-slate-500 text-sm font-bold">/ mês</span>
                  </div>
                </div>

                <div className="space-y-5 pt-4">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 group/item">
                      <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-[11px] sm:text-[12px] font-bold text-slate-300 group-hover/item:text-white transition-colors">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => updatePlan(plan.id.toLowerCase())}
                disabled={currentPlan.id === plan.id.toLowerCase()}
                className={`w-full mt-10 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all relative z-10 ${
                  currentPlan.id === plan.id.toLowerCase() 
                    ? 'bg-slate-800 text-slate-600 cursor-default grayscale' 
                    : 'bg-brand-green text-slate-950 hover:bg-white hover:scale-105 active:scale-95 shadow-xl shadow-brand-green/10'
                }`}
              >
                {currentPlan.id === plan.id.toLowerCase() ? 'Incluso no seu Plano' : 'Assinar ' + plan.name}
              </button>
            </motion.div>
          ))}
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

