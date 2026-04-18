import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import { csvParser } from '../../services/parsers/csvParser';
import BaseModal from '../Common/BaseModal';
import { Upload, FileText, Check, AlertCircle, Trash2, ChevronRight, Loader2 } from 'lucide-react';

export default function StatementInboundWizard({ isOpen, onClose }) {
  const { ingestFinancialData } = useFinance();
  const { user } = useUser();
  const toast = useToast();

  const [step, setStep] = useState('upload'); // 'upload' | 'review' | 'processing'
  const [parsedData, setParsedData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      toast.error('Formato Inválido', 'Por favor, envie um arquivo CSV ou TXT estruturado.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const transactions = csvParser.parse(text, file.name, user?.id);
        if (transactions.length === 0) throw new Error('Nenhuma transação detectada.');
        
        setParsedData(transactions);
        setStep('review');
      } catch (err) {
        toast.error('Erro no Parsing', err.message || 'Não conseguimos ler os dados deste arquivo.');
      }
    };
    reader.readAsText(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files[0]);
  };

  const handleConfirm = async () => {
    setStep('processing');
    try {
      await ingestFinancialData(parsedData, 'statement');
      toast.success('Análise Automática', `${parsedData.length} transações foram processadas.`);
      onClose();
    } catch (err) {
      toast.error('Erro na Ingestão', 'Ocorreu um problema ao salvar os dados do extrato.');
      setStep('review');
    }
  };

  const removeTransaction = (id) => {
    setParsedData(prev => prev.filter(t => t.id !== id));
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={step === 'review' ? 'Revisar Extrato' : 'Importar Extrato'}
      maxWidth="max-w-2xl"
    >
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                className={`border-2 border-dashed rounded-[2rem] p-12 text-center transition-all cursor-pointer ${isDragging ? 'border-brand-primary bg-brand-primary/5' : 'border-white/10 hover:border-brand-primary/30 bg-slate-900/40'}`}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <input 
                  id="fileInput"
                  type="file" 
                  className="hidden" 
                  accept=".csv,.txt"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                />
                <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center text-brand-primary mx-auto mb-6">
                  <Upload size={40} />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Arraste seu extrato CSV</h3>
                <p className="text-slate-400 text-sm">Ou clique para selecionar um arquivo no seu dispositivo</p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex items-start gap-4">
                <AlertCircle className="text-blue-400 shrink-0" size={20} />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Dica de Segurança</p>
                  <p className="text-xs text-slate-400 leading-relaxed">Seus dados são processados localmente no navegador. Nenhum dado bruto sai do seu computador sem ser analisado.</p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg text-brand-primary">
                    <FileText size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-200 truncate max-w-[200px]">{fileName}</span>
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
                  {parsedData.length} Transações
                </span>
              </div>

              <div className="glass overflow-hidden border-white/5 bg-slate-950/50">
                <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-slate-900 z-10">
                      <tr className="text-[8px] font-black text-slate-600 uppercase tracking-widest border-b border-white/5">
                        <th className="px-6 py-3">Data</th>
                        <th className="px-6 py-3">Descrição</th>
                        <th className="px-6 py-3 text-right">Valor</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {parsedData.map((t) => (
                        <tr key={t.id} className="text-[11px] group hover:bg-white/[0.02]">
                          <td className="px-6 py-4 text-slate-400">{t.date}</td>
                          <td className="px-6 py-4 text-white font-medium truncate max-w-[150px]">{t.description}</td>
                          <td className={`px-6 py-4 text-right font-black ${t.type === 'income' ? 'text-brand-primary' : 'text-rose-500'}`}>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => removeTransaction(t.id)}
                              className="text-slate-600 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep('upload')}
                  className="px-8 py-5 rounded-2xl bg-slate-900 text-slate-500 font-black uppercase tracking-widest hover:text-white transition-all"
                >
                  Voltar
                </button>
                <button 
                  onClick={handleConfirm}
                  className="flex-1 bg-neon-gradient text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Importar e Analisar <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 space-y-6"
            >
              <Loader2 className="animate-spin text-brand-primary" size={48} />
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Gerando Inteligência</h3>
                <p className="text-slate-400 text-sm">Classificando transações e calculando seu score...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BaseModal>
  );
}
