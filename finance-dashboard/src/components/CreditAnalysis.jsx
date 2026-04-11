import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, Info, TrendingUp, DollarSign, UserCheck, WifiOff, Loader2, ShieldCheck, Zap } from 'lucide-react';
import { API_BASE_URL } from '../constants';
import { useFinance } from '../context/FinanceContext';

// Sub-component: Floating Toast for Global Errors
const Toast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ y: -100, x: '-50%', opacity: 0 }}
      animate={{ y: 20, x: '-50%', opacity: 1 }}
      exit={{ y: -100, x: '-50%', opacity: 0 }}
      className={`fixed top-0 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl min-w-[320px] ${
        type === 'error' ? 'bg-rose-500/20 border-rose-500/30 text-rose-500' : 'bg-brand-green/20 border-brand-green/30 text-brand-green'
      }`}
    >
      <WifiOff size={20} />
      <span className="text-sm font-black uppercase tracking-widest">{message}</span>
    </motion.div>
  );
};

// Sub-component: Animated Number Counter
const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayValue(Math.floor(latest))
    });
    return () => controls.stop();
  }, [value]);

  return <span>{displayValue}</span>;
};

export default function CreditAnalysis() {
  const { isBankConnected, getIncome, getExpense } = useFinance();
  
  const [formData, setFormData] = useState({
    tipo: 'consignado',
    cpf: '',
    renda: '',
    parcela: '',
    entrada: '',
    vínculo: 'CLT',
    autorizado: false
  });

  // Intelligent Override: Use bank data as priority
  useEffect(() => {
    if (isBankConnected) {
      const bankIncome = getIncome();
      setFormData(prev => ({ ...prev, renda: bankIncome.toString() }));
    }
  }, [isBankConnected]);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [toast, setToast] = useState(null);

  const loadingMessages = [
    "Validando CPF e histórico...",
    "Consultando motor VYNEX...",
    "Cruzando dados Open Finance...",
    "Gerando recomendação personalizada..."
  ];

  const validateForm = () => {
    const errors = {};
    if (!formData.cpf || formData.cpf.length < 11) errors.cpf = 'CPF é obrigatório.';
    if (!formData.renda || Number(formData.renda) <= 0) errors.renda = 'Informe a renda bruta.';
    if (!formData.parcela || Number(formData.parcela) <= 0) errors.parcela = 'Informe a parcela.';
    if (!formData.autorizado) errors.autorizado = 'Aceite os termos LGPD para continuar.';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setResult(null);
    if (!validateForm()) return;

    setLoading(true);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 400);

    const startTime = Date.now();

    try {
      const bankDataPayload = isBankConnected ? {
        connected: true,
        income: getIncome(),
        expense: getExpense()
      } : null;

      const response = await fetch(`${API_BASE_URL}/analise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          bankData: bankDataPayload,
          renda: Number(formData.renda),
          parcela: Number(formData.parcela),
          entrada: Number(formData.entrada || 0)
        })
      });

      if (!response.ok) throw new Error('ERR_CONN');

      const data = await response.json();
      
      const waitTime = Math.max(1500 - (Date.now() - startTime), 0);
      setTimeout(() => {
        clearInterval(stepInterval);
        setResult(data);
        setLoading(false);
      }, waitTime);

    } catch (err) {
      clearInterval(stepInterval);
      setLoading(false);
      setToast('Falha na comunicação com o motor. Tente novamente.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 pb-20">
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <TrendingUp className="text-brand-green" />
            Análise de Crédito VYNEX
          </h2>
          <p className="text-slate-500 text-sm mt-1">Simulação avançada com suporte a Open Finance e scoring em tempo real.</p>
        </div>
        
        {isBankConnected && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 bg-brand-green/10 border border-brand-green/30 px-4 py-2 rounded-full text-brand-green text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-green/5"
          >
            <Zap size={14} className="animate-pulse" />
            Dados Bancários Priorizados
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* FORM SIDE */}
        <section className="glass p-6 sm:p-10 space-y-6">
          <form onSubmit={handleAnalyze} className="space-y-5">
            <div>
              <label className="label-style">Tipo de Crédito</label>
              <select 
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                className="input-style"
              >
                <option value="consignado">Crédito Consignado (Taxas Reduzidas)</option>
                <option value="imobiliario">Financiamento Imobiliário</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-style">CPF para Consulta</label>
                <input 
                  type="text" 
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => {
                    setFormData({...formData, cpf: e.target.value});
                    if (validationErrors.cpf) setValidationErrors({...validationErrors, cpf: null});
                  }}
                  className={`input-style ${validationErrors.cpf ? 'border-rose-500' : ''}`}
                />
                {validationErrors.cpf && <p className="error-text">{validationErrors.cpf}</p>}
              </div>
              <div>
                <label className="label-style">Vínculo</label>
                <select 
                  value={formData.vínculo}
                  onChange={(e) => setFormData({...formData, vínculo: e.target.value})}
                  className="input-style"
                >
                  <option value="CLT">CLT / Privado</option>
                  <option value="INSS">Aposentado ou Pensionista</option>
                  <option value="Autônomo">Autônomo / Empresário</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-style flex items-center justify-between">
                  Renda Mensal
                  {isBankConnected && <span className="text-brand-green flex items-center gap-1"><ShieldCheck size={10} /> Validada</span>}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-slate-600 font-bold text-sm">R$</span>
                  <input 
                    type="number" 
                    value={formData.renda}
                    disabled={isBankConnected}
                    onChange={(e) => setFormData({...formData, renda: e.target.value})}
                    className={`input-style pl-10 ${isBankConnected ? 'opacity-80 bg-slate-900/50' : ''}`}
                  />
                </div>
              </div>
              <div>
                <label className="label-style">Parcela Desejada</label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-slate-600 font-bold text-sm">R$</span>
                  <input 
                    type="number" 
                    value={formData.parcela}
                    onChange={(e) => setFormData({...formData, parcela: e.target.value})}
                    className="input-style pl-10"
                  />
                </div>
              </div>
            </div>

            {formData.tipo === 'imobiliario' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="label-style">Entrada / Aporte (Imobiliário)</label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-slate-600 font-bold text-sm">R$</span>
                  <input 
                    type="number" 
                    value={formData.entrada}
                    onChange={(e) => setFormData({...formData, entrada: e.target.value})}
                    className="input-style pl-10"
                  />
                </div>
              </motion.div>
            )}

            <div className="pt-2 border-t border-white/5">
              <div className="flex items-start gap-4">
                <input 
                  type="checkbox" 
                  id="lgpd"
                  checked={formData.autorizado}
                  onChange={(e) => setFormData({...formData, autorizado: e.target.checked})}
                  className="w-5 h-5 accent-brand-green mt-1"
                />
                <label htmlFor="lgpd" className="text-[11px] text-slate-400 leading-relaxed cursor-pointer select-none">
                  Declaro que as informações são verdadeiras e **autorizo a VYNEX** a consultar meu score e histórico de crédito para fins de análise automatizada (LGPD).
                </label>
              </div>
              {validationErrors.autorizado && <p className="error-text mt-2">{validationErrors.autorizado}</p>}
            </div>

            <motion.button
              whileHover={formData.autorizado && !loading ? { scale: 1.02, y: -2 } : {}}
              whileTap={formData.autorizado && !loading ? { scale: 0.98 } : {}}
              disabled={loading || !formData.autorizado}
              className={`w-full py-5 rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all shadow-xl flex items-center justify-center gap-3 relative overflow-hidden ${
                loading ? 'bg-slate-800 text-slate-500 cursor-wait' : 
                formData.autorizado ? 'bg-brand-green text-slate-950' : 'bg-slate-900 text-slate-700 cursor-not-allowed grayscale'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-4">
                  <Loader2 className="animate-spin text-brand-green" size={22} />
                  <motion.span 
                    key={loadingStep}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-white normal-case tracking-normal"
                  >
                    {loadingMessages[loadingStep]}
                  </motion.span>
                </div>
              ) : (
                <>
                  <UserCheck size={20} />
                  Analisar Crédito Instantâneo
                </>
              )}
            </motion.button>
          </form>
        </section>

        {/* RESULT SIDE */}
        <section className="glass min-h-[500px] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-white/5 text-slate-700">
                  <TrendingUp size={40} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-white font-black uppercase tracking-widest">Inicie sua Análise</h4>
                  <p className="text-slate-500 text-xs max-w-[200px] mx-auto leading-relaxed">Cruzamos seus dados com nossa base de crédito global para uma resposta em segundos.</p>
                </div>
              </motion.div>
            )}

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-8">
                <div className="relative">
                  <div className="w-44 h-44 rounded-full border-4 border-white/5 border-t-brand-green animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.5em] animate-pulse">Processing</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-white font-black text-lg uppercase">Analisando Perfil</p>
                  <p className="text-brand-green text-[10px] font-black uppercase tracking-widest bg-brand-green/10 px-4 py-1.5 rounded-full border border-brand-green/20">Criptografado ponta-a-ponta</p>
                </div>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="w-full space-y-8"
              >
                <div className="flex flex-col items-center gap-4">
                  {result.status === 'Aprovado' ? <CheckCircle className="text-brand-green" size={60} /> : 
                   result.status === 'Negado' ? <XCircle className="text-rose-500" size={60} /> : 
                   <AlertCircle className="text-amber-500" size={60} />}
                  
                  <div className="space-y-1">
                    <h3 className={`text-3xl font-black uppercase tracking-widest ${
                      result.status === 'Aprovado' ? 'text-brand-green' : 
                      result.status === 'Negado' ? 'text-rose-500' : 'text-amber-400'
                    }`}>
                      {result.status}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm px-6 leading-relaxed line-clamp-2">{result.motivo}</p>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-6 sm:p-10 rounded-[40px] border border-white/5 space-y-8">
                  <div className="flex justify-between items-end gap-2">
                    <div className="text-left">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Score VYNEX</p>
                      <p className="text-4xl sm:text-5xl font-black text-white"><AnimatedNumber value={result.score} /></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Chance</p>
                      <p className="text-2xl sm:text-3xl font-black text-brand-green"><AnimatedNumber value={parseFloat(result.probabilidade)} />%</p>
                    </div>
                  </div>
                  
                  <div className="h-5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5 p-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(result.score / 1000) * 100}%` }}
                      transition={{ duration: 1.5, delay: 0.3 }}
                      className={`h-full neon-glow rounded-full ${
                        result.status === 'Aprovado' ? 'bg-brand-green' : 
                        result.status === 'Negado' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="p-5 bg-white/[0.03] rounded-3xl border-l-4 border-brand-green text-left shadow-2xl flex gap-4">
                  <Info className="text-brand-green flex-shrink-0 mt-1" size={20} />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Conselho Estratégico</p>
                    <p className="text-sm text-slate-200 font-bold leading-relaxed">{result.sugestao}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <style jsx>{`
        .label-style { @apply text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block; }
        .input-style { @apply w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-brand-green outline-none transition-all; }
        .error-text { @apply text-[10px] font-black text-rose-500 uppercase tracking-tighter; }
      `}</style>
    </div>
  );
}
