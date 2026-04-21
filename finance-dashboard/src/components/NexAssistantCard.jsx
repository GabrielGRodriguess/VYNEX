import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, PieChart, Activity, ArrowRight, Zap, Target } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useUser } from '../context/UserContext';
import NexMascot from './NexMascot';

/**
 * NexAssistantCard – The primary "Hero" card of the VYNEX Dashboard.
 * Integrates the NEX assistant into the layout as a central guide.
 */
export default function NexAssistantCard({ onOpenAnalysis, onOpenSimulation }) {
  const { analytics, transactions } = useFinance();
  const { user, profile } = useUser();

  const firstName = profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'você';

  // Smart messaging based on state
  const diagnostic = useMemo(() => {
    if (transactions.length === 0) {
      return {
        text: `Olá ${firstName}! Analisei sua conta e ainda não encontrei movimentações. Vamos conectar seu banco ou adicionar dados manuais para eu calcular seu score?`,
        mood: 'thinking',
        cta: 'Configurar Dashboard'
      };
    }
    
    // If score is good, offer credit
    if (analytics.score > 600) {
      return {
        text: `Olá ${firstName}. Analisei seu perfil financeiro e encontrei uma excelente oportunidade de crédito estimada para você. Posso te ajudar a entender se vale a pena seguir.`,
        mood: 'happy',
        cta: 'Simular Crédito'
      };
    }

    return {
      text: `Olá ${firstName}. Identifiquei alguns pontos de atenção na sua saúde financeira este mês. Recomendo darmos uma olhada na sua liquidez antes de novas decisões.`,
      mood: 'neutral',
      cta: 'Ver Diagnóstico'
    };
  }, [analytics, transactions, firstName]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-[2.5rem] border border-blue-100 bg-white shadow-[0_20px_60px_rgba(37,99,235,0.1)] p-6 sm:p-10 lg:p-12 overflow-visible mb-12"
    >
      {/* Premium Gradient Backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFF] via-white to-[#F0F7FF] rounded-[2.5rem]" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-14">
        
        {/* NEX mascot – Integrated Hero Position */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="relative -mt-20 sm:-mt-28 lg:-mt-24 mb-6">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <NexMascot 
                mood={diagnostic.mood} 
                size={window.innerWidth < 640 ? 110 : 180} 
                className="drop-shadow-[0_20px_40px_rgba(37,99,235,0.2)]" 
              />
            </motion.div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/30">
              <Sparkles size={11} />
              NEX Inteligência
            </span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IA Financeira Ativa</p>
          </div>
        </div>

        {/* Content & High-Fidelity Speech Bubble */}
        <div className="flex-1 w-full space-y-10 text-center lg:text-left">
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-center lg:justify-between gap-4">
              <p className="text-[12px] font-black text-blue-500 uppercase tracking-[0.3em] flex items-center justify-center lg:justify-start gap-3">
                <Zap size={16} fill="currentColor" /> Recomendação Personalizada
              </p>
              {analytics.score > 0 && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-2xl border border-blue-100 mx-auto lg:mx-0">
                  <Target size={14} className="text-blue-600" />
                  <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Score: {analytics.score}</span>
                </div>
              )}
            </div>
            
            <div className="relative">
              {/* Desktop Decorative Arrow */}
              <div className="hidden lg:block absolute left-[-15px] top-8 w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent border-right-[15px] border-r-blue-50/90" />
              
              <div className="bg-blue-50/90 border border-blue-100 rounded-[2.5rem] lg:rounded-tl-none px-8 py-8 sm:px-10 sm:py-9">
                <h2 className="text-xl sm:text-2xl lg:text-3xl leading-tight font-[900] text-slate-900 tracking-tight">
                  "{diagnostic.text}"
                </h2>
              </div>
            </div>
          </div>

          {/* Core Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 sm:gap-5">
            <button
              onClick={onOpenSimulation}
              className="btn-primary min-w-[220px] shadow-2xl shadow-blue-500/40 transform hover:-translate-y-1"
            >
              <PieChart size={20} />
              <span>Simular Crédito</span>
            </button>

            <button
              onClick={onOpenAnalysis}
              className="flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-800 px-8 py-4 rounded-[1.25rem] font-black text-[12px] uppercase tracking-[0.15em] hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-lg shadow-slate-200/50 min-w-[220px] min-h-[56px]"
            >
              <Activity size={20} className="text-blue-600" />
              <span>Ver Diagnóstico</span>
            </button>

            <button
              className="hidden xl:flex items-center justify-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[11px] uppercase tracking-widest transition-all p-4"
            >
              Ver Recomendações <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
