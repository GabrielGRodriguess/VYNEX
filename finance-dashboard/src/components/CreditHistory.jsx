import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Calendar, CreditCard, ChevronRight, CheckCircle, AlertCircle, XCircle, RefreshCw, FileText } from 'lucide-react';
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

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Aprovado': return { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' };
      case 'Análise Manual': return { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' };
      case 'Negado': return { icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' };
      default: return { icon: FileText, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-100' };
    }
  };

  if (loading && history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest text-center">Sincronizando histórico...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-4 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            Histórico VYNEX
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Acompanhe todas as suas simulações e análises inteligentes</p>
        </div>
        
        <button 
           onClick={fetchHistory}
           disabled={loading}
           className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm active:scale-95"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Sincronizando' : 'Sincronizar histórico'}
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {error ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-12 text-center space-y-4 border-rose-100 bg-rose-50/30"
          >
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-500">
               <AlertCircle size={32} />
            </div>
            <div className="space-y-1">
               <p className="text-slate-800 font-black text-lg">Indisponibilidade temporária</p>
               <p className="text-slate-500 text-sm font-medium">Não foi possível conectar ao banco de dados agora. Tente em alguns instantes.</p>
            </div>
          </motion.div>
        ) : history.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-16 text-center space-y-6"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
              <CreditCard size={40} />
            </div>
            <div className="space-y-1">
              <p className="text-slate-800 font-black text-lg">Nenhuma análise registrada</p>
              <p className="text-slate-500 text-sm font-medium">Suas simulações e diagnósticos de inteligência aparecerão aqui.</p>
            </div>
            <button className="btn-primary text-[10px]">Fazer minha primeira análise</button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {history.map((record, index) => {
              const status = getStatusInfo(record.status);
              const Icon = status.icon;
              
              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass p-6 sm:p-8 group hover:border-blue-300 transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {new Date(record.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 tracking-tight">
                        {record.tipo === 'consignado' ? 'Consignado Privado' : 'Crédito Imobiliário'}
                      </h4>
                    </div>
                    
                    <div className={`px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${status.bg} ${status.color}`}>
                      <Icon size={12} />
                      {record.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Score</p>
                      <p className="text-base font-black text-slate-900">{record.score}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100">
                      <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Chance</p>
                      <p className="text-base font-black text-blue-600">{record.probabilidade}%</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Produto</p>
                      <p className="text-[10px] font-black text-slate-700 truncate">{record.tipo === 'consignado' ? 'Privado' : 'Imobiliário'}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pb-6 border-b border-slate-50">
                     <div className="flex justify-between items-center">
                        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Renda Declarada</span>
                        <span className="text-sm font-black text-slate-800">R$ {record.data.renda.toLocaleString('pt-BR')}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Parcela Estimada</span>
                        <span className="text-sm font-black text-slate-800">R$ {record.data.parcela.toLocaleString('pt-BR')}</span>
                     </div>
                  </div>

                  <div className="mt-6 flex items-start gap-3">
                    <div className="shrink-0 p-2 bg-slate-50 rounded-xl text-slate-400">
                      <ChevronRight size={14} />
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                      "{record.motivo}"
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
