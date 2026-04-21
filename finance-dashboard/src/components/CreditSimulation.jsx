import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, ArrowRight, MessageSquare, Info, 
  ShieldCheck, Calculator, Landmark, CreditCard, 
  TrendingUp, CheckCircle2, AlertCircle
} from 'lucide-react';
import NexMascot from './NexMascot';
import { useFinance } from '../context/FinanceContext';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const CREDIT_TYPES = [
  { id: 'personal', label: 'Crédito Pessoal', icon: CreditCard, desc: 'Rápido e sem garantia' },
  { id: 'consignado', label: 'Consignado', icon: Landmark, desc: 'Desconto em folha (Taxas menores)' },
  { id: 'refin', label: 'Refinanciamento', icon: TrendingUp, desc: 'Garantia de imóvel ou veículo' },
  { id: 'card', label: 'Cartão / Limite', icon: CreditCard, desc: 'Aumento de limite ou novo cartão' },
];

const PURPOSES = [
  'Quitar dívidas', 'Investir no negócio', 'Reforma', 'Emergência', 'Outro'
];

export default function CreditSimulation() {
  const { analytics } = useFinance();
  const [step, setStep] = useState('form'); // 'form' | 'analyzing' | 'result'
  const [formData, setFormData] = useState({
    amount: 5000,
    installments: 12,
    income: 3500,
    type: 'personal',
    purpose: 'Investir no negócio'
  });

  const [loadingProgress, setLoadingProgress] = useState(0);

  // Logic to simulate a result based on data
  const result = useMemo(() => {
    const rate = formData.type === 'consignado' ? 1.99 : 3.49;
    const monthlyRate = rate / 100;
    const pmt = formData.amount * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -formData.installments)));
    const total = pmt * formData.installments;
    
    // Simple logic for approval chance
    const dti = (pmt / formData.income);
    let chance = 'Alta';
    let mood = 'happy';
    let message = "Com base no seu histórico financeiro, você tem um perfil excelente para este crédito. As parcelas cabem no seu orçamento atual.";

    if (dti > 0.3) {
      chance = 'Moderada';
      mood = 'neutral';
      message = "O valor da parcela compromete uma parte significativa da sua renda. Recomendo aumentar o prazo ou reduzir o valor solicitado para maior chance de aprovação.";
    }
    if (dti > 0.45 || analytics.score < 400) {
      chance = 'Baixa';
      mood = 'alert';
      message = "No momento, seu comprometimento de renda está elevado. Posso te ajudar a organizar suas dívidas atuais antes de buscar novos créditos.";
    }

    return { pmt, total, rate, chance, mood, message };
  }, [formData, analytics.score]);

  const handleSimulate = () => {
    setStep('analyzing');
    let prog = 0;
    const interval = setInterval(() => {
      prog += 5;
      setLoadingProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => setStep('result'), 500);
      }
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.3em]">Módulo de Inteligência</p>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Simulação de Crédito Inteligente</h2>
        <p className="text-slate-500 max-w-lg mx-auto font-medium">
          O NEX analisa seu comportamento financeiro em tempo real para projetar as melhores chances de aprovação.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'form' && (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Form Side */}
            <div className="lg:col-span-2 glass p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="label-style">Quanto você precisa?</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                    <input 
                      type="number" 
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                      className="input-style pl-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="label-style">Em quantas parcelas?</label>
                  <select 
                    value={formData.installments}
                    onChange={(e) => setFormData({...formData, installments: Number(e.target.value)})}
                    className="input-style"
                  >
                    {[6, 12, 24, 36, 48, 60].map(v => <option key={v} value={v}>{v} meses</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="label-style">Sua renda mensal (bruta)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                    <input 
                      type="number" 
                      value={formData.income}
                      onChange={(e) => setFormData({...formData, income: Number(e.target.value)})}
                      className="input-style pl-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="label-style">Finalidade</label>
                  <select 
                    value={formData.purpose}
                    onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                    className="input-style"
                  >
                    {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="label-style">Modalidade de crédito</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CREDIT_TYPES.map(t => {
                    const Icon = t.icon;
                    const active = formData.type === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setFormData({...formData, type: t.id})}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          active 
                            ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/10' 
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <Icon size={18} className={active ? 'text-blue-600' : 'text-slate-400'} />
                          <span className={`text-[11px] font-black uppercase tracking-widest ${active ? 'text-blue-700' : 'text-slate-600'}`}>
                            {t.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight">{t.desc}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <button 
                onClick={handleSimulate}
                className="btn-primary w-full h-14"
              >
                Analisar Oportunidade <Zap size={18} />
              </button>
            </div>

            {/* Guiding Side */}
            <div className="space-y-6">
              <div className="bg-blue-600 rounded-[2rem] p-8 text-white space-y-6 shadow-xl shadow-blue-500/20">
                <NexMascot mood="happy" size={80} className="mb-4" />
                <h3 className="text-xl font-black leading-tight">Pronto para começar, Gabriel?</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  "Eu vou cruzar seus dados de renda com o seu histórico de movimentações para garantir que a oferta seja realista para o seu momento."
                </p>
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-blue-200">
                    <CheckCircle2 size={16} className="text-emerald-400" /> IA de Crédito Ativa
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-blue-200">
                    <CheckCircle2 size={16} className="text-emerald-400" /> Sem impacto no Score
                  </div>
                </div>
              </div>

              <div className="glass p-6 border-amber-100 bg-amber-50/30">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-amber-500 shrink-0" />
                  <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                    <strong>Atenção:</strong> Esta é uma simulação estimada. Os valores finais e a aprovação dependem da análise individual de cada instituição parceira.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'analyzing' && (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass py-20 flex flex-col items-center justify-center text-center space-y-8"
          >
            <NexMascot mood="thinking" size={120} />
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">Processando sua análise...</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Calculando taxas e verificando limites disponíveis para o seu perfil.</p>
            </div>
            <div className="w-full max-w-sm h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
              />
            </div>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Top Summary Result */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 glass flex flex-col items-center justify-center text-center p-8 bg-blue-50/30 border-blue-100">
                <NexMascot mood={result.mood} size={100} className="mb-4" />
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  result.chance === 'Alta' ? 'bg-emerald-100 text-emerald-700' :
                  result.chance === 'Moderada' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  Aprovação {result.chance}
                </span>
              </div>

              <div className="lg:col-span-3 glass p-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
                <div className="space-y-1">
                  <p className="label-style">Parcela Estimada</p>
                  <p className="text-2xl font-black text-slate-900">{fmt(result.pmt)}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Fixas p/ mês</p>
                </div>
                <div className="space-y-1">
                  <p className="label-style">Taxa Estimada</p>
                  <p className="text-2xl font-black text-blue-600">{result.rate}%</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Ao mês (a.m)</p>
                </div>
                <div className="space-y-1">
                  <p className="label-style">Prazo</p>
                  <p className="text-2xl font-black text-slate-900">{formData.installments}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Meses</p>
                </div>
                <div className="space-y-1">
                  <p className="label-style">Custo Total</p>
                  <p className="text-2xl font-black text-slate-900">{fmt(result.total)}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Valor final</p>
                </div>
              </div>
            </div>

            {/* NEX Insights Card */}
            <div className="bg-white border border-blue-100 rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden shadow-2xl shadow-blue-900/5">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <Calculator size={200} />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30">
                      <Zap size={20} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Análise do NEX</h3>
                  </div>
                  <p className="text-lg font-bold text-slate-700 leading-relaxed italic">
                    "{result.message}"
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                      className="btn-primary"
                    >
                      <MessageSquare size={18} /> Falar com Especialista
                    </button>
                    <button 
                      onClick={() => setStep('form')}
                      className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                      Refazer Simulação
                    </button>
                  </div>
                </div>
                <div className="w-full md:w-64 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Dicas de aprovação</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <CheckCircle2 size={14} className="text-emerald-500" /> Perfil Verificado
                      </li>
                      <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <CheckCircle2 size={14} className="text-emerald-500" /> Renda Consistente
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-[11px] text-slate-400 leading-relaxed max-w-xl mx-auto">
              ⚠️ <strong>Disclaimer Legal:</strong> O VYNEX não é uma instituição financeira. Somos uma plataforma de inteligência que conecta usuários a ofertas de crédito. A concessão de crédito é de responsabilidade exclusiva da instituição parceira após análise cadastral.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
