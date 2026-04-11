import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddTransactionModal({ isOpen, onClose }) {
  const { addTransaction } = useFinance();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;
    addTransaction({ ...formData, amount: Number(formData.amount) });
    setFormData({ type: 'expense', amount: '', category: '', date: new Date().toISOString().split('T')[0] });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative z-10 overflow-hidden"
          >
            {/* Background design elements */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-50 rounded-full opacity-50" />
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-rose-50 rounded-full opacity-50" />

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-gray-900">Nova Transação</h2>
                <button 
                  onClick={onClose} 
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                  <button
                    type="button"
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${formData.type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                  >
                    Receita
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${formData.type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                  >
                    Despesa
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Valor</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                    <input
                      type="number"
                      required
                      step="0.01"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-lg"
                      placeholder="0,00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Categoria</label>
                    <select
                      className="w-full px-4 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="">O que é?</option>
                      <option value="Food">Alimentação</option>
                      <option value="Salary">Salário</option>
                      <option value="Transport">Transporte</option>
                      <option value="Utilities">Contas / Lazer</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Other">Outros</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Data</label>
                    <input
                      type="date"
                      className="w-full px-4 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-sm"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-200 mt-4 tracking-wider"
                >
                  CONFIRMAR
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

