import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { nexAgent } from '../../services/agents/nexAgent';
import { nexConversion } from '../../services/agents/nexConversion';
import { whatsappService } from '../../services/whatsappService';
import { abService } from '../../services/abService';
import { analyticsService } from '../../services/analyticsService';
import { useFinance } from '../../context/FinanceContext';
import { useUser } from '../../context/UserContext';
import { MessageSquare, ArrowRight, Sparkles, ExternalLink, Activity, PieChart, PlusCircle } from 'lucide-react';
import nexNeutral from '../../assets/mascot/nex-neutral.png';

export default function NexDashboardCommentary({ onOpenAnalysis, onOpenAdjustments }) {
  const { analytics } = useFinance();
  const { user } = useUser();
  
  const variant = useMemo(() => {
    return abService.getVariant(user?.id);
  }, [user?.id]);

  const diagnostic = useMemo(() => {
    return nexAgent.getDiagnostic(analytics);
  }, [analytics]);

  const offer = useMemo(() => {
    return nexConversion.getRecommendedOffer(analytics);
  }, [analytics]);

  // Track View
  useEffect(() => {
    if (user?.id && diagnostic.mood !== 'waiting') {
      analyticsService.trackEvent(
        analyticsService.EVENTS.NEX_CTA_VIEWED, 
        user.id, 
        { mood: diagnostic.mood, offer_id: offer?.id },
        variant
      );
    }
  }, [user?.id, diagnostic.mood, variant, offer?.id]);

  const handleConversion = () => {
    if (offer && user?.id) {
      analyticsService.trackEvent(
        analyticsService.EVENTS.NEX_CTA_CLICKED, 
        user.id, 
        { offer_id: offer.id },
        variant
      );
      whatsappService.openConversation(offer.waIntent, user);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start relative z-10">
        {/* Nex Avatar with Glow */}
        <div className="relative shrink-0 mt-2">
          <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
             <img 
               src={nexNeutral} 
               alt="Nex" 
               className="w-full h-auto nex-breathe"
               style={{
                 filter: 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.3))'
               }}
             />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              <Sparkles size={12} className="animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest">IA Intelligence</span>
            </div>
          </div>

          <div className="bg-[#EFF6FF] text-[#1E3A8A] p-4 rounded-xl rounded-tl-none relative border border-blue-100/50">
            <p className="text-sm md:text-base leading-relaxed font-bold">
              "{diagnostic.text}"
            </p>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button 
              onClick={onOpenAnalysis}
              className="btn-primary flex items-center gap-2 px-4 py-3"
            >
              <PieChart size={14} /> <span className="hidden xs:inline">Ver Análise</span>
            </button>
            <button 
              onClick={onOpenAdjustments}
              className="bg-white border border-[#E2E8F0] text-slate-600 px-4 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <Activity size={14} className="text-blue-500" /> <span className="hidden xs:inline">Ajustar Gastos</span>
            </button>
            <button 
              onClick={handleConversion}
              className="bg-blue-50 text-blue-600 border border-blue-100 px-4 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-100 transition-all flex items-center gap-2"
            >
              <span className="truncate">{offer?.cta || 'Adicionar Conta'}</span> <PlusCircle size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
