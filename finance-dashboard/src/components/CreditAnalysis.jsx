import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, Info, TrendingUp, DollarSign, UserCheck } from 'lucide-react';

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

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!formData.autorizado) {
      alert('Você precisa autorizar a consulta do CPF.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3001/analise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          renda: Number(formData.renda),
          parcela: Number(formData.parcela),
          entrada: Number(formData.entrada || 0)
        })
      });

      const data = await response.json();
      
      // Delay to simulate analysis
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Erro na análise:', error);
      alert('Erro ao conectar com o motor de crédito. Verifique se o servidor está rodando.');
      setLoading(false);
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
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-white flex items-center gap-3">
          <TrendingUp className="text-brand-green" />
          Análise de Crédito Inteligente
        </h2>
        <p className="text-slate-500 text-sm">Simule e receba uma pré-aprovação em tempo real usando o motor VYNEX.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <section className="glass p-8 space-y-6">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Tipo de Crédito</label>
              <select 
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-green outline-none transition-all"
              >
                <option value="consignado">Crédito Consignado</option>
                <option value="imobiliario">Crédito Imobiliário</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">CPF</label>
                <input 
                  type="text" 
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-green outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Vínculo</label>
                <select 
                  value={formData.vínculo}
                  onChange={(e) => setFormData({...formData, vínculo: e.target.value})}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-green outline-none"
                >
                  <option value="CLT">CLT</option>
                  <option value="INSS">Aposentado (INSS)</option>
                  <option value="Autônomo">Autônomo</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Renda Mensal</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-600 text-xs">R$</span>
                  <input 
                    type="number" 
                    value={formData.renda}
                    onChange={(e) => setFormData({...formData, renda: e.target.value})}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-brand-green outline-none"
                    placeholder="0,00"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Parcela Desejada</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-600 text-xs">R$</span>
                  <input 
                    type="number" 
                    value={formData.parcela}
                    onChange={(e) => setFormData({...formData, parcela: e.target.value})}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-brand-green outline-none"
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>

            {formData.tipo === 'imobiliario' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
              >
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Valor de Entrada</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-600 text-xs">R$</span>
                  <input 
                    type="number" 
                    value={formData.entrada}
                    onChange={(e) => setFormData({...formData, entrada: e.target.value})}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-brand-green outline-none"
                    placeholder="20% recomendado"
                  />
                </div>
              </motion.div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <input 
                type="checkbox" 
                id="lgpd"
                checked={formData.autorizado}
                onChange={(e) => setFormData({...formData, autorizado: e.target.checked})}
                className="accent-brand-green w-4 h-4 bg-slate-950 border-white/10"
              />
              <label htmlFor="lgpd" className="text-[11px] text-slate-400 font-medium">
                Autorizo a consulta do meu CPF para análise de crédito e aceito os termos da LGPD.
              </label>
            </div>

            <button
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 shadow-lg ${
                loading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-brand-green text-black hover:bg-brand-green/90 shadow-brand-green/20'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
                  Processando Dados...
                </>
              ) : (
                <>
                  <UserCheck size={18} />
                  Analisar Crédito
                </>
              )}
            </button>
          </form>
        </section>

        {/* Results Section */}
        <section className="glass p-8 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-white/5 text-slate-600">
                  <DollarSign size={40} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Aguardando Dados</h4>
                  <p className="text-slate-500 text-sm max-w-[200px] mx-auto">Preencha o formulário para receber sua análise de crédito.</p>
                </div>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-white/5 border-t-brand-green animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-brand-green uppercase">SCORING</div>
                </div>
                <div className="space-y-1">
                  <p className="text-white font-bold">Consultando Bureau</p>
                  <p className="text-brand-green text-[10px] font-black animate-pulse">ESTABELECENDO CONEXÃO SEGURA...</p>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full space-y-6"
              >
                <div className="flex flex-col items-center gap-4">
                  {getStatusIcon(result.status)}
                  <div>
                    <h3 className={`text-2xl font-black uppercase tracking-widest ${getStatusColor(result.status)}`}>
                      {result.status}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">{result.motivo}</p>
                  </div>
                </div>

                <div className="bg-slate-950/50 p-6 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="text-left">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Score Gerado</p>
                      <p className="text-3xl font-black text-white">{result.score}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Probabilidade</p>
                      <p className="text-xl font-black text-brand-green">{result.probabilidade}%</p>
                    </div>
                  </div>
                  
                  {/* Score Bar */}
                  <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(result.score / 1000) * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${result.score > 700 ? 'bg-brand-green' : result.score > 400 ? 'bg-amber-500' : 'bg-rose-500'} neon-glow`}
                    />
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border-l-4 border-brand-green text-left">
                  <div className="flex gap-3">
                    <Info size={16} className="text-brand-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Recomendação VYNEX</p>
                      <p className="text-xs text-slate-300 font-medium">{result.sugestao}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
