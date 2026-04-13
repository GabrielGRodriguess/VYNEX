import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, AlertCircle, XCircle, Info, TrendingUp, 
  UserCheck, Loader2, ShieldCheck, Zap, ArrowRight,
  Database, MessageSquare, Award, Clock
} from 'lucide-react';
import { API_BASE_URL } from '../constants';
import { getDecisionResult } from '../services/creditDecisionEngine';
import { useFinance } from '../context/FinanceContext';

// Sub-component: Animated Number Counter
const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    let totalMiliseconds = 1500;
    let incrementTime = (totalMiliseconds / end) ;

    let timer = setInterval(() => {
      start += 1;
      setDisplayValue(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
};

export default function CreditAnalysis({ user }) {
  const { balance, analytics } = useFinance();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeUsers, setActiveUsers] = useState(12);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    renda: '',
    tipo_vinculo: 'CLT',
    possui_consignado: 'Não',
    status_margem: 'Livre',
    fez_portabilidade: 'Não',
    interesse_produto: 'Não sei',
    autorizado: false
  });

  const [errors, setErrors] = useState({});

  const nextStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.nome) newErrors.nome = 'Nome obrigatório';
      if (!formData.telefone) newErrors.telefone = 'WhatsApp obrigatório';
    }
    if (step === 2) {
      if (!formData.renda) newErrors.renda = 'Renda obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setStep(prev => prev + 1);
  };

  const startAnalysis = async () => {
    if (!formData.autorizado) {
      setErrors({ autorizado: 'Aceite os termos para continuar' });
      return;
    }

    setLoading(true);
    setStep(4);

    // Simulate analysis intelligence
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    // Get Decision from Engine with Real Bank Data (Layer 3 Intelligence)
    const decision = getDecisionResult(formData, {
      balance,
      ...analytics // Pass all behavioral metrics (surplus, consistency, risk, etc)
    });
    
    // ... (rest of the logic)

    setTimeout(() => {
      setResult(decision);
      setLoading(false);
      setStep(5);
    }, 2500);
  };

  // WhatsApp Redirect: Direct Conversion (Humanized)
  const handleWhatsApp = () => {
    const msg = `Olá, sou ${formData.nome}. Fiz minha análise de inteligência no Vynex (Score: ${result.score_vynex}). Quero receber minha simulação de ${result.produto_recommended} baseada no meu comportamento financeiro.`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ... (previous steps)

  const renderStep5 = () => (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center border border-brand-green/20">
          <ShieldCheck className="text-brand-green" size={32} />
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Análise Concluída</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{result.status_analise}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-6 space-y-1 relative overflow-hidden bg-brand-green/[0.02]">
          <div className="absolute top-0 right-0 w-16 h-16 bg-brand-green/10 blur-2xl -mr-8 -mt-8" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Score VYNEX 2.0</p>
          <div className="flex items-end gap-2 text-brand-green">
             <p className="text-5xl font-black tracking-tighter"><AnimatedNumber value={result.score_vynex} /></p>
          </div>
        </div>
        <div className="glass p-6 space-y-1 bg-white/[0.02]">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Valor Liberável</p>
          <p className="text-lg font-black text-white leading-tight pt-2 uppercase tracking-tighter">{result.faixa_credito}</p>
          <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Estimativa IA</p>
        </div>
      </div>

      {/* Behavioral Breakdown Section */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Comportamento Analisado</h3>
        <div className="grid grid-cols-1 gap-2">
          {result.behavioral_breakdown?.map((item, id) => (
            <div key={id} className={`flex items-center justify-between p-3 rounded-xl border ${
              item.type === 'positive' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' : 'bg-rose-500/5 border-rose-500/10 text-rose-400'
            }`}>
              <div className="flex items-center gap-2">
                {item.type === 'positive' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
              </div>
              <span className="text-[8px] font-bold uppercase opacity-60">{item.type === 'positive' ? 'Vantagem' : 'Atenção'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-slate-900/50 rounded-3xl border border-white/5 space-y-4">
        <div className="flex items-center gap-2 text-brand-green">
          <Zap size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Sugestão: {result.produto_recomendado}</span>
        </div>
        <p className="text-[13px] text-slate-300 font-medium leading-relaxed italic opacity-90">
          "{result.mensagem_front}"
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={handleWhatsApp} className="flex-1 h-16 bg-brand-green text-slate-950 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] shadow-2xl shadow-brand-green/30 transition-all">
          <MessageSquare size={22} />
          Ver Simulação
        </button>
        <button onClick={handleWhatsApp} className="sm:w-16 h-16 bg-white/10 text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center hover:bg-white/20 transition-all">
          <UserCheck size={22} />
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-xl mx-auto px-4 pb-20 pt-4">
      <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Assistente VYNEX</h4>
          <p className="text-white font-black text-lg">Veja quanto você pode liberar</p>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-black text-brand-green uppercase tracking-widest bg-brand-green/10 px-3 py-1 rounded-full border border-brand-green/20">Step {step}/5</span>
        </div>
      </div>

      <div className="glass p-8 min-h-[450px]">
        <AnimatePresence mode="wait">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </AnimatePresence>
      </div>

      {/* Trust Signals */}
      {step < 4 && (
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-1 opacity-40">
            <ShieldCheck size={16} />
            <span className="text-[7px] font-black uppercase text-center">IA <br/> Segura</span>
          </div>
          <div className="flex flex-col items-center gap-1 opacity-40">
            <Database size={16} />
            <span className="text-[7px] font-black uppercase text-center">Multi <br/> Bancos</span>
          </div>
          <div className="flex flex-col items-center gap-1 opacity-40">
            <Clock size={16} />
            <span className="text-[7px] font-black uppercase text-center">Fast <br/> Response</span>
          </div>
        </div>
      )}
    </div>
  );
}
