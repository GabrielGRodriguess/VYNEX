import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, ShieldCheck, Banknote, ArrowRight, Check, Zap, Crown, X } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { PLANS } from '../services/planService';
import logo from '../assets/vynex-logo.png';
import { useToast } from '../context/ToastContext';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const { updatePlan, completeOnboarding, profile } = useUser();
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const toast = useToast();

  if (!isVisible) return null;

  const handleFinish = async () => {
    setIsSubmitting(true);
    
    // DECISION: We prioritize access over persistence. 
    // The UserContext now handles local state updates immediately.
    
    try {
      // Fire and forget (UserContext handles the await internaly if needed, 
      // but here we move forward to clear the screen)
      updatePlan(selectedPlan);
      completeOnboarding();
      
      // Navigate immediately to the app
      setIsVisible(false);
      
      toast.success('Bem-vindo!', 'Seu plano foi configurado e sua jornada começou.');
    } catch (error) {
      console.error('Erro ao finalizar onboarding:', error);
      // Even on error, we let the user in
      setIsVisible(false);
      toast.error('Aviso', 'Entrando no modo de contingência. Suas escolhas serão sincronizadas em breve.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      title: 'ESCOLHA SEU PLANO',
      subtitle: 'Selecione a opção ideal para liberar os recursos da sua gestão financeira.',
      icon: <Crown className="text-amber-500" size={48} />,
      content: (
        <div className="grid grid-cols-1 gap-4">
          {Object.values(PLANS).map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              disabled={isSubmitting}
              className={`p-5 rounded-3xl border transition-all text-left relative overflow-hidden group ${
                selectedPlan === plan.id 
                  ? 'bg-brand-primary/10 border-brand-primary shadow-2xl' 
                  : 'bg-slate-900/40 border-white/10 hover:border-white/20'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h4 className="font-black text-white uppercase tracking-tight">{plan.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    {plan.price === 0 ? 'Gratuito para sempre' : `R$ ${plan.price.toFixed(2)} / mês`}
                  </p>
                </div>
                {selectedPlan === plan.id && <Check className="text-brand-primary" size={20} />}
              </div>
              <div className="mt-4 space-y-1 relative z-10">
                {plan.features.slice(0, 2).map((f, i) => (
                  <p key={i} className="text-[9px] text-slate-400 font-medium flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-700" /> {f}
                  </p>
                ))}
              </div>
            </button>
          ))}
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
