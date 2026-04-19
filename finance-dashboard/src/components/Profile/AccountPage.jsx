import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { useFinance } from '../../context/FinanceContext';
import { useToast } from '../../context/ToastContext';
import { User, CreditCard, Shield, Zap, LogOut, Key, Headphones, Check, Crown, Info, Sparkles, Activity, Thermometer, ArrowUpRight } from 'lucide-react';
import { PLANS, planService, openFinanceProgress } from '../../services/planService';

export default function AccountPage() {
  const { profile, currentPlan, activeAgents, updatePlan, handleStartSubscription } = useUser();
  const { connections } = useFinance();
  const toast = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    
    if (status === 'success') {
      toast.success('Pagamento Recebido', 'Pagamento recebido. Estamos confirmando sua assinatura.');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (status === 'failure') {
      toast.error('Erro no Pagamento', 'Não foi possível processar sua assinatura. Tente novamente.');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (status === 'pending') {
      toast.info('Pagamento Pendente', 'Seu pagamento está sendo processado pelo Mercado Pago.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const activeAgentCount = Object.values(activeAgents).filter(Boolean).length;
  const progressStatus = planService.getOpenFinanceStatus(openFinanceProgress);  const Stat = ({ label, value, limit, icon, color, unit = '' }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 space-y-3 group hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all relative overflow-hidden shadow-sm">
      <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-10 transition-opacity group-hover:opacity-20 ${color.replace('text-', 'bg-')}`} />
      <div className="flex items-center gap-2 text-slate-500 relative z-10">
        <div className={`p-2 rounded-xl bg-blue-50 text-blue-600`}>
           {icon}
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="relative z-10 flex items-baseline gap-2">
        <p className="text-3xl font-black text-[#0B1220]">{value}{unit}</p>
        {limit && (
           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">/ {limit === Infinity ? '∞' : limit}</p>
        )}
      </div>
      {limit && (
        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((value / (limit === Infinity ? value || 1 : limit)) * 100, 100)}%` }}
            className={`h-full bg-blue-600`}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 px-4">
      {/* Premium Header: Navy Gradient */}
      <div className="relative p-8 md:p-12 rounded-[3rem] border border-white/10 bg-[#0B1220] overflow-hidden shadow-2xl shadow-blue-900/20">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0B1220_0%,#1E3A8A_55%,#2563EB_100%)]" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
               <span className="bg-[#2563EB] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-500/20">
                  <Crown size={12} fill="currentColor" /> {currentPlan.name}
               </span>
               <span className="text-[#CBD5E1] text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/20">
                  ID: {profile?.user_id?.split('-')[0]}
               </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
              Seu Plano e <span className="text-[#60A5FA]">Benefícios</span>
            </h1>
            <p className="text-[#CBD5E1] text-sm max-w-lg font-medium">
              Gerencie sua assinatura, monitore seus limites de inteligência e conecte novas instituições para ampliar sua clareza financeira.
            </p>
          </div>
          <div className="bg-white/10 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-md flex flex-col items-center gap-4 min-w-[200px]">
             <div className="w-16 h-16 rounded-2xl bg-blue-400/20 flex items-center justify-center text-blue-300 shadow-[0_0_30px_rgba(96,165,250,0.2)]">
                <Activity size={32} />
             </div>
             <div className="text-center">
                <p className="text-[10px] font-black text-[#CBD5E1] uppercase tracking-widest">Status da Conta</p>
                <p className="text-xl font-black text-white uppercase">Verificado</p>
             </div>
          </div>
        </div>
      </div>

      {/* Usage Metrics - Light Dashboard Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat 
          label="Bancos Conectados" 
          value={connections.length} 
          limit={currentPlan.maxConnections} 
          icon={<Zap size={18} />} 
          color="text-blue-600" 
        />
        <Stat 
          label="Agentes Ativos" 
          value={activeAgentCount} 
          limit={currentPlan.maxActiveAgents} 
          icon={<Sparkles size={18} />} 
          color="text-blue-500" 
        />
        <Stat 
          label="Score Vynex" 
          value="782" 
          icon={<Shield size={18} />} 
          color="text-indigo-600" 
        />
        <Stat 
          label="Economia Gerada" 
          value="1.2k" 
          unit="R$"
          icon={<CreditCard size={18} />} 
          color="text-blue-600" 
        />
      </div>

      {/* Your Access Section - Premium Light */}
      <div className="space-y-10">
        <div className="border-b border-slate-200 pb-8">
          <h3 className="text-3xl font-[800] text-[#0B1220] uppercase tracking-tight">Seu acesso</h3>
          <p className="text-[#64748B] text-sm mt-2 font-medium">
            {currentPlan.id === 'FREE' 
              ? 'Você está usando o VYNEX Gratuito' 
              : 'Você é um assinante VYNEX Pro Pass'}
          </p>
        </div>

        <div className="max-w-2xl">
          {/* Pro Pass Card - Premium Highlighted */}
          <div className={`relative p-10 rounded-[3rem] border-2 overflow-hidden transition-all duration-500 bg-white ${
            currentPlan.id === 'PRO_PASS' 
              ? 'border-[#2563EB] shadow-[0_30px_60px_rgba(37,99,235,0.15)]' 
              : 'border-slate-100 shadow-xl shadow-slate-200/50 hover:border-[#2563EB]/30'
          }`}>
            {/* Decoration */}
            <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-[0.08] -mr-32 -mt-32 rounded-full ${
              currentPlan.id === 'PRO_PASS' ? 'bg-[#2563EB]' : 'bg-blue-400'
            }`} />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE] font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles size={12} /> Pro Pass Early Access
                    </span>
                    {currentPlan.id === 'PRO_PASS' && (
                      <span className="bg-[#DCFCE7] text-[#16A34A] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        Ativo
                      </span>
                    )}
                  </div>
                  <h4 className="text-4xl font-black text-[#0B1220] tracking-tighter uppercase">VYNEX Pro Pass</h4>
                  <p className="text-[#2563EB] font-bold text-xl tracking-tight">R$ 29,90 / mês</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${
                  currentPlan.id === 'PRO_PASS' ? 'bg-[#2563EB] text-white shadow-blue-500/20' : 'bg-slate-50 text-slate-300'
                }`}>
                  <Crown size={32} fill={currentPlan.id === 'PRO_PASS' ? 'currentColor' : 'none'} />
                </div>
              </div>

              <p className="text-[#64748B] text-sm mb-8 leading-relaxed max-w-md font-medium">
                {currentPlan.id === 'PRO_PASS' 
                  ? 'Você garantiu seu lugar na próxima fase do VYNEX. Acompanhe abaixo o aquecimento do Open Finance.'
                  : 'Ative o Pro Pass e garanta acesso às conexões bancárias reais quando o Open Finance for liberado.'}
              </p>

              {/* Thermometer Area - Refined Colors */}
              <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${
                      progressStatus.label === 'Quente' ? 'bg-orange-100 text-orange-600' : 
                      progressStatus.label === 'Morno' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <Thermometer size={16} />
                    </div>
                    <span className="text-xs font-black text-[#0B1220] uppercase tracking-tight">{progressStatus.title}</span>
                  </div>
                  <span className="text-sm font-black text-[#F59E0B]">{openFinanceProgress}% — {progressStatus.status}</span>
                </div>
                
                <div className="h-4 bg-slate-200 rounded-full overflow-hidden mb-3 relative">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${openFinanceProgress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full relative [background:linear-gradient(90deg,#60A5FA_0%,#F59E0B_70%,#FB923C_100%)]`}
                   >
                     <div className="absolute inset-0 bg-white/10 animate-pulse" />
                   </motion.div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-slate-400">Progresso Atual</span>
                  <span className="text-slate-500">Próximo: {progressStatus.next}</span>
                </div>

                <p className="mt-4 text-[11px] text-slate-400 font-medium leading-relaxed italic">
                  * Quando chegar no nível máximo, assinantes Pro Pass recebem acesso às conexões bancárias reais.
                </p>
                
                {openFinanceProgress === 100 && currentPlan.id === 'PRO_PASS' && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <button className="w-full py-4 bg-[linear-gradient(135deg,#2563EB,#7C3AED)] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                      Ativar conexões bancárias <Zap size={16} fill="currentColor" />
                    </button>
                  </div>
                )}
              </div>

              {currentPlan.id !== 'PRO_PASS' && (
                <button 
                  onClick={handleStartSubscription}
                  className="w-full py-6 bg-[linear-gradient(135deg,#2563EB,#7C3AED)] text-white rounded-[1.2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-500/30 hover:translate-y-[-2px] hover:shadow-blue-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Ativar Pro Pass — R$ 29,90 <ArrowUpRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security & Multi-Agent Disclaimer - Light Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        <div className="bg-white p-10 border border-slate-200 rounded-[2.5rem] flex items-start gap-6 shadow-sm hover:shadow-md transition-shadow">
           <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <Shield size={24} />
           </div>
           <div className="space-y-2">
              <h4 className="text-sm font-black text-[#0B1220] uppercase tracking-tight">Segurança Open Finance</h4>
              <p className="text-[11px] text-[#64748B] leading-relaxed font-medium">Seus dados bancários são acessados apenas em modo de leitura através de conexões criptografadas de ponta a ponta.</p>
           </div>
        </div>

        <div className="bg-white p-10 border border-slate-200 rounded-[2.5rem] flex items-start gap-6 shadow-sm hover:shadow-md transition-shadow">
           <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <Activity size={24} />
           </div>
           <div className="space-y-2">
              <h4 className="text-sm font-black text-[#0B1220] uppercase tracking-tight">Frequência de Dados</h4>
              <p className="text-[11px] text-[#64748B] leading-relaxed font-medium">Sincronização automática a cada 24h ou sob demanda para usuários Pro Pass ativos.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

