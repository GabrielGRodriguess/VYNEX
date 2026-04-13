import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { useFinance } from '../../context/FinanceContext';
import { User, CreditCard, Shield, Zap, LogOut, Key, Headphones } from 'lucide-react';
import { PLANS } from '../../services/planService';

export default function AccountPage() {
  const { profile, currentPlan } = useUser();
  const { connections } = useFinance();

  const Stat = ({ label, value, icon }) => (
    <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 space-y-1">
      <div className="flex items-center gap-2 text-slate-500 mb-2">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-900/40 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="w-24 h-24 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green text-4xl font-black shadow-2xl relative z-10">
          {profile?.email?.[0].toUpperCase()}
        </div>

        <div className="text-center md:text-left relative z-10 space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{profile?.email?.split('@')[0]}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
             <span className="bg-brand-green/10 text-brand-green text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-brand-green/20">
                Plano {currentPlan.name}
             </span>
             <span className="bg-white/5 text-slate-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/5">
                Usuário desde 2024
             </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat label="Bancos Conectados" value={connections.length} icon={<Zap size={14} />} />
        <Stat label="Vynex Score" value="780" icon={<Shield size={14} />} />
        <Stat label="Plano Atual" value={currentPlan.name} icon={<CreditCard size={14} />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-10 border-white/5 space-y-8">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
            <CreditCard className="text-brand-green" size={20} />
            Assinatura
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-950 p-6 rounded-3xl border border-white/5">
              <div>
                <p className="text-xs font-bold text-white">Próxima Cobrança</p>
                <p className="text-[10px] text-slate-500">12 de Maio, 2024</p>
              </div>
              <p className="text-lg font-black text-white">R$ {currentPlan.price.toFixed(2)}</p>
            </div>
            <button className="w-full py-4 bg-brand-green/10 text-brand-green rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-green/20 transition-all">
              Gerenciar Cartão
            </button>
          </div>
        </div>

        <div className="glass p-10 border-white/5 space-y-6">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
            <Headphones className="text-blue-400" size={20} />
            Suporte & API
          </h3>
          <div className="space-y-3">
            <button className="w-full p-4 flex items-center justify-between rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
               <span className="text-xs font-bold text-slate-300">Central de Ajuda</span>
               <Headphones size={16} className="text-slate-600 group-hover:text-white" />
            </button>
            <button className="w-full p-4 flex items-center justify-between rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
               <span className="text-xs font-bold text-slate-300">Chaves de API</span>
               <Key size={16} className="text-slate-600 group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
