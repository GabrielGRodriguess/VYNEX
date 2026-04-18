import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Calendar, CreditCard, ChevronRight, CheckCircle, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../constants';

export default function CreditHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(`${API_BASE_URL}/historico`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Aprovado': return <CheckCircle className="text-brand-primary" size={14} />;
      case 'Análise Manual': return <AlertCircle className="text-amber-500" size={14} />;
      case 'Negado': return <XCircle className="text-rose-500" size={14} />;
      default: return null;
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'Aprovado': return 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary';
      case 'Análise Manual': return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      case 'Negado': return 'bg-rose-500/10 border-rose-500/20 text-rose-500';
      default: return 'bg-slate-800 border-white/5 text-slate-400';
    }
  };

  if (loading && history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 sm:p-20 space-y-4">
        <div className="w-10 h-10 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest text-center">Cruzando dados históricos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto px-1 sm:px-0 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-black text-white flex items-center gap-3">
            <History className="text-brand-primary flex-shrink-0" />
            Histórico VYNEX
          </h2>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Relatório consolidado de solicitações</p>
        </div>
        <button 
           onClick={fetchHistory}
           disabled={loading}
           className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all text-white"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Sincronizando...' : 'Atualizar'}
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {error ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-10 text-center space-y-4 border-rose-500/20"
          >
            <AlertCircle size={32} className="text-rose-500 mx-auto" />
            <p className="text-slate-400 text-xs font-bold leading-relaxed">Não foi possível conectar ao banco de dados histórico no momento.</p>
          </motion.div>
        ) : history.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-10 sm:p-20 text-center space-y-4"
          >
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto text-slate-700">
              <CreditCard size={32} />
            </div>
            <p className="text-slate-500 text-xs italic">Nenhuma análise registrada até o momento.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {history.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass p-5 sm:p-6 group hover:border-brand-primary/30 transition-all border-white/5 relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">REF: {record.id}</span>
                       <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                       <div className="flex items-center gap-1 text-slate-500">
                          <Calendar size={10} />
                          <span className="text-[10px] font-bold">{new Date(record.date).toLocaleDateString('pt-BR')}</span>
                       </div>
                    </div>
                    <h4 className="text-white font-black uppercase tracking-widest text-xs sm:text-sm">
                      {record.tipo === 'consignado' ? 'Consignado' : 'Imobiliário'}
                    </h4>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full border text-[9px] font-black uppercase flex items-center gap-1.5 ${getStatusBg(record.status)}`}>
                    {getStatusIcon(record.status)}
                    {record.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 xs:grid-cols-3 gap-3 sm:gap-4 mb-6">
                  <div className="bg-slate-950/40 p-2 sm:p-3 rounded-xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Score</p>
                    <p className="text-xs sm:text-sm font-black text-white">{record.score}</p>
                  </div>
                  <div className="bg-slate-950/40 p-2 sm:p-3 rounded-xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-1 flex items-center gap-1">Chance</p>
                    <p className="text-xs sm:text-sm font-black text-brand-primary">{record.probabilidade}%</p>
                  </div>
                  <div className="bg-slate-950/40 p-2 sm:p-3 rounded-xl border border-white/5 col-span-2 xs:col-span-1 flex flex-col justify-center">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Status</p>
                    <p className="text-[10px] sm:text-xs font-black text-slate-300 truncate tracking-tight">{record.tipo === 'consignado' ? 'Privado/Seguro' : 'Auditado VYNEX'}</p>
                  </div>
                </div>


                <div className="space-y-2.5 pb-4 border-b border-white/5">
                   <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500 font-bold uppercase tracking-wider">Renda Líquida</span>
                      <span className="text-white font-black">R$ {record.data.renda.toLocaleString('pt-BR')}</span>
                   </div>
                   <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500 font-bold uppercase tracking-wider">Comprometimento</span>
                      <span className="text-white font-black">R$ {record.data.parcela.toLocaleString('pt-BR')}</span>
                   </div>
                   {record.tipo === 'imobiliario' && (
                     <div className="flex justify-between text-[10px]">
                        <span className="text-slate-500 font-bold uppercase tracking-wider">Aporte Inicial</span>
                        <span className="text-white font-black">R$ {record.data.entrada.toLocaleString('pt-BR')}</span>
                     </div>
                   )}
                </div>

                <div className="mt-4 flex items-center justify-between group-hover:translate-x-1 transition-transform">
                  <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold line-clamp-1 italic italic pr-4">
                    "{record.motivo}"
                  </p>
                  <ChevronRight size={14} className="text-brand-primary flex-shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
