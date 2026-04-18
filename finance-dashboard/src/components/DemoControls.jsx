import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Play, Power, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

export default function DemoControls() {
  const { isDemoMode, loadDemoData } = useFinance();
  const toast = useToast();

  const handleLoadDemo = () => {
    loadDemoData();
    toast.info('Modo Simulação', 'Dados de exemplo carregados para teste.');
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {!isDemoMode ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleLoadDemo}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/40 hover:bg-slate-800/60 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-primary transition-all"
          >
            <Play size={12} />
            Ver Exemplo
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 bg-brand-primary/10 border border-brand-primary/20 px-4 py-2 rounded-xl"
          >
            <div className="flex items-center gap-2 text-brand-primary">
              <ShieldAlert size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Modo Simulação</span>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="p-1 hover:bg-brand-primary/20 rounded-lg text-brand-primary transition-colors"
              title="Sair do Demo"
            >
              <Power size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
