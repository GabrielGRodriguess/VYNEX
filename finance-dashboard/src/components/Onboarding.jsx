import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, ShieldCheck, Banknote, ArrowRight, Check, Zap, Crown, X, Thermometer, Sparkles, Lock, ArrowUpRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { PLANS, planService, openFinanceProgress } from '../services/planService';
import logo from '../assets/vynex-logo.png';
import { useToast } from '../context/ToastContext';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const { updatePlan, completeOnboarding, profile } = useUser();
  const [selectedPlan, setSelectedPlan] = useState('FREE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const toast = useToast();

  if (!isVisible) return null;

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      updatePlan(selectedPlan);
      completeOnboarding();
      setIsVisible(false);
      toast.success('Bem-vindo!', 'Seu plano foi configurado e sua jornada começou.');
    } catch (error) {
      console.error('Erro ao finalizar onboarding:', error);
      setIsVisible(false);
      toast.error('Aviso', 'Entrando no modo de contingência. Suas escolhas serão sincronizadas em breve.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressStatus = planService.getOpenFinanceStatus(openFinanceProgress);

  const steps = [
    {
      id: 1,
      title: 'Bem-vindo ao Novo VYNEX',
      subtitle: 'Conecte seus bancos e converse com seu dinheiro.',
      icon: <Rocket className="text-brand-primary" size={48} />,
      content: (
        <div className="space-y-6 text-center">
          <p className="text-slate-400 text-sm leading-relaxed">
            Evoluímos para ser mais do que crédito. Agora, você tem uma visão consolidada de todo o seu patrimônio e uma IA pronta para agir por você.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div className="glass p-4 border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <ShieldCheck size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-left">Open Finance Seguro</p>
            </div>
            <div className="glass p-4 border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Zap size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-left">Insights em tempo real</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Escolha seu acesso',
      subtitle: 'Comece grátis ou ative o Pro Pass para entrar na próxima fase do VYNEX.',
      icon: <Crown className="text-brand-primary" size={48} />,
      content: (
        <div className="flex flex-col gap-6">
          {/* Pro Pass Card - Highlighted */}
          <button
            onClick={() => setSelectedPlan('PRO_PASS')}
            className={`group relative w-full p-8 rounded-[2.5rem] border-2 transition-all text-left overflow-hidden ${
              selectedPlan === 'PRO_PASS'
                ? 'bg-white border-brand-primary shadow-[0_30px_60px_-12px_rgba(163,255,18,0.25)]'
                : 'bg-white/50 border-slate-200 hover:border-brand-primary/50'
            }`}
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-brand-primary text-slate-950 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      Recomendado
                    </span>
                    <span className="text-brand-primary flex items-center gap-1 text-[9px] font-black uppercase tracking-widest">
                      <Sparkles size={12} /> Premium
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                    VYNEX Pro Pass
                  </h3>
                  <p className="text-brand-primary text-xl font-black mt-1">
                    R$ 29,90 <span className="text-slate-400 text-xs font-bold lowercase">/ mês</span>
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  selectedPlan === 'PRO_PASS' ? 'bg-brand-primary text-slate-950' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Check size={24} strokeWidth={3} className={selectedPlan === 'PRO_PASS' ? 'opacity-100' : 'opacity-0'} />
                </div>
              </div>

              <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
                Ative o Pro Pass e garanta acesso às conexões bancárias reais quando o Open Finance for liberado.
              </p>

              {/* Thermometer Area */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-8">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      progressStatus.label === 'Quente' ? 'bg-orange-500/10 text-orange-500' : 
                      progressStatus.label === 'Morno' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      <Thermometer size={14} />
                    </div>
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{progressStatus.title}</span>
                  </div>
                  <span className="text-[11px] font-black text-brand-primary">{openFinanceProgress}%</span>
                </div>
                
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden mb-2 relative">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${openFinanceProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full relative ${
                      progressStatus.label === 'Quente' ? 'bg-gradient-to-r from-orange-400 to-red-500' : 
                      progressStatus.label === 'Morno' ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-blue-400 to-brand-primary'
                    }`}
                   >
                     <div className="absolute inset-0 bg-white/20 animate-pulse" />
                   </motion.div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-400">{progressStatus.status}</span>
                  <span className="text-slate-300">Próximo: {progressStatus.next}</span>
                </div>

                <p className="mt-4 text-[10px] text-slate-400 font-medium leading-relaxed italic">
                  * Quando chegar no nível máximo, assinantes Pro Pass recebem acesso às conexões bancárias reais.
                </p>
              </div>

              <div className="space-y-3">
                {PLANS.PRO_PASS.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-[12px] font-bold text-slate-600">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </button>

          {/* Free Card - Simpler */}
          <button
            onClick={() => setSelectedPlan('FREE')}
            className={`w-full p-6 rounded-[2rem] border transition-all text-left flex items-center justify-between ${
              selectedPlan === 'FREE'
                ? 'bg-white border-slate-900 shadow-xl'
                : 'bg-white/30 border-slate-100 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                selectedPlan === 'FREE' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                <Rocket size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-900 uppercase tracking-tight">Gratuito</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Para começar sua organização</p>
              </div>
            </div>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
              selectedPlan === 'FREE' ? 'border-brand-primary bg-brand-primary text-slate-950' : 'border-slate-200'
            }`}>
              {selectedPlan === 'FREE' && <Check size={14} strokeWidth={4} />}
            </div>
          </button>
        </div>
      )
    }
  ];

  const currentStep = steps.find(s => s.id === step);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent" />
      
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-8 right-8 p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-all z-[110] shadow-sm"
        title="Pular por enquanto"
      >
        <X size={20} />
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg space-y-12"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <img src={logo} alt="VYNEX" className="h-10 opacity-30 grayscale" />
          <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 flex items-center justify-center shadow-lg">
            {currentStep.icon}
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{currentStep.title}</h1>
            <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]">{currentStep.subtitle}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-[300px]"
          >
            {currentStep.content}
          </motion.div>
        </AnimatePresence>

        <div className="pt-8">
          {step < steps.length ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              className="w-full py-5 bg-brand-primary text-slate-950 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-brand-primary/20 hover:scale-[1.02] transition-all"
            >
              Continuar <ArrowRight size={20} />
            </button>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleFinish}
                disabled={isSubmitting}
                className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-brand-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-wait"
              >
                {isSubmitting ? 'Processando...' : 'Começar minha jornada'} <Check size={20} />
              </button>
              
              <button
                onClick={() => setIsVisible(false)}
                className="w-full py-3 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-slate-900 transition-all"
              >
                Pular configuração e entrar no app →
              </button>
            </div>
          )}
          
          <div className="mt-8 flex justify-center gap-2">
            {steps.map(s => (
              <div 
                key={s.id} 
                className={`h-1 rounded-full transition-all ${step === s.id ? 'w-8 bg-brand-primary' : 'w-2 bg-slate-800'}`} 
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
