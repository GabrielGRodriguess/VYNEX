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

    // Get Decision from Engine with Real Bank Data
    const decision = getDecisionResult(formData, {
      balance,
      totalIncome: analytics.totalIncome,
      totalExpense: analytics.totalExpense
    });
    
    // Send to backend (Supabase)
    try {
      await fetch(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          score_vynex: decision.score_vynex, 
          tipo_lead: decision.tipo_lead, 
          produto_recomendado: decision.produto_recomendado,
          valor_estimado: decision.faixa_credito,
          operador_email: user?.email || 'anonimo'
        })
      });
    } catch (e) { console.error("Lead capture failed (silent fallback)"); }

    setTimeout(() => {
      setResult(decision);
      setLoading(false);
      setStep(5);
    }, 2500);
  };

  // WhatsApp Redirect: Direct Conversion
  const handleWhatsApp = () => {
    const msg = `Olá, sou ${formData.nome}. Fiz minha análise no Vynex e quero receber minha simulação de ${result.produto_recomendado}.`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Step Renders
  const renderStep1 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Quem é você?</h2>
        <p className="text-slate-400 text-sm">Só precisamos de alguns dados básicos para começar sua simulação personalizada.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="label-style">Nome Completo</label>
          <input 
            type="text" 
            placeholder="Seu nome"
            className="input-style"
            value={formData.nome}
            onChange={e => setFormData({...formData, nome: e.target.value})}
          />
          {errors.nome && <p className="error-text">{errors.nome}</p>}
        </div>
        <div>
          <label className="label-style">WhatsApp (DDD + Número)</label>
          <input 
            type="tel" 
            placeholder="(00) 00000-0000"
            className="input-style"
            value={formData.telefone}
            onChange={e => setFormData({...formData, telefone: e.target.value})}
          />
          {errors.telefone && <p className="error-text">{errors.telefone}</p>}
        </div>
      </div>
      <button onClick={nextStep} className="bg-brand-green text-slate-950 w-full py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
        Próximo Passo <ArrowRight size={18} />
      </button>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Como é sua renda?</h2>
        <p className="text-slate-400 text-sm">Isso nos ajuda a encontrar as melhores taxas e prazos para o seu perfil.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="label-style">Tipo de Vínculo</label>
          <select 
            className="input-style"
            value={formData.tipo_vinculo}
            onChange={e => setFormData({...formData, tipo_vinculo: e.target.value})}
          >
            <option value="CLT">CLT / Privado</option>
            <option value="Servidor Público">Servidor Público (Federal/Estadual)</option>
            <option value="Aposentado / Pensionista">Aposentado ou Pensionista INSS</option>
            <option value="Autônomo">Autônomo / Empresário</option>
          </select>
        </div>
        <div>
          <label className="label-style">Renda Mensal Bruta</label>
          <div className="relative flex items-center">
            <span className="absolute left-5 text-slate-500 font-bold text-sm">R$</span>
            <input 
              type="number" 
              placeholder="0.00"
              className="input-style pl-14"
              value={formData.renda}
              onChange={e => setFormData({...formData, renda: e.target.value})}
            />
          </div>
          {errors.renda && <p className="error-text">{errors.renda}</p>}
        </div>
      </div>
      <div className="flex gap-4">
        <button onClick={() => setStep(1)} className="border border-white/10 text-white w-1/3 py-4 rounded-2xl font-black uppercase tracking-widest">Voltar</button>
        <button onClick={nextStep} className="bg-brand-green text-slate-950 flex-1 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2">Continuar</button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Seu momento atual</h2>
        <p className="text-slate-400 text-sm">Quase lá! Vamos checar sua margem para liberar o melhor valor possível.</p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-style">Possui Empréstimo?</label>
            <select className="input-style" value={formData.possui_consignado} onChange={e => setFormData({...formData, possui_consignado: e.target.value})}>
              <option value="Não">Não</option>
              <option value="Sim">Sim</option>
            </select>
          </div>
          <div>
            <label className="label-style">Sua Margem está:</label>
            <select className="input-style" value={formData.status_margem} onChange={e => setFormData({...formData, status_margem: e.target.value})}>
              <option value="Livre">Livre / Disponível</option>
              <option value="Parcialmente usada">Parcialmente usada</option>
              <option value="Totalmente usada">Totalmente usada</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div>
            <label className="label-style">Já fez portabilidade?</label>
            <select className="input-style" value={formData.fez_portabilidade} onChange={e => setFormData({...formData, fez_portabilidade: e.target.value})}>
              <option value="Não">Não</option>
              <option value="Sim">Sim</option>
            </select>
          </div>
          <div>
            <label className="label-style">Tem interesse em:</label>
            <select className="input-style" value={formData.interesse_produto} onChange={e => setFormData({...formData, interesse_produto: e.target.value})}>
              <option value="Não sei">Não sei / Quero descobrir</option>
              <option value="Empréstimo consignado">Empréstimo Consignado Novo</option>
              <option value="Portabilidade">Portabilidade (Reduzir Parcela)</option>
              <option value="Refinanciamento">Refinanciamento</option>
              <option value="Cartão consignado">Cartão de Crédito Consignado</option>
            </select>
          </div>
        </div>
        <div className="pt-2">
          <div className="flex items-center gap-3">
            <input type="checkbox" id="lgpd" className="vynex-checkbox" checked={formData.autorizado} onChange={e => setFormData({...formData, autorizado: e.target.checked})} />
            <label htmlFor="lgpd" className="text-[10px] text-slate-500 leading-tight cursor-pointer">Autorizo a consulta e análise automatizada para simulação de crédito (LGPD).</label>
          </div>
          {errors.autorizado && <p className="error-text">{errors.autorizado}</p>}
        </div>
      </div>
        <button 
          onClick={startAnalysis}
          className="w-full relative z-10 bg-brand-green text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-green/20"
        >
          Simular meu crédito
        </button>
        <button 
          onClick={handleWhatsApp}
          className="w-full relative z-10 bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white/20 active:scale-95 transition-all"
        >
          Falar com especialista
        </button>
    </motion.div>
  );

  const renderStep4 = () => (
    <div className="flex flex-col items-center justify-center py-10 space-y-8 min-h-[400px]">
      <div className="relative">
        <div className="w-48 h-48 rounded-full border-4 border-white/5 border-t-brand-green animate-spin" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{loadingProgress}%</span>
          <span className="text-[8px] font-black text-brand-green uppercase tracking-[0.3em]">IA Decision</span>
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-white font-black uppercase tracking-widest">Calculando suas condições</h3>
        <p className="text-slate-500 text-xs px-10">Nossa inteligência está consultando as melhores taxas para o seu perfil em tempo real...</p>
      </div>
      <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-white/5">
        <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{activeUsers} pessoas consultando limite agora</span>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center border border-brand-green/20">
          <ShieldCheck className="text-brand-green" size={32} />
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Análise Concluída</h2>
          <p className="text-slate-500 text-sm">Detectamos uma excelente oportunidade de {result.produto_recomendado}.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-5 space-y-1">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Score VYNEX</p>
          <div className="flex items-end gap-2 text-brand-green">
             <p className="text-4xl font-black"><AnimatedNumber value={result.score_vynex} /></p>
          </div>
        </div>
        <div className="glass p-5 space-y-1">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Destaque</p>
          <p className="text-[11px] font-black text-brand-green leading-tight pt-2 uppercase tracking-tighter">Oportunidade Identificada</p>
        </div>
      </div>

      <div className="p-6 bg-brand-green/10 rounded-3xl border border-brand-green/20 space-y-4">
        <div className="flex items-center gap-2 text-brand-green">
          <Zap size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Produto Sugerido: {result.produto_recomendado}</span>
        </div>
        <p className="text-sm text-slate-200 font-bold leading-relaxed">
          {result.mensagem_front}
        </p>
        <div className="flex items-center justify-between border-t border-brand-green/20 pt-3">
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Estimativa Comercial</span>
           <span className="text-sm font-black text-white">{result.faixa_credito}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button onClick={handleWhatsApp} className="h-16 bg-brand-green text-slate-950 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] shadow-2xl shadow-brand-green/30 transition-all">
          <MessageSquare size={22} />
          Finalizar Agora
        </button>
        <button onClick={handleWhatsApp} className="h-16 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 active:scale-95 transition-all">
          <UserCheck size={22} />
          Falar com especialista
        </button>
      </div>
      <p className="text-[9px] text-slate-500 text-center uppercase tracking-widest animate-pulse mt-4">Atendimento especializado conectado • Consultando parceiros</p>
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
