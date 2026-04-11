import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, animate } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, Info, TrendingUp, DollarSign, UserCheck, AlertTriangle, WifiOff, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../constants';

// Sub-component: Floating Toast
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
      className={`fixed top-0 left-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl min-w-[300px] ${
        type === 'error' ? 'bg-rose-500/20 border-rose-500/30 text-rose-500' : 'bg-brand-green/20 border-brand-green/30 text-brand-green'
      }`}
    >
      {type === 'error' ? <WifiOff size={20} /> : <CheckCircle size={20} />}
      <span className="text-sm font-black uppercase tracking-widest">{message}</span>
    </motion.div>
  );
};

// Sub-component: Animated Number
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
  const [formData, setFormData] = useState({
    tipo: 'consignado',
    cpf: '',
    renda: '',
    parcela: '',
    entrada: '',
    vínculo: 'CLT',
    autorizado: false
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [toast, setToast] = useState(null);

  const loadingMessages = [
    "Analisando seu crédito...",
    "Consultando score atualizado...",
    "Processando política de crédito...",
    "Finalizando análise VYNEX..."
  ];

  const validateForm = () => {
    const errors = {};
    if (!formData.cpf || formData.cpf.length < 11) errors.cpf = 'CPF inválido ou incompleto.';
    if (!formData.renda || Number(formData.renda) <= 0) errors.renda = 'Informe uma renda mensal válida.';
    if (!formData.parcela || Number(formData.parcela) <= 0) errors.parcela = 'Informe o valor da parcela.';
    if (!formData.autorizado) errors.autorizado = 'Você precisa autorizar a consulta do CPF.';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setResult(null);
    setToast(null);

    if (!validateForm()) return;

    setLoading(true);
    setLoadingStep(0);

    // Dynamic loading sequence (min 1.5s total)
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 450);

    const startTime = Date.now();

    try {
      const response = await fetch(`${API_BASE_URL}/analise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          renda: Number(formData.renda),
          parcela: Number(formData.parcela),
          entrada: Number(formData.entrada || 0)
        })
      });

      if (!response.ok) throw new Error('ERR_CONNECTION');

      const data = await response.json();
      
      const elapsedTime = Date.now() - startTime;
      const waitTime = Math.max(1500 - elapsedTime, 0);

      setTimeout(() => {
        clearInterval(stepInterval);
        setResult(data);
        setLoading(false);
      }, waitTime);

    } catch (err) {
      clearInterval(stepInterval);
      setLoading(false);
      setToast('Erro ao conectar com o motor de crédito. Verifique se o servidor está rodando.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Aprovado': return <CheckCircle className="text-brand-green" size={48} />;
      case 'Análise Manual': return <AlertCircle className="text-amber-500" size={48} />;
      case 'Negado': return <XCircle className="text-rose-500" size={48} />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aprovado': return 'text-brand-green';
      case 'Análise Manual': return 'text-amber-500';
      case 'Negado': return 'text-rose-500';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 sm:px-0 pb-10">
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
          <TrendingUp className="text-brand-green flex-shrink-0" />
          Análise de Crédito Inteligente
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm">Simulação em tempo real usando o motor de decisão VYNEX.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <section className="glass p-6 sm:p-8 space-y-6 border-white/5">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Tipo de Crédito</label>
              <select 
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-4 text-sm text-white focus:border-brand-green outline-none transition-all"
              >
                <option value="consignado">Crédito Consignado</option>
                <option value="imobiliario">Crédito Imobiliário</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">CPF</label>
                <input 
                  type="text" 
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => {
                    setFormData({...formData, cpf: e.target.value});
                    if (validationErrors.cpf) setValidationErrors({...validationErrors, cpf: null});
                  }}
                  className={`w-full bg-slate-900 border ${validationErrors.cpf ? 'border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : 'border-white/5'} rounded-xl px-4 py-4 text-sm text-white focus:border-brand-green outline-none transition-all`}
                />
                {validationErrors.cpf && <p className="text-[10px] font-black text-rose-500 uppercase">{validationErrors.cpf}</p>}
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Vínculo</label>
                <select 
                  value={formData.vínculo}
                  onChange={(e) => setFormData({...formData, vínculo: e.target.value})}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-4 text-sm text-white focus:border-brand-green outline-none transition-all"
                >
                  <option value="CLT">CLT</option>
                  <option value="INSS">Aposentado (INSS)</option>
                  <option value="Autônomo">Autônomo</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Renda Mensal</label>
                <div className="relative">
                  <span className="absolute left-4 top-4.5 text-slate-600 text-xs font-black">R$</span>
                  <input 
                    type="number" 
                    value={formData.renda}
                    onChange={(e) => {
                      setFormData({...formData, renda: e.target.value});
                      if (validationErrors.renda) setValidationErrors({...validationErrors, renda: null});
                    }}
                    className={`w-full bg-slate-900 border ${validationErrors.renda ? 'border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : 'border-white/5'} rounded-xl pl-10 pr-4 py-4 text-sm text-white focus:border-brand-green outline-none transition-all`}
                    placeholder="0,00"
                  />
                </div>
                {validationErrors.renda && <p className="text-[10px] font-black text-rose-500 uppercase">{validationErrors.renda}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Parcela Desejada</label>
                <div className="relative">
                  <span className="absolute left-4 top-4.5 text-slate-600 text-xs font-black">R$</span>
                  <input 
                    type="number" 
                    value={formData.parcela}
                    onChange={(e) => {
                      setFormData({...formData, parcela: e.target.value});
                      if (validationErrors.parcela) setValidationErrors({...validationErrors, parcela: null});
                    }}
                    className={`w-full bg-slate-900 border ${validationErrors.parcela ? 'border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : 'border-white/5'} rounded-xl pl-10 pr-4 py-4 text-sm text-white focus:border-brand-green outline-none transition-all`}
                    placeholder="0,00"
                  />
                </div>
                {validationErrors.parcela && <p className="text-[10px] font-black text-rose-500 uppercase">{validationErrors.parcela}</p>}
              </div>
            </div>

            <AnimatePresence>
              {formData.tipo === 'imobiliario' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Valor de Entrada</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4.5 text-slate-600 text-xs font-black">R$</span>
                    <input 
                      type="number" 
                      value={formData.entrada}
                      onChange={(e) => setFormData({...formData, entrada: e.target.value})}
                      className="w-full bg-slate-900 border border-white/5 rounded-xl pl-10 pr-4 py-4 text-sm text-white focus:border-brand-green outline-none transition-all"
                      placeholder="Investimento inicial"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 group">
                <input 
                  type="checkbox" 
                  id="lgpd"
                  checked={formData.autorizado}
                  onChange={(e) => {
                    setFormData({...formData, autorizado: e.target.checked});
                    if (validationErrors.autorizado) setValidationErrors({...validationErrors, autorizado: null});
                  }}
                  className="accent-brand-green w-5 h-5 bg-slate-950 border-white/10 rounded-md mt-0.5 cursor-pointer"
                />
                <label htmlFor="lgpd" className="text-[11px] text-slate-400 font-medium leading-relaxed cursor-pointer group-hover:text-slate-200 transition-colors">
                  Autorizo a consulta do meu CPF para análise de crédito e aceito os termos da LGPD.
                </label>
              </div>
              {validationErrors.autorizado && <p className="text-[10px] font-black text-rose-500 uppercase">{validationErrors.autorizado}</p>}
            </div>

            <motion.button
              whileHover={!loading ? { scale: 1.03 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-2xl relative overflow-hidden ${
                loading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5' 
                : 'bg-brand-green text-slate-950 shadow-brand-green/20'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin text-brand-green" size={20} />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={loadingStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-white"
                    >
                      {loadingMessages[loadingStep]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <UserCheck size={20} />
                  Analisar Crédito
                </>
              )}
            </motion.button>
          </form>
        </section>

        {/* Results Section */}
        <section className="glass p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[450px]">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-6"
              >
                <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-white/5 text-slate-600 shadow-inner">
                  <DollarSign size={48} />
                </div>
                <div>
                  <h4 className="text-white font-black text-lg uppercase tracking-widest">Aguardando Dados</h4>
                  <p className="text-slate-500 text-sm max-w-[200px] mx-auto mt-2 leading-relaxed">Preencha o formulário para receber sua análise de crédito instantânea.</p>
                </div>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-8"
              >
                <div className="relative">
                  <div className="w-40 h-40 rounded-full border-[6px] border-white/5 border-t-brand-green animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-[12px] font-black text-brand-green uppercase tracking-[0.3em] animate-pulse">Scoring...</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-white font-black text-xl uppercase">Cruzando Dados</p>
                  <p className="text-brand-green text-[10px] font-black animate-pulse bg-brand-green/10 px-4 py-1.5 rounded-full border border-brand-green/20">CONEXÃO SEGURA ESTABELECIDA</p>
                </div>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div 
                key="result"
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 15 }}
                className="w-full space-y-8"
              >
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center gap-3 sm:gap-4"
                >
                  {getStatusIcon(result.status)}
                  <div className="space-y-1">
                    <h3 className={`text-2xl sm:text-3xl font-black uppercase tracking-widest ${getStatusColor(result.status)}`}>
                      {result.status}
                    </h3>
                    <p className="text-slate-400 text-[11px] sm:text-sm px-2 sm:px-4 leading-relaxed line-clamp-2">{result.motivo}</p>
                  </div>
                </motion.div>

                <div className="bg-slate-950/50 p-5 sm:p-8 rounded-[30px] sm:rounded-[40px] border border-white/5 space-y-5">
                  <div className="flex justify-between items-end gap-2">
                    <div className="text-left">
                      <p className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Score VYNEX</p>
                      <p className="text-3xl sm:text-4xl font-black text-white"><AnimatedNumber value={result.score} /></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Chance</p>
                      <p className="text-xl sm:text-2xl font-black text-brand-green tracking-tight"><AnimatedNumber value={parseFloat(result.probabilidade)} />%</p>
                    </div>
                  </div>
                  
                  {/* Score Bar */}
                  <div className="h-3 sm:h-4 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(result.score / 1000) * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      className={`h-full neon-glow ${
                        result.status === 'Aprovado' ? 'bg-brand-green' : 
                        result.status === 'Análise Manual' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                    />
                  </div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 sm:p-5 bg-white/[0.03] rounded-2xl sm:rounded-3xl border-l-[4px] sm:border-l-[6px] border-brand-green text-left shadow-2xl"
                >
                  <div className="flex gap-3 sm:gap-4">
                    <Info size={18} className="text-brand-green flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5 sm:space-y-1">
                      <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Especialista VYNEX</p>
                      <p className="text-[11px] sm:text-sm text-slate-200 font-bold leading-relaxed">{result.sugestao}</p>
                    </div>
                  </div>
                </motion.div>

              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
