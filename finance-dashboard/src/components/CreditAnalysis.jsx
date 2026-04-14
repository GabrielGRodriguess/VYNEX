import { useState, useEffect } from 'react';
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

  const renderStep1 = () => (
    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Identificação</h3>
        <p className="text-slate-500 text-xs">Comece informando como devemos te chamar e seu contato.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Nome Completo</label>
          <input 
            type="text" 
            value={formData.nome} 
            onChange={e => setFormData({...formData, nome: e.target.value})}
            className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-white focus:border-brand-green/50 transition-all outline-none"
            placeholder="Ex: João Silva"
          />
          {errors.nome && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.nome}</p>}
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">WhatsApp</label>
          <input 
            type="tel" 
            value={formData.telefone} 
            onChange={e => setFormData({...formData, telefone: e.target.value})}
            className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-white focus:border-brand-green/50 transition-all outline-none"
            placeholder="(11) 99999-9999"
          />
          {errors.telefone && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.telefone}</p>}
        </div>
      </div>
      <button onClick={nextStep} className="w-full h-16 bg-brand-green text-slate-950 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
        Continuar <ArrowRight size={18} />
      </button>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Perfil Financeiro</h3>
        <p className="text-slate-500 text-xs">Informe sua renda para que nossa IA calcule sua capacidade.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Renda Bruta Mensal</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">R$</span>
            <input 
              type="number" 
              value={formData.renda} 
              onChange={e => setFormData({...formData, renda: e.target.value})}
              className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 pl-12 text-white focus:border-brand-green/50 transition-all outline-none"
              placeholder="0.00"
            />
          </div>
          {errors.renda && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.renda}</p>}
        </div>
        <div className="p-4 bg-brand-green/5 rounded-2xl border border-brand-green/10 flex items-start gap-3">
          <Info size={16} className="text-brand-green mt-0.5 shrink-0" />
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Sua renda será cruzada com os dados do Open Finance para validar sua estabilidade financeira automática.
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => setStep(1)} className="flex-1 h-16 bg-white/5 text-slate-400 rounded-2xl font-black uppercase tracking-widest border border-white/5 transition-all outline-none">
          Voltar
        </button>
        <button onClick={nextStep} className="flex-[2] h-16 bg-brand-green text-slate-950 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
          Continuar <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Estabilidade & Vínculo</h3>
        <p className="text-slate-500 text-xs">Isso nos ajuda a definir as melhores taxas para você.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Tipo de Vínculo</label>
          <div className="grid grid-cols-2 gap-2">
            {['Servidor Público', 'Aposentado / Pensionista', 'CLT', 'Autônomo'].map(type => (
              <button
                key={type}
                onClick={() => setFormData({...formData, tipo_vinculo: type})}
                className={`py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${
                  formData.tipo_vinculo === type 
                    ? 'border-brand-green bg-brand-green/10 text-brand-green' 
                    : 'border-white/5 bg-slate-900 text-slate-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-1">
              <input 
                type="checkbox" 
                checked={formData.autorizado} 
                onChange={e => setFormData({...formData, autorizado: e.target.checked})}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                formData.autorizado ? 'bg-brand-green border-brand-green' : 'border-white/20 bg-slate-900 group-hover:border-brand-green/50'
              }`}>
                {formData.autorizado && <CheckCircle size={12} className="text-slate-950" />}
              </div>
            </div>
            <span className="text-[10px] font-medium text-slate-500 leading-snug">
              Autorizo a VYNEX a consultar meus dados do Open Finance para gerar minha pontuação e ofertas personalizadas.
            </span>
          </label>
          {errors.autorizado && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest">{errors.autorizado}</p>}
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => setStep(2)} className="flex-1 h-16 bg-white/5 text-slate-400 rounded-2xl font-black uppercase tracking-widest border border-white/5 transition-all outline-none">
          Voltar
        </button>
        <button onClick={startAnalysis} className="flex-[2] h-16 bg-brand-green text-slate-950 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-brand-green/20">
          Analisar Agora <Zap size={18} />
        </button>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <div className="flex flex-col items-center justify-center text-center py-12 space-y-8">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-2 border-brand-green/10 border-t-brand-green animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Database className="text-brand-green animate-pulse" size={24} />
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Analisando sua Vida Financeira</h3>
        <p className="text-slate-500 text-xs max-w-xs mx-auto">
          Nossa IA está lendo seus extratos, identificando sua margem líquida e calculando sua pontuação VYNEX em tempo real.
        </p>
      </div>
      <div className="w-full max-w-xs bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          className="h-full bg-brand-green shadow-[0_0_15px_rgba(163,255,18,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${loadingProgress}%` }}
        />
      </div>
      <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em]">{loadingProgress}% Concluído</p>
    </div>
  );

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
          <span className="text-[9px] font-black text-brand-green uppercase tracking-widest bg-brand-green/10 px-3 py-1 rounded-full border border-brand-green/20">Passo {step}/5</span>
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
            <span className="text-[7px] font-black uppercase text-center">Resposta <br/> Rápida</span>
          </div>
        </div>
      )}
    </div>
  );
}

