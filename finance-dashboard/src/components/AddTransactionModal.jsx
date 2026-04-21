import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useNex } from '../context/NexContext.jsx';
import { useToast } from '../context/ToastContext';
import BaseModal from './Common/BaseModal';
import { getCategoriesByType } from '../constants/categories';
import { ArrowDownLeft, ArrowUpRight, Calendar, Tag, CreditCard } from 'lucide-react';

export default function AddTransactionModal({ isOpen, onClose }) {
  const { addTransaction } = useFinance();
  const { sendMessageToNex } = useNex();
  const toast = useToast();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.description) {
      toast.warning('Campos incompletos', 'Por favor, preencha o valor, descrição e categoria.');
      return;
    }
    
    try {
      await addTransaction({ ...formData, amount: Number(formData.amount) });
      toast.success('Transação registrada', `O registro de R$ ${formData.amount} foi adicionado com sucesso.`);
      
      // Feedback from Nex
      setTimeout(() => {
        sendMessageToNex(`Adicionei uma transação de ${formData.type === 'income' ? 'receita' : 'gasto'}: ${formData.description} no valor de R$ ${formData.amount}.`);
      }, 500);

      setFormData({ type: 'expense', amount: '', description: '', category: '', date: new Date().toISOString().split('T')[0] });
      onClose();
    } catch (err) {
      toast.error('Erro ao salvar', 'Ocorreu um erro ao tentar registrar a transação.');
    }
  };

  const isExpense = formData.type === 'expense';

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Registrar Transação"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Toggle Type */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isExpense ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setFormData({ ...formData, type: 'income' })}
          >
            <ArrowDownLeft size={14} /> Receita
          </button>
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isExpense ? 'bg-white text-rose-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setFormData({ ...formData, type: 'expense' })}
          >
            <ArrowUpRight size={14} /> Despesa
          </button>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="label-style flex items-center gap-2 ml-1">
            <CreditCard size={12} /> Valor
          </label>
          <div className="relative group">
            <span className={`absolute left-5 top-1/2 -translate-y-1/2 font-black text-xl transition-colors ${isExpense ? 'text-rose-500' : 'text-blue-600'}`}>R$</span>
            <input
              type="number"
              required
              step="0.01"
              autoFocus
              className={`w-full pl-14 pr-6 py-5 rounded-2xl border-2 bg-white text-slate-900 outline-none transition-all font-black text-3xl placeholder:text-slate-300 ${isExpense ? 'border-rose-100 focus:border-rose-300' : 'border-blue-100 focus:border-blue-300'}`}
              placeholder="0,00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="label-style ml-1">Descrição</label>
          <input
            type="text"
            required
            className="input-style"
            placeholder="Ex: Supermercado, Salário, Pix..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Category & Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="label-style flex items-center gap-2 ml-1">
              <Tag size={12} /> Categoria
            </label>
            <select
              className="input-style"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Selecione</option>
              {getCategoriesByType(formData.type).map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="label-style flex items-center gap-2 ml-1">
              <Calendar size={12} /> Data
            </label>
            <input
              type="date"
              className="input-style"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg active:scale-95 mt-4 ${isExpense ? 'bg-rose-600 text-white shadow-rose-500/20 hover:bg-rose-700' : 'bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700'}`}
        >
          Salvar Transação
        </button>
      </form>
    </BaseModal>
  );
}
