import { useFinance } from '../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryById } from '../constants/categories';

export default function TransactionList() {
  const { transactions, deleteTransaction } = useFinance();

  return (
    <div className="glass p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold flex items-center gap-3">
          <span className="w-2 h-8 bg-brand-green rounded-full shadow-[0_0_15px_rgba(163,255,18,0.5)]"></span>
          Histórico de Movimentações
        </h3>
        <span className="text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
          {transactions.length} Registros
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
              <th className="pb-6">Data</th>
              <th className="pb-6">Categoria</th>
              <th className="pb-6 text-right">Valor</th>
              <th className="pb-6 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {transactions.map((t) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  key={t.id} 
                  className="text-sm group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-6 text-slate-400 font-medium">{t.date}</td>
                  <td className="py-6">
                    <span 
                      className="px-3 py-1 bg-slate-800/50 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest group-hover:border-brand-green/30 transition-colors"
                      style={{ color: `var(--color-${getCategoryById(t.category).color})` || 'white', borderColor: getCategoryById(t.category).isRisk ? 'rgba(244, 63, 94, 0.3)' : undefined }}
                    >
                      {getCategoryById(t.category).label}
                    </span>
                  </td>
                  <td className={`py-6 text-right font-black text-lg ${t.type === 'income' ? 'text-brand-green text-neon' : 'text-rose-500'}`}>
                    {t.type === 'income' ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                  </td>
                  <td className="py-6 text-right">
                    <button 
                      onClick={() => deleteTransaction(t.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
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
                <td colSpan="4" className="py-16 text-center text-slate-500 font-medium italic">
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
