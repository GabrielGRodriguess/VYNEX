import { useFinance } from '../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryById } from '../constants/categories';
import { Trash2, ArrowUpRight, ArrowDownLeft, Search, Filter } from 'lucide-react';

export default function TransactionList() {
  const { transactions, deleteTransaction } = useFinance();

  return (
    <div className="glass">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            Histórico de movimentações
          </h3>
          <p className="text-sm text-slate-400 font-medium mt-1">Veja todos os seus registros financeiros</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full sm:w-48 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-bold focus:border-blue-300 outline-none transition-all"
            />
          </div>
          <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
            <Filter size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {transactions.map((t, idx) => {
            const category = getCategoryById(t.category);
            const isIncome = t.type === 'income';
            
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                key={t.id}
                transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/20 transition-all cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {isIncome ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  
                  <div>
                    <p className="text-sm font-bold text-slate-800">{category.label}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                      {new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-base font-black ${isIncome ? 'text-blue-600' : 'text-slate-800'}`}>
                      {isIncome ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                    </p>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${category.isRisk ? 'text-rose-500' : 'text-slate-400'}`}>
                      {category.isRisk ? 'Alto Risco' : 'Operacional'}
                    </p>
                  </div>

                  <button 
                    onClick={() => deleteTransaction(t.id)}
                    className="opacity-0 group-hover:opacity-100 p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {transactions.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={32} />
            </div>
            <p className="text-slate-400 font-bold text-sm">Nenhuma movimentação encontrada.</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Seus registros aparecerão aqui.</p>
          </div>
        )}
      </div>

      {transactions.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-50 flex justify-center">
          <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
            Ver extrato completo
          </button>
        </div>
      )}
    </div>
  );
}
