import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { useFinance } from '../../context/FinanceContext';
import { User, CreditCard, Shield, Zap, LogOut, Key, Headphones, Check, Crown, Info } from 'lucide-react';
import { PLANS } from '../../services/planService';

export default function AccountPage() {
  const { profile, currentPlan } = useUser();
  const { connections } = useFinance();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const Stat = ({ label, value, icon, color }) => (
    <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 space-y-1 group hover:border-white/10 transition-all">
      <div className="flex items-center gap-2 text-slate-500 mb-2">
        <div className={`p-1.5 rounded-lg bg-white/5 ${color}`}>
           {icon}
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 px-4">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-900/40 p-8 md:p-12 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/5 rounded-full blur-[100px] -mr-48 -mt-48" />
        
        <div className="w-28 h-28 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green text-5xl font-black shadow-[0_0_50px_rgba(163,255,18,0.15)] relative z-10 border border-brand-green/20">
          {profile?.email?.[0].toUpperCase()}
        </div>

        <div className="text-center md:text-left relative z-10 space-y-3 flex-1">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{profile?.email?.split('@')[0]}</h2>
            <p className="text-slate-500 text-xs mt-2 font-bold">{profile?.email}</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
             <span className="bg-brand-green/10 text-brand-green text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-brand-green/20 flex items-center gap-2">
                <Crown size={10} /> Plano {currentPlan.name}
             </span>
             <span className="bg-white/5 text-slate-500 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/5">
                Membro Vynex
             </span>
          </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat label="Bancos Conectados" value={`${connections.length} / ${currentPlan.maxConnections}`} icon={<Zap size={14} />} color="text-brand-green" />
        <Stat label="Perfil Vynex" value="780" icon={<Shield size={14} />} color="text-blue-400" />
        <Stat label="Status Assinatura" value="Ativa" icon={<CreditCard size={14} />} color="text-purple-400" />
        <Stat label="Agentes Ativos" value="6" icon={<Crown size={14} />} color="text-amber-500" />
      </div>

      {/* Plans Comparison Section - UI Polish */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
             <h3 className="text-2xl font-black text-white uppercase tracking-tight">Evolua seu Plano</h3>
             <p className="text-slate-500 text-sm">Desbloqueie mais inteligência e conexões ilimitadas.</p>
          </div>
          
          <div className="flex p-1 bg-slate-900 rounded-xl border border-white/5 self-start md:self-auto">
             <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${billingCycle === 'monthly' ? 'bg-slate-800 text-white shadow-xl' : 'text-slate-500'}`}
             >Mensal</button>
             <button 
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${billingCycle === 'annual' ? 'bg-slate-800 text-white shadow-xl' : 'text-slate-500'}`}
             >Anual <span className="text-brand-green text-[8px] ml-1">-20%</span></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.values(PLANS).map((plan) => (
            <motion.div 
              key={plan.id}
              whileHover={{ y: -5 }}
              className={`glass p-8 relative overflow-hidden flex flex-col ${
                currentPlan.id === plan.id.toLowerCase() ? 'border-brand-green/30 ring-1 ring-brand-green/20' : 'border-white/5'
              }`}
            >
              {currentPlan.id === plan.id.toLowerCase() && (
                <div className="absolute top-4 right-4 bg-brand-green text-slate-950 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Seu Plano
                </div>
              )}
              
              <div className="space-y-6 flex-1">
                <div>
                  <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{plan.name}</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">R$ {billingCycle === 'monthly' ? plan.price : (plan.price * 0.8).toFixed(0)}</span>
                    <span className="text-slate-500 text-xs">/mês</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    `${plan.maxConnections === Infinity ? 'Ilimitados' : plan.maxConnections} Conexões bancárias`,
                    plan.id === 'PREMIUM' ? 'Todos os Agentes Ativos' : 'Acesso a 6 Agentes',
                    'Inteligência Artificial 24h',
                    plan.id === 'FREE' ? 'Insights básicos' : 'Insights Avançados + API',
                    plan.id === 'PREMIUM' ? 'Suporte VIP 24h' : 'Suporte Padrão'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
                        <Check size={12} />
                      </div>
                      <span className={i > 2 && plan.id === 'FREE' ? 'text-slate-600' : 'text-slate-400'}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                disabled={currentPlan.id === plan.id.toLowerCase()}
                className={`w-full mt-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                  currentPlan.id === plan.id.toLowerCase() 
                    ? 'bg-slate-800 text-slate-500 cursor-default' 
                    : 'bg-brand-green text-slate-950 hover:scale-105 shadow-lg shadow-brand-green/10'
                }`}
              >
                {currentPlan.id === plan.id.toLowerCase() ? 'Plano Atual' : 'Migrar para ' + plan.name}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Security & Support Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        <div className="glass p-8 border-white/5 space-y-6">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                 <Shield size={20} />
              </div>
              <div>
                 <h4 className="text-sm font-black text-white uppercase tracking-tight">Dados & Privacidade</h4>
                 <p className="text-[10px] text-slate-500">Criptografia AES-256 bits ativa.</p>
              </div>
           </div>
           <button className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest underline decoration-brand-green underline-offset-4 transition-all">
              Gerenciar chaves de acesso
           </button>
        </div>

        <div className="glass p-8 border-white/5 space-y-6 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
                 <Headphones size={20} />
              </div>
              <div>
                 <h4 className="text-sm font-black text-white uppercase tracking-tight">Precisa de ajuda?</h4>
                 <p className="text-[10px] text-slate-500">Fale com um consultor Vynex.</p>
              </div>
           </div>
           <button className="bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 transition-all">
              <LogOut size={16} className="text-rose-500" />
           </button>
        </div>
      </div>
    </div>
  );
}
