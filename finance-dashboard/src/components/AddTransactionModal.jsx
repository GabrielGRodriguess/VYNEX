import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';
import BaseModal from './Common/BaseModal';

export default function AddTransactionModal({ isOpen, onClose }) {
  const { addTransaction } = useFinance();
  const toast = useToast();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) {
      toast.warning('Campos incompletos', 'Por favor, preencha o valor e a categoria.');
      return;
    }
    
    try {
      addTransaction({ ...formData, amount: Number(formData.amount) });
      toast.success('Lançamento realizado', `${formData.type === 'income' ? 'Recebimento' : 'Gasto'} de R$ ${formData.amount} registrado.`);
      setFormData({ type: 'expense', amount: '', category: '', date: new Date().toISOString().split('T')[0] });
      onClose();
    } catch (err) {
      toast.error('Erro ao salvar', 'Ocorreu um erro ao tentar registrar a transação.');
    }
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Novo Registro"
    >
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-white/5">
          <button
            type="button"
            className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === 'income' ? 'bg-brand-green text-slate-950 shadow-[0_0_15px_rgba(163,255,18,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}
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
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Valor do Lançamento</label>
          <div className="relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-green font-black text-xl">R$</span>
            <input
              type="number"
              required
              step="0.01"
              autoFocus
              className="w-full pl-16 pr-6 py-5 rounded-2xl border-2 border-white/5 bg-slate-950 text-white focus:border-brand-green/50 outline-none transition-all font-black text-2xl placeholder:text-slate-800"
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
                className="w-full px-6 py-4 rounded-2xl border-2 border-white/5 bg-slate-950 text-white focus:border-brand-green/50 outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Selecione</option>
                <option value="Food">Alimentação</option>
                <option value="Salary">Salário</option>
                <option value="Transport">Transporte</option>
                <option value="Utilities">Contas / Lazer</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Outros</option>
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
              className="w-full px-6 py-4 rounded-2xl border-2 border-white/5 bg-slate-950 text-white focus:border-brand-green/50 outline-none transition-all font-bold text-sm"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-neon-gradient text-slate-950 py-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-green/10 mt-6"
        >
          Salvar Registro
        </button>
      </form>
    </BaseModal>
  );
}
