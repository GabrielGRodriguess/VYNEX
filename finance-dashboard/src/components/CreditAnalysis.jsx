import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, AlertCircle, Info, ArrowRight,
  Database, MessageSquare, ShieldCheck, Zap, Clock, UserCheck, Loader2
} from 'lucide-react';
import { getDecisionResult } from '../services/creditDecisionEngine';
import { useFinance } from '../context/FinanceContext';
import NexMascot from './NexMascot';

// Animated counter
const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;
    const totalMs = 1500;
    const inc = totalMs / end;
    const timer = setInterval(() => {
      start += 1;
      setDisplayValue(start);
      if (start === end) clearInterval(timer);
    }, inc);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{displayValue}</span>;
};

// Step indicator
const StepBar = ({ current, total }) => (
  <div className="flex items-center gap-1.5 mb-6">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
          i < current ? 'bg-blue-600' : i === current - 1 ? 'bg-blue-400' : 'bg-slate-200'
        }`}
      />
    ))}
  </div>
);

export default function CreditAnalysis({ user }) {
  const { balance, analytics } = useFinance();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
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
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
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

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 2;
      });
    }, 40);

    const decision = getDecisionResult(formData, { balance, ...analytics });

    setTimeout(() => {
      setResult(decision);
      setLoading(false);
      setStep(5);
    }, 2500);
  };

  const handleWhatsApp = () => {
    const msg = `Olá, sou ${formData.nome}. Fiz minha análise no VYNEX (Score: ${result.score_vynex}). Quero receber minha simulação de ${result.produto_recomendado} baseada no meu comportamento financeiro.`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ── STEP 1 ────────────────────────────────────────────────────────────────
  const renderStep1 = () => (
    <motion.div initial={{ x: 16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Identificação</h3>
        <p className="text-slate-500 text-sm mt-1">Como devemos te chamar e seu contato.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="label-style">Nome completo</label>
          <input
            type="text"
            value={formData.nome}
            onChange={e => setFormData({ ...formData, nome: e.target.value })}
            className="input-style"
            placeholder="Ex: João Silva"
          />
          {errors.nome && <p className="error-text">{errors.nome}</p>}
        </div>
        <div>
          <label className="label-style">WhatsApp</label>
          <input
            type="tel"
            value={formData.telefone}
            onChange={e => setFormData({ ...formData, telefone: e.target.value })}
            className="input-style"
            placeholder="(11) 99999-9999"
          />
          {errors.telefone && <p className="error-text">{errors.telefone}</p>}
        </div>
      </div>

      <button onClick={nextStep} className="w-full btn-primary">
        Continuar <ArrowRight size={16} />
      </button>
    </motion.div>
  );

  // ── STEP 2 ────────────────────────────────────────────────────────────────
  const renderStep2 = () => (
    <motion.div initial={{ x: 16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Perfil financeiro</h3>
        <p className="text-slate-500 text-sm mt-1">Sua renda permite calcular sua capacidade de crédito.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="label-style">Renda bruta mensal</label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">R$</span>
            <input
              type="number"
              value={formData.renda}
              onChange={e => setFormData({ ...formData, renda: e.target.value })}
              className="input-style pl-12"
              placeholder="0,00"
            />
          </div>
          {errors.renda && <p className="error-text">{errors.renda}</p>}
        </div>

        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-700 leading-relaxed">
            Sua renda será cruzada com dados do Open Finance para validar sua estabilidade financeira automaticamente.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => setStep(1)} className="w-full sm:w-1/3 h-[48px] sm:h-[52px] bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-200 transition-all">Voltar</button>
        <button onClick={nextStep} className="flex-1 btn-primary">Continuar <ArrowRight size={16} /></button>
      </div>
    </motion.div>
  );

  // ── STEP 3 ────────────────────────────────────────────────────────────────
  const renderStep3 = () => (
    <motion.div initial={{ x: 16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Vínculo & Estabilidade</h3>
        <p className="text-slate-500 text-sm mt-1">Isso nos ajuda a definir as melhores taxas para você.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="label-style">Tipo de vínculo</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {['Servidor Público', 'Aposentado / Pensionista', 'CLT', 'Autônomo'].map(type => (
              <button
                key={type}
                onClick={() => setFormData({ ...formData, tipo_vinculo: type })}
                className={`py-4 px-5 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all text-left ${
                  formData.tipo_vinculo === type
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={formData.autorizado}
                onChange={e => setFormData({ ...formData, autorizado: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${
                formData.autorizado ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white group-hover:border-blue-400'
              }`}>
                {formData.autorizado && <CheckCircle size={12} className="text-white" />}
              </div>
            </div>
            <span className="text-sm text-slate-600 leading-relaxed">
              Autorizo a VYNEX a consultar meus dados do Open Finance para gerar minha pontuação e ofertas personalizadas.
            </span>
          </label>
          {errors.autorizado && <p className="error-text mt-2">{errors.autorizado}</p>}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          ⚠️ Esta é uma <strong>simulação estimada</strong>. Os valores podem variar conforme análise da instituição financeira. Não garantimos aprovação.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => setStep(2)} className="w-full sm:w-1/3 h-[48px] sm:h-[52px] bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-200 transition-all">Voltar</button>
        <button onClick={startAnalysis} className="flex-1 btn-primary">
          Analisar agora <Zap size={16} />
        </button>
      </div>
    </motion.div>
  );

  // ── STEP 4 (Loading) ──────────────────────────────────────────────────────
  const renderStep4 = () => (
    <div className="flex flex-col items-center justify-center text-center py-12 space-y-8">
      <NexMascot mood="thinking" size={96} />
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900">Analisando seu perfil…</h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          Nossa IA está lendo seus extratos, identificando sua margem e calculando sua pontuação VYNEX.
        </p>
      </div>
      <div className="w-full max-w-xs bg-slate-100 h-2 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${loadingProgress}%` }}
        />
      </div>
      <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{loadingProgress}% concluído</p>
    </div>
  );

  // ── STEP 5 (Result) ───────────────────────────────────────────────────────
  const renderStep5 = () => (
    <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <NexMascot mood="happy" size={80} animate={false} />
        <div>
          <h2 className="text-2xl font-black text-slate-900">Análise Concluída!</h2>
          <p className="text-slate-500 text-sm mt-1">{result.status_analise}</p>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Score VYNEX</p>
          <p className="text-5xl font-black text-blue-700 tracking-tight">
            <AnimatedNumber value={result.score_vynex} />
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor estimado</p>
          <p className="text-lg font-black text-slate-800 leading-tight pt-1">{result.faixa_credito}</p>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Estimativa IA</p>
        </div>
      </div>

      {/* Behavioral breakdown */}
      {result.behavioral_breakdown?.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Comportamento analisado</p>
          <div className="space-y-2">
            {result.behavioral_breakdown.map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                item.type === 'positive'
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                  : 'bg-rose-50 border-rose-100 text-rose-700'
              }`}>
                <div className="flex items-center gap-2">
                  {item.type === 'positive' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  <span className="text-[11px] font-bold">{item.label}</span>
                </div>
                <span className="text-[9px] font-black uppercase opacity-60">
                  {item.type === 'positive' ? 'Vantagem' : 'Atenção'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEX suggestion */}
      <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
        <div className="flex items-center gap-2 text-blue-600">
          <Zap size={16} />
          <span className="text-[11px] font-black uppercase tracking-widest">Sugestão: {result.produto_recomendado}</span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed font-medium">"{result.mensagem_front}"</p>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-slate-400 leading-relaxed text-center">
        ⚠️ Esta é uma estimativa. Valores reais podem variar conforme análise da instituição financeira.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleWhatsApp}
          className="flex-1 h-[52px] bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
        >
          <MessageSquare size={18} /> Ver simulação
        </button>
        <button
          onClick={handleWhatsApp}
          className="w-full sm:w-16 h-[52px] bg-slate-100 text-slate-600 border border-slate-200 rounded-2xl font-black flex items-center justify-center hover:bg-slate-200 transition-all"
        >
          <UserCheck size={20} />
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-xl mx-auto px-4 pb-20 pt-4">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-black text-blue-500 uppercase tracking-widest mb-1">Assistente VYNEX</p>
          <h2 className="text-2xl font-black text-slate-900">Veja quanto você pode liberar</h2>
        </div>
        {step < 4 && (
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
            {step}/3
          </span>
        )}
      </div>

      {/* Step progress */}
      {step < 4 && <StepBar current={step} total={3} />}

      {/* Card */}
      <div className="glass min-h-[420px]">
        <AnimatePresence mode="wait">
          <React.Fragment key={step}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </React.Fragment>
        </AnimatePresence>
      </div>

      {/* Trust signals */}
      {step < 4 && (
        <div className="mt-8 flex items-center justify-center gap-8 opacity-50">
          {[
            { icon: ShieldCheck, label: 'IA Segura' },
            { icon: Database,    label: 'Multi Bancos' },
            { icon: Clock,       label: 'Rápido' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <Icon size={16} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
