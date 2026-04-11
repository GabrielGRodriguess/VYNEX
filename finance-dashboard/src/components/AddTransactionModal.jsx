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
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md p-10 relative z-10 overflow-hidden"
          >
            {/* Background design elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-brand-green/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <span className="w-2 h-6 bg-brand-green rounded-full"></span>
                  Nova Operação
                </h2>
                <button 
                  onClick={onClose} 
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-slate-500 hover:text-white transition-all border border-white/5 hover:border-white/10"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-white/5">
                  <button
                    type="button"
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.type === 'income' ? 'bg-brand-green text-slate-950 shadow-[0_0_15px_rgba(163,255,18,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                  >
                    Entrada
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.type === 'expense' ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                  >
                    Saída
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Volume Financeiro</label>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-green font-black">R$</span>
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

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Segmento</label>
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
                  className="w-full bg-neon-gradient text-slate-950 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-green/10 mt-6"
                >
                  Confirmar na Rede
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
