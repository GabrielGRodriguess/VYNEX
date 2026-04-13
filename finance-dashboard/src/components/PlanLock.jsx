import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Crown, Check, X } from 'lucide-react';
import { PLANS } from '../services/planService';
import { useUser } from '../context/UserContext';

export default function PlanLock({ isOpen, onClose, requiredPlan = 'PRO' }) {
  const { updatePlan } = useUser();
  const targetPlan = PLANS[requiredPlan];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="w-full max-w-lg glass border-white/10 p-10 relative z-10 overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 space-y-8 text-center">
              <div className="w-20 h-20 bg-brand-green/20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-brand-green/20">
                <Crown className="text-brand-green" size={40} />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Funcionalidade Premium</h2>
                <p className="text-slate-500 text-sm">
                  Esta funcionalidade está disponível apenas para membros <span className="text-brand-green font-bold">{targetPlan.name}</span>.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 text-left space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Incluído no {targetPlan.name}:</p>
                <div className="space-y-3">
                  {targetPlan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                        <Check size={12} />
                      </div>
                      <span className="text-xs text-slate-300 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  updatePlan(targetPlan.id);
                  onClose();
                }}
                className="w-full py-5 bg-brand-green text-slate-950 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-brand-green/20 hover:scale-[1.02] transition-all"
              >
                Fazer Upgrade Agora
              </button>

              <button 
                onClick={onClose}
                className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-slate-400 transition-colors"
              >
                Voltar ao dashboard
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
