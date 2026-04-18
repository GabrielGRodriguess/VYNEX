import { useFinance } from '../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryById } from '../constants/categories';

export default function TransactionList() {
  const { transactions, deleteTransaction } = useFinance();

  return (
    <div className="glass">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
          <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
          Histórico de Movimentações
        </h3>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          {transactions.length} Registros
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
              <th className="pb-6">Data</th>
              <th className="pb-6">Categoria</th>
              <th className="pb-6 text-right">Valor</th>
              <th className="pb-6 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence mode="popLayout">
              {transactions.map((t) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  key={t.id} 
                  className="text-sm group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-6 text-slate-400 font-medium">{t.date}</td>
                  <td className="py-6">
                    <span 
                      className={`px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${getCategoryById(t.category).isRisk ? 'text-rose-600 border-rose-100 bg-rose-50' : 'text-blue-600 border-blue-100 bg-blue-50'}`}
                    >
                      {getCategoryById(t.category).label}
                    </span>
                  </td>
                  <td className={`py-6 text-right font-black text-lg ${t.type === 'income' ? 'text-blue-600' : 'text-rose-500'}`}>
                    {t.type === 'income' ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                  </td>
                  <td className="py-6 text-right">
                    <button 
                      onClick={() => deleteTransaction(t.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
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
                <td colSpan="4" className="py-16 text-center text-slate-400 font-medium italic">
                  Nenhuma movimentação encontrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
