import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import { csvParser } from '../../services/parsers/csvParser';
import BaseModal from '../Common/BaseModal';
import { Upload, FileText, Check, AlertCircle, Trash2, ChevronRight, Loader2, Landmark, Info, ArrowLeft, HelpCircle } from 'lucide-react';
import { BANK_GUIDES } from '../../constants/bankGuides';
import NexMascot from '../NexMascot';

export default function StatementInboundWizard({ isOpen, onClose, initialStep = 'bank-selection', initialBank = null }) {
  const { ingestFinancialData } = useFinance();
  const { user } = useUser();
  const toast = useToast();

  const [step, setStep] = useState(initialStep); // 'bank-selection' | 'instructions' | 'upload' | 'review' | 'processing'
  const [selectedBank, setSelectedBank] = useState(initialBank);

  // Sync state when opened with props
  React.useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setSelectedBank(initialBank);
    }
  }, [isOpen, initialStep, initialBank]);
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

  const resetAndClose = () => {
    setStep('bank-selection');
    setSelectedBank(null);
    setParsedData([]);
    onClose();
  };

  const currentGuide = selectedBank ? BANK_GUIDES[selectedBank] : null;

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={resetAndClose} 
      title={
        step === 'bank-selection' ? 'Escolha seu banco' : 
        step === 'instructions' ? 'Instruções' :
        step === 'review' ? 'Revisar Extrato' : 'Importar Extrato'
      }
      maxWidth="max-w-2xl"
    >
      <div className="min-h-[450px] flex flex-col">
        <AnimatePresence mode="wait">
          {/* STEP 1: BANK SELECTION */}
          {step === 'bank-selection' && (
            <motion.div
              key="bank-selection"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-6 p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                <NexMascot mood="happy" size={64} />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">NEX diz:</p>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    "Vamos começar pelo Nubank porque o processo é mais simples para guiar você."
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.values(BANK_GUIDES).map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => {
                      setSelectedBank(bank.id);
                      setStep(bank.id === 'nubank' ? 'instructions' : 'upload');
                    }}
                    className={`relative p-6 rounded-[2rem] border flex flex-col items-center gap-4 transition-all group ${bank.recommended ? 'border-purple-200 bg-purple-50/50 ring-2 ring-purple-500/20' : 'border-slate-100 bg-white hover:border-blue-200'}`}
                  >
                    {bank.recommended && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-purple-500/30">
                        Recomendado
                      </span>
                    )}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bank.id === 'nubank' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                      <Landmark size={24} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">{bank.name}</span>
                    {bank.comingSoon && (
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Breve</span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: INSTRUCTIONS */}
          {step === 'instructions' && (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{currentGuide?.title}</h3>
                <div className="space-y-3">
                  {currentGuide?.steps.map((txt, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <span className="w-8 h-8 shrink-0 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-blue-500/20">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-600 font-medium pt-1">{txt}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-start gap-4">
                <HelpCircle className="text-amber-600 shrink-0" size={24} />
                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                  {currentGuide?.observation}
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep('bank-selection')}
                  className="p-5 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all"
                >
                  <ArrowLeft size={24} />
                </button>
                <button 
                  onClick={() => setStep('upload')}
                  className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  Ir para o Upload <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: UPLOAD */}
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-6 p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                <NexMascot mood="thinking" size={64} />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">NEX diz:</p>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    {selectedBank === 'nubank' 
                      ? "Pode enviar seu extrato Nubank. Eu vou separar as informações importantes."
                      : "Pode enviar seu extrato. Eu vou separar as informações importantes."
                    }
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {selectedBank === 'nubank' ? 'Envie seu extrato Nubank' : 'Envie seu extrato'}
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  O NEX vai analisar entradas, saídas, recorrências, gastos sensíveis, estabilidade financeira e sinais que podem influenciar seu perfil de crédito.
                </p>
              </div>

              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                className={`border-2 border-dashed rounded-[2.5rem] p-12 text-center transition-all cursor-pointer ${isDragging ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300 bg-slate-50'}`}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <input 
                  id="fileInput"
                  type="file" 
                  className="hidden" 
                  accept=".csv,.txt"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                />
                <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30">
                  <Upload size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Selecionar extrato</h3>
                <p className="text-slate-400 text-sm font-medium">Arraste seu extrato CSV ou clique aqui</p>
              </div>

              {selectedBank === 'other' && (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-4">
                  <AlertCircle className="text-amber-600 shrink-0" size={20} />
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">
                    Você pode enviar seu extrato. A análise pode variar conforme o formato do arquivo.
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(selectedBank === 'nubank' ? 'instructions' : 'bank-selection')}
                  className="p-5 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all"
                >
                  <ArrowLeft size={24} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: REVIEW */}
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
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                    <FileText size={20} />
                  </div>
                  <span className="text-sm font-black text-slate-900 truncate max-w-[200px]">{fileName}</span>
                </div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                  {parsedData.length} Transações
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-slate-50 z-10">
                      <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-6 py-4">Data</th>
                        <th className="px-6 py-4">Descrição</th>
                        <th className="px-6 py-4 text-right">Valor</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {parsedData.map((t) => (
                        <tr key={t.id} className="text-[12px] group hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-slate-400 font-medium">{t.date}</td>
                          <td className="px-6 py-4 text-slate-900 font-black truncate max-w-[150px]">{t.description}</td>
                          <td className={`px-6 py-4 text-right font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => removeTransaction(t.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
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
                  className="px-8 py-5 rounded-2xl bg-slate-50 text-slate-400 font-black uppercase tracking-widest hover:text-slate-600 transition-all"
                >
                  Voltar
                </button>
                <button 
                  onClick={handleConfirm}
                  className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Confirmar Análise <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: PROCESSING */}
          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 space-y-8"
            >
              <div className="relative">
                <div className="w-24 h-24 border-4 border-blue-100 rounded-full" />
                <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <NexMascot mood="thinking" size={48} />
                </div>
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Gerando Inteligência</h3>
                <div className="space-y-2">
                  <p className="text-slate-500 text-sm font-medium">"Vou identificar entradas, saídas e padrões de comportamento."</p>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest animate-pulse">Também vou procurar sinais que podem impactar sua análise de crédito...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BaseModal>
  );
}
