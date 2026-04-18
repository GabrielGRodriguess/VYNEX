import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';
import BaseModal from './Common/BaseModal';
import { getCategoriesByType } from '../constants/categories';

export default function AddTransactionModal({ isOpen, onClose }) {
  const { addTransaction, transactions } = useFinance();
  const toast = useToast();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Check frequency (1x per week)
  const canAddException = () => {
    const manualTxs = transactions.filter(t => !t.fromBank);
    if (manualTxs.length === 0) return true;
    
    const lastTx = new Date(manualTxs[0].date);
    const now = new Date();
    const diffTime = Math.abs(now - lastTx);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 7;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!canAddException()) {
      toast.error('Limite atingido', 'Exceções são limitadas a 1 uso por semana para manter a precisão da IA.');
      return;
    }

    if (!formData.amount || !formData.category) {
      toast.warning('Campos incompletos', 'Por favor, preencha o valor e a categoria.');
      return;
    }
    
    try {
      addTransaction({ ...formData, amount: Number(formData.amount), description: '(Ajuste Manual)' });
      toast.success('Exceção registrada', `O ajuste de R$ ${formData.amount} foi adicionado à sua análise.`);
      setFormData({ type: 'expense', amount: '', category: '', date: new Date().toISOString().split('T')[0] });
      onClose();
    } catch (err) {
      toast.error('Erro ao salvar', 'Ocorreu um erro ao tentar registrar a exceção.');
    }
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Adicionar Exceção"
    >
      <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
        <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest text-center">
          Exceções são limitadas para manter a precisão da análise financeira
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-white/5">
          <button
            type="button"
            className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === 'income' ? 'bg-brand-primary text-slate-950 shadow-[0_0_15px_rgba(163,255,18,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={() => setFormData({ ...formData, type: 'income' })}
          >
            Recebimento
          </button>
          <button
            type="button"
            className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === 'expense' ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={() => setFormData({ ...formData, type: 'expense' })}
          >
            Gasto / Despesa
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Valor do Ajuste</label>
          <div className="relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary font-black text-xl">R$</span>
            <input
              type="number"
              required
              step="0.01"
              autoFocus
              className="w-full pl-16 pr-6 py-5 rounded-2xl border-2 border-white/5 bg-slate-950 text-white focus:border-brand-primary/50 outline-none transition-all font-black text-2xl placeholder:text-slate-800"
              placeholder="0,00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Categoria</label>
            <div className="relative">
              <select
                className="w-full px-6 py-4 rounded-2xl border-2 border-white/5 bg-slate-950 text-white focus:border-brand-primary/50 outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Selecione</option>
                {getCategoriesByType(formData.type).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                ▼
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Data</label>
            <input
              type="date"
              className="w-full px-6 py-4 rounded-2xl border-2 border-white/5 bg-slate-950 text-white focus:border-brand-primary/50 outline-none transition-all font-bold text-sm"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-neon-gradient text-slate-950 py-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-primary/10 mt-6"
        >
          Confirmar Ajuste
        </button>
      </form>
    </BaseModal>
  );
}
