import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransactionList() {
  const { transactions, deleteTransaction } = useFinance();

  return (
    <div className="glass p-6">
      <h3 className="text-lg font-semibold mb-6">Transações Recentes</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-50">
              <th className="pb-4">Data</th>
              <th className="pb-4">Categoria</th>
              <th className="pb-4 text-right">Valor</th>
              <th className="pb-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/50">
            <AnimatePresence mode="popLayout">
              {transactions.map((t) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={t.id} 
                  className="text-sm group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 text-gray-500">{t.date}</td>
                  <td className="py-4">
                    <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-wider shadow-sm">
                      {t.category}
                    </span>
                  </td>
                  <td className={`py-4 text-right font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'income' ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                  </td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => deleteTransaction(t.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="Excluir"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>

                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {transactions.length === 0 && (
              <tr>
                <td colSpan="4" className="py-12 text-center text-gray-400 italic">
                  Nenhuma transação encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

